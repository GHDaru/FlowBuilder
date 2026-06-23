import os
from pathlib import Path
from infrastructure.utils.config import config
from infrastructure.adapters.file_prompt_repository import FilePromptRepository

class PromptLoader:
    def __init__(self, repository=None):
        self.repo = repository or FilePromptRepository(config.LOCAL_PROMPTS_PATH)

    def load_prompt(self, filename: str) -> str:
        """Loads a prompt content."""
        prompt = self.repo.get_prompt(filename)
        if prompt:
            return prompt.content
        raise FileNotFoundError(f"Prompt '{filename}' not found in {self.repo.base_path}")

    def list_prompts(self) -> list:
        """Lists available prompts."""
        return self.repo.list_prompts()

# Singleton for backward compatibility
prompt_loader = PromptLoader()
