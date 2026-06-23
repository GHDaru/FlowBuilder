from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class IOfficialDbPort(ABC):
    @abstractmethod
    def list_firms(self, search: Optional[str] = None) -> List[Dict[str, Any]]:
        """List accounting firms with evaluation counts, optionally filtered by name."""
        pass

    @abstractmethod
    def list_interactions(self, firm_ids: List[str]) -> List[Dict[str, Any]]:
        """List recent interactions for one or more firms."""
        pass

    @abstractmethod
    def get_interaction_content(self, interaction_id: int) -> str:
        """Get the text content of a specific interaction."""
        pass
    
    @abstractmethod
    def get_interaction_details(self, interaction_id: int) -> Dict[str, Any]:
        """Get full details of an interaction."""
        pass
