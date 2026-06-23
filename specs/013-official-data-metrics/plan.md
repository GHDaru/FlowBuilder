# Implementation Plan: Official Data Metrics and Scores

**Branch**: `013-official-data-metrics` | **Date**: 2026-06-02 | **Spec**: [specs/013-official-data-metrics/spec.md](spec.md)
**Input**: Feature specification from `/specs/013-official-data-metrics/spec.md`

## Summary

Enhance the Official Database integration in the AI Visual Lab by displaying global summary metrics (Big Numbers) for total firms and evaluations, and by showing detailed evaluation scores (Média, Comunicação, Profissionalismo, Resolução) for each specific service interaction.

## Technical Context

**Language/Version**: Python 3.12 (Backend), React 18+ (Frontend)
**Primary Dependencies**: FastAPI, SQLAlchemy, React, Material UI (MUI).
**Storage**: PostgreSQL (Official DB, read-only).
**Architecture**: Fullstack (FastAPI backend adapter, React frontend components).
**Constraints**: Must maintain read-only strictness for the official DB.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Vibe Coding**: Modifying React components and FastAPI routes in `aitest/` for rapid UX improvements.
- [x] **II. Branching Discipline**: Branch `013-official-data-metrics` created from `feature/skills-lab`.
- [x] **IV. Clean Separation**: Backend provides raw metrics, frontend renders them.

## Project Structure

### Documentation (this feature)

```text
specs/013-official-data-metrics/
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
│   │   └── adapters/
│   │       └── postgres_adapter.py    # UPDATED: Fetch additional score columns
│   └── models/
│       └── official_schemas.py        # UPDATED: Add optional score fields to DTO
└── frontend/
    └── src/
        ├── components/
        │   └── OfficialData/
        │       ├── FirmList.tsx          # UPDATED: Compute and display Big Numbers
        │       └── AtendimentoPicker.tsx # UPDATED: Display score columns in table
        └── services/
            └── officialDataApi.ts        # UPDATED: Sync interfaces with backend DTOs
```

**Structure Decision**: Keep modifications contained to the previously established official data pipeline.

## Complexity Tracking

*No violations identified.*
