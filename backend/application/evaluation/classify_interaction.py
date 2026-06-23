from typing import Dict, Any
from domain.ports.llm_provider import ILLMProvider
from domain.models.value_objects import Classification, TokenUsage

class ClassificationUseCase:
    def __init__(self, llm_provider: ILLMProvider):
        self.llm_provider = llm_provider

    def execute(self, content: str) -> tuple[Classification, TokenUsage]:
        # Tagging prompt as defined in original EvaluationFlow
        tag_prompt_template = """
        Analise o atendimento abaixo e identifique:
        1. Serviço principal (Ex: FGTS, Folha, Impostos, Admissão, etc. - Máximo 2 palavras)
        2. Marcadores de erro (Lista de erros encontrados no formato #Erro, ex: #ErroCalculo #Esquecimento)

        Retorne apenas um JSON:
        {
          "servico_principal": "",
          "marcadores": []
        }

        Texto:
        {{input}}
        """
        prompt = tag_prompt_template.replace("{{input}}", content)

        result_dict = self.llm_provider.call(prompt, json_mode=True)
        
        classification = Classification(
            servico_principal=result_dict.get("servico_principal", "Outros"),
            marcadores=result_dict.get("marcadores", [])
        )
        
        usage_dict = self.llm_provider.get_token_usage()
        usage = TokenUsage(
            input_tokens=usage_dict.get("input_tokens", 0),
            output_tokens=usage_dict.get("output_tokens", 0)
        )
        
        return classification, usage
