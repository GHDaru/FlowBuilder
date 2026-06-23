import json
import time
import re
from typing import Dict, List, Any, TypedDict, Annotated, Optional
import operator
from langgraph.graph import StateGraph, END
from services.ia_client import get_ia_client
from domain.services.variable_resolver import VariableResolver
from domain.services.flow_router_evaluator import FlowRouterEvaluator
from application.services.sql_execution_service import SqlExecutionService

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '_', text)
    return text.strip('_')

# Define the State shared between LangGraph nodes
class GraphState(TypedDict):
    content: str  # Original atendimento content
    outputs: Annotated[Dict[str, Any], operator.ior]  # Merged outputs from nodes
    tracking_id: str
    current_node: str

class LangGraphAdapter:
    """
    Infrastructure adapter to run Flows using LangGraph engine.
    """
    def __init__(self):
        self.ia_client = get_ia_client()

    def run(self, nodes: List[Dict[str, Any]], edges: List[tuple], start_node_id: str, content: str, tracking_id: str, log_callback=None, initial_metadata: Optional[Dict[str, Any]] = None):
        """
        Builds and executes a LangGraph from the provided definition.
        """
        workflow = StateGraph(GraphState)
        
        condition_nodes = {n["id"]: n for n in nodes if n["type"] == "condition"}
        
        # Add Nodes to LangGraph
        for node_def in nodes:
            if node_def["type"] == "start":
                # Start node just initializes the state
                workflow.add_node(node_def["id"], self._make_start_fn(node_def, initial_metadata, log_callback))
            elif node_def["type"] == "condition":
                workflow.add_node(node_def["id"], self._make_condition_fn(node_def["id"]))
            elif node_def["type"] == "sql":
                workflow.add_node(node_def["id"], self._make_sql_fn(node_def, log_callback))
            else:
                # LLM node execution
                workflow.add_node(node_def["id"], self._make_llm_fn(node_def, log_callback))

        # Add Edges
        for source, target in edges:
            if source in condition_nodes:
                continue # Skip condition outgoing edges, handled below
            workflow.add_edge(source, target)
            
        # Add Conditional Edges
        for c_id, c_def in condition_nodes.items():
            targets_mapping = c_def.get("targets", {})
            mapping = {}
            for handle, tgt in targets_mapping.items():
                mapping[handle] = tgt
            
            # If default is not in mapping, ensure it maps to END or another node
            if "default" not in mapping:
                mapping["default"] = END
                
            workflow.add_conditional_edges(c_id, self._make_router_fn(c_def, log_callback, all_nodes=nodes), mapping)
        
        # End nodes (those with no outgoing edges and not condition nodes)
        outgoing_sources = {e[0] for e in edges}
        for node_def in nodes:
            if node_def["id"] not in outgoing_sources and node_def["type"] != "condition":
                workflow.add_edge(node_def["id"], END)

        workflow.set_entry_point(start_node_id)
        
        # Compile and Run
        app = workflow.compile()
        initial_state = {
            "content": content,
            "outputs": {},
            "tracking_id": tracking_id,
            "current_node": start_node_id
        }
        
        return app.invoke(initial_state)

    def _make_start_fn(self, node_def: Dict[str, Any], initial_metadata: Optional[Dict[str, Any]] = None, log_callback=None):
        def start_fn(state: GraphState):
            selected_globals = node_def.get("selected_globals", [])
            print(f"[DEBUG] Start Node Execution: id={node_def.get('id')}")
            print(f"[DEBUG] Selected Globals in Node: {selected_globals}")
            
            initial_outputs = {}
            if initial_metadata:
                print(f"[DEBUG] Available Metadata Keys: {list(initial_metadata.keys())}")
                if selected_globals:
                    for var_id in selected_globals:
                        if var_id in initial_metadata:
                            initial_outputs[var_id] = initial_metadata[var_id]
            
            print(f"[DEBUG] Final Initial Outputs injected into state: {list(initial_outputs.keys())}")
            
            if log_callback:
                log_callback(
                    state["tracking_id"],
                    node_def["id"],
                    node_def.get("label", "Início"),
                    f"Iniciando fluxo com globais: {selected_globals}",
                    "N/A",
                    initial_outputs,
                    "SUCCESS"
                )

            return {"current_node": node_def["id"], "outputs": initial_outputs}
        return start_fn

    def _make_condition_fn(self, node_id: str):
        def condition_fn(state: GraphState):
            return {"current_node": node_id}
        return condition_fn

    def _make_router_fn(self, node_def: Dict[str, Any], log_callback, all_nodes: List[Dict[str, Any]] = None):
        def router_fn(state: GraphState):
            start_time = time.perf_counter()
            rules = node_def.get("rules", [])
            chosen_handle = FlowRouterEvaluator.evaluate(state["outputs"], rules)
            
            targets = node_def.get("targets", {})
            target_node_id = targets.get(chosen_handle, END)
            duration_ms = int((time.perf_counter() - start_time) * 1000)
                
            if log_callback:
                # Resolve the path and value for logging context
                matched_rule = next((r for r in rules if r.get("id") == chosen_handle), None)
                var_path = matched_rule.get("variable") if matched_rule else "N/A"
                actual_val = "N/A"
                if matched_rule:
                    actual_val = VariableResolver.resolve(state["outputs"], var_path)
                
                # Get human-readable label for target node
                target_label = "END"
                if target_node_id != END and all_nodes:
                    target_node_def = next((n for n in all_nodes if n["id"] == target_node_id), None)
                    if target_node_def:
                        target_label = target_node_def.get("title", target_node_id)

                prompt_sent = f"Evaluating rules. Matched path: {var_path} with value: {actual_val}"
                log_callback(
                    state["tracking_id"],
                    node_def["id"],
                    node_def.get("title", node_def["id"]),
                    prompt_sent,
                    f"Routed to: {target_label} (ID: {target_node_id}) via {chosen_handle}",
                    {"matched_rule": chosen_handle, "target": target_node_id, "target_label": target_label},
                    "SUCCESS",
                    duration_ms=duration_ms
                )
                
            return chosen_handle
        return router_fn

    def _make_sql_fn(self, node_def: Dict[str, Any], log_callback):
        def sql_fn(state: GraphState):
            start_time = time.perf_counter()
            query = node_def.get("sql_query", "")
            context = state["outputs"]
            
            # Extract and resolve variables for the SQL query
            variable_names = VariableResolver.extract_variable_names(query)
            resolved_vars = {}
            for var_path in variable_names:
                resolved_vars[var_path] = VariableResolver.resolve(context, var_path)

            try:
                # Execute the query securely
                result_json_str = SqlExecutionService.execute(
                    database_type=node_def.get("database_type", "sqlite"),
                    connection_details=node_def.get("connection_details", {}),
                    query=query,
                    variables=resolved_vars
                )
                
                # Parse the JSON string to store as structured data in outputs
                result_data = json.loads(result_json_str)
                
                # Use slugified title as the key
                key = slugify(node_def.get("title", node_def["id"]))
                output_dict = {key: result_data}
                
                duration_ms = int((time.perf_counter() - start_time) * 1000)
                
                if log_callback:
                    log_query = query
                    for k, v in resolved_vars.items():
                        log_query = log_query.replace(f"{{{{{k}}}}}", str(v))
                        
                    log_callback(
                        state["tracking_id"],
                        node_def["id"],
                        node_def.get("title", node_def["id"]),
                        f"Executed SQL:\n{log_query}",
                        result_json_str,
                        output_dict,
                        "SUCCESS",
                        duration_ms=duration_ms,
                        model=f"sql-{node_def.get('database_type', 'unknown')}"
                    )
                    
                return {"outputs": output_dict, "current_node": node_def["id"]}
            except Exception as e:
                duration_ms = int((time.perf_counter() - start_time) * 1000)
                error_msg = str(e)
                
                key = slugify(node_def.get("title", node_def["id"]))
                output_dict = {key: {"error": error_msg}}
                
                if log_callback:
                    log_query = query
                    for k, v in resolved_vars.items():
                        log_query = log_query.replace(f"{{{{{k}}}}}", str(v))
                        
                    log_callback(
                        state["tracking_id"],
                        node_def["id"],
                        node_def.get("title", node_def["id"]),
                        f"Failed SQL:\n{log_query}",
                        error_msg,
                        output_dict,
                        "ERROR",
                        duration_ms=duration_ms,
                        error=error_msg,
                        model=f"sql-{node_def.get('database_type', 'unknown')}"
                    )
                # Return the error in outputs so the flow can continue
                return {"outputs": output_dict, "current_node": node_def["id"]}
        return sql_fn

    def _make_llm_fn(self, node_def: Dict[str, Any], log_callback):
        def llm_fn(state: GraphState):
            start_time = time.perf_counter()
            prompt = node_def["prompt"]
            # Context for resolution: STRICTLY use the merged outputs from previous nodes (including start node selections)
            context = state["outputs"]
            
            # Extract variables present in the template (e.g., {{meta.id}})
            variables = VariableResolver.extract_variable_names(prompt)
            
            # Resolve each variable
            for var_path in variables:
                val = VariableResolver.resolve(context, var_path)
                # Replace {{path}} with value or empty string if not found
                placeholder = f"{{{{{var_path}}}}}"
                prompt = prompt.replace(placeholder, str(val) if val is not None else "")
            
            # Get specific client for this node's model
            provider = node_def.get("provider", "openai")
            model = node_def.get("model_id")
            temperature = node_def.get("temperature", 0.0)
            client = get_ia_client(provider=provider, model=model)
            
            try:
                response_raw = client.call(prompt, json_mode=True, temperature=temperature)
                response_json = json.loads(response_raw) if isinstance(response_raw, str) else response_raw
                duration_ms = int((time.perf_counter() - start_time) * 1000)
                
                if log_callback:
                    # Pass the token usage if possible
                    usage = client.get_token_usage()
                    log_callback(
                        state["tracking_id"], 
                        node_def["id"], 
                        node_def.get("title", node_def["id"]),
                        prompt, 
                        response_raw, 
                        response_json, 
                        "SUCCESS",
                        duration_ms=duration_ms,
                        usage=usage,
                        model=model
                    )
                
                return {"outputs": response_json, "current_node": node_def["id"]}
            except Exception as e:
                duration_ms = int((time.perf_counter() - start_time) * 1000)
                if log_callback:
                    log_callback(state["tracking_id"], node_def["id"], node_def.get("title", node_def["id"]), prompt, str(e), {}, "ERROR", duration_ms=duration_ms, error=str(e))
                raise e
        return llm_fn
