# Tasks: ui-refactor-material

**Input**: Design documents from `/specs/024-ui-refactor-material/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Implementation Strategy
We will implement the centralized theme first to establish the visual baseline. Then, we will refactor the core layout (Sidebar) to provide immediate usability benefits. Finally, we will sweep through all management screens to standardize them against the new Material 3 standard.

## Phase 1: Setup (Shared Infrastructure)
- [x] T001 [P] Create `aitest/frontend/src/theme/materialTheme.ts` with Antigravity tokens
- [x] T002 Update `aitest/frontend/src/App.tsx` to use the new centralized theme

## Phase 2: Foundational (Navigation Refactor)
- [x] T003 [P] Create `aitest/frontend/src/components/Navigation/Sidebar.tsx` as a standalone component
- [x] T004 Refactor `App.tsx` to use the new `Sidebar` component instead of inline Drawer
- [x] T005 [P] Create `SidebarContext.tsx` or similar to manage `collapsed` state globally if needed

## Phase 3: User Story 1 - Collapsible Sidebar (Priority: P1) 🎯 MVP
**Goal**: Allow toggling sidebar width with persistence.
**Independent Test**: Click toggle and refresh page; state must persist.

- [x] T006 [US1] Implement toggle button and transition logic in `Sidebar.tsx`
- [x] T007 [US1] Add `localStorage` persistence for the `collapsed` state
- [x] T008 [P] [US1] Add tooltips to all navigation icons for the collapsed state

## Phase 4: User Story 2 - Material Design Consistency (Priority: P1)
**Goal**: Apply visual baseline across all components.
**Independent Test**: Visual audit of buttons, backgrounds, and fonts.

- [x] T009 [US2] Globally update fonts to Inter and Roboto in the theme
- [x] T010 [US2] Standardize all `Paper` and `Card` components with consistent elevation and border-radius (16px)
- [x] T011 [US2] Update `RulesTable.tsx` to use the new primary color and spacing

## Phase 5: User Story 3 - Refined Screen Objects (Priority: P2)
**Goal**: Clean up data-heavy views and forms.
**Independent Test**: Hover rows in Rules table and check form focus states.

- [x] T012 [US3] Refactor `RuleForm.tsx` with Material 3 input styling and better grouping
- [x] T013 [US3] Improve `History.tsx` TraceLog layout with refined spacing and typography
- [x] T014 [US3] Update `FirmList.tsx` and `AtendimentoPicker.tsx` to match the new visual standard

## Phase 6: Polish & Cross-Cutting Concerns
- [x] T015 Performance: Ensure smooth transition animations for the sidebar
- [x] T016 Accessibility: Verify keyboard navigation through the new sidebar
- [x] T017 [P] Update documentation (README.md, specs, plans) to reflect the final implementation (MANDATED BY CONSTITUTION)
- [x] T018 [NEW] Implement dynamic Light/Dark mode switching with persistence
