from typing import Any, Dict, List, Optional
from domain.services.variable_resolver import VariableResolver

class FlowRouterEvaluator:
    """
    Domain service to evaluate routing rules in AI Flows.
    """

    @staticmethod
    def evaluate(state_outputs: dict, rules: List[dict]) -> str:
        """
        Evaluates a list of rules and returns the ID of the first rule that matches.
        Returns "default" if no rules match.
        """
        for rule in rules:
            var_path = rule.get("variable")
            op = rule.get("operator")
            val = str(rule.get("value", "")).lower()
            rule_id = rule.get("id")

            # Use VariableResolver to handle nested paths and {{}} syntax
            raw_actual_val = VariableResolver.resolve(state_outputs, var_path)
            actual_val = str(raw_actual_val).lower() if raw_actual_val is not None else ""

            if op == "equals" and actual_val == val:
                return rule_id
            elif op == "not_equals" and actual_val != val:
                return rule_id
            elif op == "contains" and val in actual_val:
                return rule_id

        return "default"
