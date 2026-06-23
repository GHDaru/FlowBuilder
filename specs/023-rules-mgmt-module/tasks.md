# Tasks: rules-mgmt-module

**Input**: Design documents from `/specs/023-rules-mgmt-module/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Implementation Strategy
We follow the DDD + Hexagonal architecture. We will implement the Rule domain model and repository first, then the application services for generation and backup. The UI will be built incrementally, starting with the admin table and then the AI refinement cycles.

## Phase 1: Setup
- [x] T001 [P] Create Rule domain model in `aitest/backend/domain/models/rule.py`
- [x] T002 [P] Create RuleRepository port in `aitest/backend/domain/ports/rule_repository.py`
- [x] T003 Update `aitest/backend/infrastructure/database/connection.py` with the new Rule SQLAlchemy model
- [x] T004 Implement SqliteRuleRepository in `aitest/backend/infrastructure/adapters/sqlite_rule_repository.py`

## Phase 2: Foundational (Infrastructure & Core Logic)
- [x] T005 [P] Implement `DatabaseBackupService` in `aitest/backend/application/services/backup_service.py` to handle Rules and Flows export/import
- [x] T006 Integrate backup/restore logic into `main.py` startup or `connection.py` initialization
- [x] T007 [P] Create `RuleGenerationService` in `aitest/backend/application/services/rule_generation_service.py` with a base method for calling LLM
- [x] T008 [P] Add Rules CRUD endpoints to `aitest/backend/main.py`

## Phase 3: [US1] Manual Rule Management (P1)
**Story Goal**: Manage global and specific rules via admin interface with AI help.

- [x] T009 [P] [US1] Create `ruleService.ts` in `aitest/frontend/src/services/ruleService.ts`
- [x] T010 [US1] Create `RulesTable.tsx` in `aitest/frontend/src/components/Rules/` to list all rules with filters
- [x] T011 [US1] Create `RuleForm.tsx` in `aitest/frontend/src/components/Rules/` with fields for Name, Text, Scope, and Status
- [x] T012 [US1] Add a "Regras" tab/page to the main AI Visual Lab layout
- [x] T013 [US1] Implement "Generate with AI" button in `RuleForm.tsx` calling `POST /rules/generate/manual`

## Phase 4: [US2] Automatic Rule Generation (P1)
**Story Goal**: Generate rules from supervisor feedback.

- [x] T014 [US2] Implement feedback generalization logic in `RuleGenerationService.py` using the AVALIA v1 prompt
- [x] T015 [US2] Add `POST /rules/generate/feedback` endpoint to `aitest/backend/main.py`
- [x] T016 [US2] Create `RuleFeedbackDialog.tsx` in `aitest/frontend/src/components/Rules/` to collect feedback and display generated JSON

## Phase 5: [US3] Hierarchical Application (P1)
**Story Goal**: Aggregate and apply rules during scoring.

- [x] T017 [US3] Update `aitest/backend/domain/services/rule_aggregator.py` (or similar) to implement "Merge-Up" logic for Global and Specific rules
- [x] T018 [US3] Integrate rule aggregation into the main scoring prompt builder in `LangGraphAdapter` or specific LLM nodes

## Phase 6: Polish & Cross-Cutting Concerns
- [ ] T019 UX: Add loading states and error boundaries to Rule Admin screens
- [ ] T020 [P] Add unit tests for Rule aggregation logic in `aitest/backend/tests/unit/test_rule_aggregation.py`
- [x] T021 [P] Update documentation (README.md, specs, plans) to reflect the final implementation (MANDATED BY CONSTITUTION)

## Dependencies
- US2 depends on Foundational (T007).
- US3 depends on US1 (for data availability) and Foundational.

## Parallel Execution
- Backend (Phase 1/2) and Frontend (Phase 3) can start in parallel once models and contracts are defined.
- T001, T002, T005, T007 are parallelizable.
