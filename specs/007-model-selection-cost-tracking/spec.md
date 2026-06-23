# Feature Specification: Model Selection and Cost Tracking

**Feature Branch**: `007-model-selection-cost-tracking`  
**Created**: 2026-06-01  
**Status**: Draft  
**Input**: User description: "eu como construtor dos fluxos desejo no nó determinar qual modelo ele deve utilizar como motor. Estes devem ser os que estão configurados pelo backend. No backend, os modelos deveriam ser obtidos a partir dos comandos dos adapters (por exemplo openai e gemini tem chamadas que devolvem seus modelos, então cria uma abstração que depois implementa isto nos adapters de modelo) Este modelos devem ser apresentados para seleção. Nas chamadas, devemos saber quanto custou (via quantidade de tokens de input, output, thinking) cada chamada de cada nó e ter um resumo geral da chamada."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Per-Node Model Selection (Priority: P1)

As a Flow Builder, I want to select a specific AI model for each node in my flow so that I can use the most appropriate (or cost-effective) model for each specific task (e.g., GPT-4o for complex analysis, GPT-4o-mini for simple tagging).

**Why this priority**: Core functionality requested. Enables multi-model orchestration.

**Independent Test**: Create a flow with two nodes, assign "GPT-4o" to Node A and "Gemini 1.5 Pro" to Node B, and verify the backend invokes the correct provider for each node.

**Acceptance Scenarios**:
1. **Given** a node configuration sidebar, **When** I open it, **Then** I should see a dropdown list of available AI models.
2. **Given** the model dropdown, **When** I select a model, **Then** the node definition JSON should be updated with the selected model ID.

---

### User Story 2 - Automated Model Discovery (Priority: P1)

As a Developer, I want the system to automatically fetch available models from configured providers so that the UI always reflects the latest capabilities without manual updates.

**Why this priority**: Simplifies maintenance and ensures the UI is always in sync with backend capabilities.

**Independent Test**: Add a new API key for a provider in the backend, and verify the frontend dropdown automatically includes the models supported by that provider.

**Acceptance Scenarios**:
1. **Given** the backend API, **When** queried for models, **Then** it must return a unified list of models from all active adapters (OpenAI, Gemini, etc.).
2. **Given** a new model adapter, **When** it implements the model discovery interface, **Then** its models should appear in the system without changing the core engine.

---

### User Story 3 - Token Usage and Cost Tracking (Priority: P2)

As an AI Researcher, I want to see the detailed token usage (input, output, thinking) for every node execution and a total summary for the entire flow run so that I can monitor costs and optimize efficiency.

**Why this priority**: Essential for operational monitoring and cost management.

**Independent Test**: Run a flow and verify the `TraceLog` in the database contains `input_tokens`, `output_tokens`, and `thinking_tokens`, and the UI displays these values.

**Acceptance Scenarios**:
1. **Given** a node execution, **When** it completes, **Then** the system MUST capture and store the exact token counts provided by the AI provider.
2. **Given** a completed flow run, **When** I view the results, **Then** I should see a summary totaling all tokens across all nodes.

---

### Edge Cases

- **Model Unavailable**: If a previously selected model is no longer available (e.g., API key expired or model deprecated), the system MUST fallback to a default model and log a warning.
- **Token Tracking Failure**: If the AI provider fails to return usage metadata, the node execution should still succeed, but the token counts should be recorded as 0 or "Unknown".
- **Dynamic Variable Collision**: Ensure that token counting correctly accounts for the final resolved prompt (including all injected variables) rather than just the template.
- **Provider-Specific Fields**: Models that do not support "thinking" tokens (e.g., standard GPT-3.5) MUST report 0 for that specific field.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Backend MUST define an abstraction (`IModelProvider`) for fetching available models.
- **FR-002**: OpenAI and Gemini adapters MUST implement the model discovery abstraction.
- **FR-003**: Frontend MUST provide a dropdown in the `Sidebar` to select a model for `llm` nodes.
- **FR-004**: Node configuration JSON MUST store the selected `model_id`.
- **FR-005**: Execution engine MUST use the specific `model_id` defined in the node when making the LLM call.
- **FR-006**: Backend MUST capture `input_tokens`, `output_tokens`, and `thinking_tokens` (if available) from LLM responses.
- **FR-007**: System MUST persist token usage data in the `TraceLog` table.
- **FR-008**: System MUST provide an endpoint or summary calculation for total token usage per `Tracking` (execution run).

### Key Entities *(include if feature involves data)*

- **Node (updated)**: Now includes a `model_id` field in its metadata.
- **TraceLog (updated)**: Now includes `input_tokens`, `output_tokens`, and `thinking_tokens`.
- **Model (new)**: A representation of an AI model with its ID, name, and provider source.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Model selection dropdown loads in less than 500ms.
- **SC-002**: 100% of LLM calls have their token usage tracked and persisted.
- **SC-003**: Flow summary accurately reflects the sum of all node tokens without discrepancies.

## Assumptions

- **Thinking Tokens**: These refer to reasoning/thought tokens (e.g., OpenAI `reasoning_tokens` or Gemini's internal thinking process) and will be mapped to a standard field.
- **Model Compatibility**: All models fetched from adapters are assumed to be compatible with the system's prompt format (Markdown/JSON).
- **Default Model**: Nodes will have a default model (e.g., `gpt-4o-mini`) if none is selected.
