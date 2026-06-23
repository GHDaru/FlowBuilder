# Tasks: Node Editor UX Improvements

**Feature**: Node Editor UX Improvements
**Plan**: [specs/012-node-editor-ux-improvements/plan.md](plan.md)

## Implementation Strategy

We will focus purely on frontend React components. First, we will create the reusable `ExpandedEditorModal`. Then, we will integrate it into the `Sidebar` along with the copy-to-clipboard functionality.

1.  **Phase 1: Setup**: Check dependencies.
2.  **Phase 2: Expanded Editor (US2)**: Create the reusable modal component.
3.  **Phase 3: Sidebar Integration (US1 & US2)**: Add copy and expand buttons to the sidebar fields and wire them to state.
4.  **Phase 4: Polish**: Verify styling and functionality.

---

## Phase 1: Setup

- [x] T001 Verify `aitest/frontend/package.json` for React and MUI dependencies.

---

## Phase 2: User Story 2 - Expanded Editing View (P1)

**Story Goal**: Provide a spacious text editor containing the field's current value.
**Independent Test**: The modal opens, allows text editing, saves on confirm, and cancels on escape.

- [x] T002 [P] [US2] Create `ExpandedEditorModal.tsx` in `aitest/frontend/src/components/Common/ExpandedEditorModal.tsx` using MUI `Dialog`.

---

## Phase 3: User Story 1 & 2 - Sidebar Integration (P1)

**Story Goal**: Add copy and expand buttons to Prompt Template and JSON Schema fields.
**Independent Test**: Clicking copy adds to clipboard; clicking expand opens the modal.

- [x] T003 [US1] Add state variables for copy feedback and modal visibility in `aitest/frontend/src/components/Sidebar/Sidebar.tsx`.
- [x] T004 [US1] Implement `handleCopy` utility function in `Sidebar.tsx`.
- [x] T005 [US1] Add copy and expand action buttons to the "Prompt Template" header in `Sidebar.tsx`.
- [x] T006 [US1] Add copy and expand action buttons to the "JSON Schema (Output)" header in `Sidebar.tsx`.
- [x] T007 [US2] Render `ExpandedEditorModal` inside `Sidebar.tsx` and wire it to the state.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [x] T008 Run frontend build `npm run build` to verify no TypeScript regressions.

---

## Parallel Execution Opportunities

- T002 can be implemented completely independently of the Sidebar updates.

## Dependencies

1. T007 depends on T002 being completed.
