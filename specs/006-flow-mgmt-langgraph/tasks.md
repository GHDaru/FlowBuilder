# Tasks: Flow Management and LangGraph Integration

**Input**: Design documents from `/specs/006-flow-mgmt-langgraph/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and core dependencies

- [x] T001 Add `langgraph` and `langchain` to backend dependencies in `aitest/backend/pyproject.toml`
- [x] T002 Update `uv` environment: `cd aitest/backend; uv sync`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update database schema and base domain model

- [x] T003 Update `Flow` model to include `json_definition` (TEXT/JSON) in `aitest/backend/infrastructure/database/connection.py`
- [x] T004 Create `Flow` domain model aggregate root in `aitest/backend/domain/models/flow.py`
- [x] T005 [P] Create `IFlowRepository` port in `aitest/backend/domain/ports/flow_repository.py`
- [x] T006 [P] Implement `SqliteFlowRepository` adapter in `aitest/backend/infrastructure/adapters/sqlite_flow_repository.py`

---

## Phase 3: User Story 1 - Flow Lifecycle Management (Priority: P1)

**Goal**: Support New, Copy, Save As, and Load operations for flows.

**Independent Test**: Load the app, create a flow, click "Save As", give a new name, and verify both flows appear in the load list.

### Implementation for User Story 1

- [x] T007 [US1] Create `FlowLifecycleUseCase` in `aitest/backend/application/services/flow_lifecycle.py` (Save, Copy, Load logic)
- [x] T008 [US1] Implement CRUD endpoints for Flows in `aitest/backend/main.py`
- [x] T009 [US1] Create `FlowActions` component with New/Save/SaveAs buttons in `aitest/frontend/src/components/Toolbar/FlowActions.tsx`
- [x] T010 [US1] Create `LoadFlowDialog` modal using MUI in `aitest/frontend/src/components/Toolbar/LoadFlowDialog.tsx`
- [x] T011 [US1] Integrate lifecycle endpoints in `aitest/frontend/src/services/flowService.ts`

---

## Phase 4: User Story 2 - Visual Left-to-Right Connections (Priority: P2)

**Goal**: Standardize visual flow with left (target) and right (source) handles.

**Independent Test**: Drag two LLM nodes and verify they can only be connected from the right side of node A to the left side of node B.

### Implementation for User Story 2

- [x] T012 [P] [US2] Create `CustomLLMNode.tsx` with LR Handles in `aitest/frontend/src/components/FlowBuilder/CustomLLMNode.tsx`
- [x] T013 [P] [US2] Create `StartNode.tsx` (entry point component) in `aitest/frontend/src/components/FlowBuilder/StartNode.tsx`
- [x] T014 [US2] Register custom node types in `aitest/frontend/src/components/FlowBuilder/FlowBuilder.tsx`
- [x] T015 [US2] Update CSS for horizontal flow aesthetic in `aitest/frontend/src/index.css`

---

## Phase 5: User Story 3 - LangGraph Execution Integration (Priority: P1) 🎯 MVP

**Goal**: Compile visual JSON into a Runnable LangGraph and execute it.

**Independent Test**: Connect Start -> LLM1 -> LLM2, run execution, and verify the backend logs show LangGraph executing nodes in order.

### Implementation for User Story 3

- [x] T016 [US3] Create `GraphCompiler` domain service in `aitest/backend/domain/services/graph_compiler.py` (Resolve nodes/edges sequence)
- [x] T017 [US3] Implement `LangGraphAdapter` in `aitest/backend/infrastructure/adapters/langgraph_adapter.py` (Map Flow -> StateGraph)
- [x] T018 [US3] Create `FlowExecutionUseCase` in `aitest/backend/application/services/flow_execution.py`
- [x] T019 [US3] Update execution endpoint in `aitest/backend/main.py` to use LangGraph adapter
- [x] T020 [US3] Update TraceLog logic to capture LangGraph node transitions in `aitest/backend/infrastructure/database/connection.py`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and instructions.

- [x] T021 [P] Remove deprecated `nodes` table and logic from backend if applicable.
- [x] T022 Update `aitest/backend/README.md` with LangGraph execution details.
- [x] T023 Final validation using `specs/006-flow-mgmt-langgraph/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 & 2**: Mandatory prerequisites.
- **Phase 3 (Lifecycle)**: Prerequisite for testing US3 (need to save/load graphs to run them).
- **Phase 4 (Visuals)**: Can run in parallel with US1.
- **Phase 5 (LangGraph)**: The core logical implementation.

### Parallel Opportunities
- US1 (UI/Lifecycle) and US2 (Visual Nodes) can be developed by separate agents.
- T005 and T006 (Repo Port/Adapter).

---

## Implementation Strategy

### MVP First (Lifecycle + LangGraph Integration)
1. Complete DB foundation.
2. Implement basic Save/Load (US1).
3. Implement the LangGraph Adapter (US3).
4. **Checkpoint**: A visual graph can be saved, loaded, and executed as a LangGraph.

### Incremental Delivery
1. Foundation -> Lifecycle -> Interactive Lab.
2. Visual LR Handles -> Enhanced Builder UX.
3. LangGraph Engine -> State-managed execution.
