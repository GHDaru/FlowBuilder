# Implementation Plan: Lab Postgres Integration

**Branch**: `008-lab-postgres-integration` | **Date**: 2026-06-01 | **Spec**: [specs/008-lab-postgres-integration/spec.md](spec.md)
**Input**: Feature specification from `/specs/008-lab-postgres-integration/spec.md`

## Summary

Integrate the AI Visual Lab with the official PostgreSQL database (read-only) to allow IA Evaluators to browse real accounting firms and service interactions. This enables testing Visual AI flows against production-like data, triggering the existing execution engine and logging results in the local Lab history.

## Technical Context

**Language/Version**: Python 3.12 (Backend), React 18+ (Frontend)  
**Primary Dependencies**: FastAPI, SQLAlchemy, `psycopg2-binary`, LangGraph, React Flow, MUI, Axios.  
**Storage**: PostgreSQL (Official DB, read-only), SQLite (`aitest/backend/audit.db` for Lab local data).  
**Testing**: `pytest` (Backend), Vitest (Frontend).  
**Target Platform**: Web Browser / Local Development.
**Project Type**: Web Application (Experimental Lab).  
**Performance Goals**: Listing accounting firms < 2s for 1000 firms.  
**Constraints**: MUST follow DDD/Hexagonal; MUST use `uv` and `npm`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Vibe Coding**: Implementation resides in `aitest/` using FastAPI and React for visual validation.
- [x] **II. Branching Discipline**: Feature branch originated from `feature/skills-lab`.
- [x] **III. AI-First & Domain Integrity**: Leverages `FlowExecutionUseCase` while maintaining domain separation.
- [x] **IV. Clean Separation**: Strict split between official data adapter and local domain logic.
- [x] **V. Observability**: All executions against official data will generate local `TraceLog` records.
- [x] **VI. Ubiquitous Language**: Using **Atendimento**, **Contabilidade**, **Flow**, **Tracking**.

## Project Structure

### Documentation (this feature)

```text
specs/008-lab-postgres-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # API Contract definitions
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
aitest/
├── backend/
│   ├── infrastructure/
│   │   ├── adapters/
│   │   │   └── postgres_adapter.py    # NEW: Read-only SQLAlchemy adapter for Official DB
│   │   └── database/
│   │       └── connection.py        # UPDATED: Local SQLite models remains unchanged
│   ├── domain/
│   │   ├── ports/
│   │   │   └── official_db_port.py    # NEW: Interface for fetching official firms/atendimentos
│   ├── application/
│   │   └── services/
│   │       └── official_data_service.py # NEW: Bridge between official DB and Lab execution
│   └── main.py                        # UPDATED: Endpoints for /official/firms, /official/atendimentos
└── frontend/
    └── src/
        ├── components/
        │   └── OfficialData/
        │       ├── FirmList.tsx       # NEW: Browse accounting firms
        │       └── AtendimentoPicker.tsx # NEW: Select interactions for processing
        └── services/
            └── officialDataApi.ts     # NEW: API client for official data endpoints
```

**Structure Decision**: Maintain existing `backend/` and `frontend/` separation in `aitest/`. Use a dedicated adapter for PostgreSQL to ensure read-only constraints are isolated from the main SQLite-based Lab logic.

## Complexity Tracking

*No violations identified.*
