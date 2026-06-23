from abc import ABC, abstractmethod
from typing import List, Optional
from domain.models.rule import Rule

class IRuleRepository(ABC):
    @abstractmethod
    def save(self, rule: Rule) -> Rule:
        pass

    @abstractmethod
    def get_by_id(self, rule_id: str) -> Optional[Rule]:
        pass

    @abstractmethod
    def list_all(self, scope: Optional[str] = None, context: Optional[str] = None) -> List[Rule]:
        pass

    @abstractmethod
    def delete(self, rule_id: str) -> bool:
        pass

    @abstractmethod
    def list_active_for_context(self, context: Optional[str] = None) -> List[Rule]:
        """
        Returns all active Global rules + rules for the specific context.
        """
        pass
