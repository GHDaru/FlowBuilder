# Implementation Plan: sql-context-node

**Branch**: `022-sql-context-node` | **Date**: 2026-06-09 | **Spec**: [specs/022-sql-context-node/spec.md](spec.md)
**Input**: Feature specification from `/specs/022-sql-context-node/spec.md`

## Summary
Implement a new "SQL Context" node in the React Flow builder that allows architects to configure a database connection (PostgreSQL or SQLite) and write SQL queries with `{{variable}}` interpolation. The backend will securely execute these queries using parameterized inputs, providing a preview endpoint for the UI and integrating into the LangGraph execution engine to append the results as JSON into the flow's context state.

## Technical Context

**Language/Version**: Python 3.12 (Backend), TypeScript/React (Frontend)
**Primary Dependencies**: FastAPI, React Flow, psycopg2-binary, sqlite3
**Storage**: SQLite (Flow JSON storage)
**Testing**: pytest (Backend), Vitest (Frontend)
**Target Platform**: AI Visual Lab (Fullstack)
**Project Type**: Web Service + Web Application
**Constraints**: Must maintain DDD/Hexagonal architecture. SQL execution MUST use parameterized queries to prevent SQL injection.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Vibe Coding**: ✅ Implementation resides in `aitest/`.
- **Branching Discipline**: ✅ Branch created from `feature/skills-lab`.
- **Clean Separation**: ✅ Clear split between FastAPI and React, communicating via REST API (`/tools/sql/preview`).
- **Observability**: ✅ LangGraph adapter will log SQL execution status and parameters.

## Project Structure

### Documentation (this feature)

```text
specs/022-sql-context-node/
├── plan.md              # This file
├── research.md          # Technical decisions
├── data-model.md        # Node data and DTOs
├── quickstart.md        # Usage instructions
├── contracts/           # API contracts
│   └── api.md
└── tasks.md             # Tasks (to be generated)
```

### Source Code

```text
aitest/
├── backend/
│   ├── main.py (New /tools/sql/preview endpoint)
│   ├── domain/services/ (GraphCompiler updates)
│   ├── infrastructure/adapters/ (LangGraphAdapter updates, sql execution logic)
│   └── models/ (Preview schemas)
└── frontend/
    ├── src/
    │   ├── components/FlowBuilder/ (SqlNode.tsx, flowUtils updates)
    │   ├── components/Sidebar/ (SqlSidebar.tsx or Sidebar updates)
    │   └── services/ (api client for preview)
```

**Structure Decision**: Fullstack feature adding a new node type to the React flow and corresponding execution logic in the Python backend.
