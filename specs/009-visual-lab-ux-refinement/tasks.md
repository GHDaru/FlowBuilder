# Tasks: Visual Lab UX/UI Refinement

**Feature**: Visual Lab UX/UI Refinement
**Plan**: [specs/009-visual-lab-ux-refinement/plan.md](plan.md)

## Implementation Strategy

We will focus on the Frontend improvements, starting with the header reorganization and contextual actions, then moving to the code panel and floating addition, and finally the import/export functionality.

1.  **Phase 1: Setup & Foundational**: Verify dependencies and environment.
2.  **Phase 2: Header & Inline Editing (US2)**: Move actions to header and implement inline flow renaming.
3.  **Phase 3: Contextual Actions (US1)**: Implement `NodeToolbar` for quick node deletion and duplication.
4.  **Phase 4: Code Panel & Shortcuts (US4)**: Create the code drawer and register keyboard shortcuts.
5.  **Phase 6: Import/Export (US3)**: Add JSON file manipulation to the main list.
6.  **Phase 7: Polish**: Final UI adjustments and verification.

---

## Phase 1: Setup

- [x] T001 Verify `npm` dependencies (`reactflow`, `@mui/material`) in `aitest/frontend/package.json`

---

## Phase 2: User Story 2 - Editor Header & Inline Editing (P1)

**Story Goal**: Centralize actions in the header and allow inline flow renaming.
**Independent Test**: Flow name is editable in header; Save/Save As are moved to top-right.

- [x] T002 [P] [US2] Update `flowService.ts` to support renaming an existing flow in `aitest/frontend/src/services/flowService.ts`
- [x] T003 [US2] Refactor `FlowBuilder.tsx` to include a new Header component with inline editing in `aitest/frontend/src/components/FlowBuilder/FlowBuilder.tsx`
- [x] T004 [US2] Move "Save" and "Save As" buttons from `FlowActions.tsx` to the new Header in `aitest/frontend/src/components/FlowBuilder/FlowBuilder.tsx`

---

## Phase 3: User Story 1 - Contextual Node Actions (P1)

**Story Goal**: Quick actions (delete/duplicate) available directly on selected nodes.
**Independent Test**: Selecting a node shows a toolbar; clicking delete removes it.

- [x] T005 [P] [US1] Create `NodeToolbar.tsx` component using `reactflow` in `aitest/frontend/src/components/FlowBuilder/NodeToolbar.tsx`
- [x] T006 [US1] Integrate `NodeToolbar` into `CustomLLMNode.tsx` in `aitest/frontend/src/components/FlowBuilder/CustomLLMNode.tsx`
- [x] T007 [US1] Integrate `NodeToolbar` into `StartNode.tsx` in `aitest/frontend/src/components/FlowBuilder/StartNode.tsx`

---

## Phase 4: User Story 4 - Code Panel & Shortcuts (P2)

**Story Goal**: JSON view/copy/download and keyboard shortcuts.
**Independent Test**: `</>` opens panel; `Ctrl+S` triggers save.

- [x] T008 [P] [US4] Create `CodePanel.tsx` (MUI Drawer) for JSON interaction in `aitest/frontend/src/components/FlowBuilder/CodePanel.tsx`
- [x] T009 [US4] Implement keyboard shortcut listener (Ctrl+S, Ctrl+Shift+S) in `FlowBuilder.tsx` in `aitest/frontend/src/components/FlowBuilder/FlowBuilder.tsx`

---

## Phase 5: User Story 4 - Floating Node Addition (P2)

**Story Goal**: Replace top-menu "Add Node" with a floating button.
**Independent Test**: Floating `+` button opens node discovery UI.

- [x] T010 [US4] Remove "Add Node" from `FlowActions.tsx` in `aitest/frontend/src/components/Toolbar/FlowActions.tsx`
- [x] T011 [US4] Add Floating Action Button (FAB) for node addition in `FlowBuilder.tsx` in `aitest/frontend/src/components/FlowBuilder/FlowBuilder.tsx`

---

## Phase 6: User Story 3 - Import and Export (P2)

**Story Goal**: JSON file backup and restore from main list.
**Independent Test**: Exporting flow downloads JSON; importing creates a new flow.

- [x] T012 [P] [US3] Implement `handleExportFlow` utility in `aitest/frontend/src/utils/flowUtils.ts`
- [x] T013 [US3] Add "Export" button to flow cards in `aitest/frontend/src/components/FlowBuilder/FlowListView.tsx`
- [x] T014 [US3] Add "Import Flow" upload button to header in `aitest/frontend/src/components/FlowBuilder/FlowListView.tsx`

---

## Phase 7: Polish & Verification

- [x] T015 Verify visual alignment and spacing across all new components
- [x] T016 Run frontend build `npm run build` to ensure no type regressions
- [x] T017 [P] Update local `GEMINI.md` documentation in `aitest/frontend/`

---

## Parallel Execution Opportunities

- T002 and T005 (Service update and new UI component)
- T008 and T012 (Drawer UI and Utility logic)
- T017 (Documentation)

## Dependencies

1. Phase 2 SHOULD be completed before Phase 5 (header layout shift).
2. Phase 3 MUST be completed before node-specific testing.
3. Phase 6 requires `flowService.ts` updates if not already handled by T002.
