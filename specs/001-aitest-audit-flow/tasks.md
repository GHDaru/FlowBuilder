# Tasks: Interface de Teste de Fluxos de Avaliacao IA

**Input**: Design documents from `/specs/001-aitest-audit-flow/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested. In this project, `pytest` is configured in `plan.md` for validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure in `aitest/`

- [x] T001 Create project structure in `aitest/` (src/models, src/services, src/database, src/utils, tests)
- [x] T002 [P] Initialize Python environment and create `aitest/requirements.txt` with dependencies (streamlit, pydantic, sqlalchemy, openai, etc.)
- [x] T003 [P] Configure `.env` loading from root in `aitest/src/utils/config.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for IA flow and Persistence

- [x] T004 Implement SQLite database connection and table creation (executions, atendimentos, audit_logs) in `aitest/src/database/connection.py`
- [x] T005 Implement Pydantic models for structured IA outputs (Metadata, DimensionScore, Tags) in `aitest/src/models/schemas.py`
- [x] T006 [P] Create prompt loader utility to read from `../src/main/resources/prompts/` in `aitest/src/utils/prompts.py`
- [x] T007 Implement base IA service with OpenAI/Gemini support in `aitest/src/services/ia_client.py`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Executar avaliacao em lote (Priority: P1) 🎯 MVP

**Goal**: Permitir selecionar uma pasta e processar todos os atendimentos através do fluxo de IA.

**Independent Test**: Informar uma pasta válida na UI, clicar em processar e ver os logs de progresso e a tabela de resultados sendo preenchida.

### Implementation for User Story 1

- [x] T008 [US1] Implement folder scanner utility to identify processable files in `aitest/src/utils/scanner.py`
- [x] T009 [US1] Implement full evaluation flow logic (Metadata -> Tags -> Scores -> Summary) in `aitest/src/services/evaluation_flow.py`
- [x] T010 [US1] Create main Streamlit app layout with Sidebar and "Execução Atual" tab in `aitest/app.py`
- [x] T011 [US1] Implement batch processing loop with real-time UI updates (progress bar, status) in `aitest/app.py`
- [x] T012 [US1] Implement persistence for each step of the flow (auto-save to SQLite) in `aitest/src/services/evaluation_flow.py`

**Checkpoint**: User Story 1 (MVP) functional: Batch processing from folder to SQLite and real-time UI.

---

## Phase 4: User Story 2 - Auditar saidas estruturadas (Priority: P2)

**Goal**: Inspecionar cada saída estruturada (JSON) produzida pela IA para auditoria.

**Independent Test**: Selecionar um atendimento na tabela e abrir a aba "Auditoria Detalhada" para ver os Expanders de cada etapa com Prompt e Resposta.

### Implementation for User Story 2

- [x] T013 [US2] Implement retrieval logic for audit logs by atendimento_id in `aitest/src/database/queries.py`
- [x] T014 [US2] Create "Auditoria Detalhada" tab with Expanders for each evaluation step in `aitest/app.py`
- [x] T015 [US2] Implement visual indicators for validation status (Green/Red icons) in the audit view in `aitest/app.py`
- [x] T016 [US2] Add raw JSON inspection and prompt preview in audit Expanders in `aitest/app.py`

**Checkpoint**: User Story 2 functional: Full traceability of IA steps from the UI.

---

## Phase 5: User Story 3 - Resultados consolidados e historico (Priority: P3)

**Goal**: Visualizar resultados de execuções passadas e aplicar filtros.

**Independent Test**: Alternar para a aba "Histórico", selecionar uma execução anterior e ver os dados recuperados do SQLite sem re-processar.

### Implementation for User Story 3

- [x] T017 [US3] Implement logic to list previous executions and their results in `aitest/src/database/queries.py`
- [x] T018 [US3] Create "Histórico de Execuções" tab with execution selector in `aitest/app.py`
- [x] T019 [US3] Implement filtering and sorting for the consolidated results table in `aitest/app.py`
- [x] T020 [US3] Ensure selecting a historical record updates the Audit tab view in `aitest/app.py`

**Checkpoint**: User Story 3 functional: Full history management and filtering.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [x] T021 [P] Implement "Clear Database" button in sidebar with confirmation dialog in `aitest/app.py`
- [x] T022 Handle edge cases (empty folders, invalid files, IA timeout) in `aitest/src/services/evaluation_flow.py`
- [x] T023 [P] Add unit tests for Pydantic validation and prompt loading in `aitest/tests/unit/`
- [x] T024 Run final validation of `quickstart.md` steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must complete first.
- **Foundational (Phase 2)**: Depends on Phase 1. Blocks all User Stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2. (MVP)
- **User Story 2 & 3**: Depend on Phase 3 (since they audit/review results created there).
- **Polish**: Final cleanup.

### Parallel Opportunities

- T002 and T003 (Setup)
- T006 and T007 (Foundational)
- T013 and T014 (US2 implementation can start together once data exists)
- T021 and T023 (Polish tasks)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational.
2. Implement US1 (Batch scanner + Flow + App Tab 1).
3. Verify that a folder can be processed and results stored.

### Incremental Delivery

1. Add US2 Audit tab to enable deep inspection of the MVP results.
2. Add US3 History tab to preserve and compare results over time.
3. Apply final Polish and edge case handling.
