# Implementation Plan: Visual Lab UX/UI Refinement

**Branch**: `009-visual-lab-ux-refinement` | **Date**: 2026-06-02 | **Spec**: [specs/009-visual-lab-ux-refinement/spec.md](spec.md)
**Input**: Feature specification from `/specs/009-visual-lab-ux-refinement/spec.md`

## Summary

Refine the AI Visual Lab User Experience by adopting industry-standard UI patterns inspired by Flowise. Key improvements include a contextual node toolbar for rapid actions (delete, duplicate), header reorganization to group primary actions in the top-right, inline editing for flow names, a dedicated code panel for JSON export, and a floating button for node addition. This plan also covers bulk import/export of flows via JSON files.

## Technical Context

**Language/Version**: Python 3.12 (Backend), React 18+ (Frontend)
**Primary Dependencies**: React Flow, Material UI (MUI), Lucide React (or MUI Icons), Axios.
**Architecture**: Fullstack (FastAPI/React).
**Constraints**: MUST follow DDD/Hexagonal; MUST use `uv` and `npm`.

## Constitution Check

- [x] **I. Vibe Coding**: Implementation resides in `aitest/` using FastAPI and React for high-fidelity visual validation.
- [x] **II. Branching Discipline**: Branch `009-visual-lab-ux-refinement` originated from `feature/skills-lab`.
- [x] **III. AI-First**: Prompts and flow logic remain central to the visual lab.
- [x] **IV. Clean Separation**: UI changes are isolated in the Frontend; existing Flow persistence in the Backend is reused.
- [x] **V. Observability**: UX improvements make audit logs (TraceLog) easier to navigate and manage.
- [x] **VI. Ubiquitous Language**: Terms like **Flow**, **Node**, and **Metadata** are consistent with the domain.

## Project Structure

### Documentation (this feature)

```text
specs/009-visual-lab-ux-refinement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (JSON structure validation)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
aitest/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── FlowBuilder/
│       │   │   ├── FlowBuilder.tsx    # UPDATED: Header reorganization, FAB integration
│       │   │   ├── NodeToolbar.tsx    # NEW: Contextual node actions
│       │   │   ├── CodePanel.tsx      # NEW: Drawer for JSON viewing/copying
│       │   │   └── CustomLLMNode.tsx  # UPDATED: Integrate NodeToolbar
│       │   ├── Toolbar/
│       │   │   └── FlowActions.tsx    # UPDATED: Move buttons to header
│       │   └── FlowListView.tsx       # UPDATED: Add Import/Export buttons
│       └── services/
│           └── flowApi.ts             # UPDATED: Support renaming and import logic
└── backend/
    └── main.py                        # UPDATED: Ensure naming/import endpoints are stable
```

**Structure Decision**: Keep all UX logic in the React components. Use the `NodeToolbar` component from `reactflow` for contextual actions. Use a `Drawer` from MUI for the Code Panel.

## Complexity Tracking

*No violations identified.*
