# Implementation Plan: React Flow UI Refactor

**Branch**: `005-react-flow-ui` | **Date**: 2026-05-30 | **Spec**: [specs/005-react-flow-ui/spec.md](spec.md)
**Input**: Feature specification from `/specs/005-react-flow-ui/spec.md`

## Summary

Refactor the `aitest` UI from Streamlit to a modern React frontend featuring a visual flow builder (React Flow). This will allow users to define, track, and compare LLM-driven evaluation sequences with granular telemetry and LLM assistance during design.

## Technical Context

**Language/Version**: Python 3.12 (Backend), React 18+ (Frontend)
**Primary Dependencies**: 
- Backend: FastAPI, SQLAlchemy, Pydantic, OpenAI/Gemini SDKs.
- Frontend: React Flow, Axios, Tailwind CSS, Lucide React (icons).
**Storage**: SQLite (`audit.db`) with new tables for `Flows` and `Nodes`.
**Testing**: pytest (backend), Vitest/React Testing Library (frontend).
**Target Platform**: Windows/Local (Self-hosted API + SPA).
**Project Type**: Fullstack Web Application (Experimental Lab).
**Performance Goals**: UI status updates < 500ms, Flow loading < 1s.
**Constraints**: MUST follow DDD/Hexagonal in the backend; Frontend should use modular service patterns.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Vibe Coding**: Core logic remains in Python (`aitest/backend`). React provides the enhanced "vibe".
- [x] **II. Branching Discipline**: Branch `005-react-flow-ui` originated from `feature/skills-lab`.
- [x] **III. AI-First & Domain Integrity**: Visual nodes represent domain steps; LLM aids creation.
- [x] **IV. Clean Separation**: FastAPI separates Domain/Application from the new SPA frontend.
- [x] **V. Observability**: Tracking IDs and granular statuses fulfill tracking requirements.
- [x] **VI. Ubiquitous Language**: Using "Flow", "Node", "Tracking", "Atendimento".
- [x] **VII. uv Usage**: Backend dependencies managed via `uv`.

## Project Structure

### Documentation (this feature)

```text
specs/005-react-flow-ui/
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
├── backend/                    # Renamed from 'src' for clarity
│   ├── main.py                 # FastAPI entry point
│   ├── src/                    # Existing DDD structure
│   └── tests/
├── frontend/                   # New React SPA
│   ├── src/
│   │   ├── components/         # Canvas, Sidebar, Node types
│   │   ├── services/           # API clients
│   │   └── hooks/              # Flow state management
│   ├── package.json
│   └── vite.config.ts
└── data/
    └── flows/                  # Exported flow definitions (optional)
```

**Structure Decision**: Split `aitest` into `backend/` and `frontend/` to clearly separate the API from the React application, while maintaining the DDD structure in the backend.

## Complexity Tracking

*No violations identified.*
