import graphviz
from typing import List, Dict, Any

class FlowGraphProvider:
    @staticmethod
    def generate_dot(audit_logs: List[Any]) -> str:
        """
        Generates a DOT string representing the evaluation flow based on audit logs.
        """
        dot = graphviz.Digraph(comment='Evaluation Flow')
        dot.attr(rankdir='LR', size='8,5')
        
        # Default nodes in sequence
        nodes = [
            ("Start", "Início", "SUCCESS"),
            ("Extrair Metadados", "Metadados", "PENDING"),
            ("Classificar Atendimento", "Classificação", "PENDING"),
            ("Avaliar Regras", "Regras", "PENDING"),
            ("Consolidar Resultados", "Consolidação", "PENDING"),
            ("End", "Resultado Final", "SUCCESS")
        ]
        
        # Map step names to indices for updating status
        log_map = {log.step_name: log for log in audit_logs}
        
        # Edges
        dot.edge("Start", "Extrair Metadados")
        dot.edge("Extrair Metadados", "Classificar Atendimento")
        dot.edge("Classificar Atendimento", "Avaliar Regras")
        dot.edge("Avaliar Regras", "Consolidar Resultados")
        dot.edge("Consolidar Resultados", "End")
        
        for step_id, label, default_status in nodes:
            status = default_status
            color = "lightgrey"
            
            if step_id in log_map:
                log = log_map[step_id]
                status = log.validation_status
                if status == "VALID":
                    color = "lightgreen"
                    status_label = "✅ VALID"
                else:
                    color = "lightcoral"
                    status_label = f"❌ {log.validation_status}"
            elif step_id in ["Start", "End"]:
                color = "lightblue"
                status_label = ""
            else:
                status_label = "⏳ PENDING"
            
            node_label = f"{label}\n{status_label}"
            dot.node(step_id, node_label, style='filled', fillcolor=color, shape='box', fontname='Arial')
            
        return dot.source
