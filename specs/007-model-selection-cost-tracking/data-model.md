# Data Model: Model Selection and Cost Tracking

## Updated Entities

### Flow
*Updated to ensure `json_definition` supports per-node model preferences.*
- `json_definition`: String (JSON). Nodes within this JSON will now include an optional `model_id` and `provider`.

### TraceLog
*Updated to capture precise usage metrics.*
- `input_tokens`: Integer (Default: 0) - Prompt/Input tokens.
- `output_tokens`: Integer (Default: 0) - Completion/Output tokens.
- `thinking_tokens`: Integer (Default: 0) - Reasoning/Thought tokens (e.g., OpenAI o1-preview or Gemini internal).
- `total_tokens`: Integer (Formula: `input_tokens + output_tokens`) - For quick reporting.

### Tracking
*Updated to aggregate total execution costs.*
- `total_input_tokens`: Integer (Sum of TraceLogs).
- `total_output_tokens`: Integer (Sum of TraceLogs).

## New Concepts (Non-Persistent)

### Model (DTO)
- `id`: String (e.g., "gpt-4o")
- `name`: String (e.g., "GPT-4o")
- `provider`: String ("openai" | "gemini")
- `capabilities`: List (e.g., ["vision", "json_mode"])

## State Transitions
1. **Flow Definition**: User selects model in UI -> Saved in `Flow.json_definition`.
2. **Execution Initialization**: `FlowExecutionUseCase` reads `model_id` from node data.
3. **LLM Request**: `LangGraphAdapter` passes `model_id` to `IAClient`.
4. **LLM Response**: `IAClient` returns content + usage metadata.
5. **Persistence**: `FlowExecutionUseCase` stores usage in `TraceLog`.
