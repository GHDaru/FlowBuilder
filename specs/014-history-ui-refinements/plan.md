# Implementation Plan: History UI Refinements

**Branch**: `014-history-ui-refinements` | **Date**: 2026-06-03 | **Spec**: [specs/014-history-ui-refinements/spec.md](spec.md)
**Input**: Feature specification from `/specs/014-history-ui-refinements/spec.md`

## Summary

Enhance the Execution History view in the AI Visual Lab frontend. This involves replacing static step cards with collapsible Material UI Accordions, ensuring the first step is expanded by default. To provide better context, the backend TraceLog will be updated to store and serve the human-readable `node_label`, which will be displayed in the Accordion header. Finally, CSS properties will be applied to prevent text overflow issues for long JSON outputs and prompts.

## Technical Context

**Language/Version**: Python 3.12 (Backend), React 18+ (Frontend), TypeScript.
**Primary Dependencies**: FastAPI, SQLAlchemy, React, Material UI (MUI).
**Storage**: SQLite (`aitest/backend/audit.db`)
**Testing**: pytest (Backend), Vitest (Frontend)
**Target Platform**: Web Browser / Local Development
**Project Type**: Fullstack Experimental Lab (FastAPI/React)
**Constraints**: MUST follow DDD/Hexagonal; MUST use `uv` and `npm`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Vibe Coding**: Modifying React components in `aitest/` for rapid UX improvements.
- [x] **II. Branching Discipline**: Branch `014-history-ui-refinements` created from `feature/skills-lab`.
- [x] **IV. Clean Separation**: The backend updates the DB schema and models; the frontend consumes and renders them via REST.
- [x] **V. Observability & Tracking**: Enhances the visual navigation of the existing TraceLog system.

## Project Structure

### Documentation (this feature)

```text
specs/014-history-ui-refinements/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
aitest/
├── backend/
│   ├── infrastructure/
│   │   ├── database/
│   │   │   └── connection.py        # UPDATED: Add node_label column to TraceLog table
│   │   └── adapters/
│   │       └── langgraph_adapter.py # UPDATED: Pass node label to log_callback
│   ├── application/
│   │   └── services/
│   │       └── flow_execution.py    # UPDATED: Accept and persist node_label in TraceLog
│   └── models/
│       └── schemas.py               # UPDATED: Add node_label to TraceLog Pydantic schema
└── frontend/
    └── src/
        └── components/
            └── History/
                └── History.tsx      # UPDATED: Replace Card with Accordion, add CSS for text overflow
```

**Structure Decision**: Maintain existing `backend/` and `frontend/` separation. The change spans from the database column down to the UI rendering component.

## Complexity Tracking

*No violations identified.*
