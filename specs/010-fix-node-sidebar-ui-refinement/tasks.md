# Tasks: Node Sidebar Fix & UI Refinement

**Feature**: Node Sidebar Fix & UI Refinement
**Plan**: [specs/010-fix-node-sidebar-ui-refinement/plan.md](plan.md)

## Implementation Strategy

We will follow an incremental approach starting with the critical bug fix, followed by UI component updates for size and badges, and concluding with the auto-positioning logic.

1.  **Phase 1: Bug Fix (US1)**: Fix the sidebar reactivity.
2.  **Phase 2: Node Design (US2 & US3)**: Update node components for model badges and compact design.
3.  **Phase 3: Positioning (US4)**: Implement new node coordinate calculation.
4.  **Phase 4: Polish**: Verify visual consistency.

---

## Phase 1: Bug Fix - Reactive Sidebar (P1)

**Story Goal**: Ensure Sidebar content updates when a different node is clicked.
**Independent Test**: Open Sidebar for Node A, click Node B, verify Sidebar content matches Node B.

- [x] T001 [US1] Implement `useEffect` with `selectedNode.id` as dependency to reset local state in `aitest/frontend/src/components/Sidebar/Sidebar.tsx`

---

## Phase 2: Node Design Refinement (P1)

**Story Goal**: Reduce node size and add model badges.
**Independent Test**: Nodes occupy ~30% less space; LLM nodes show a chip with the model ID.

- [x] T002 [P] [US3] Reduce `width` and `padding` in `CustomLLMNode.tsx` styles in `aitest/frontend/src/components/FlowBuilder/CustomLLMNode.tsx`
- [x] T003 [P] [US3] Reduce `width` and `padding` in `StartNode.tsx` styles in `aitest/frontend/src/components/FlowBuilder/StartNode.tsx`
- [x] T004 [US2] Add MUI `Chip` to display `data.model_id` in `CustomLLMNode.tsx` in `aitest/frontend/src/components/FlowBuilder/CustomLLMNode.tsx`

---

## Phase 3: Intelligent Positioning (P2)

**Story Goal**: Automatically position new nodes to the right of the existing flow.
**Independent Test**: Add node, verify it appears to the right of the rightmost node.

- [x] T005 [US4] Implement `calculateNewNodePosition` utility logic in `FlowBuilder.tsx` in `aitest/frontend/src/components/FlowBuilder/FlowBuilder.tsx`
- [x] T006 [US4] Update `onAddNode` callback to use calculated coordinates in `aitest/frontend/src/components/FlowBuilder/FlowBuilder.tsx`

---

## Phase 4: Polish & Verification

- [x] T007 Verify visual alignment of model badges across different zoom levels
- [x] T008 Run frontend build `npm run build` to verify no regressions
- [x] T009 [P] Update local `GEMINI.md` documentation if any UI conventions changed

---

## Parallel Execution Opportunities

- T002 and T003 (Different node components)
- T009 (Documentation)

## Dependencies

1. T001 (Bug fix) is independent.
2. T006 (Positioning) depends on T005 logic.
3. T004 (Badge) should ideally follow T002 (Size reduction) to ensure spacing is correct.
