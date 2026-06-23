import json
import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from infrastructure.database.connection import Atendimento, AuditLog, Execution
from models.schemas import MetadataOutput, TagsOutput, DimensionScoreOutput, FinalEvaluation
from services.ia_client import IAClient
from infrastructure.utils.prompts import prompt_loader

logger = logging.getLogger(__name__)

class EvaluationFlow:
    def __init__(self, ia_client: IAClient, db: Session):
        self.ia_client = ia_client
        self.db = db

    def _save_audit_log(self, atendimento_id: int, step: str, prompt: str, response: str, status: str, error: str = None):
        log = AuditLog(
            atendimento_id=atendimento_id,
            step_name=step,
            prompt=prompt,
            response_raw=response,
            validation_status=status,
            error_message=error
        )
        self.db.add(log)
        self.db.commit()

    def run_full_evaluation(self, content: str, filename: str, execution_id: int) -> Atendimento:
        # Create initial record
        atendimento = Atendimento(
            execution_id=execution_id,
            filename=filename,
            content=content,
            status="RUNNING"
        )
        self.db.add(atendimento)
        self.db.commit()
        self.db.refresh(atendimento)

        try:
            # 1. Metadata
            metadata = self._process_step(atendimento.id, "Extrair Metadados", content, MetadataOutput)
            
            # 2. Tags
            # Note: We use a custom prompt for tags as defined in research/ai_flow_test.py
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
            tags = self._process_step(atendimento.id, "Tagueamento", content, TagsOutput, template=tag_prompt_template)

            # 3. Scores (3 Dimensions)
            dimensions = ["Comunicação e Clareza", "Profissionalismo e Conformidade", "Resolução e Eficiência"]
            scores = []
            for dim in dimensions:
                score = self._process_step(atendimento.id, dim, content, DimensionScoreOutput)
                scores.append(score)

            # 4. Summary
            summary_raw = self._process_step(atendimento.id, "Resumir Atendimento", content, str, json_mode=False)

            # Consolidate
            notas = [s.nota for s in scores if isinstance(s, DimensionScoreOutput)]
            media = sum(notas) / len(notas) if notas else 0

            atendimento.final_score = round(media, 2)
            atendimento.summary = summary_raw if isinstance(summary_raw, str) else str(summary_raw)
            atendimento.status = "SUCCESS"
            
        except Exception as e:
            logger.error(f"Error evaluating {filename}: {e}")
            atendimento.status = "ERROR"
            atendimento.summary = f"Error: {str(e)}"

        self.db.commit()
        self.db.refresh(atendimento)
        return atendimento

    def _process_step(self, atendimento_id: int, step_name: str, input_text: str, schema_class, template: str = None, json_mode: bool = True):
        try:
            if template:
                prompt = template.replace("{{input}}", input_text)
            else:
                prompt_base = prompt_loader.load_prompt(step_name)
                prompt = prompt_base.replace("{{input}}", input_text)
                # Handle placeholders in score prompts
                prompt = prompt.replace("{{contexto_feedback}}", "").replace("{{contexto_global}}", "")

            response_raw = self.ia_client.call(prompt, json_mode=json_mode)
            
            if not json_mode:
                self._save_audit_log(atendimento_id, step_name, prompt, response_raw, "VALID")
                return response_raw

            try:
                data = json.loads(self._clean_json(response_raw))
                validated_data = schema_class(**data)
                self._save_audit_log(atendimento_id, step_name, prompt, response_raw, "VALID")
                return validated_data
            except Exception as ve:
                self._save_audit_log(atendimento_id, step_name, prompt, response_raw, "INVALID", str(ve))
                raise ve

        except Exception as e:
            logger.error(f"Step {step_name} failed: {e}")
            raise e

    def _clean_json(self, text: str) -> str:
        import re
        match = re.search(r'\{.*\}', text, re.DOTALL)
        return match.group(0) if match else text
