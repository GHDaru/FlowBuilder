# Feature Specification: AvaliacaoBlock Component

**Feature Branch**: `017-avaliacao-block-renderer`  
**Created**: 2026-06-04  
**Status**: Draft  
**Input**: Comprehensive UI/UX requirements for rendering the `avalia.consolidacao.v1` schema.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consolidated Score Visualization (Priority: P1)

As an IA Evaluator browsing the execution history, I want to see a clear, high-level summary of the evaluation (Main Score, Attendant Trail, and Client Trail) at the top of the history entry, so that I can immediately grasp the overall quality of the interaction.

**Why this priority**: Essential for the primary auditing workflow.

**Acceptance Scenarios**:
1. **Given** a consolidated evaluation JSON, **When** the `AvaliacaoBlock` renders, **Then** it MUST display a Main Card with the numerical score (1 decimal), a band badge (e.g., "adequado"), and the overall summary text.
2. **Given** the Main Card, **When** viewing sub-scores, **Then** it MUST show Attendant (Trail A) and Client (Trail B) scores side-by-side with appropriate color-coding (NPS colors for Client).
3. **Given** dimension data, **When** rendering Trail A, **Then** each dimension MUST have its own card showing sub-axis mini-bars and markers for applied rules.

---

### User Story 2 - Deep Audit Tree (Priority: P1)

As an IA Evaluator, I want to drill down into the specific justifications and rules that led to a particular score, so that I can verify the AI's reasoning and ensure the evaluation is accurate and fair.

**Why this priority**: Core "Audit" functionality of the Lab.

**Acceptance Scenarios**:
1. **Given** the audit tree section, **When** it first loads, **Then** the Root (Level 0) MUST be expanded while all other levels MUST be collapsed.
2. **Given** the audit tree, **When** I click a "Sub-eixo" (Level 3), **Then** it MUST expand to show the detailed justification and a highlighted block for each applied rule.
3. **Given** the "Expandir tudo" button, **When** clicked, **Then** all nodes in the tree MUST open recursively.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Component `AvaliacaoBlock` MUST accept a prop compatible with the `avalia.consolidacao.v1` schema.
- **FR-002**: Implement a Band Badge system with specific background/text colors for: `exemplar`, `consistente`, `adequado`, `irregular`, `critico`.
- **FR-003**: Implement NPS color scaling for the Client Trail: `promotor` (green), `passivo` (amber), `detrator` (red), `indeterminado` (gray).
- **FR-004**: Implement a 4-level recursive tree component with specific expansion behaviors and global controls.
- **FR-005**: Render conditional evidence lists for dimensions with "irregular" or "critico" status, including polarity icons/colors.
- **FR-006**: Display "Oportunidade de Melhoria" blocks prominently when critical/irregular dimensions exist.
- **FR-007**: Apply specific border colors for applied rules based on type: `contexto` (blue), `piso_teto` (orange), `suspensao` (red).

### Key Entities *(include if feature involves data)*

- **ConsolidatedEvaluation**: The input object conforming to `avalia.consolidacao.v1`.
- **AuditNode**: A logical node in the 4-level hierarchy.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the fields defined in the example JSON are mapped to a specific UI element in either the Cards or the Tree.
- **SC-002**: Tree depth exactly matches the 4-level requirement (Root -> Trail -> Dimension -> Sub-axis).
- **SC-003**: Visual density is high but maintains legibility as per "Brazilian accounting office" target style.

## Assumptions

- We will use Material UI (MUI) components as the base for Cards, Accordions (for tree), and Progress Bars.
- The component will be placed within the existing `History.tsx` detail view.
- The input JSON is already validated by the backend.
