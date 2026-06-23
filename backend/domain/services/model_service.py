from typing import List, Dict, Any
from domain.ports.model_provider import IModelProvider
from infrastructure.adapters.openai_adapter import OpenAIAdapter
from infrastructure.adapters.gemini_adapter import GeminiAdapter

class ModelService:
    def __init__(self):
        self.providers: List[IModelProvider] = [
            OpenAIAdapter(),
            GeminiAdapter()
        ]

    def list_all_models(self) -> List[Dict[str, Any]]:
        all_models = []
        for provider in self.providers:
            all_models.extend(provider.list_models())
        return all_models
