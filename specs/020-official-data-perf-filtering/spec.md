# Feature Specification: Official Data Performance & Filtering

**Feature Branch**: `020-official-data-perf-filtering`  
**Created**: 2026-06-05  
**Status**: Draft  
**Input**: Accounting firms list performance issues and status filtering for interactions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Optimized Firm Search (Priority: P1)

As an IA Auditor, I want the accounting firm list to load and render faster, especially when searching for a specific company, so that I don't waste time waiting for the entire database to be processed and transmitted.

**Why this priority**: Directly impacts usability and system responsiveness.

**Acceptance Scenarios**:
1. **Given** the Official Data tab, **When** searching for a firm by name, **Then** the backend SHOULD ideally perform the filtering to reduce data transfer size.
2. **Given** a large number of firms, **When** the page loads, **Then** it SHOULD render the list efficiently (e.g., using a limit or pagination if necessary).

---

### User Story 2 - Interaction Status Filter (Priority: P1)

As an IA Auditor, I want to filter interactions by their current status (Pendente or Avaliado) within a firm's detail view, so that I can quickly focus on tickets that still need processing or audit already evaluated ones.

**Why this priority**: Essential for managing large volumes of tickets within a firm.

**Acceptance Scenarios**:
1. **Given** the Atendimento Picker for selected firms, **When** viewing the list, **Then** I MUST see a filter control (Select/Buttons) for "Todos", "Pendentes", and "Avaliados".
2. **Given** a status filter is applied, **When** the list updates, **Then** only interactions matching the selected status MUST be visible and selectable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Backend `list_firms` SHOULD support an optional search query to filter by name at the database level.
- **FR-002**: Frontend `FirmList` SHOULD pass the search term to the API if performance is not acceptable locally.
- **FR-003**: Frontend `AtendimentoPicker` MUST include a status filter UI (Select component).
- **FR-004**: `AtendimentoPicker` MUST filter the displayed interactions list based on the `has_evaluation` property.
- **FR-005**: Selection logic in `AtendimentoPicker` (Select All) MUST only apply to the currently *filtered* items.

### Key Entities *(include if feature involves data)*

- **Firm**: Updated with backend-side filtering.
- **Interaction**: Updated with status-based filtering.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Firm list initial load time remains under 1s for up to 500 firms.
- **SC-002**: Status filtering in the interaction picker responds instantly (under 50ms).

## Assumptions

- We will first try to optimize the backend query for firms.
- Status filtering for interactions will be handled on the frontend as the data is already in memory.
