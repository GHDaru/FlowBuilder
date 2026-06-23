# Tasks: Prompt Management and Flow Visualization

**Input**: Design documents from `/specs/004-prompt-mgmt-viz/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory `aitest/data/prompts/`
- [x] T002 [P] Create migration script placeholder `aitest/scripts/sync_prompts.py`
- [x] T003 [P] Add `graphviz` to dependencies in `aitest/pyproject.toml` (if needed for type hinting, though `st.graphviz_chart` is native)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T004 Create `IPromptRepository` port in `aitest/src/domain/ports/prompt_repository.py`
- [x] T005 Create `FilePromptRepository` adapter in `aitest/src/infrastructure/adapters/file_prompt_repository.py`
- [x] T006 Update `Config` class in `aitest/src/infrastructure/utils/config.py` to include `LOCAL_PROMPTS_PATH` pointing to `aitest/data/prompts/`

---

## Phase 3: User Story 3 - Prompt Local Migration (Priority: P1)

**Goal**: Move prompts from global resources to the local `aitest` module for isolation.

**Independent Test**: Verify that prompts are successfully copied to `aitest/data/prompts/` and the evaluation flow loads them from there.

### Implementation for User Story 3

- [x] T007 [US3] Implement file migration logic in `aitest/scripts/sync_prompts.py` (copying from core `src/main/resources/prompts`)
- [x] T008 [US3] Implement `list_prompts` and `get_prompt` in `aitest/src/infrastructure/adapters/file_prompt_repository.py`
- [x] T009 [US3] Refactor `PromptLoader` in `aitest/src/infrastructure/utils/prompts.py` to use `IPromptRepository`
- [x] T010 [US3] Update `app.py` to call the migration script if the local prompt directory is empty.

**Checkpoint**: Prompts are isolated within `aitest` and correctly loaded by the system.

---

## Phase 4: User Story 1 - Prompt Management (Priority: P1) 🎯 MVP

**Goal**: Allow editing AI prompts directly from the Streamlit UI.

**Independent Test**: Edit a prompt in the "Configuração" tab, save it, and verify the file content changes on disk.

### Implementation for User Story 1

- [x] T011 [P] [US1] Create `PromptManagementUseCase` in `aitest/src/application/prompt/service.py`
- [x] T012 [US1] Implement `save_prompt` method in `aitest/src/infrastructure/adapters/file_prompt_repository.py`
- [x] T013 [US1] Implement "Gestão de Prompts" UI section in `aitest/app.py` (Dropdown + Text Area + Save Button)
- [x] T014 [US1] Add success/error notifications for prompt saving in `aitest/app.py`

**Checkpoint**: User Story 1 is functional - prompts can be edited and saved via UI.

---

## Phase 5: User Story 2 - Flow Visualization (Priority: P2)

**Goal**: Show a visual sequence of the evaluation flow in the audit view.

**Independent Test**: Open the "Auditoria Detalhada" tab and verify the rendering of a directed graph for a selected atendimento.

### Implementation for User Story 2

- [x] T015 [P] [US2] Create `FlowGraphProvider` utility in `aitest/src/infrastructure/adapters/graph_provider.py`
- [x] T016 [US2] Implement DOT graph generation logic from `AuditLog` records in `aitest/src/infrastructure/adapters/graph_provider.py`
- [x] T017 [US2] Integrate `st.graphviz_chart` in the "Auditoria Detalhada" tab of `aitest/app.py`
- [x] T018 [US2] Add visual status indicators (Success/Error colors) to graph nodes in `graph_provider.py`

**Checkpoint**: Evaluation flows are visually represented in the audit dashboard.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and final validation.

- [x] T019 [P] Update `aitest/README.md` with instructions for prompt management and Graphviz prerequisites.
- [x] T020 Code cleanup and ensure all imports in new files follow the `src.` absolute pattern.
- [x] T021 Run `quickstart.md` validation to ensure a fresh setup works as expected.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup & Foundational**: MUST complete first.
- **US3 (Migration)**: Prerequisite for US1 and US2 (ensures data is in the right place).
- **US1 (Management)** and **US2 (Visualization)**: Can be implemented in parallel after US3.

### Parallel Opportunities

- T002 and T003 can run in parallel.
- T011 can start while T012 is in progress.
- T015 can start while US1 is being finalized.

---

## Implementation Strategy

### MVP First (User Stories 1 & 3)

1. Complete Setup and Foundation.
2. Complete US3 (Migration) - critical for the module to work independently.
3. Complete US1 (Management) - core value for rapid iteration.
4. **Checkpoint**: Local prompt management is fully operational.

### Incremental Delivery

1. Foundation + Migration → Isolated local lab.
2. Prompt Management → Enhanced developer iteration.
3. Flow Visualization → Enhanced auditing and transparency.
