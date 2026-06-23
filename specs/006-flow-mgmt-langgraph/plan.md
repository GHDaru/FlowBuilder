# Implementation Plan: Flow Management and LangGraph Integration

**Branch**: `006-flow-mgmt-langgraph` | **Date**: 2026-05-31 | **Spec**: [specs/006-flow-mgmt-langgraph/spec.md](spec.md)
**Input**: Feature specification from `/specs/006-flow-mgmt-langgraph/spec.md`

## Summary

Enhance the AI Visual Lab with full lifecycle management for evaluation flows (Create, Copy, Save As, Load) and integrate LangGraph as the execution engine. Visual nodes will use a Left-to-Right orientation with explicit "Start" node identification, translating the visual JSON model into a production-grade StateGraph in the backend.

## Technical Context

**Language/Version**: Python 3.12 (Backend), React 18+ (Frontend)
**Primary Dependencies**: 
- Backend: FastAPI, SQLAlchemy, **LangGraph**, LangChain.
- Frontend: React Flow, MUI (Material UI), Axios.
**Storage**: SQLite (`audit.db`) - updated schemas for Flow JSON storage.
**Testing**: pytest (backend), Vitest/React Testing Library (frontend).
**Target Platform**: Windows/Local.
**Project Type**: Web Application (Experimental Lab).
**Performance Goals**: < 800ms flow loading.
**Constraints**: MUST follow DDD/Hexagonal; use standard `uv` and `npm` dependency management.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Vibe Coding**: Implementation resides in `aitest/` using FastAPI and React for high-fidelity visual validation.
- [x] **II. Branching Discipline**: Branch `006-flow-mgmt-langgraph` originated from `feature/skills-lab`.
- [x] **III. AI-First & Domain Integrity**: Visual flows define domain logic; LLMs aid creation. Prompts stored in mirroring local paths.
- [x] **IV. Clean Separation**: Explicit FastAPI Backend and React Frontend split. DDD/Hexagonal maintained.
- [x] **V. Observability & Tracking**: Tracking IDs and TraceLogs ensure 100% traceability of LangGraph executions.
- [x] **VI. Architectural Sync**: Aggregate Root `Flow` updated to include JSON definition.

## Project Structure

### Documentation (this feature)

```text
specs/006-flow-mgmt-langgraph/
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
│   ├── main.py                 # FastAPI Entry point
│   ├── infrastructure/
│   │   ├── adapters/
│   │   │   ├── langgraph_adapter.py    # NEW: LangGraph Translation Layer
│   │   │   └── sqlite_flow_repository.py # NEW: CRUD for Flows
│   │   └── database/
│   │       └── connection.py           # Updated: Flow Table definition
│   ├── domain/
│   │   ├── models/
│   │   │   └── flow.py                 # Updated: Flow Aggregate Root
│   │   └── services/
│   │       └── graph_compiler.py        # NEW: Logic to compile visual to logical graph
│   └── application/
│       └── services/
│           ├── flow_lifecycle.py       # NEW: Save/Copy/Load use cases
│           └── flow_execution.py       # NEW: Orchestrate LangGraph run
└── frontend/
    └── src/
        ├── components/
        │   ├── FlowBuilder/
        │   │   ├── CustomNode.tsx      # NEW: Node with Left/Right handles
        │   │   └── StartNode.tsx       # NEW: Dedicated entry node
        │   └── Toolbar/
        │       └── FlowActions.tsx     # NEW: New/Save/SaveAs/Load buttons
        └── services/
            └── flowApi.ts              # NEW: CRUD and Execution endpoints
```

**Structure Decision**: Maintain the clean `backend/` and `frontend/` separation introduced in the previous refactor. Introduce a dedicated `LangGraphAdapter` in the infrastructure layer to handle the specific library integration, keeping the Domain pure.

## Complexity Tracking

*No violations identified.*
