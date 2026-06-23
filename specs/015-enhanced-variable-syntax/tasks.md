# Tasks: Enhanced Variable Syntax

**Feature**: Enhanced Variable Syntax
**Plan**: [specs/015-enhanced-variable-syntax/plan.md](plan.md)

## Implementation Strategy

We will implement the centralized resolution logic in the Domain layer first, followed by updating the execution adapter to utilize it. Finally, we will adjust the frontend UI to support the new unified syntax.

1.  **Phase 1: Setup**: Verification.
2.  **Phase 2: Variable Resolver (Domain)**: Create the core resolution logic.
3.  **Phase 3: Backend Integration**: Update LangGraph execution to support nested paths.
4.  **Phase 4: Frontend UI (US2)**: Allow `{{}}` in routing rules.
5.  **Phase 5: Polish**: Verify end-to-end.

---

## Phase 1: Setup

- [x] T001 Verify backend environment with `uv sync`.

---

## Phase 2: Domain Logic (Variable Resolver)

**Story Goal**: Implement the ability to resolve nested JSON paths from a dictionary.
**Independent Test**: Unit tests for `VariableResolver.resolve` with various nesting levels and edge cases.

- [x] T002 [US1] Create `aitest/backend/domain/services/variable_resolver.py` with the `VariableResolver` class.
- [x] T003 [US1] Implement `resolve(data: dict, path: str)` supporting dot notation and legacy exact match.
- [x] T004 [US1] Implement `extract_variable_names(text: str)` to find `{{}}` tokens.
- [x] T005 [P] Create a unit test file `aitest/backend/tests/unit/test_variable_resolver.py` to verify resolution logic.

---

## Phase 3: Backend Integration (LangGraph)

**Story Goal**: LLM nodes and Condition nodes correctly handle nested variable paths.
**Independent Test**: A flow with `{{a.b}}` in prompt and router works correctly.

- [x] T006 [US1] Update `aitest/backend/infrastructure/adapters/langgraph_adapter.py`'s `_make_llm_fn` to use `VariableResolver` for prompt replacement.
- [x] T007 [US2] Update `aitest/backend/infrastructure/adapters/langgraph_adapter.py`'s `_make_router_fn` to resolve the `variable` field (stripping `{{}}` if present) via `VariableResolver`.

---

## Phase 4: User Story 2 - Frontend UI Refinement

**Story Goal**: Allow users to type consistent `{{variable}}` syntax in the router.
**Independent Test**: The "Variable" field in a Condition Node accepts `{{meta.id}}`.

- [x] T008 [P] [US2] Update `aitest/frontend/src/components/Sidebar/Sidebar.tsx` to ensure rule variable field accepts free text (verified existing TextField flexibility).

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T009 [P] Run backend tests via `uv run pytest`.
- [x] T010 [P] Run frontend build to ensure no regressions.

---

## Parallel Execution Opportunities

- T005 (Tests) can be written while T003 is being implemented.
- T008 (Frontend) can be done independently of backend changes as long as the data structure is preserved.

## Dependencies

1. T006 and T007 depend on T003 being completed.
2. T009 depends on T005.
