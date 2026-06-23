from typing import Dict, Any
from domain.ports.llm_provider import ILLMProvider
from domain.models.value_objects import TokenUsage
from infrastructure.utils.prompts import prompt_loader

class ConsolidationUseCase:
    def __init__(self, llm_provider: ILLMProvider):
        self.llm_provider = llm_provider

    def execute(self, content: str) -> tuple[str, TokenUsage]:
        prompt_template = prompt_loader.load_prompt("Resumir Atendimento")
        prompt = prompt_template.replace("{{input}}", content)
        
        # Consolidation is currently non-JSON (Step 5 in legacy)
        response_dict = self.llm_provider.call(prompt, json_mode=False)
        summary = response_dict.get("response", "")
        
        usage_dict = self.llm_provider.get_token_usage()
        usage = TokenUsage(
            input_tokens=usage_dict.get("input_tokens", 0),
            output_tokens=usage_dict.get("output_tokens", 0)
        )
        
        return summary, usage
