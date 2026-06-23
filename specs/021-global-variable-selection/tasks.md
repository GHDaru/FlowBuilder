# Implementation Tasks: global-variable-selection

**Feature**: global-variable-selection  
**Plan**: [specs/021-global-variable-selection/plan.md](plan.md)  
**Branch**: `021-global-variable-selection`

## Implementation Strategy
We will follow an incremental approach:
1.  **Backend Foundation**: Create the endpoint to list available global variables.
2.  **Frontend Integration**: Update the sidebar to allow selecting these variables in the "Start" node.
3.  **Execution Engine**: Update the LangGraph adapter to initialize the state with the selected variables.

## Phase 1: Setup
- [x] T001 Add `OfficialVariable` schema to `aitest/backend/models/official_schemas.py`
- [x] T002 Define `OfficialVariable` interface in `aitest/frontend/src/services/officialDataApi.ts`

## Phase 2: Foundational
- [x] T003 Implement `get_available_variables` in `aitest/backend/application/services/official_data_service.py` to return static definitions (atendente, cliente, etc.)
- [x] T004 Add `GET /official/variables` endpoint to `aitest/backend/main.py`

## Phase 3: [US1] Start Node Configuration (P1)
**Story Goal**: Allow users to select global variables in the Start node.
**Independent Test**: Click the Start node in the Flow Builder and see the list of variables.

- [x] T005 [P] [US1] Update `aitest/frontend/src/services/officialDataApi.ts` to include `listVariables` method
- [x] T006 [US1] Modify `aitest/frontend/src/components/Sidebar/Sidebar.tsx` to detect `type === 'start'` nodes
- [x] T007 [US1] Implement a checkbox list in `Sidebar.tsx` to display and toggle `selected_globals` for the start node

## Phase 4: [US2] Variable Availability (P2)
**Story Goal**: Make selected variables available in subsequent nodes.
**Independent Test**: Use a global variable in an LLM node prompt and verify it is resolved in the Trace logs.

- [x] T008 [US2] Update `LangGraphAdapter._make_start_fn` in `aitest/backend/infrastructure/adapters/langgraph_adapter.py` to include `selected_globals` in state update
- [x] T009 [US2] Modify `FlowExecutionUseCase.execute` in `aitest/backend/application/services/flow_execution.py` to fetch official metadata if global variables are requested
- [x] T010 [US2] Update `VariableResolver` or logic in `LangGraphAdapter` to prioritize global variables in initial state

## Phase 5: [US3] Persistence & Polish (P2)
- [x] T011 [US3] Verify flow JSON persistence for `selected_globals` in `Flow` entity
- [x] T012 [US3] Add a visual indicator (badge or text) to the Start node on the canvas when variables are selected
- [x] T013 [FIX] Update `GraphCompiler` to preserve `selected_globals` during compilation
- [x] T014 [FIX] Unify local and official input via `initial_metadata` in `main.py`


## Dependencies
- US1 depends on Foundational phase.
- US2 depends on US1.
- US3 depends on US1.

## Parallel Execution
- T003 and T005 can be done in parallel.
- T006 and T008 can be done in parallel once Foundational is done.
