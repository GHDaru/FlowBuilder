# Feature Specification: Official Data Metrics and Scores

**Feature Branch**: `013-official-data-metrics`  
**Created**: 2026-06-02  
**Status**: Draft  
**Input**: User description: "Na integração com a base para trazer os dados da contabilidade, incluir big numbers que informem quantas contabilidades, quantas avaliações. E no detalhe, conter as notas do atendimento."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Global Metrics (Big Numbers) (Priority: P1)

As an IA Evaluator, I want to see summary metrics (Big Numbers) at the top of the Official Data page, so that I can immediately understand the total volume of firms and evaluations available in the official database.

**Why this priority**: Enhances the analytical dashboard experience.

**Acceptance Scenarios**:
1. **Given** the Official Data Firm List page, **When** the list of firms loads, **Then** the UI MUST display high-visibility "Big Number" cards.
2. **Given** the Big Numbers, **When** viewing them, **Then** I MUST see the "Total de Contabilidades" and "Total de Avaliações" (sum of all evaluated interactions).

---

### User Story 2 - Interaction Evaluation Scores (Priority: P1)

As an IA Evaluator, I want to see the specific dimension scores assigned to an interaction when browsing a firm's records, so that I can identify which specific interactions need re-processing or closer inspection.

**Why this priority**: Crucial for auditing the quality of the AI outputs against specific tickets.

**Acceptance Scenarios**:
1. **Given** the Atendimento Picker for a specific firm, **When** the table of interactions loads, **Then** the table MUST include columns for the evaluation scores (Média, Comunicação, Profissionalismo, Resolução).
2. **Given** the interaction table, **When** an interaction has no evaluation, **Then** the score columns MUST display a fallback indicator (e.g., "-").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Frontend `FirmList` MUST calculate and display global summary metrics based on the fetched firms data.
- **FR-002**: Backend `PostgresAdapter` MUST fetch `nota_media`, `nota_comunicacao`, `nota_profissionalismo`, and `nota_resolucao` when listing interactions.
- **FR-003**: Backend `OfficialInteraction` schema MUST be updated to include the score fields as optional floats.
- **FR-004**: Frontend `AtendimentoPicker` MUST display the scores in the table layout.

### Key Entities *(include if feature involves data)*

- **OfficialInteraction**: Updated to include `nota_media`, `nota_comunicacao`, `nota_profissionalismo`, `nota_resolucao`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Big Numbers render accurately reflecting the sum of the underlying data grid.
- **SC-002**: Interaction scores are correctly mapped from the PostgreSQL database to the frontend UI without precision loss.

## Assumptions

- The backend already fetches all firms in one request, so global metrics can be calculated directly on the frontend via array reduction.
- The `atendimentos` table in PostgreSQL already has the `nota_*` columns as verified in previous schema migrations.
