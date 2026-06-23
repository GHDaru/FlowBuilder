from typing import Dict, Any
from domain.ports.llm_provider import ILLMProvider
from domain.models.value_objects import Score, TokenUsage
from infrastructure.utils.prompts import prompt_loader

class DimensionScoringUseCase:
    def __init__(self, llm_provider: ILLMProvider):
        self.llm_provider = llm_provider

    def execute(self, content: str, dimension_name: str) -> tuple[Score, TokenUsage]:
        prompt_template = prompt_loader.load_prompt(dimension_name)
        prompt = prompt_template.replace("{{input}}", content)
        
        # Additional placeholders cleanup
        prompt = prompt.replace("{{contexto_feedback}}", "").replace("{{contexto_global}}", "")

        result_dict = self.llm_provider.call(prompt, json_mode=True)
        
        score = Score(
            dimensao=dimension_name,
            nota=float(result_dict.get("nota", 0)),
            justificativa=result_dict.get("justificativa", "Sem justificativa.")
        )
        
        usage_dict = self.llm_provider.get_token_usage()
        usage = TokenUsage(
            input_tokens=usage_dict.get("input_tokens", 0),
            output_tokens=usage_dict.get("output_tokens", 0)
        )
        
        return score, usage
