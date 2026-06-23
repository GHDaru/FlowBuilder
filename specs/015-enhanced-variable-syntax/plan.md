# Implementation Plan: Enhanced Variable Syntax

**Branch**: `015-enhanced-variable-syntax` | **Date**: 2026-06-03 | **Spec**: [specs/015-enhanced-variable-syntax/spec.md](spec.md)
**Input**: Feature specification from `/specs/015-enhanced-variable-syntax/spec.md`

## Summary

Implement a centralized variable resolution system in the AI Visual Lab backend. This system will support nested JSON path access using dot notation (e.g., `{{meta.id}}`) for both prompt injection in LLM nodes and routing decisions in Condition nodes. The frontend will be updated to allow and encourage the `{{}}` syntax in rule definitions for consistency.

## Technical Context

**Language/Version**: Python 3.12 (Backend), TypeScript/React (Frontend)
**Primary Dependencies**: FastAPI, LangGraph.
**Architecture**: DDD + Hexagonal.
**Constraints**: Support up to 5 levels of nesting; handle missing keys gracefully.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Vibe Coding**: Rapid UX/DX improvement for flow creation.
- [x] **II. Branching Discipline**: Branch `015-enhanced-variable-syntax` from `feature/skills-lab`.
- [x] **IV. Clean Separation**: Resolution logic encapsulated in a Domain Service.
- [x] **VI. Ubiquitous Language**: Variables and Paths defined consistently.

## Project Structure

### Documentation (this feature)

```text
specs/015-enhanced-variable-syntax/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
aitest/
├── backend/
│   ├── domain/
│   │   └── services/
│   │       └── variable_resolver.py # NEW: Centralized resolution logic
│   └── infrastructure/
│       └── adapters/
│           └── langgraph_adapter.py # UPDATED: Use resolver in LLM and Router functions
└── frontend/
    └── src/
        └── components/
            └── FlowBuilder/
                └── ConditionNode.tsx # UPDATED: UI support for {{}} syntax
```

**Structure Decision**: Place the logic in the Domain layer as it defines how the flow "speaks" with the data.

## Complexity Tracking

*No violations identified.*
