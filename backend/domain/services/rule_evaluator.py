from typing import List
from domain.models.rule import EvaluationRule
from domain.models.value_objects import Classification

class RuleEvaluator:
    def __init__(self, rules: List[EvaluationRule]):
        self.rules = rules

    def get_dimensions_for_classification(self, classification: Classification) -> List[str]:
        """
        Returns the list of dimension names that should be executed 
        for a given classification.
        """
        # Exact match on service name
        for rule in self.rules:
            if rule.is_active and rule.service_name.lower() == classification.servico_principal.lower():
                return rule.dimensions
        
        # Default dimensions if no rule matches
        return ["Comunicação e Clareza", "Profissionalismo e Conformidade", "Resolução e Eficiência"]
        # In a real scenario, this default could also come from a specific "DEFAULT" rule.
