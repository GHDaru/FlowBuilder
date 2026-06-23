import json
from typing import List, Dict, Any, Tuple

class GraphCompiler:
    """
    Domain service to analyze the visual JSON and resolve the execution sequence.
    Independent of execution engines like LangGraph.
    """
    
    @staticmethod
    def compile(json_def_str: str) -> Tuple[List[Dict[str, Any]], List[Tuple[str, str]]]:
        """
        Parses visual JSON and returns a list of logical nodes and edges.
        """
        try:
            data = json.loads(json_def_str)
        except (json.JSONDecodeError, TypeError):
            return [], []

        nodes = data.get("nodes", [])
        edges = data.get("edges", [])

        # Extract only relevant data for execution
        logical_nodes = []
        for node in nodes:
            node_id = node.get("id")
            node_type = node.get("type", "llm")
            node_data = node.get("data", {})
            
            node_dict = {
                "id": node_id,
                "type": node_type,
                "title": node_data.get("label", "Untitled"),
                "prompt": node_data.get("prompt", ""),
                "variables": node_data.get("variables", []),
                "output_schema": node_data.get("schema", "{}"),
                "model_id": node_data.get("model_id"),
                "provider": node_data.get("provider"),
                "temperature": float(node_data.get("temperature", 0.0)),
                "selected_globals": node_data.get("selected_globals", []),
                "database_type": node_data.get("database_type"),
                "connection_details": node_data.get("connection_details", {}),
                "sql_query": node_data.get("sql_query")
            }

            if node_type == "condition":
                node_dict["rules"] = node_data.get("rules", [])
                
                # Build target mapping based on edges
                # A condition node has multiple source handles (e.g., rule-1, rule-2, default)
                targets = {}
                for edge in edges:
                    if edge.get("source") == node_id:
                        handle_id = edge.get("sourceHandle", "default")
                        targets[handle_id] = edge.get("target")
                
                node_dict["targets"] = targets

            logical_nodes.append(node_dict)

        logical_edges = []
        for edge in edges:
            logical_edges.append((edge.get("source"), edge.get("target")))

        return logical_nodes, logical_edges

    @staticmethod
    def find_start_node(nodes: List[Dict[str, Any]]) -> str:
        """
        Identifies the entry point node (type='start').
        """
        for node in nodes:
            if node["type"] == "start":
                return node["id"]
        return nodes[0]["id"] if nodes else None
