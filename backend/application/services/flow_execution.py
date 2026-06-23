import json
from datetime import datetime
from typing import Optional, Dict, Any
from domain.ports.flow_repository import IFlowRepository
from domain.services.graph_compiler import GraphCompiler
from infrastructure.adapters.langgraph_adapter import LangGraphAdapter
from infrastructure.database.connection import SessionLocal, Tracking, TraceLog

class FlowExecutionUseCase:
    def __init__(self, repository: IFlowRepository):
        self.repo = repository
        self.adapter = LangGraphAdapter()

    def execute(self, flow_id: str, content: str, tracking_id: str, initial_metadata: Optional[Dict[str, Any]] = None):
        print(f"[DEBUG] FlowExecutionUseCase.execute: tracking_id={tracking_id}, has_metadata={initial_metadata is not None}")
        
        # 0. Aggregate Hierarchical Rules
        active_rules_text = ""
        db = SessionLocal()
        try:
            from infrastructure.adapters.sqlite_rule_repository import SqliteRuleRepository
            from domain.services.rule_aggregator import RuleAggregator
            
            rule_repo = SqliteRuleRepository(db)
            aggregator = RuleAggregator(rule_repo)
            
            # Context comes from initial_metadata (contabilidade_id)
            context_id = initial_metadata.get("contabilidade_id") if initial_metadata else None
            rules = aggregator.get_active_rules_for_context(context_id)
            active_rules_text = aggregator.format_rules_for_prompt(rules)
            
            if rules:
                print(f"[DEBUG] Applied {len(rules)} hierarchical rules to flow.")
        finally:
            db.close()

        flow = self.repo.get_by_id(flow_id)
        if not flow:
            raise ValueError(f"Flow {flow_id} not found")

        # 1. Compile Domain Graph
        nodes, edges = GraphCompiler.compile(flow.json_definition)
        
        # 1.1 Inject Rules into ALL LLM nodes
        if active_rules_text:
            for node in nodes:
                if node.get("type") == "llm":
                    node["prompt"] = f"{node['prompt']}\n\n{active_rules_text}"

        start_id = GraphCompiler.find_start_node(nodes)
        
        if not start_id:
            raise ValueError("No start node found in flow")

        # 2. Setup Logging Callback
        def log_callback(track_id, node_id, node_label, prompt, raw, json_data, status, duration_ms=0, error=None, usage=None, model=None):
            db = SessionLocal()
            try:
                log = TraceLog(
                    tracking_id=track_id,
                    node_id=node_id,
                    node_label=node_label,
                    prompt_sent=prompt,
                    response_raw=raw,
                    response_json=json.dumps(json_data),
                    status=status,
                    error_message=error,
                    duration_ms=duration_ms,
                    model_id=model,
                    input_tokens=usage.get("input_tokens", 0) if usage else 0,
                    output_tokens=usage.get("output_tokens", 0) if usage else 0,
                    thinking_tokens=usage.get("thinking_tokens", 0) if usage else 0
                )
                db.add(log)
                db.commit()
            finally:
                db.close()

        # 3. Run via LangGraph Adapter
        try:
            start_time = datetime.utcnow()
            final_state = self.adapter.run(nodes, edges, start_id, content, tracking_id, log_callback, initial_metadata)
            finished_at = datetime.utcnow()
            total_duration_ms = int((finished_at - start_time).total_seconds() * 1000)
            
            # Extract metadata from state (Firm, Client, Attendant)
            # Heuristic: Look for common metadata keys in ANY node output
            outputs = final_state.get("outputs", {})
            metadata = {}
            
            # Common keys from metadados_extractor or similar nodes
            for key, val in outputs.items():
                if isinstance(val, dict):
                    # Check for nested keys
                    if "nome_cliente" in val: metadata["cliente"] = val["nome_cliente"]
                    if "atendente_principal" in val: metadata["atendente"] = val["atendente_principal"]
                    if "contabilidade" in val: metadata["contabilidade"] = val["contabilidade"]
                
                # Check direct keys
                if key == "nome_cliente": metadata["cliente"] = val
                if key == "atendente_principal": metadata["atendente"] = val
            
            # Update final status and metadata
            db = SessionLocal()
            try:
                tracking = db.query(Tracking).filter(Tracking.id == tracking_id).first()
                tracking.status = "COMPLETED"
                tracking.finished_at = finished_at
                tracking.total_duration_ms = total_duration_ms
                tracking.flow_name = flow.name
                if metadata:
                    tracking.metadata_json = json.dumps(metadata)
                db.commit()
            finally:
                db.close()
                
        except Exception as e:
            db = SessionLocal()
            try:
                tracking = db.query(Tracking).filter(Tracking.id == tracking_id).first()
                tracking.status = "ERROR"
                tracking.finished_at = datetime.utcnow()
                db.commit()
            finally:
                db.close()
            raise e
