# Feature Specification: Official Data UX Enhancements

**Feature Branch**: `019-official-data-ux-enhancements`  
**Created**: 2026-06-05  
**Status**: Draft  
**Input**: Multi-firm selection, sorting by evaluation count and scores, and select-all/deselect-all functionality.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Multi-Firm Selection & Sorting (Priority: P1)

As an IA Auditor, I want to select multiple accounting firms at once and sort them by the number of evaluations, so that I can process and audit large batches of data more efficiently.

**Why this priority**: Directly impacts the speed of bulk auditing.

**Acceptance Scenarios**:
1. **Given** the Official Data Firm List, **When** clicking a row, **Then** it MUST be multi-selectable via checkboxes.
2. **Given** the Firm List, **When** I click the "Avaliados" column header, **Then** the list MUST sort by the quantity of evaluations (asc/desc).
3. **Given** a selection of firms, **When** I proceed to the next view, **Then** all interactions from all selected firms MUST be displayed.

---

### User Story 2 - Interaction Picker Improvements (Priority: P1)

As an IA Auditor, I want a quick way to select all interactions and sort them by specific score dimensions, so that I can focus on the most relevant tickets for my audit.

**Why this priority**: Crucial for identifying edge cases and poor-performing AI responses.

**Acceptance Scenarios**:
1. **Given** the Interaction Picker, **When** the list loads, **Then** all interactions MUST be selected by default.
2. **Given** the Interaction Picker, **When** I click the "Select/Deselect All" button, **Then** the entire list's selection state MUST toggle accordingly.
3. **Given** the interaction table, **When** I click on headers for "Média", "Comunicação", "Profissionalismo", or "Resolução", **Then** the rows MUST sort based on those numerical values.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `FirmList` component MUST support multi-selection using checkboxes.
- **FR-002**: `FirmList` MUST implement client-side sorting for the "Avaliados" (evaluation count) column.
- **FR-003**: Backend `IOfficialDbPort` and `PostgresAdapter` MUST be updated to support fetching interactions for a list of firm IDs. `AtendimentoPicker` will use this updated capability to show consolidated data.
- **FR-004**: `AtendimentoPicker` MUST include a "Selecionar/Desselecionar Todos" button in its toolbar.
- **FR-005**: `AtendimentoPicker` MUST implement client-side sorting for all numerical score columns.
- **FR-006**: The default selection state for both firms and interactions MUST be "All Selected" when first loaded.

### Key Entities *(include if feature involves data)*

- **FirmSelection**: A collection of `OfficialFirm` objects.
- **InteractionView**: A consolidated view of interactions from multiple firms.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can select 5 firms and see a combined list of interactions in under 2 seconds.
- **SC-002**: Sorting operations respond instantly (under 100ms) for lists up to 1000 items.

## Assumptions

- We will perform sorting on the frontend to avoid complex backend query builders for these read-only views.
- The default state of "all selected" applies to the *currently visible/filtered* items.
