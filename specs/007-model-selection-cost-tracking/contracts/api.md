# API Contract: Model Selection

## GET /models
*Returns a list of all available models from all configured providers.*

### Response (200 OK)
```json
[
  {
    "id": "gpt-4o",
    "name": "GPT-4o",
    "provider": "openai"
  },
  {
    "id": "gemini-1.5-pro",
    "name": "Gemini 1.5 Pro",
    "provider": "gemini"
  }
]
```

## GET /trackings/{id}/summary
*Returns an aggregated summary of token usage for a specific execution.*

### Response (200 OK)
```json
{
  "tracking_id": "uuid",
  "total_input_tokens": 1250,
  "total_output_tokens": 800,
  "total_thinking_tokens": 0,
  "node_details": [
    {
      "node_id": "llm-1",
      "model_id": "gpt-4o",
      "input_tokens": 500,
      "output_tokens": 300
    }
  ]
}
```
