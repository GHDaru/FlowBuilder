from abc import ABC, abstractmethod
from typing import List, Optional
from domain.models.atendimento import Atendimento
from domain.models.rule import EvaluationRule

class IAtendimentoRepository(ABC):
    @abstractmethod
    def save(self, atendimento: Atendimento) -> Atendimento:
        """Saves or updates an Atendimento aggregate."""
        pass

    @abstractmethod
    def get_by_id(self, id: str) -> Optional[Atendimento]:
        """Retrieves an Atendimento by its unique identifier."""
        pass

    @abstractmethod
    def list_rules(self) -> List[EvaluationRule]:
        """Retrieves all active evaluation rules."""
        pass

    @abstractmethod
    def save_rule(self, rule: EvaluationRule) -> EvaluationRule:
        """Saves an evaluation rule."""
        pass
