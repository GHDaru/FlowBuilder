# Feature Specification: History UI Refinements

**Feature Branch**: `014-history-ui-refinements`  
**Created**: 2026-06-03  
**Status**: Draft  
**Input**: User description: "Aprimore a visualização do histórico dos atendimentos. 1) coloque recolhíveis em cada passo, coloque o nome do nó. 2) O texto está passando a parte visível."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Collapsible Execution Steps (Priority: P1)

As an IA Evaluator, I want each step in the execution history to be collapsible (accordion style) and clearly display the node's name, so that I can easily navigate through complex, multi-step flow executions without endless scrolling.

**Why this priority**: Directly addresses usability issues in reading long execution traces.

**Acceptance Scenarios**:
1. **Given** the History view for a selected interaction, **When** the list of steps renders, **Then** each step MUST be displayed as a collapsible panel (e.g., Accordion).
2. **Given** a collapsible step panel, **When** it is closed, **Then** its header MUST clearly display the Node Name (e.g., "Passo 1: Extrator de Metadados") alongside the existing token badges.
3. **Given** a collapsible step panel, **When** I click its header, **Then** the panel MUST expand to show the prompt and response details.

---

### User Story 2 - Prevent Text Overflow (Priority: P1)

As an IA Evaluator, I want long texts (prompts or JSON responses) to wrap or scroll properly within their containers, so that the content does not break the layout or become unreadable by extending beyond the visible screen area.

**Why this priority**: Fixes a UI bug that makes the tool difficult to use on smaller screens or with very large prompts.

**Acceptance Scenarios**:
1. **Given** an expanded step panel with a very long prompt or JSON, **When** viewed on the screen, **Then** the text MUST NOT overflow the horizontal boundaries of its parent container.
2. **Given** a text block, **When** it reaches the edge of the container, **Then** it MUST wrap to the next line or provide a localized horizontal scrollbar if line wrapping is not possible (e.g., strictly formatted code blocks).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Replace the `Card` component currently used for each log step in `History.tsx` with an `Accordion` component from MUI.
- **FR-002**: The backend `TraceLog` model and execution engine MUST be updated to capture and store the human-readable `node_label`. The frontend `AccordionSummary` MUST display this label alongside the step number.
- **FR-003**: Apply CSS properties (`word-break`, `white-space: pre-wrap`, `overflow-x: auto`) to the `pre` and `Typography` components inside the step details to prevent horizontal overflow.
- **FR-004**: By default, the first step of the execution SHOULD be expanded, while subsequent steps SHOULD be collapsed.

### Key Entities *(include if feature involves data)*

- **TraceLog**: May need a schema update if the human-readable node name needs to be captured at execution time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A flow with 10 steps can be viewed entirely on a standard 1080p screen without vertical scrolling when all steps are collapsed.
- **SC-002**: No horizontal scrolling is required on the main browser window when viewing long prompts (local horizontal scrolling within a code block is acceptable).

## Assumptions

- We will use MUI's `Accordion`, `AccordionSummary`, and `AccordionDetails` components.
