# Tasks: Official Data Performance & Filtering

**Feature**: Official Data Performance & Filtering
**Plan**: [specs/020-official-data-perf-filtering/plan.md](plan.md)

## Implementation Strategy

We will update the backend first to support server-side search for firms. Then, we will move to the frontend to implement debounced searching in the firm list and status-based filtering in the interaction picker.

1.  **Phase 1: Backend Optimization (US1)**: Update domain port and PostgreSQL adapter for firm search.
2.  **Phase 2: Frontend Service (US1)**: Update API client to pass the search parameter.
3.  **Phase 3: Firm List UX (US1)**: Implement debounced search and optimized rendering.
4.  **Phase 4: Interaction Picker UX (US2)**: Implement status filtering logic and UI.
5.  **Phase 5: Polish**: Verification and testing.

---

## Phase 1: Backend Optimization (US1)

**Story Goal**: The backend filters accounting firms by name at the database level.
**Independent Test**: API call `GET /official/firms?search=contab` returns only matching firms.

- [x] T001 [US1] Update `IOfficialDbPort` in `aitest/backend/domain/ports/official_db_port.py` to accept an optional `search` parameter in `list_firms`.
- [x] T002 [US1] Update `PostgresAdapter` in `aitest/backend/infrastructure/adapters/postgres_adapter.py` to implement `ILIKE` filtering on firm names.
- [x] T003 [US1] Update FastAPI route in `aitest/backend/main.py` to accept the `search` query parameter.

---

## Phase 2: Frontend Service Sync (US1)

**Story Goal**: The frontend API client can send the search term to the backend.

- [x] T004 [P] [US1] Update `officialDataApi.ts` in `aitest/frontend/src/services/officialDataApi.ts` to accept an optional `search` string for `listFirms`.

---

## Phase 3: Firm List UX (US1)

**Story Goal**: Responsive search with debouncing and loading feedback.
**Independent Test**: Typing in the search box triggers an API call after a short delay; results update correctly.

- [x] T005 [US1] Implement a 300ms debounce for the search input in `aitest/frontend/src/components/OfficialData/FirmList.tsx`.
- [x] T006 [US1] Trigger `officialDataApi.listFirms(search)` when the debounced search term changes.
- [x] T007 [US1] Ensure the loading indicator is displayed during backend search requests.

---

## Phase 4: Interaction Picker UX (US2)

**Story Goal**: Filter interactions by Pendente/Avaliado and ensure selection consistency.
**Independent Test**: Changing the filter updates the visible rows; "Select All" only affects visible rows.

- [x] T008 [US2] Add a `statusFilter` state (all/pending/evaluated) to `aitest/frontend/src/components/OfficialData/AtendimentoPicker.tsx`.
- [x] T009 [US2] Add a `FormControl` with a `Select` component for the status filter in the toolbar.
- [x] T010 [US2] Implement a `useMemo` hook to compute `filteredInteractions` based on the `has_evaluation` property.
- [x] T011 [US2] Update the table mapping to use `filteredInteractions` instead of the raw interactions list.
- [x] T012 [US2] Update `handleSelectAll` logic to only target IDs present in the `filteredInteractions` list.

---

## Phase 5: Polish & Verification

- [x] T013 [P] Verify backend consistency via `uv run pytest`.
- [x] T014 [P] Run frontend build (`npm run build`) to check type safety.
- [x] T015 Verify visual alignment and responsiveness of the new filter controls.

---

## Parallel Execution Opportunities

- T004 can be done alongside backend tasks.
- Phase 3 and Phase 4 can be worked on in parallel by different developers (if applicable).

## Dependencies

1. Phase 1 must be completed before Phase 3 can be fully functional.
2. T012 depends on T010.
