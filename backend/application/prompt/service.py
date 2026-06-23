from typing import List, Optional
from domain.ports.prompt_repository import IPromptRepository, Prompt

class PromptManagementUseCase:
    def __init__(self, repository: IPromptRepository):
        self.repo = repository

    def list_available_prompts(self) -> List[str]:
        return self.repo.list_prompts()

    def get_prompt_content(self, name: str) -> Optional[str]:
        prompt = self.repo.get_prompt(name)
        return prompt.content if prompt else None

    def update_prompt(self, name: str, new_content: str) -> bool:
        try:
            prompt = self.repo.get_prompt(name)
            if not prompt:
                prompt = Prompt(name=name, content=new_content)
            else:
                prompt.content = new_content
            
            self.repo.save_prompt(prompt)
            return True
        except Exception:
            return False
