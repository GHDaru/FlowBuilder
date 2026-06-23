from typing import Dict, Any
from domain.ports.llm_provider import ILLMProvider
from domain.models.value_objects import Metadata, TokenUsage
from infrastructure.utils.prompts import prompt_loader

class MetadataExtractionUseCase:
    def __init__(self, llm_provider: ILLMProvider):
        self.llm_provider = llm_provider

    def execute(self, content: str) -> tuple[Metadata, TokenUsage]:
        prompt_template = prompt_loader.load_prompt("Extrair Metadados")
        prompt = prompt_template.replace("{{input}}", content)
        
        # Additional placeholders cleanup
        prompt = prompt.replace("{{contexto_feedback}}", "").replace("{{contexto_global}}", "")

        result_dict = self.llm_provider.call(prompt, json_mode=True)
        
        metadata = Metadata(
            data_atendimento=result_dict.get("data_atendimento"),
            cliente=result_dict.get("cliente"),
            numero_ticket=result_dict.get("numero_ticket")
        )
        
        usage_dict = self.llm_provider.get_token_usage()
        usage = TokenUsage(
            input_tokens=usage_dict.get("input_tokens", 0),
            output_tokens=usage_dict.get("output_tokens", 0)
        )
        
        return metadata, usage
