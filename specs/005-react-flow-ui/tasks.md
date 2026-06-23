# Tasks: React Flow UI Refactor

**Input**: Design documents from `/specs/005-react-flow-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Rename `aitest/src` to `aitest/backend` and update imports
- [x] T002 Initialize React frontend with Vite in `aitest/frontend/`
- [x] T003 [P] Add FastAPI and standard Uvicorn dependencies to `aitest/backend/pyproject.toml`
- [x] T004 [P] Install `reactflow`, `axios`, `tailwindcss`, and `lucide-react` in `aitest/frontend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T005 Create base FastAPI app in `aitest/backend/main.py` with CORS enabled for frontend
- [x] T006 Implement `flows`, `nodes`, `trackings`, and `trace_logs` tables in `aitest/backend/infrastructure/database/connection.py`
- [x] T007 Create Pydantic schemas for Flow and Node in `aitest/backend/models/schemas.py`
- [x] T008 [P] Implement API endpoints for CRUD operations on Flows and Nodes in `aitest/backend/main.py`


---

## Phase 3: User Story 1 - Visual Flow Construction (Priority: P1) 🎯 MVP

**Goal**: Visually build a sequence of LLM interactions (nodes).

**Independent Test**: Create a flow with multiple nodes, change their sequence numbers, and verify the visual layout updates.

### Implementation for User Story 1

- [x] T009 [P] [US1] Implement Node and Edge components using React Flow in `aitest/frontend/src/components/FlowBuilder/`
- [x] T010 [US1] Create Sidebar for node configuration (Prompt, Variables, JSON Schema) in `aitest/frontend/src/components/Sidebar/`
- [x] T011 [US1] Implement variable extraction logic from `{{}}` in `aitest/frontend/src/utils/variableExtractor.ts`
- [x] T012 [US1] Integrate frontend with backend API for saving and loading Flows in `aitest/frontend/src/services/flowService.ts`

---

## Phase 4: User Story 2 - Execution and Tracking (Priority: P1) 🎯 MVP

**Goal**: Run a batch process and track progress step-by-step with real-time status.

**Independent Test**: Start an execution from a folder and verify that Tracking IDs are generated and statuses update in the UI.

### Implementation for User Story 2

- [x] T013 [US2] Implement batch execution logic in `aitest/backend/main.py` that iterates through files and executes nodes
- [x] T014 [US2] Create Batch Runner UI in `aitest/frontend/src/components/BatchRunner/` with progress tracking
- [x] T015 [US2] Implement filename-to-Atendimento ID extraction logic in `aitest/backend/infrastructure/utils/scanner.py`
- [x] T016 [US2] Add real-time status update endpoint (using WebSockets or polling) in `aitest/backend/main.py`

---

## Phase 5: User Story 3 - LLM-Assisted Configuration (Priority: P2)

**Goal**: Assist in prompt and node configuration using an LLM.

**Independent Test**: Use the "Assist" feature in the node sidebar and verify it suggests a prompt based on the previous node.

### Implementation for User Story 3

- [x] T017 [US3] Create "System Architect" prompt template in `aitest/backend/data/prompts/System Architect.md`
- [x] T018 [US3] Implement backend endpoint for node assistance in `aitest/backend/main.py`
- [x] T019 [US3] Add "Auxiliar com IA" button and modal in the node sidebar in `aitest/frontend/src/components/Sidebar/`

---

## Phase 6: User Story 4 - History and Comparison (Priority: P2)

**Goal**: View history of previous executions and compare results.

**Independent Test**: Open the History tab, select two tracking records, and verify the comparison view renders details.

### Implementation for User Story 4

- [x] T020 [US4] Create History list view in `aitest/frontend/src/components/History/`
- [x] T021 [US4] Implement comparison view to show side-by-side node traces in `aitest/frontend/src/components/History/Comparison.tsx`
- [x] T022 [US4] Add trace log retrieval API in `aitest/backend/main.py`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and final validation

- [x] T023 [P] Add Tailwind styling for a polished "Vibe Coding" aesthetic in `aitest/frontend/`
- [x] T024 Clean up existing Streamlit code and move shared logic to `aitest/backend/src/`
- [x] T025 Update `aitest/README.md` with instructions for running both Backend and Frontend

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 & 2**: MUST complete first (blocking foundation).
- **Phase 3 (US1)**: Prerequisite for running executions (need a flow to execute).
- **Phase 4 (US2)**: Depends on US1 completion for tracking visual progress.
- **Phase 5 & 6**: Can be implemented in parallel after MVP (US1 & US2).

### Parallel Opportunities

- T003 and T004 (dependency installation)
- T007 and T008 (API/Schema setup)
- T011 can start while UI components are being built
- T017 can be done anytime before T018

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Foundation and API setup.
2. Build the Visual Flow builder (US1).
3. Implement Batch Execution with basic tracking (US2).
4. **Checkpoint**: System can define and run a flow with real-time status.

### Incremental Delivery

1. Setup + Foundation → Web-ready backbone.
2. Visual Flow Builder → Interactive logic definition.
3. Batch Runner + Tracking → Operational automation.
4. LLM Assistant + History → Enhanced usability and comparison.
