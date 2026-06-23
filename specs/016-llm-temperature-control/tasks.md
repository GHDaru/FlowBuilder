# Tasks: LLM Node Temperature Control

**Feature**: LLM Node Temperature Control
**Plan**: [specs/016-llm-temperature-control/plan.md](plan.md)

## Implementation Strategy

We will update the system starting from the core domain ports, then through the infrastructure adapters, and finally updating the frontend UI to enable the configuration and execution with custom temperature.

1.  **Phase 1: Setup**: Basic verification.
2.  **Phase 2: Domain Layer (US2)**: Update the LLM provider port.
3.  **Phase 3: Infrastructure Layer (US2)**: Update the OpenAI and Gemini adapters.
4.  **Phase 4: Execution Logic (US2)**: Update compiler and execution adapter.
5.  **Phase 5: Frontend UI (US1)**: Add the temperature control to the Sidebar.
6.  **Phase 6: Polish**: Verification and testing.

---

## Phase 1: Setup

- [x] T001 Verify backend dependencies in `aitest/backend/pyproject.toml`.

---

## Phase 2: User Story 2 - Domain Layer (P1)

**Story Goal**: The system core recognizes `temperature` as a valid parameter for LLM calls.
**Independent Test**: Interface `ILLMProvider` method signature updated and type-checked.

- [x] T002 [US2] Update `ILLMProvider` interface in `aitest/backend/domain/ports/llm_provider.py` to accept `temperature: float = 0.0` in the `call` method.

---

## Phase 3: User Story 2 - Infrastructure Adapters (P1)

**Story Goal**: Specific AI adapters (OpenAI/Gemini) can receive and propagate the temperature value.
**Independent Test**: Unit tests for adapters showing temperature passed to SDK clients.

- [x] T003 [US2] Update `OpenAIAdapter` in `aitest/backend/infrastructure/adapters/openai_adapter.py` to pass `temperature` to `client.chat.completions.create`.
- [x] T004 [US2] Update `GeminiAdapter` in `aitest/backend/infrastructure/adapters/gemini_adapter.py` to pass `temperature` within the `config` of `client.models.generate_content`.

---

## Phase 4: User Story 2 - Execution Logic (P1)

**Story Goal**: The flow execution engine reads temperature from the flow definition and uses it during runtime.
**Independent Test**: Running a flow with a custom temperature results in the correct parameter being sent to the provider.

- [x] T005 [US2] Update `GraphCompiler.compile` in `aitest/backend/domain/services/graph_compiler.py` to extract `temperature` from node data (default to 0.0).
- [x] T006 [US2] Update `LangGraphAdapter._make_llm_fn` in `aitest/backend/infrastructure/adapters/langgraph_adapter.py` to pass the node's temperature to the provider's `call` method.

---

## Phase 5: User Story 1 - Frontend UI (P1)

**Story Goal**: Users can visually set and save the temperature for each node.
**Independent Test**: The Sidebar shows a slider/input; saving updates the node's JSON data.

- [x] T007 [P] [US1] Add a `temperature` state variable to `Sidebar.tsx` (default 0.0) in `aitest/frontend/src/components/Sidebar/Sidebar.tsx`.
- [x] T008 [P] [US1] Implement a `Slider` (MUI) or numeric `TextField` for temperature in `Sidebar.tsx`.
- [x] T009 [US1] Ensure `temperature` is included in the `onUpdateNode` callback in `Sidebar.tsx`.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T010 [P] Run backend tests via `uv run pytest`.
- [x] T011 [P] Run frontend build (`npm run build`) to ensure type safety.

---

## Parallel Execution Opportunities

- T007 and T008 (Frontend UI) can be developed independently of the backend adapter changes as long as the JSON key `temperature` is agreed upon.

## Dependencies

1. T003 and T004 depend on T002 (Port update).
2. T006 depends on T003/T004 (Adapter updates) and T005 (Compiler update).
