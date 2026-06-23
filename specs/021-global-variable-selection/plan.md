# Implementation Plan: global-variable-selection

**Branch**: `021-global-variable-selection` | **Date**: 2026-06-08 | **Spec**: [specs/021-global-variable-selection/spec.md](spec.md)
**Input**: Feature specification from `/specs/021-global-variable-selection/spec.md`

## Summary
Implement a mechanism to select and inject global variables (e.g., customer name, firm name) into the AI flow at the starting node. This involves a new backend endpoint for variable definitions, a custom sidebar in the React frontend for the "Start" node, and updates to the LangGraph execution logic to initialize the state with these variables.

## Technical Context

**Language/Version**: Python 3.12 (Backend), TypeScript/React (Frontend)
**Primary Dependencies**: FastAPI, React Flow, Material UI (MUI)
**Storage**: SQLite (Flow JSON storage)
**Testing**: pytest (Backend), Vitest (Frontend)
**Target Platform**: AI Visual Lab (Fullstack)
**Project Type**: Web Service + Web Application
**Performance Goals**: N/A (Lab environment)
**Constraints**: Must maintain DDD/Hexagonal architecture in the backend.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Vibe Coding**: ✅ Implementation resides in `aitest/`.
- **Branching Discipline**: ✅ Branch created from latest state.
- **Clean Separation**: ✅ Clear split between FastAPI and React.
- **Observability**: ✅ Variables will be logged in `TraceLog`.

## Project Structure

### Documentation (this feature)

```text
specs/021-global-variable-selection/
├── plan.md              # This file
├── research.md          # Decisions and rationale
├── data-model.md        # Entity definitions
├── quickstart.md        # Usage guide
├── contracts/           # API definitions
└── tasks.md             # Implementation tasks
```

### Source Code

```text
aitest/
├── backend/
│   ├── api/ (endpoints)
│   ├── application/services/ (use cases)
│   ├── domain/services/ (logic)
│   └── infrastructure/adapters/ (langgraph)
└── frontend/
    ├── src/
    │   ├── components/ (Sidebar, FlowBuilder)
    │   └── services/ (API calls)
```

**Structure Decision**: Fullstack feature spanning both backend and frontend of the AI Visual Lab.
