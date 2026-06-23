from typing import List, Optional
from domain.models.rule import Rule
from domain.ports.rule_repository import IRuleRepository

class RuleAggregator:
    def __init__(self, repository: IRuleRepository):
        self.repo = repository

    def get_active_rules_for_context(self, context: Optional[str] = None) -> List[Rule]:
        """
        Fetches all active rules for the given context using the Merge-Up principle.
        Global rules are always included. Specific rules for the context override 
        or complement them.
        """
        # IRuleRepository.list_active_for_context already handles the basic merge 
        # (Global + Specific). If we had more levels (H1, H2), we would resolve them here.
        return self.repo.list_active_for_context(context)

    def format_rules_for_prompt(self, rules: List[Rule]) -> str:
        """
        Converts a list of rules into a structured string for injection into an IA prompt.
        """
        if not rules:
            return ""

        formatted = "DIRETRIZES E REGRAS DE SCORIFICAÇÃO ADICIONAIS:\n"
        for rule in rules:
            formatted += f"- [{rule.name}] ({rule.dimension}): {rule.text}\n"
        
        return formatted
