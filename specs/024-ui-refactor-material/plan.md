# Implementation Plan: ui-refactor-material

**Branch**: `024-ui-refactor-material` | **Date**: 2026-06-11 | **Spec**: [specs/024-ui-refactor-material/spec.md](spec.md)
**Input**: Feature specification for Material Design UI Refactoring.

## Summary
Refactor the entire AI Visual Lab frontend to comply with the project's Material Design standard (`material` skill). The implementation focuses on creating a centralized theme, a collapsible navigation sidebar, and standardized management components (Rules, Firms). All design decisions are grounded in the `material` skill tokens.

## Technical Context

**Language/Version**: TypeScript / React 18+ (Vite)
**Primary Dependencies**: Material UI (MUI) v6
**Target Platform**: Web (Desktop focus)
**Constraints**: MUST use `#6442D6` as primary color. Sidebar MUST be collapsible with persistence.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Frontend UX/UI Definition**: Defined in `docs/definicoes_tela.md` using the `material` skill guidance. (✅ MANDATORY)
- [x] **Vibe Coding**: Implementation resides in `aitest/frontend`.
- [x] **Branching Discipline**: Branch created from `feature/skills-lab`.
- [x] **Clean Separation**: Pure frontend refactor; no backend logic changes.
- [x] **Observability**: N/A for visual-only refactor.
- [x] **TDD Mandate**: Component tests will be updated.
- [x] **Data Backup**: N/A for frontend-only changes.

## Project Structure

### Documentation
```text
specs/024-ui-refactor-material/
├── plan.md
├── research.md
├── data-model.md
└── quickstart.md
docs/definicoes_tela.md  # UX/UI Specialist Decisions
```

### Source Code
```text
aitest/frontend/src/
├── theme/
│   └── materialTheme.ts      # New Centralized Theme
├── components/
│   ├── Navigation/
│   │   └── Sidebar.tsx      # Refactored Collapsible Sidebar
│   ├── Rules/                # Standardized Rules UI
│   ├── OfficialData/         # Standardized Data views
│   └── History/              # Standardized TraceLog
└── App.tsx                   # Layout Refactor
```

**Structure Decision**: Refactor existing components into domain-grouped folders under `src/components/` and centralize style configuration in `src/theme/`.
