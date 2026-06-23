import json
from typing import Dict, List, Any, Optional
from google import genai
from domain.ports.llm_provider import ILLMProvider
from domain.ports.model_provider import IModelProvider
from infrastructure.utils.config import config

class GeminiAdapter(ILLMProvider, IModelProvider):
    def __init__(self, model: Optional[str] = None):
        self.client = genai.Client(api_key=config.GEMINI_API_KEY)
        self.model = model or config.GEMINI_MODEL
        self._last_usage = {"input_tokens": 0, "output_tokens": 0, "thinking_tokens": 0}

    def list_models(self) -> List[Dict[str, Any]]:
        if not config.GEMINI_API_KEY:
            return []
        try:
            # The genai SDK has a specific way to list models
            models = self.client.models.list()
            return [
                {"id": m.name, "name": m.display_name, "provider": "gemini"}
                for m in models if "generateContent" in m.supported_actions
            ]
        except Exception as e:
            print(f"Error fetching Gemini models: {e}")
            return []

    def call(self, prompt: str, schema: Optional[Any] = None, json_mode: bool = True, temperature: float = 0.0) -> Dict[str, Any]:
        config_params = {"temperature": temperature}
        if json_mode:
            config_params["response_mime_type"] = "application/json"
            
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=config_params
        )
        
        self._last_usage = {
            "input_tokens": response.usage_metadata.prompt_token_count,
            "output_tokens": response.usage_metadata.candidates_token_count,
            "thinking_tokens": 0 # Gemini thinking tokens are not always exposed same way as OpenAI o1
        }
        
        content = response.text
        if json_mode:
            try:
                return json.loads(content)
            except Exception as e:
                raise ValueError(f"Failed to parse Gemini JSON response: {e}\nContent: {content}")
        
        return {"response": content}

    def get_token_usage(self) -> Dict[str, int]:
        return self._last_usage
