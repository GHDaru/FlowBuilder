from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class ILLMProvider(ABC):
    @abstractmethod
    def call(self, prompt: str, schema: Optional[Any] = None, json_mode: bool = True, temperature: float = 0.0) -> Dict[str, Any]:
        """
        Calls the LLM provider and returns the response as a dictionary.
        If schema is provided, the adapter should handle validation or use it for structured output.
        """
        pass

    @abstractmethod
    def get_token_usage(self) -> Dict[str, int]:
        """Returns a dictionary with 'input_tokens' and 'output_tokens' from the last call."""
        pass
