# Implementation Plan: Interface de Teste de Fluxos de Avaliacao IA

**Branch**: `001-aitest-audit-flow` | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-aitest-audit-flow/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementação de uma interface web local utilizando Streamlit (Python) para testar e auditar o fluxo completo de avaliação de atendimentos por IA. A ferramenta permitirá processamento em lote, inspeção de saídas estruturadas da IA em cada etapa (metadados, classificação, tagueamento, avaliação) e persistência dos resultados em um banco SQLite local para histórico e auditoria.

## Technical Context

**Language/Version**: Python 3.11+  
**Primary Dependencies**: `streamlit`, `pandas`, `openai`, `google-generativeai`, `pydantic` (para structured output), `sqlalchemy` (opcional, para SQLite)  
**Storage**: SQLite (arquivo local em `aitest/audit.db`)  
**Testing**: `pytest`  
**Target Platform**: Ambiente local de desenvolvimento/teste  
**Project Type**: Desktop-app (Streamlit)  
**Performance Goals**: Processar 50 atendimentos em < 2 minutos; Interface responsiva para inspeção de JSONs grandes.  
**Constraints**: Deve residir na pasta `aitest/`; Deve garantir que todas as saídas da IA sejam auditáveis; Deve funcionar offline para revisão de históricos já processados.  
**Scale/Scope**: Ferramenta de uso interno para validação de prompts e lógica de avaliação antes da integração no backend principal (Java).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Local Tooling**: A ferramenta está contida na pasta `aitest/` e utiliza um ambiente Python isolado. (PASS)
2. **Data Privacy**: Persistência local em SQLite e uso de `.env` para chaves. (PASS)
3. **Auditability**: O design do banco de dados (tabela `audit_logs`) garante rastreabilidade total de cada etapa. (PASS)
4. **Technology Alignment**: Python/Streamlit escolhidos são ideais para a finalidade de auditoria e teste de IA. (PASS)
5. **Separation of Concerns**: A lógica de IA foi desacoplada em serviços, facilitando testes e futura integração. (PASS)

## Project Structure

### Documentation (this feature)

```text
specs/001-aitest-audit-flow/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
aitest/
├── .venv/               # Python virtual environment
├── app.py               # Main Streamlit application
├── audit.db             # SQLite database (gitignored)
├── requirements.txt     # Python dependencies
├── src/
│   ├── models/          # Pydantic schemas for structured outputs
│   ├── services/        # IA flow logic, prompt preparation, evaluation
│   ├── database/        # SQLite integration
│   └── utils/           # File loading, pre-processing
└── tests/
    ├── unit/
    └── integration/
```

**Structure Decision**: A estrutura segue o padrão de aplicações Python/Streamlit, mantendo toda a lógica separada do código-fonte Java principal, conforme solicitado.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
