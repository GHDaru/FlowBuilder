import json
from typing import Dict, Any, Optional
from services.ia_client import get_ia_client
from domain.models.rule import Rule, RuleOrigin

class RuleGenerationService:
    def __init__(self):
        self.ia_client = get_ia_client()

    async def generate_from_feedback(self, transcript: str, evaluation: Dict[str, Any], feedback: str, atendimento_ref: str) -> Rule:
        """
        Generates a generalized Rule JSON from supervisor feedback using LLM.
        """
        prompt = f"""
        Role: Você é um agente especializado em aprender com contestações humanas (AVALIA v1).
        
        Inputs:
        1. Transcript do atendimento:
        {transcript}
        
        2. Avaliação gerada pelo sistema:
        {json.dumps(evaluation, indent=2)}
        
        3. Feedback do supervisor:
        {feedback}
        
        O que você deve fazer:
        1. Entender a contestação (nota alta demais, baixa demais, ou dimensão não deveria ter sido avaliada).
        2. Identificar a condição geral provocada pelo atendimento. Generalize: não descreva este atendimento específico.
        3. Determinar o impacto correto (aumentar, diminuir, piso, teto, ou desconsiderar).
        4. Definir o escopo (global ou específico).
        5. Gerar o JSON da regra no formato canônico.
        
        Princípios:
        - Generalize, não particularize.
        - Avalie o atendente, não o cliente.
        - Não puna o que está fora do controle do atendente.
        - Condição identificável e Impacto declarado.
        
        Formato de Saída (JSON APENAS):
        {{
          "nome": "string curta",
          "texto": "instrução em segunda pessoa para o avaliador de IA",
          "dimensao": "id da dimensão ou todas",
          "escopo": "global | específico",
          "contexto": null
        }}
        """
        
        response_raw = self.ia_client.call(prompt, json_mode=True)
        data = json.loads(response_raw) if isinstance(response_raw, str) else response_raw
        
        return Rule(
            name=data.get("nome", "Regra gerada via feedback"),
            text=data.get("texto", ""),
            dimension=data.get("dimensao", "todas"),
            scope=data.get("escopo", "global"),
            context=data.get("contexto"),
            origin=RuleOrigin(
                type="feedback",
                atendimento_ref=atendimento_ref,
                feedback_original=feedback
            )
        )

    async def refine_manual_rule(self, description: str) -> Dict[str, Any]:
        """
        Refines a manual natural language description into a formal rule structure.
        """
        prompt = f"""
        Converta a seguinte descrição de regra de negócio em uma instrução formal para um avaliador de IA.
        
        Descrição: {description}
        
        Retorne um JSON com:
        - nome: Nome curto e profissional.
        - texto: Instrução em segunda pessoa contendo a condição e o impacto no score.
        """
        
        response_raw = self.ia_client.call(prompt, json_mode=True)
        return json.loads(response_raw) if isinstance(response_raw, str) else response_raw
