# Feature Specification: LLM Node Temperature Control

**Feature Branch**: `016-llm-temperature-control`  
**Created**: 2026-06-04  
**Status**: Draft  
**Input**: User description: "Implementar na interface do llm adapter a temperatura e levar para os adpaters. Nos nós, permitir colocar a temperatura. Trazer como padrão 0."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Node Temperature Configuration (Priority: P1)

As a Flow Creator, I want to set a specific temperature for each LLM Node in the Visual Lab, so that I can control the creativity vs. determinism of the AI response for that specific step.

**Why this priority**: Essential for high-quality evaluations (e.g., determinism for extraction, higher temperature for summarization).

**Acceptance Scenarios**:
1. **Given** an LLM Node Sidebar, **When** configuring the node, **Then** I MUST see a "Temperature" field (slider or input).
2. **Given** a new LLM Node, **When** I first create it, **Then** its default temperature MUST be `0`.
3. **Given** a saved temperature value, **When** I reload the flow, **Then** the value MUST be preserved and correctly displayed in the UI.

---

### User Story 2 - Model Execution with Temperature (Priority: P1)

As a Flow Creator, I want the execution engine to pass my custom temperature to the underlying LLM provider (OpenAI or Gemini), so that the actual AI output reflects my setting.

**Why this priority**: Without this, the UI setting is merely decorative.

**Acceptance Scenarios**:
1. **Given** an execution tracking, **When** an LLM node runs with temperature `0.7`, **Then** the `TraceLog` SHOULD ideally capture that this temperature was sent to the provider.
2. **Given** the system execution, **When** calling the `ILLMProvider` interface, **Then** it MUST accept a `temperature` parameter.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Update `ILLMProvider` (Domain Port) to include `temperature` in the `call_openai` (or equivalent) method.
- **FR-002**: Update `OpenAIAdapter` and `GeminiAdapter` to pass the temperature value to the respective SDKs/API calls.
- **FR-003**: Backend `GraphCompiler` MUST extract the `temperature` field from the visual JSON definition.
- **FR-004**: `LangGraphAdapter` MUST pass the node-specific temperature during execution.
- **FR-005**: Frontend `Sidebar` MUST include a UI control for temperature (range 0.0 to 1.0 or 2.0 depending on provider support, recommended 0.0 to 1.0 for UI safety).
- **FR-006**: Default value MUST be `0.0`.

### Key Entities *(include if feature involves data)*

- **LLM Node Data**: Now includes `temperature: float`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of LLM executions use the specific temperature defined in the node configuration.
- **SC-002**: The default value of 0 is applied to all nodes that don't have a value explicitly set.

## Assumptions

- We will standardize the temperature range in the UI to [0.0, 1.0] for simplicity, even though some providers support up to 2.0.
- If a provider does not support temperature (rare), it will be ignored by that specific adapter.
