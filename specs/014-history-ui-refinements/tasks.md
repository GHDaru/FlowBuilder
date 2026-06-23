# Tasks: History UI Refinements

**Feature**: History UI Refinements
**Plan**: [specs/014-history-ui-refinements/plan.md](plan.md)

## Implementation Strategy

We will build this in two main phases: first updating the backend to capture and serve the `node_label`, and then updating the frontend `History.tsx` component to utilize this new data and render the collapsible UI with correct overflow handling.

1.  **Phase 1: Setup**: Basic verification.
2.  **Phase 2: Backend Data (US1)**: Update DB schema, models, and execution adapter to capture `node_label`.
3.  **Phase 3: Frontend Refactoring (US1, US2)**: Replace `Card` with `Accordion` in the History view and apply CSS fixes for overflow.
4.  **Phase 4: Polish**: Verify and test.

---

## Phase 1: Setup

- [x] T001 Verify MUI accordion components are available in `aitest/frontend/package.json` (they are part of `@mui/material`).

---

## Phase 2: User Story 1 - Backend Data Capture (P1)

**Story Goal**: Ensure the backend stores the human-readable node name when executing a flow.
**Independent Test**: Running a flow inserts a `TraceLog` with a non-null `node_label` in the database.

- [x] T002 [US1] Add `node_label` column to `TraceLog` model in `aitest/backend/infrastructure/database/connection.py`.
- [x] T003 [US1] Add `node_label` field to `TraceLog` schema in `aitest/backend/models/schemas.py`.
- [x] T004 [US1] Update `log_callback` in `aitest/backend/application/services/flow_execution.py` to accept and persist `node_label`.
- [x] T005 [US1] Update `_make_llm_fn` and `_make_router_fn` in `aitest/backend/infrastructure/adapters/langgraph_adapter.py` to pass the node title/label to `log_callback`.

---

## Phase 3: User Story 1 & 2 - Frontend History Component (P1)

**Story Goal**: Display steps as accordions with node names, and prevent text from overflowing horizontally.
**Independent Test**: The History UI renders accordions; long JSON responses wrap correctly within the panel.

- [x] T006 [P] [US1] Refactor `aitest/frontend/src/components/History/History.tsx` to replace `Card` mapping with `Accordion`, `AccordionSummary` (with `ExpandMoreIcon`), and `AccordionDetails`.
- [x] T007 [US1] Update the `AccordionSummary` title logic to display `node_label` (fallback to `node_id`) in `History.tsx`.
- [x] T008 [US1] Implement state logic in `History.tsx` to ensure only the first step is expanded by default.
- [x] T009 [US2] Add `sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowX: 'auto' }}` to the prompt and JSON output containers in `History.tsx`.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [x] T010 [P] Run backend script `uv run python scripts/reset_db.py` to apply the new schema.
- [x] T011 [P] Run `npm run build` in the frontend to verify TypeScript types.

---

## Parallel Execution Opportunities

- T006 (UI refactor structure) can be started before T005 is completed, using mock data or existing `node_id`.

## Dependencies

1. T007 depends on T002-T005 (backend data) to fully work.
2. T010 MUST be run before testing the end-to-end flow.
