# Implementation Plan: Official Data Performance & Filtering

**Branch**: `020-official-data-perf-filtering` | **Date**: 2026-06-05 | **Spec**: [specs/020-official-data-perf-filtering/spec.md](spec.md)
**Input**: Feature specification from `/specs/020-official-data-perf-filtering/spec.md`

## Summary

Optimize the Official Data firm listing by implementing backend-side search and filtering. Additionally, add a status filter (All, Pending, Evaluated) to the interaction picker UI to improve data navigation.

## Technical Context

**Language/Version**: Python 3.12 (Backend), React 18+ (Frontend)
**Primary Dependencies**: FastAPI, SQLAlchemy, @mui/material.
**Architecture**: DDD + Hexagonal.
**Constraints**: PostgreSQL access must remain read-only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Vibe Coding**: Improves responsiveness and usability of the Lab interface.
- [x] **II. Branching Discipline**: Branch created from `feature/skills-lab`.
- [x] **IV. Clean Separation**: Logic clearly split between backend query optimization and frontend UI filtering.

## Project Structure

### Documentation (this feature)

```text
specs/020-official-data-perf-filtering/
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
│   │   └── ports/
│   │       └── official_db_port.py    # UPDATED: Add search parameter to list_firms
│   └── infrastructure/
│       └── adapters/
│           └── postgres_adapter.py    # UPDATED: Implement ILIKE filtering for firms
└── frontend/
    └── src/
        ├── components/
        │   └── OfficialData/
        │       ├── FirmList.tsx          # UPDATED: Pass search to API, optimize rendering
        │       └── AtendimentoPicker.tsx # UPDATED: Add Status Filter UI and logic
        └── services/
            └── officialDataApi.ts        # UPDATED: Update API calls with search param
```

**Structure Decision**: Standardize the firm search as a backend parameter to scale with large databases.

## Complexity Tracking

*No violations identified.*
