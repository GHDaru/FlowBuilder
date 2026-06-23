# Tasks: Execution History Enhancements

**Feature**: Execution History Enhancements
**Plan**: [specs/018-history-enhancements/plan.md](plan.md)

## Implementation Strategy

We will approach this feature by first updating the data persistence layer (DB and Schemas), then implementing the timing and metadata capture in the backend execution logic, and finally building the rich UI components in the frontend.

1.  **Phase 1: Setup**: Schema updates.
2.  **Phase 2: Backend Logic (US1, US3)**: Timing capture and metadata caching.
3.  **Phase 3: Frontend UI (US1, US2, US3)**: Rich header, durations, and bulk copy.
4.  **Phase 4: Polish**: Verification and tests.

---

## Phase 1: Setup & Data Schema

**Story Goal**: Prepare the database to store timing and metadata.

- [x] T001 [US3] Add `finished_at` and `total_duration_ms` columns to `Tracking` model in `aitest/backend/infrastructure/database/connection.py`.
- [x] T002 [US1] Add `flow_name` and `metadata_json` columns to `Tracking` model in `aitest/backend/infrastructure/database/connection.py`.
- [x] T003 [US3] Add `duration_ms` column to `TraceLog` model in `aitest/backend/infrastructure/database/connection.py`.
- [x] T004 [P] Update Pydantic schemas in `aitest/backend/models/schemas.py` to match new DB fields.

---

## Phase 2: Backend Logic (US1, US3)

**Story Goal**: Measure execution times and capture business context.
**Independent Test**: Execution logs show duration values; Tracking table has finished_at.

- [x] T005 [US3] Update `log_callback` in `aitest/backend/application/services/flow_execution.py` to accept and persist `duration_ms`.
- [x] T006 [US3] Update `execute` method in `aitest/backend/application/services/flow_execution.py` to record `finished_at` and calculate `total_duration_ms`.
- [x] T007 [x] [US1] Update `execute` method in `aitest/backend/application/services/flow_execution.py` to retrieve `Flow` name and cache it in `Tracking`.
- [x] T008 [US3] Implement `time.perf_counter()` measurements in `_make_llm_fn` and `_make_router_fn` in `aitest/backend/infrastructure/adapters/langgraph_adapter.py`.
- [x] T009 [US1] Implement basic metadata extraction (Firm/Client/Attendant) logic in `FlowExecutionUseCase` to populate `Tracking.metadata_json`.

---

## Phase 3: Frontend UI Enhancements (US1, US2, US3)

**Story Goal**: Render the rich history view with bulk copy and timings.
**Independent Test**: History header shows Firm/Client; steps show "1.2s"; Copy button works.

- [x] T010 [P] [US1] Update `handleSelectTracking` in `aitest/frontend/src/components/History/History.tsx` to handle the new metadata fields.
- [x] T011 [US1] Implement the "Rich Header" section in `History.tsx` showing Firm, Client, Attendant, and Flow Name.
- [x] T012 [US3] Display `total_duration_ms` in the History header and `duration_ms` in each Accordion summary.
- [x] T013 [US2] Implement `handleCopyAll` in `History.tsx` to consolidate all step JSONs and copy to clipboard.
- [x] T014 [US2] Add the "Copiar Tudo (JSON)" button to the history detail header.

---

## Phase 4: Polish & Testing

- [x] T015 [P] Run backend script `uv run python scripts/reset_db.py` to apply schema changes.
- [x] T016 [P] Add unit tests for timing calculation in `aitest/backend/tests/unit/test_timing.py`.
- [x] T017 [P] Run frontend build to ensure type safety.

---

## Parallel Execution Opportunities

- T004 (Schemas) and T010 (Frontend structure) can be done in parallel.
- T016 (Tests) can be developed alongside Phase 2.

## Dependencies

1. Phase 1 MUST be completed before Phase 2.
2. T012 depends on T005-T008 (Backend timings) being functional.
3. T011 depends on T007 and T009 (Metadata caching).
