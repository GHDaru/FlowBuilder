# Feature Specification: Node Editor UX Improvements

**Feature Branch**: `012-node-editor-ux-improvements`  
**Created**: 2026-06-02  
**Status**: Draft  
**Input**: User description: "Eu como construtor de nó do tipo LLM, desejo poder copiar o prompt template do nó (não aparece uma opção de copiar) e no json schema(output) também. Também gostaria de editar o texto, mas é muito pequeno a caixa atual. Precisaria que fosse expandida."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quick Copy for Prompts and Schemas (Priority: P1)

As a Flow Builder, I want a quick way to copy the full content of the "Prompt Template" and "JSON Schema" fields without manually selecting all text, so that I can easily move configurations between nodes or external tools.

**Why this priority**: Directly solves a reported friction point in the user's daily workflow.

**Acceptance Scenarios**:
1. **Given** the node configuration sidebar, **When** I look at the "Prompt Template" or "JSON Schema" fields, **Then** I MUST see a dedicated "Copy" icon/button associated with each field.
2. **Given** the "Copy" button, **When** I click it, **Then** the entire content of the respective field MUST be copied to my clipboard, and a brief visual confirmation (e.g., icon change to a checkmark) MUST appear.

---

### User Story 2 - Expanded Editing View (Priority: P1)

As a Flow Builder, I want to be able to expand the text boxes for "Prompt Template" and "JSON Schema", so that I can comfortably edit large prompts and complex schemas without being constrained by the narrow sidebar.

**Why this priority**: Solves a major usability issue when dealing with realistic, long LLM instructions.

**Acceptance Scenarios**:
1. **Given** the node configuration sidebar, **When** I look at the text fields, **Then** I MUST see an "Expand/Maximize" icon/button.
2. **Given** the "Expand" button, **When** I click it, **Then** a large modal or full-screen overlay MUST open, providing a spacious text editor containing the field's current value.
3. **Given** the expanded editor, **When** I make changes and click "Save/Apply", **Then** the modal MUST close and the new text MUST reflect in the sidebar field.
4. **Given** the expanded editor, **When** I press the `Escape` key, **Then** the modal MUST close without saving any pending changes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Add a "Copy" (`ContentCopy` icon) action button near the labels of the `prompt` and `schema` text fields in `Sidebar.tsx`.
- **FR-002**: Implement clipboard write logic providing visual feedback (icon swap to `Check` for 2 seconds) upon successful copy.
- **FR-003**: Add an "Expand" (`OpenInFull` or similar icon) action button near the labels of the `prompt` and `schema` text fields.
- **FR-004**: Create a reusable Modal/Dialog component (`ExpandedEditorModal`) for full-screen or large-scale text editing.
- **FR-005**: The `ExpandedEditorModal` MUST support saving changes back to the parent state and canceling via UI buttons or keyboard shortcuts (Escape).

### Key Entities *(include if feature involves data)*

- None (Purely UI/UX enhancements on existing fields).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Content can be copied to the clipboard with exactly 1 click.
- **SC-002**: The expanded editor provides at least 3x the visible editing area (height/width) compared to the standard sidebar `TextField` rows limit.

## Assumptions

- The expanded editor will use the standard MUI `TextField` (multiline) internally for simplicity, rather than introducing a heavy third-party code editor like Monaco/CodeMirror for now.
- Copy functionality requires a secure context (HTTPS or localhost) due to browser clipboard API restrictions.
