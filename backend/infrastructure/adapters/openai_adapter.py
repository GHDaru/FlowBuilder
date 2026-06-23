import json
import re
from typing import Dict, Any, Optional, List
from openai import OpenAI
from domain.ports.llm_provider import ILLMProvider
from domain.ports.model_provider import IModelProvider
from infrastructure.utils.config import config

class OpenAIAdapter(ILLMProvider, IModelProvider):
    def __init__(self, model: Optional[str] = None):
        self.client = OpenAI(api_key=config.OPENAI_API_KEY)
        self.model = model or config.OPENAI_MODEL
        self._last_usage = {"input_tokens": 0, "output_tokens": 0, "thinking_tokens": 0}

    def list_models(self) -> List[Dict[str, Any]]:
        if not config.OPENAI_API_KEY:
            return []
        try:
            models = self.client.models.list()
            # Filter only GPT models for better UX
            return [
                {"id": m.id, "name": m.id, "provider": "openai"}
                for m in models if "gpt" in m.id or "o1" in m.id
            ]
        except Exception as e:
            print(f"Error fetching OpenAI models: {e}")
            return []

    def call(self, prompt: str, schema: Optional[Any] = None, json_mode: bool = True, temperature: float = 0.0) -> Dict[str, Any]:
        response_format = {"type": "json_object"} if json_mode else None
        
        # OpenAI requirement: 'messages' must contain the word 'json' to use json_object
        if json_mode and "json" not in prompt.lower():
            prompt += "\n\nRespond strictly in JSON format."

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            response_format=response_format,
            temperature=temperature
        )
        
        content = response.choices[0].message.content
        
        # Extract usage and handle thinking tokens for o1 models
        usage = response.usage
        thinking = 0
        if hasattr(usage, "completion_tokens_details") and usage.completion_tokens_details:
            thinking = getattr(usage.completion_tokens_details, "reasoning_tokens", 0)

        self._last_usage = {
            "input_tokens": usage.prompt_tokens,
            "output_tokens": usage.completion_tokens,
            "thinking_tokens": thinking
        }

        if json_mode:
            try:
                return json.loads(self._clean_json(content))
            except Exception as e:
                raise ValueError(f"Failed to parse OpenAI JSON response: {e}\nContent: {content}")
        
        return {"response": content}

    def get_token_usage(self) -> Dict[str, int]:
        return self._last_usage

    def _clean_json(self, text: str) -> str:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        return match.group(0) if match else text
