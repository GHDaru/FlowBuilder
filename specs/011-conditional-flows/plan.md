# Implementation Plan: Conditional Flows

**Branch**: `011-conditional-flows` | **Date**: 2026-06-02 | **Spec**: [specs/011-conditional-flows/spec.md](spec.md)
**Input**: Feature specification from `/specs/011-conditional-flows/spec.md`

## Summary

Implement conditional branching within the AI Visual Lab. This allows users to create a "Condition Node" in the UI to define routing rules based on the outputs of previous LLM nodes. The backend `GraphCompiler` will parse these rules, and the `LangGraphAdapter` will execute them using `add_conditional_edges`, logging the routing decisions to the `TraceLog` for full observability.

## Technical Context

**Language/Version**: Python 3.12 (Backend), React 18+ (Frontend)
**Primary Dependencies**: FastAPI, LangGraph, React Flow, Material UI (MUI).
**Storage**: SQLite (`aitest/backend/audit.db`)
**Testing**: pytest (Backend), Vitest (Frontend)
**Target Platform**: Web Browser / Local Development
**Project Type**: Fullstack Experimental Lab (FastAPI/React)
**Constraints**: MUST follow DDD/Hexagonal; MUST use `uv` and `npm`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Vibe Coding**: Implemented in `aitest/` for rapid prototyping.
- [x] **II. Branching Discipline**: Branch `011-conditional-flows` created from `feature/skills-lab`.
- [x] **III. AI-First**: Enhances the visual evaluation flow with non-linear AI logic.
- [x] **IV. Clean Separation**: UI node configuration and backend compilation/execution are strictly separated.
- [x] **V. Observability**: Routing decisions will be logged in `TraceLog`.
- [x] **VI. Ubiquitous Language**: Using "Condition Node", "Rules", "GraphState", and "LangGraphAdapter".

## Project Structure

### Documentation (this feature)

```text
specs/011-conditional-flows/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
aitest/
├── backend/
│   ├── application/
│   │   └── services/
│   │       └── flow_execution.py    # UPDATED: Support logging condition node decisions
│   ├── domain/
│   │   └── services/
│   │       └── graph_compiler.py    # UPDATED: Parse Condition nodes and rules
│   └── infrastructure/
│       └── adapters/
│           └── langgraph_adapter.py # UPDATED: Implement add_conditional_edges logic
└── frontend/
    └── src/
        └── components/
            ├── FlowBuilder/
            │   ├── FlowBuilder.tsx      # UPDATED: Register new node type
            │   ├── ConditionNode.tsx    # NEW: React Flow component for condition logic
            │   └── Sidebar/
            │       └── Sidebar.tsx      # UPDATED: Render condition rules UI when Condition Node is selected
```

**Structure Decision**: Add `ConditionNode` to the frontend and extend existing domain/infrastructure classes in the backend to parse and execute conditions.

## Complexity Tracking

*No violations identified.*
