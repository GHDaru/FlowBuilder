from abc import ABC, abstractmethod
from typing import List, Dict, Any

class IModelProvider(ABC):
    """
    Port for AI model discovery.
    """
    
    @abstractmethod
    def list_models(self) -> List[Dict[str, Any]]:
        """
        Returns a list of available models from the provider.
        Each model should have 'id', 'name', and 'provider'.
        """
        pass
