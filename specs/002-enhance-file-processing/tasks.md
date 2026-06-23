# Tasks: Enhance File Processing and PDF Support

**Input**: Design documents from `/specs/002-enhance-file-processing/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests for file listing and PDF extraction are included to ensure reliability.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Update `aitest/requirements.txt` to include `pypdf`
- [x] T002 Install new dependencies using `uv pip install -r aitest/requirements.txt`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Implement `aitest/src/services/file_service.py` with `FileService` class for file listing
- [x] T004 [P] Update `aitest/src/utils/scanner.py` to use `pathlib` for robust path resolution
- [x] T005 Create base unit tests for file scanning in `aitest/tests/unit/test_file_service.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Transparent File Selection (Priority: P1) 🎯 MVP

**Goal**: Show exactly which files are available in the folder before starting the processing.

**Independent Test**: Verify if the sidebar table in `aitest/app.py` correctly lists files from a given directory after clicking "Refresh".

### Implementation for User Story 1

- [x] T006 [US1] Add a "File Explorer" section to the sidebar in `aitest/app.py`
- [x] T007 [US1] Implement a "Refresh" button in `aitest/app.py` that triggers folder re-scanning
- [x] T008 [US1] Display detected files in a `st.dataframe` or `st.table` in the `aitest/app.py` sidebar
- [x] T009 [US1] Add a "Pre-flight Log" in the main tab of `aitest/app.py` showing a summary of files to be processed
- [x] T010 [US1] Fix path resolution logic in `aitest/app.py` to use absolute paths from `pathlib`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - PDF Processing Support (Priority: P2)

**Goal**: Support reading and extracting text from PDF files (.pdf).

**Independent Test**: Provide a PDF file in the input folder and verify if its content is correctly extracted and shown in the "Audit Log" tab.

### Implementation for User Story 2

- [x] T011 [US2] Implement PDF text extraction method in `aitest/src/services/file_service.py` using `pypdf`
- [x] T012 [P] [US2] Update `aitest/src/utils/scanner.py` to include `.pdf` in the supported extensions list
- [x] T013 [US2] Update `aitest/src/services/evaluation_flow.py` to handle PDF content extraction via `FileService`
- [x] T014 [US2] Update `aitest/app.py` to support PDF file reading in the main processing loop
- [x] T015 [P] [US2] Add unit tests for PDF text extraction in `aitest/tests/unit/test_file_service.py`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 [P] Update `aitest/README.md` to document new PDF support and File Explorer features
- [x] T017 Final manual validation of the full flow using `specs/002-enhance-file-processing/quickstart.md`
- [x] T018 [P] Clean up any temporary debug logs or comments in `aitest/app.py`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1's file listing

---

## Parallel Example: User Story 2

```bash
# Implement PDF extension support and tests in parallel:
Task: "Update aitest/src/utils/scanner.py to include .pdf in the supported extensions list"
Task: "Add unit tests for PDF text extraction in aitest/tests/unit/test_file_service.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Foundation ready
2. Add User Story 1 (MVP!)
3. Add User Story 2 (PDF Support)
4. Polish and Documentation
