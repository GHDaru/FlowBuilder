# Feature Specification: Visual Lab UX/UI Refinement

**Feature Branch**: `009-visual-lab-ux-refinement`  
**Created**: 2026-06-02  
**Status**: Draft  
**Input**: User description: (UX/UI improvements for the Visual Flow Editor based on Flowise reference, including contextual node toolbar, header repositioning, inline renaming, code export, FAB for adding nodes, and import/export on main list).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Contextual Node Actions (Priority: P1)

As a Flow Builder, I want to see a toolbar with common actions when I select a node so that I can quickly duplicate or delete it without using a separate menu.

**Why this priority**: Core interaction improvement. Reduces mouse travel and friction.

**Acceptance Scenarios**:
1. **Given** the flow editor, **When** I click on a node, **Then** a toolbar MUST appear above the node with "Duplicate", "Delete", and "Info" icons.
2. **Given** the contextual toolbar, **When** I click "Delete", **Then** the node MUST be removed from the canvas.

---

### User Story 2 - Editor Header Reorganization (Priority: P1)

As a Flow Builder, I want my saving and configuration controls in the top right and my flow name in the top left so that the interface aligns with industry-standard flow editors (like Flowise).

**Why this priority**: Essential for a professional feel and intuitive navigation.

**Acceptance Scenarios**:
1. **Given** the editor, **When** I look at the top right, **Then** I MUST see buttons for "Save", "Save As", "View Code", and "Settings".
2. **Given** the top left header, **When** I see the flow name, **Then** clicking it or the pencil icon MUST turn it into an editable text input.
3. **Given** the flow name input, **When** I press "Enter" or click away, **Then** the flow MUST be renamed.

---

### User Story 3 - Flow Import and Export (Priority: P2)

As an IA Evaluator, I want to download my flows as JSON files and upload existing JSON files as new flows so that I can share configurations and maintain backups.

**Why this priority**: Critical for collaboration and portability between environments.

**Independent Test**: Export a flow to a JSON file, delete it from the system, and successfully import it back from the file.

**Acceptance Scenarios**:
1. **Given** the main flow list, **When** I click "Import Flow", **Then** I should be able to select a `.json` file and have it added as a new flow.
2. **Given** an existing flow card, **When** I click "Export", **Then** a `.json` file containing the flow definition MUST be downloaded.

---

### User Story 4 - Floating Node Addition (Priority: P2)

As a Flow Builder, I want to add new nodes via a floating button or a side panel rather than a top menu button so that the workspace feels more open.

**Why this priority**: UX refinement to clean up the primary header space.

**Acceptance Scenarios**:
1. **Given** the editor canvas, **When** I look for the "Add Node" button, **Then** it MUST NOT be in the top left header.
2. **Given** a floating `+` button on the left of the canvas, **When** I click it, **Then** a panel or menu of available nodes MUST appear.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Implementation of `NodeToolbar` (React Flow component) for all node types.
- **FR-002**: Move "Save" and "Save As" actions from the sidebar/bottom to the editor header (top right).
- **FR-003**: Implement inline editing for flow names in the header with pencil icon and visual feedback on hover.
- **FR-004**: Create a "Code Panel" (Drawer/Modal) accessible via `</>` button in the header, supporting JSON copying and downloading.
- **FR-005**: Remove "Add Node" button from the header and implement a Floating Action Button (FAB) or left-aligned floating button for node discovery.
- **FR-006**: Add "Import" (File Upload) and "Export" (JSON Download) buttons to the main Flow List UI.
- **FR-007**: Support `Ctrl+S` (Save) and `Ctrl+Shift+S` (Save As) keyboard shortcuts in the editor.

### Key Entities *(include if feature involves data)*

- **Flow**: The JSON structure exported MUST be compatible with the current database schema (`json_definition`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: "Save" action is accessible within 1 click from any view state in the editor.
- **SC-002**: 100% of exported flows can be successfully re-imported without data loss.
- **SC-003**: Node deletion via contextual toolbar requires 50% fewer clicks than the previous sidebar-only method.

## Assumptions

- We will use standard React Flow components (`NodeToolbar`) where possible.
- MUI (Material UI) will be used for the Code Panel (Drawer) and icons for consistency.
- No changes to the backend API are required, as the existing flow storage already supports arbitrary JSON.
