# Research: Model Selection and Cost Tracking

## Decision 1: Model Provider Abstraction
**Decision**: Implement `IModelProvider` interface in `domain/ports/model_provider.py`.
**Rationale**: Adheres to Hexagonal Architecture. The Domain layer should not know about OpenAI or Gemini SDK specifics.
**Alternatives considered**: 
- Hardcoding model lists in a config file (Rejected: not dynamic enough for provider updates).
- Direct SDK calls in Application services (Rejected: violates Clean Architecture).

## Decision 2: Model Discovery Implementation
**Decision**: Use `client.models.list()` for OpenAI and `client.models.list_models()` for Gemini.
**Rationale**: These are standard SDK methods for discovering available models associated with the API key.
**Alternatives considered**:
- Static lists per provider (Rejected: prevents discovery of new or private fine-tuned models).

## Decision 3: Token Capture Strategy
**Decision**: Extract usage from API responses and persist in `TraceLog`.
- OpenAI: `response.usage.prompt_tokens`, `completion_tokens`.
- Gemini: `response.usage_metadata.prompt_token_count`, `candidates_token_count`.
- Thinking Tokens: Map OpenAI `completion_tokens_details.reasoning_tokens` if present.
**Rationale**: This provides granular cost visibility per node.
**Alternatives considered**:
- Using `tiktoken` locally to estimate (Rejected: less accurate than official provider metadata).

## Decision 4: Frontend Integration
**Decision**: Create a dedicated `/models` endpoint to serve the aggregated model list.
**Rationale**: Allows the frontend to load models once and populate all dropdowns.
**Alternatives considered**:
- Fetching models within the Flow list (Rejected: redundant).
