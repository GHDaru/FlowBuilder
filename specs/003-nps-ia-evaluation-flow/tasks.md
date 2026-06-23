# Tasks: NPS IA Evaluation Flow

**Input**: Design documents from `/specs/003-nps-ia-evaluation-flow/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Architecture**: DDD + Hexagonal (Mandatory in `aitest/`)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Hexagonal Infrastructure)

**Purpose**: Initialize the new architectural structure in `aitest/src/`

- [x] T001 Create domain directories: `aitest/src/domain/models/` and `aitest/src/domain/ports/`
- [x] T002 Create application directory: `aitest/src/application/evaluation/`
- [x] T003 Create infrastructure directories: `aitest/src/infrastructure/adapters/` and `aitest/src/infrastructure/database/`
- [x] T004 Define `ILLMProvider` port in `aitest/src/domain/ports/llm_provider.py`
- [x] T005 Define `IAtendimentoRepository` port in `aitest/src/domain/ports/repository.py`

---

## Phase 2: Foundational (Domain Models & Adapters)

**Purpose**: Core logic and basic infrastructure implementations

- [x] T006 [P] Implement Domain Value Objects (Metadata, Classification, Score, TokenUsage) in `aitest/src/domain/models/value_objects.py`
- [x] T007 [P] Implement `Atendimento` Aggregate Root in `aitest/src/domain/models/atendimento.py`
- [x] T008 [P] Implement `EvaluationRule` Aggregate in `aitest/src/domain/models/rule.py`
- [x] T009 Implement `OpenAIAdapter` in `aitest/src/infrastructure/adapters/openai_adapter.py` implementing `ILLMProvider`
- [x] T010 Implement `SQLiteRepository` in `aitest/src/infrastructure/adapters/sqlite_repository.py` implementing `IAtendimentoRepository`

---

## Phase 3: User Story 1 - Automated Metadata & Classification (Priority: P1)

**Goal**: Extract metadata and classify interactions using AI.

**Independent Test**: Run a test script that takes a raw text and returns a validated `Atendimento` aggregate with metadata and classification fields populated.

- [x] T011 [US1] Create `MetadataExtractionUseCase` in `aitest/src/application/evaluation/extract_metadata.py`
- [x] T012 [US1] Create `ClassificationUseCase` in `aitest/src/application/evaluation/classify_interaction.py`
- [x] T013 [US1] Implement orchestration in `EvaluationApplicationService` at `aitest/src/application/evaluation/service.py` for Steps 1 & 2
- [x] T014 [US1] Update `aitest/app.py` to trigger the new application service for the first two steps

---

## Phase 4: User Story 2 - Dynamic Evaluation Rules (Priority: P1)

**Goal**: Select scoring dimensions based on classification rules.

**Independent Test**: Define a rule "Folha -> [Dim01]" in the UI and verify if only Dim01 is scheduled for an interaction classified as "Folha".

- [x] T015 [US2] Implement `RuleEvaluator` domain service in `aitest/src/domain/services/rule_evaluator.py`
- [x] T016 [US2] Create `ManageRulesUseCase` in `aitest/src/application/evaluation/manage_rules.py`
- [x] T017 [US2] Add "⚙️ Configuração Avançada" tab to `aitest/app.py`
- [x] T018 [US2] Implement Rule Editor (CRUD) in the advanced configuration tab of `aitest/app.py`
- [x] T019 [US2] Integrate `RuleEvaluator` into the `EvaluationApplicationService` flow (Step 3)

---

## Phase 5: User Story 3 - Parallel Multi-Dimension Scoring (Priority: P2)

**Goal**: Evaluate interactions across multiple axes in parallel and consolidate results.

**Independent Test**: Process a file with 3 dimensions and verify that the total time is approximately the time of the longest single dimension call.

- [x] T020 [US3] Implement `DimensionScoringUseCase` in `aitest/src/application/evaluation/score_dimension.py`
- [x] T021 [US3] Implement parallel execution logic using `ThreadPoolExecutor` in `EvaluationApplicationService` (Step 4)
- [x] T022 [US3] Implement `ConsolidationUseCase` in `aitest/src/application/evaluation/consolidate_results.py` (Step 5)
- [x] T023 [US3] Update `Atendimento` domain logic to calculate final score in `aitest/src/domain/models/atendimento.py`

---

## Phase 6: User Story 4 - Execution Dashboard & Audit (Priority: P2)

**Goal**: Visualize detailed evaluation results and AI audit trail.

**Independent Test**: Click on a processed item in the dashboard and see the "Audit Trail" with individual steps and token usage.

- [x] T024 [US4] Update Dashboard in `aitest/app.py` to display `input_tokens` and `output_tokens` per item
- [x] T025 [US4] Enhance "Auditoria Detalhada" in `aitest/app.py` to show the Hexagonal flow steps
- [x] T026 [US4] Add visualization of the triggered rules for each atendimento in `aitest/app.py`

---

## Phase 7: Polish & Observability

**Purpose**: Final improvements and tracking

- [x] T027 [P] Implement `TokenTracker` adapter wrapper in `aitest/src/infrastructure/adapters/token_tracker.py` (Handled internally by adapters)
- [x] T028 [P] Add unit tests for `RuleEvaluator` in `aitest/tests/unit/test_rule_evaluator.py`
- [x] T029 Update `aitest/README.md` with the new Hexagonal Architecture documentation

---

## Dependencies & Execution Order

1. **Foundational (Phase 1 & 2)**: MUST be completed first.
2. **Metadata/Classification (US1)**: First functional increment.
3. **Rules (US2)**: Depends on US1 (needs classification result).
4. **Scoring (US3)**: Depends on US2 (needs selected dimensions).
5. **Dashboard (US4)**: Can be developed in parallel with US1-US3 but needs them for data.

## Implementation Strategy

### MVP First (Steps 1 & 2)
1. Setup structure (Phase 1)
2. Domain Models (Phase 2)
3. Metadata & Classification (Phase 3)
**Checkpoint**: Verify AI extraction and classification works.

### Incremental Growth
1. Add Rules Engine (Phase 4)
2. Add Parallel Scoring (Phase 5)
3. Enhance UI/Dashboard (Phase 6)
