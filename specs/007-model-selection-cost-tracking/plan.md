# Implementation Plan: Model Selection and Cost Tracking

**Branch**: `007-model-selection-cost-tracking` | **Date**: 2026-06-01 | **Spec**: [specs/007-model-selection-cost-tracking/spec.md](spec.md)
**Input**: Feature specification from `/specs/007-model-selection-cost-tracking/spec.md`

## Summary

Enhance the AI Visual Lab with per-node model selection and precise cost tracking. This involves creating a unified model provider abstraction in the FastAPI backend, implementing model discovery for OpenAI and Gemini adapters, and updating the execution engine and database schema to capture and persist token usage (input, output, thinking) for every node.

## Technical Context

**Language/Version**: Python 3.12 (Backend), React 18+ (Frontend)
**Primary Dependencies**: 
- Backend: FastAPI, LangGraph, OpenAI, Google Gemini (`google-genai`).
- Frontend: React Flow, MUI (Material UI), Axios.
**Storage**: SQLite (`aitest/backend/audit.db`)
**Testing**: pytest (backend), Vitest/React Testing Library (frontend).
**Target Platform**: Windows/Local (AI Visual Lab).
**Project Type**: Web Application (Experimental Lab).
**Performance Goals**: Model selection dropdown loads < 500ms.
**Constraints**: MUST follow DDD/Hexagonal; MUST use `uv` and `npm`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Vibe Coding**: Implementation resides in `aitest/` using FastAPI and React for high-fidelity visual validation.
- [x] **II. Branching Discipline**: Branch `007-model-selection-cost-tracking` originated from `feature/skills-lab` (via the spec process).
- [x] **III. AI-First & Domain Integrity**: Multi-model support reinforces the adapter pattern for LLMs.
- [x] **IV. Clean Separation**: Strict FastAPI Backend and React Frontend split. DDD/Hexagonal maintained for model providers.
- [x] **V. Observability & Tracking**: Explicit focus on monitoring token usage and audit logs.
- [x] **VI. Ubiquitous Language**: Using **Node**, **Tracking**, and **TraceLog** terminology.

## Project Structure

### Documentation (this feature)

```text
specs/007-model-selection-cost-tracking/
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
│   │   │   ├── openai_adapter.py    # UPDATED: Implement model discovery
│   │   │   └── gemini_adapter.py    # UPDATED: Implement model discovery
│   │   └── database/
│   │       └── connection.py        # UPDATED: Add token columns to TraceLog
│   ├── domain/
│   │   ├── ports/
│   │   │   └── model_provider.py    # NEW: IModelProvider interface
│   │   └── services/
│   │       └── model_service.py     # NEW: Aggregate models from providers
│   └── application/
│       └── services/
│           └── flow_execution.py    # UPDATED: Capture and store tokens
└── frontend/
    └── src/
        ├── components/
        │   ├── FlowBuilder/
        │   │   └── Sidebar.tsx      # UPDATED: Add model selection dropdown
        └── services/
            └── modelApi.ts          # NEW: Fetch available models
```

**Structure Decision**: Maintain existing `backend/` and `frontend/` separation in `aitest/`. Use the Port/Adapter pattern for model discovery to keep the Domain layer decoupled from specific LLM SDKs.

## Complexity Tracking

*No violations identified.*
