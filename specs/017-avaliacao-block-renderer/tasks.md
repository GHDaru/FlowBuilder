# Tasks: AvaliacaoBlock Component

**Feature**: AvaliacaoBlock Component
**Plan**: [specs/017-avaliacao-block-renderer/plan.md](plan.md)

## Implementation Strategy

We will build the component using a modular approach within a dedicated sub-folder. We'll start with the utility functions for visual rules, followed by the summary cards, then the complex recursive audit tree, and finally integrate it into the History screen.

1.  **Phase 1: Setup**: Scaffolding the folder structure.
2.  **Phase 2: Visual Utilities (Rules)**: Implement color mappings.
3.  **Phase 3: Score Cards (US1)**: Summary and Dimension cards.
4.  **Phase 4: Audit Tree (US2)**: Recursive tree with global controls.
5.  **Phase 5: Integration**: Connect to `History.tsx`.
6.  **Phase 6: Polish**: Final visual adjustments.

---

## Phase 1: Setup

- [x] T001 Create directory `aitest/frontend/src/components/History/AvaliacaoBlock`.
- [x] T002 Create directory `aitest/frontend/src/components/History/AvaliacaoBlock/utils`.

---

## Phase 2: Visual Utilities (Rules)

**Story Goal**: Centralize mapping of bands and NPS status to colors.

- [x] T003 [P] Create `aitest/frontend/src/components/History/AvaliacaoBlock/utils/visualRules.ts` with helper functions for band colors, NPS colors, and rule border colors.

---

## Phase 3: User Story 1 - Score Cards (P1)

**Story Goal**: Render the summary and dimension cards with mini-bars.

- [x] T004 [P] [US1] Create `aitest/frontend/src/components/History/AvaliacaoBlock/ScoreCards.tsx`.
- [x] T005 [US1] Implement the Main Score card with band badge and overall summary.
- [x] T006 [US1] Implement the Attendant Trail dimension cards with sub-axis mini-bars.
- [x] T007 [US1] Implement the Client Trail perception and emotional signal cards.

---

## Phase 4: User Story 2 - Audit Tree (P1)

**Story Goal**: Implement the deep, recursive audit tree.

- [x] T008 [P] [US2] Create `aitest/frontend/src/components/History/AvaliacaoBlock/AuditTree.tsx`.
- [x] T009 [US2] Implement the recursive `AuditTreeItem` component with expansion logic.
- [x] T010 [US2] Implement global "Expand All" and "Collapse All" controls.
- [x] T011 [US2] Implement detailed view for Sub-axis (Level 3) including rule highlight blocks.

---

## Phase 5: Integration & Conditional Blocks

**Story Goal**: Connect the block to the history detail view and handle conditional elements.

- [x] T012 [P] Create `aitest/frontend/src/components/History/AvaliacaoBlock/AvaliacaoBlock.tsx` as the main entry point combining cards and tree.
- [x] T013 [US1] Implement conditional rendering for "Oportunidade de Melhoria" and "Marcadores Críticos".
- [x] T014 [US1] Implement conditional rendering for dimension evidence lists with polarity.
- [x] T015 Update `aitest/frontend/src/components/History/History.tsx` to render `AvaliacaoBlock` when a consolidation log is detected.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T016 [P] Run `npm run build` in the frontend to verify type safety.
- [x] T017 Verify visual alignment and spacing against the professional tone requirement.

---

## Parallel Execution Opportunities

- T003, T004, and T008 can be started simultaneously as they are in different files.
- Integration (Phase 5) can start as soon as the main container and utilities are ready, even if sub-components are partially mocked.

## Dependencies

1. Phase 1 must be completed before any other T-tasks.
2. T012 depends on T004 and T008.
3. T015 depends on T012.
