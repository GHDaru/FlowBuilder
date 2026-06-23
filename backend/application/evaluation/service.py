from concurrent.futures import ThreadPoolExecutor
from domain.models.atendimento import Atendimento
from domain.ports.llm_provider import ILLMProvider
from domain.ports.repository import IAtendimentoRepository
from domain.services.rule_evaluator import RuleEvaluator
from application.evaluation.extract_metadata import MetadataExtractionUseCase
from application.evaluation.classify_interaction import ClassificationUseCase
from application.evaluation.score_dimension import DimensionScoringUseCase
from application.evaluation.consolidate_results import ConsolidationUseCase

class EvaluationApplicationService:
    def __init__(self, llm_provider: ILLMProvider, repository: IAtendimentoRepository):
        self.llm_provider = llm_provider
        self.repository = repository
        
        # Use Cases
        self.metadata_extractor = MetadataExtractionUseCase(llm_provider)
        self.classifier = ClassificationUseCase(llm_provider)
        self.scorer = DimensionScoringUseCase(llm_provider)
        self.consolidator = ConsolidationUseCase(llm_provider)

    def start_evaluation(self, content: str, filename: str, execution_id: int) -> Atendimento:
        atendimento = Atendimento(
            source_content=content,
            filename=filename,
            execution_id=execution_id,
            status="RUNNING"
        )
        return self.repository.save(atendimento)

    def process_metadata_and_classification(self, atendimento_id: str) -> Atendimento:
        atendimento = self.repository.get_by_id(atendimento_id)
        if not atendimento:
            raise ValueError(f"Atendimento {atendimento_id} not found")

        try:
            # Step 1: Metadata
            metadata, usage1 = self.metadata_extractor.execute(atendimento.source_content)
            atendimento.metadata = metadata
            atendimento.add_token_usage(usage1)
            
            # Step 2: Classification
            classification, usage2 = self.classifier.execute(atendimento.source_content)
            atendimento.classification = classification
            atendimento.add_token_usage(usage2)
            
            return self.repository.save(atendimento)
            
        except Exception as e:
            atendimento.status = "FAILED"
            atendimento.summary = f"Error in Steps 1/2: {str(e)}"
            return self.repository.save(atendimento)

    def evaluate_rules(self, atendimento_id: str) -> list[str]:
        """Step 3: Determine which dimensions to run based on classification."""
        atendimento = self.repository.get_by_id(atendimento_id)
        if not atendimento or not atendimento.classification:
            raise ValueError(f"Atendimento {atendimento_id} classification not found")

        rules = self.repository.list_rules()
        evaluator = RuleEvaluator(rules)
        
        selected_dimensions = evaluator.get_dimensions_for_classification(atendimento.classification)
        return selected_dimensions

    def run_scoring_and_consolidation(self, atendimento_id: str, dimensions: list[str]) -> Atendimento:
        """Steps 4 & 5: Parallel scoring and consolidation."""
        atendimento = self.repository.get_by_id(atendimento_id)
        if not atendimento:
            raise ValueError(f"Atendimento {atendimento_id} not found")

        try:
            # Step 4: Parallel Scoring
            with ThreadPoolExecutor(max_workers=len(dimensions)) as executor:
                futures = [executor.submit(self.scorer.execute, atendimento.source_content, dim) for dim in dimensions]
                for future in futures:
                    score, usage = future.result()
                    atendimento.add_score(score)
                    atendimento.add_token_usage(usage)

            # Step 5: Consolidation
            summary, usage_final = self.consolidator.execute(atendimento.source_content)
            atendimento.summary = summary
            atendimento.add_token_usage(usage_final)
            
            atendimento.status = "COMPLETED"
            return self.repository.save(atendimento)
            
        except Exception as e:
            atendimento.status = "FAILED"
            atendimento.summary = f"Error in Steps 4/5: {str(e)}"
            return self.repository.save(atendimento)
