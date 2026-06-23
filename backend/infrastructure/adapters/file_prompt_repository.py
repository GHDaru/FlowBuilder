import os
from pathlib import Path
from typing import List, Optional
from domain.ports.prompt_repository import IPromptRepository, Prompt

class FilePromptRepository(IPromptRepository):
    def __init__(self, base_path: Path):
        self.base_path = Path(base_path).resolve()
        self._cache = {}

    def get_prompt(self, name: str) -> Optional[Prompt]:
        # Try to load from disk if not in cache
        if name not in self._cache:
            paths_to_try = [
                self.base_path / name,
                self.base_path / f"{name}.md",
                self.base_path / f"{name}.txt"
            ]
            
            for path in paths_to_try:
                if path.exists():
                    try:
                        with open(path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            self._cache[name] = Prompt(name=name, content=content, path=path)
                            return self._cache[name]
                    except Exception:
                        return None
            return None
            
        return self._cache[name]

    def save_prompt(self, prompt: Prompt) -> None:
        # Determine path
        file_path = prompt.path or (self.base_path / f"{prompt.name}.md")
        
        os.makedirs(self.base_path, exist_ok=True)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(prompt.content)
        
        # Update cache
        self._cache[prompt.name] = Prompt(name=prompt.name, content=prompt.content, path=file_path)

    def list_prompts(self) -> List[str]:
        if not self.base_path.exists():
            return []
        
        prompts = []
        for file in self.base_path.iterdir():
            if file.is_file() and file.suffix.lower() in [".md", ".txt"]:
                prompts.append(file.stem)
        
        return sorted(list(set(prompts)))
