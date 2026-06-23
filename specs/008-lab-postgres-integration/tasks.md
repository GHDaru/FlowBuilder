# Tasks: Lab Postgres Integration

**Feature**: Lab Postgres Integration
**Plan**: [specs/008-lab-postgres-integration/plan.md](plan.md)

## Implementation Strategy

We will build this incrementally, starting from the foundational data layer (connecting to Postgres) and moving up to the frontend UI.

1.  **Phase 1: Setup**: Ensure environment is ready.
2.  **Phase 2: Foundational**: Implement the read-only Postgres connection and SQLAlchemy models for the official database.
3.  **Phase 3 (US1)**: Implement API and UI to browse accounting firms.
4.  **Phase 4 (US2)**: Implement API to list interactions, the trigger endpoint, and the UI to select and process them.
5.  **Phase 5 (US3)**: Ensure the UI routes to the history/trace view after processing (the backend part is largely handled by existing trace logs, but we need to ensure the flow connects).
6.  **Phase 6: Polish**: Error handling, loading states, and tests.

---

## Phase 1: Setup

- [x] T001 Update `.env.template` to include `OFFICIAL_DATABASE_URL` placeholder.
- [x] T002 Ensure `psycopg2-binary` and `SQLAlchemy` are listed in `aitest/backend/pyproject.toml` (run `uv sync` if needed).

---

## Phase 2: Foundational (Infrastructure)

- [x] T003 Create `aitest/backend/infrastructure/database/postgres_connection.py` for the secondary `official_engine` and `SessionLocalOfficial` session maker.
- [x] T004 Define SQLAlchemy models for `Contabilidade`, `Atendimento`, and `AtendimentoChat` in `aitest/backend/infrastructure/database/postgres_models.py`.
- [x] T005 Define Pydantic schemas for the official data endpoints in `aitest/backend/models/official_schemas.py`.

---

## Phase 3: User Story 1 - Browse Accounting Firms (P1)

**Story Goal**: List all accounting firms from the official database with their evaluation counts.
**Independent Test**: `GET /official/firms` returns a list of firms and the frontend renders them.

- [x] T006 [P] [US1] Implement `OfficialDbPort` interface in `aitest/backend/domain/ports/official_db_port.py`.
- [x] T007 [P] [US1] Implementar `PostgresAdapter` (infraestrutura) herdando `OfficialDbPort` (domínio) para buscar contabilidades, garantindo query eficiente para contagem de avaliações em `aitest/backend/infrastructure/adapters/postgres_adapter.py`.
- [x] T008 [US1] Implement `OfficialDataService` with `get_firms` logic in `aitest/backend/application/services/official_data_service.py`.
- [x] T009 [US1] Add `GET /official/firms` endpoint in `aitest/backend/main.py`.
- [x] T010 [P] [US1] Create frontend API client `aitest/frontend/src/services/officialDataApi.ts` for the firms endpoint.
- [x] T011 [US1] Create `FirmList.tsx` component to display the list of firms in `aitest/frontend/src/components/OfficialData/FirmList.tsx`.
- [x] T012 [US1] Add "Official Data" navigation tab/route in the main frontend layout.

---

## Phase 4: User Story 2 - Select and Process Interactions (P1)

**Story Goal**: Select specific service interactions and run an AI Visual Lab flow on them.
**Independent Test**: Can select an interaction, choose a flow, and trigger the `/official/process` endpoint successfully.

- [x] T013 [P] [US2] Update `PostgresAdapter` to implement `get_interactions_for_firm` logic in `aitest/backend/infrastructure/adapters/postgres_adapter.py`.
- [x] T014 [US2] Update `OfficialDataService` to include `get_interactions` logic in `aitest/backend/application/services/official_data_service.py`.
- [x] T015 [US2] Add `GET /official/firms/{id}/interactions` endpoint in `aitest/backend/main.py`.
- [x] T016 [US2] Implement `trigger_processing` in `OfficialDataService` (fetches `text_content` and calls `FlowExecutionUseCase` via background tasks).
- [x] T017 [US2] Add `POST /official/process` endpoint in `aitest/backend/main.py`.
- [x] T018 [P] [US2] Update `officialDataApi.ts` in frontend with `getInteractions` and `processInteractions` methods.
- [x] T019 [US2] Create `AtendimentoPicker.tsx` component to list interactions for a selected firm in `aitest/frontend/src/components/OfficialData/AtendimentoPicker.tsx`.
- [x] T020 [US2] Integrate flow selection dropdown and "Process" button in `AtendimentoPicker.tsx`.

---

## Phase 5: User Story 3 - Execution Trace Observation (P2)

**Story Goal**: See the progress and results of batch processing in the Lab.
**Independent Test**: After clicking "Process" in the UI, the user is navigated to the History tab or shown a success message with links to traces.

- [x] T021 [US3] Update frontend to redirect to the History tab or show tracking IDs upon successful trigger of `/official/process`.
- [x] T022 [US3] Ensure `FlowExecutionUseCase` correctly handles the `OFFICIAL_DB:<firm_id>` marker in the `folder_path` field for Tracking/Execution records.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T023 Implement error handling for Postgres connection failures in `PostgresAdapter`.
- [x] T024 Add loading states (spinners) to `FirmList.tsx` and `AtendimentoPicker.tsx`.
- [x] T025 [P] Run backend tests (if any new ones are written) with `uv run pytest`.
- [x] T026 Verificar critérios de performance SC-001 (listagem < 2s) e SC-002 (trigger < 5s).

---

## Parallel Execution Opportunities

- T006, T007, T010 can be done in parallel once models are defined.
- T013 and T018 can be implemented simultaneously.
- T025 can be run anytime after core implementation.

## Dependencies

1. Phase 2 MUST be completed before Phase 3 or Phase 4 backend tasks.
2. Phase 3 MUST be completed to allow selecting a firm in Phase 4 UI.
3. Phase 4 MUST be completed to trigger the actions required for Phase 5 observation.
