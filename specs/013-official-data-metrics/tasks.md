# Tasks: Official Data Metrics and Scores

**Feature**: Official Data Metrics and Scores
**Plan**: [specs/013-official-data-metrics/plan.md](plan.md)

## Implementation Strategy

We will approach this feature from the bottom-up, starting with the backend schema and adapters, then moving to the frontend service, and finally updating the UI components to display the metrics.

1.  **Phase 1: Setup**: Basic verification.
2.  **Phase 2: Backend Data (US2)**: Update SQLAlchemy models and Pydantic schemas, and fetch scores in `PostgresAdapter`.
3.  **Phase 3: Frontend Service (US2)**: Update TypeScript interfaces.
4.  **Phase 4: Global Metrics UI (US1)**: Add Big Numbers to `FirmList`.
5.  **Phase 5: Detailed Scores UI (US2)**: Add columns for scores to `AtendimentoPicker`.
6.  **Phase 6: Polish**: Verify and test.

---

## Phase 1: Setup

- [x] T001 Verify backend dependencies (`psycopg2-binary`, `sqlalchemy`) in `aitest/backend/pyproject.toml`.

---

## Phase 2: User Story 2 - Backend Data (P1)

**Story Goal**: The backend successfully extracts the score columns from the official PostgreSQL database.
**Independent Test**: The endpoint `GET /official/firms/{id}/interactions` returns the scores.

- [x] T002 [US2] Update `OfficialAtendimento` in `aitest/backend/infrastructure/database/postgres_models.py` to map the `nota_*` columns.
- [x] T003 [US2] Update `OfficialInteraction` DTO in `aitest/backend/models/official_schemas.py` to include `nota_*` fields.
- [x] T004 [US2] Update `list_interactions` query in `aitest/backend/infrastructure/adapters/postgres_adapter.py` to fetch and return the `nota_*` fields.

---

## Phase 3: User Story 2 - Frontend Service (P1)

**Story Goal**: The frontend API client correctly types the new data.
**Independent Test**: No TypeScript errors when accessing the `nota_*` properties from the API response.

- [x] T005 [P] [US2] Update `OfficialInteraction` interface in `aitest/frontend/src/services/officialDataApi.ts` to include `nota_*` properties.

---

## Phase 4: User Story 1 - Global Metrics UI (P1)

**Story Goal**: Display Big Numbers (total firms, total evaluations) at the top of the firm list.
**Independent Test**: The UI shows visually distinct cards above the table with the correct sums.

- [x] T006 [US1] Add `Stack` or `Grid` with `Paper` elements for "Total Contabilidades" and "Total Avaliações" at the top of `aitest/frontend/src/components/OfficialData/FirmList.tsx`.
- [x] T007 [US1] Calculate the sums dynamically from the `firms` state array in `aitest/frontend/src/components/OfficialData/FirmList.tsx`.

---

## Phase 5: User Story 2 - Detailed Scores UI (P1)

**Story Goal**: Display interaction scores in the Atendimento Picker table.
**Independent Test**: The table shows new columns (Média, Comunicação, Profissionalismo, Resolução) and correctly displays the values or a fallback.

- [x] T008 [US2] Add columns for the scores to the table header in `aitest/frontend/src/components/OfficialData/AtendimentoPicker.tsx`.
- [x] T009 [US2] Update the table body in `aitest/frontend/src/components/OfficialData/AtendimentoPicker.tsx` to render the scores, handling missing values gracefully.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T010 [P] Run backend tests (if any exist for this layer) via `uv run pytest`.
- [x] T011 [P] Run frontend build (`npm run build`) to ensure type safety.

---

## Parallel Execution Opportunities

- T005 can be started simultaneously with T002.
- T006 and T007 (FirmList Big Numbers) can be built independently of the AtendimentoPicker changes.

## Dependencies

1. Phase 2 MUST be completed before Phase 5.
2. T009 depends on T005 being completed.
