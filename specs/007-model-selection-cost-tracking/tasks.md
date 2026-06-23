# Tasks: Model Selection and Cost Tracking

**Feature**: Model Selection and Cost Tracking
**Plan**: [specs/007-model-selection-cost-tracking/plan.md](plan.md)

## Implementation Strategy

We will follow an incremental approach:
1.  **Foundational**: Update the database schema to support token tracking.
2.  **US2 (Discovery)**: Implement the model discovery abstraction and adapters first, as US1 depends on having a list of models.
3.  **US1 (Selection)**: Update the UI to allow model selection and the execution engine to respect the chosen model.
4.  **US3 (Tracking)**: Capture and persist usage metrics from AI providers.
5.  **Polish**: Add summaries and UI refinements.

---

## Phase 1: Setup

- [x] T001 Verify `uv` environment and backend dependencies in `aitest/backend/pyproject.toml`
- [x] T002 Verify `npm` dependencies in `aitest/frontend/package.json`

---

## Phase 2: Foundational (Infrastructure)

- [x] T003 Update `TraceLog` model with `input_tokens`, `output_tokens`, and `thinking_tokens` in `aitest/backend/infrastructure/database/connection.py`
- [x] T004 Create `IModelProvider` interface in `aitest/backend/domain/ports/model_provider.py`
- [x] T005 Define `Model` DTO in `aitest/backend/models/schemas.py`

---

## Phase 3: User Story 2 - Automated Model Discovery (P1)

**Story Goal**: Automatically fetch available models from configured providers.
**Independent Test**: Endpoint `/models` returns a combined list of models from OpenAI and Gemini.

- [x] T006 [P] [US2] Implement `OpenAIAdapter` model discovery in `aitest/backend/infrastructure/adapters/openai_adapter.py`
- [x] T007 [P] [US2] Implement `GeminiAdapter` model discovery in `aitest/backend/infrastructure/adapters/gemini_adapter.py`
- [x] T008 [US2] Create `ModelService` to aggregate models from providers in `aitest/backend/domain/services/model_service.py`
- [x] T009 [US2] Add `GET /models` endpoint in `aitest/backend/main.py`
- [x] T010 [US2] Create frontend model service in `aitest/frontend/src/services/modelService.ts`

---

## Phase 4: User Story 1 - Per-Node Model Selection (P1)

**Story Goal**: Select a specific AI model for each node in the flow builder.
**Independent Test**: Save a node with a specific model and verify the selection persists in the database.

- [x] T011 [US1] Update `Sidebar.tsx` to include a dropdown for model selection in `aitest/frontend/src/components/Sidebar/Sidebar.tsx`
- [x] T012 [US1] Update `IAClient` to support dynamic model and provider initialization in `aitest/backend/services/ia_client.py`
- [x] T013 [US1] Update `LangGraphAdapter` to pass model configuration to the LLM function in `aitest/backend/infrastructure/adapters/langgraph_adapter.py`

---

## Phase 5: User Story 3 - Token Usage and Cost Tracking (P2)

**Story Goal**: Track and persist token usage for every node execution.
**Independent Test**: After running a flow, verify the `TraceLog` table contains non-zero token counts.

- [x] T014 [US3] Capture usage metadata in `IAClient` responses in `aitest/backend/services/ia_client.py`
- [x] T015 [US3] Update `FlowExecutionUseCase` log callback to persist token usage in `aitest/backend/application/services/flow_execution.py`
- [x] T016 [US3] Add `GET /trackings/{id}/summary` endpoint for aggregated costs in `aitest/backend/main.py`
- [x] T017 [US3] Add token usage badges to the Trace Log UI in `aitest/frontend/src/components/History/TraceLogView.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T018 Implement fallback logic for unavailable models in `aitest/backend/services/ia_client.py`
- [x] T019 Update `GEMINI.md` local documentation in `aitest/backend/` and `aitest/frontend/`
- [x] T020 [P] Run all backend tests with `uv run pytest`

---

## Parallel Execution Opportunities

- T006 and T007 (Provider adapters)
- T020 (Final testing)

## Dependencies

1. Phase 2 (Foundational) MUST complete before Phase 3.
2. Phase 3 (US2) MUST complete before T011 in Phase 4 (UI needs the model list).
3. Phase 4 (US1) MUST complete before Phase 5 (Tracking needs the actual execution run).
