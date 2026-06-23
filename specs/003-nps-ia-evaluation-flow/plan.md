# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a multi-step AI evaluation flow for NPS interactions using **DDD** and **Hexagonal Architecture**. The flow includes metadata extraction, dynamic classification, rule-based scoring dimension selection, and results consolidation. OpenAI is the primary LLM provider, treated as a pluggable adapter.

## Technical Context

**Language/Version**: Python 3.12 (Mandatory implementation in `aitest/`)  
**Architecture**: DDD + Hexagonal (Ports & Adapters)  
**Primary Dependencies**: Streamlit, OpenAI (Primary LLM), Pydantic (Domain Models), SQLAlchemy (DB Adapter)  
**Storage**: PostgreSQL 16  
**Testing**: pytest  
**Target Platform**: Linux server / Windows (dev)
**Project Type**: web-service (Interactive Dashboard + Processing Flow)  
**Performance Goals**: Target < 10s per evaluation via parallel scoring dimensions.  
**Constraints**: Token tracking mandatory; AI as a pluggable port.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Implementation Folder**: All code MUST be in `aitest/`. (✅ ALIGNED)
2. **Architecture**: MUST use DDD + Hexagonal Architecture. (✅ ALIGNED)
3. **Primary LLM**: OpenAI is standard, but pluggable. (✅ ALIGNED)
4. **Vibe Coding**: Rapid validation in Python. (✅ ALIGNED)
5. **Observability**: Token tracking mandatory. (✅ ALIGNED)
6. **Ubiquitous Language**: Domain sync mandatory. (✅ ALIGNED)

## Project Structure (Hexagonal)

```text
aitest/src/
├── domain/             # Core Logic (Entities, Value Objects, Domain Services)
│   ├── models/         # Pydantic domain models
│   └── ports/          # Abstract interfaces for LLM, Repository, etc.
├── application/        # Use Cases (Orchestrates the flow)
│   └── evaluation/
├── infrastructure/     # Adapters (Implementation of Ports)
│   ├── adapters/
│   │   ├── openai_adapter.py
│   │   ├── sql_repository.py
│   │   └── local_file_adapter.py
│   └── database/
└── web/                # Entry Points
    └── app.py (Streamlit)
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
