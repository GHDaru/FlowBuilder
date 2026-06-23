from typing import List
from domain.models.rule import EvaluationRule
from domain.ports.repository import IAtendimentoRepository

class ManageRulesUseCase:
    def __init__(self, repository: IAtendimentoRepository):
        self.repository = repository

    def list_active_rules(self) -> List[EvaluationRule]:
        return self.repository.list_rules()

    def create_or_update_rule(self, service_name: str, dimensions: List[str]) -> EvaluationRule:
        # Check if exists
        existing_rules = self.repository.list_rules()
        rule = next((r for r in existing_rules if r.service_name == service_name), None)
        
        if rule:
            rule.dimensions = dimensions
        else:
            rule = EvaluationRule(service_name=service_name, dimensions=dimensions)
            
        return self.repository.save_rule(rule)
