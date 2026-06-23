import os
import json
from typing import Dict
from infrastructure.adapters.openai_adapter import OpenAIAdapter
from infrastructure.adapters.gemini_adapter import GeminiAdapter

class IAClient:
    def __init__(self, provider: str = "openai", model: str = None):
        self.provider = provider.lower()
        
        if self.provider == "openai":
            self.adapter = OpenAIAdapter(model=model)
        elif self.provider == "gemini":
            self.adapter = GeminiAdapter(model=model)
        else:
            raise ValueError(f"Provider '{provider}' not supported. Use 'openai' or 'gemini'.")

    def call(self, prompt: str, json_mode: bool = False, temperature: float = 0.0) -> str:
        """Call the provider through a unified interface."""
        # The adapters now return Dict, but the legacy IAClient expected str.
        # To maintain compatibility with existing code, we'll convert back if needed
        # or update the callers.
        result = self.adapter.call(prompt, json_mode=json_mode, temperature=temperature)
        if isinstance(result, dict):
            return json.dumps(result)
        return result

    def call_openai(self, prompt: str, json_mode: bool = False, temperature: float = 0.0) -> str:
        """Alias for backward compatibility with main.py."""
        return self.call(prompt, json_mode, temperature)

    def get_token_usage(self) -> Dict[str, int]:
        return self.adapter.get_token_usage()

def get_ia_client(provider="openai", model=None):
    return IAClient(provider=provider, model=model)
