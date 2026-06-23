# Tasks: Official Data UX Enhancements

**Feature**: Official Data UX Enhancements
**Plan**: [specs/019-official-data-ux-enhancements/plan.md](plan.md)

## Implementation Strategy

We will update the backend first to support multi-firm queries, then move to the frontend to refactor the API services and components for selection, default state, and client-side sorting.

1.  **Phase 1: Backend Data (US1)**: Update domain port and PostgreSQL adapter for multi-firm support.
2.  **Phase 2: Frontend Service (US1)**: Sync API client with new multi-firm capability.
3.  **Phase 3: Firm List UI (US1)**: Implement multi-selection, default state, and sorting in `FirmList`.
4.  **Phase 4: Interaction Picker UI (US2)**: Implement multi-firm display, "Select All", and sorting in `AtendimentoPicker`.
5.  **Phase 5: Polish**: Verification and testing.

---

## Phase 1: Backend Data Support (US1)

**Story Goal**: The backend can fetch interactions from multiple firms in one query.
**Independent Test**: API call `GET /official/firms/id1,id2/interactions` (or similar) returns consolidated data.

- [x] T001 [US1] Update `IOfficialDbPort` in `aitest/backend/domain/ports/official_db_port.py` to accept a list of firm IDs in `list_interactions`.
- [x] T002 [US1] Update `PostgresAdapter` in `aitest/backend/infrastructure/adapters/postgres_adapter.py` to implement the `IN` operator for multiple firm IDs.
- [x] T003 [US1] Update FastAPI route in `aitest/backend/main.py` to accept comma-separated firm IDs or a list of IDs.

---

## Phase 2: Frontend Service Sync (US1)

**Story Goal**: The frontend API client can send multiple firm IDs to the backend.

- [x] T004 [P] [US1] Update `officialDataApi.ts` in `aitest/frontend/src/services/officialDataApi.ts` to accept an array of strings for `listInteractions`.

---

## Phase 3: Firm List UX (US1)

**Story Goal**: Multi-selection and sorting in the accounting firm list.
**Independent Test**: Firm list has checkboxes; clicking "Avaliados" sorts the rows.

- [x] T005 [US1] Add selection state and checkboxes to the table in `aitest/frontend/src/components/OfficialData/FirmList.tsx`.
- [x] T006 [US1] Implement default "select all" behavior in `useEffect` when firms are first loaded in `FirmList.tsx`.
- [x] T007 [US1] Implement a sorting toggle for the "Avaliados" column in `FirmList.tsx`.
- [x] T008 [US1] Add a "Ver Atendimentos" button that passes the array of selected firm IDs to the parent component.

---

## Phase 4: Interaction Picker UX (US2)

**Story Goal**: Consolidated view for multiple firms with global selection and score sorting.
**Independent Test**: Table shows interactions from all selected firms; "Select All" toggles all rows; clicking "Média" sorts by score.

- [x] T009 [US2] Update `AtendimentoPicker.tsx` to handle an array of firm objects/IDs and display them as a consolidated list.
- [x] T010 [US2] Implement a "Selecionar Todos" / "Desselecionar Todos" checkbox in the table header of `AtendimentoPicker.tsx`.
- [x] T011 [US2] Implement default "select all" behavior when interactions are loaded in `AtendimentoPicker.tsx`.
- [x] T012 [US2] Implement client-side sorting for "Média", "Comunicação", "Profissionalismo", and "Resolução" headers in `AtendimentoPicker.tsx`.

---

## Phase 5: Polish & Verification

- [x] T013 [P] Verify backend consistency via `uv run pytest`.
- [x] T014 [P] Run frontend build (`npm run build`) to check type safety.
- [x] T015 Perform end-to-end visual check of sorting arrows and selection counts.

---

## Parallel Execution Opportunities

- T004 can be done alongside T001-T003.
- Phase 3 and Phase 4 are mostly independent UI tasks once the API contract is updated.

## Dependencies

1. Phase 1 must be completed before the "Ver Atendimentos" button in Phase 3 can fully function with multiple firms.
2. T012 depends on the new score fields implemented in feature 013 (which are already in `OfficialInteraction`).
