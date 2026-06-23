# Feature Specification: ui-refactor-material

**Feature Branch**: `024-ui-refactor-material`  
**Created**: 2026-06-11  
**Status**: Draft  
**Input**: User description: "Refatorar toda a interface aplicando a skill de design material, incluindo a refatoração dos objetos de tela e do menu lateral para ser um side bar que colapsa nos ícones."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Collapsible Sidebar (Priority: P1)

As a Flow Architect, I want to toggle the width of the navigation sidebar between an expanded state (with labels) and a collapsed state (icons only), so that I can maximize the available screen space for the visual canvas.

**Why this priority**: Core navigation improvement that directly impacts the usability of the flow builder.

**Independent Test**: Click a toggle button at the bottom of the sidebar. Verify that the sidebar smoothly transitions from 240px to 64px width and labels disappear/reappear.

**Acceptance Scenarios**:

1. **Given** the sidebar is expanded, **When** I click the toggle button, **Then** the sidebar MUST collapse to a mini-width showing only icons.
2. **Given** the sidebar is collapsed, **When** I hover or click the toggle, **Then** it MUST expand back to the full width with text labels.

---

### User Story 2 - Material Design Consistency (Priority: P1)

As a User, I want the entire application (Flow Builder, History, Rules, Official Data) to follow a consistent visual language based on Material Design 3, so that the experience feels professional and polished.

**Why this priority**: Fulfills the "Antigravity" Material Design standard mandated by the project's design skill.

**Independent Test**: Audit all screens for typography, color palette, and spacing consistency against the `material` skill tokens.

**Acceptance Scenarios**:

1. **Given** any component, **When** it is rendered, **Then** it MUST use the defined tokens (Primary: #6442D6, Surface: #FFFFFF, Text: #111827).
2. **Given** the typography scale, **When** viewing titles and body text, **Then** they MUST adhere to the Inter/Roboto font families and the specified scale.

---

### User Story 3 - Refined Screen Objects (Priority: P2)

As a User, I want data tables, forms, and cards to have clean layouts, meaningful spacing, and clear interaction states (hover, focus), so that I can perform management tasks without visual clutter.

**Why this priority**: Enhances the quality of data-heavy views like Rules and Official interactions.

**Acceptance Scenarios**:

1. **Given** the Rules table, **When** I hover over a row, **Then** it MUST provide clear visual feedback using elevation or background shifts.

---

### Edge Cases

- **Mobile View**: How does the collapsible sidebar behave on very small screens? (Expected: Sidebar becomes a floating drawer).
- **Long Labels**: What happens if a sidebar label is too long? (Expected: Text truncates with ellipsis in expanded state).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST implement a global ThemeProvider using Material UI (MUI) v6+ with the custom tokens defined in the `material` skill.
- **FR-002**: The Sidebar component MUST support two states: `expanded` and `collapsed`.
- **FR-003**: The system MUST store the sidebar's toggle state in `localStorage` to persist user preference.
- **FR-004**: All management tables (Rules, Official Firms) MUST be refactored to use standard MUI `Table` components with consistent spacing (4/8/12/16/24/32 scale).
- **FR-005**: All actionable items MUST have explicit focus-visible and hover states for accessibility.
- **FR-006**: The typography MUST be globally updated to Inter (primary) and Roboto (display).

### Key Entities

- **UI Context State**:
  - `sidebarCollapsed`: Boolean
  - `activeTheme`: MaterialThemeObject

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of frontend screens use the centralized theme tokens for colors and typography.
- **SC-002**: The sidebar transition animation completes in under 300ms for a smooth user experience.
- **SC-003**: The application achieves 100% compliance with WCAG 2.2 AA accessibility standards for focus indicators.

## Assumptions

- We are using Material UI (MUI) as the underlying component library.
- The `material` skill tokens are the source of truth for all style decisions.
- Existing logic remains intact; only the presentation layer is being refactored.
