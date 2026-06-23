# Research: LLM Node Temperature Control

## Decision 1: Domain Port Update
**Decision**: Update `ILLMProvider.call` to accept an optional `temperature` argument with a default value of `0.0`.
**Rationale**: Centralizing the parameter in the interface ensures all adapters follow the same contract and that the default behavior remains deterministic.

## Decision 2: Adapter Specifics
**Decision**:
- **OpenAI**: Pass `temperature` directly to `self.client.chat.completions.create`.
- **Gemini**: Pass `temperature` within the `config` dictionary in `self.client.models.generate_content`.
**Rationale**: Both SDKs support temperature, but the parameter placement differs slightly.

## Decision 3: Graph Compilation and Execution
**Decision**: 
- `GraphCompiler` will read `temperature` from the `node_data` in the JSON definition.
- `LangGraphAdapter` will extract this value and pass it to the `call` method of the LLM provider.
**Rationale**: This maintains the clean separation between flow definition and execution logic.

## Decision 4: UI Control
**Decision**: Add a `Slider` component in the `Sidebar.tsx` for LLM nodes, with a range of 0.0 to 1.0 and a step of 0.1.
**Rationale**: 1.0 is the standard creative limit for most common models (like GPT-4o-mini). While some models support up to 2.0, 1.0 is safer for general use cases.
