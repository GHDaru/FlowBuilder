# Implementation Plan: rules-mgmt-module

**Branch**: `023-rules-mgmt-module` | **Date**: 2026-06-09 | **Spec**: [specs/023-rules-mgmt-module/spec.md](spec.md)
**Input**: Feature specification for Rules Management Module — AVALIA v1

## Summary
Implement a hierarchical rules management system (AVALIA v1) that supports manual and feedback-driven rule generation. Rules are stored in SQLite and can be either Global or Specific to a context. The system includes an automated backup/restore mechanism for both Rules and Flows to prevent data loss during schema evolutions.

## Technical Context

**Language/Version**: Python 3.12 (Backend), TypeScript/React (Frontend)
**Primary Dependencies**: FastAPI, SQLAlchemy, OpenAI, Material UI
**Storage**: SQLite (`audit.db`)
**Testing**: pytest (Backend), Vitest (Frontend)
**Target Platform**: AI Visual Lab
**Constraints**: Must follow DDD/Hexagonal Architecture. MUST comply with Constitution's Data Backup & Restore mandate.

## Constitution Check

- **Vibe Coding**: ✅ Implementation in `aitest/`.
- **Branching Discipline**: ✅ Branch from `feature/skills-lab`.
- **Clean Separation**: ✅ Clear port/adapter split for Rule management.
- **TDD Mandate**: ✅ Test tasks will be included for logic components.
- **Data Backup**: ✅ Mandated in this plan via a dedicated `DatabaseInitializer` service.

## Project Structure

### Documentation
```text
specs/023-rules-mgmt-module/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── api.md
```

### Source Code
```text
aitest/backend/
├── application/services/ (RuleGenerationService, DatabaseBackupService)
├── domain/models/rule.py
├── domain/ports/rule_repository.py
├── infrastructure/adapters/sqlite_rule_repository.py
└── infrastructure/database/connection.py (Updated with Rule model and backup logic)
```
```text
aitest/frontend/src/
├── components/Rules/ (RulesTable, RuleForm, RuleFeedbackDialog)
└── services/ruleService.ts
```

**Structure Decision**: Fullstack module using DDD. Backend implementation will use the Repository pattern to abstract SQLite access.
