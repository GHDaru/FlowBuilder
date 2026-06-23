# Data Model: Prompt Management and Flow Visualization

## Entities

### Prompt (Value Object / Entity)
Represents an AI prompt template stored as a file.
- **name**: String (Filename without extension, e.g., "Extrair Metadados")
- **content**: String (Markdown content)
- **path**: Path (Physical location on disk)

### FlowNode (UI Value Object)
Represents a step in the evaluation graph.
- **id**: String (Step name)
- **label**: String (Display name)
- **status**: String (SUCCESS, ERROR, PENDING)
- **result**: String (Optional summary of output, e.g., "Score: 8.5")

## Domain Ports

### IPromptRepository
Interface for managing prompt templates.
- `get_prompt(name: str) -> Prompt`
- `save_prompt(prompt: Prompt) -> None`
- `list_prompts() -> List[str]`

## Infrastructure Adapters

### FilePromptRepository
Implements `IPromptRepository` using the local filesystem.
- **Base Directory**: `aitest/data/prompts/`
- **Formats**: `.md`, `.txt`

## State Transitions (Flow Visualization)
1. **PENDING**: Step has not started.
2. **RUNNING**: Step is currently being processed by LLM.
3. **SUCCESS**: Step completed and output validated.
4. **ERROR**: LLM call failed or output failed validation.
