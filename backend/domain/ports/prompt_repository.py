from abc import ABC, abstractmethod
from typing import List, Optional
from dataclasses import dataclass
from pathlib import Path

@dataclass
class Prompt:
    name: str
    content: str
    path: Optional[Path] = None

class IPromptRepository(ABC):
    @abstractmethod
    def get_prompt(self, name: str) -> Optional[Prompt]:
        """Retrieves a prompt by its name."""
        pass

    @abstractmethod
    def save_prompt(self, prompt: Prompt) -> None:
        """Saves or updates a prompt."""
        pass

    @abstractmethod
    def list_prompts(self) -> List[str]:
        """Lists all available prompt names."""
        pass
