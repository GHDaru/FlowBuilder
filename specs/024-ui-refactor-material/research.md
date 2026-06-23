# Research: ui-refactor-material

## Decision: MUI Theme Provider Integration
We will refactor the existing `darkTheme` in `App.tsx` into a separate configuration file to handle the specific Material tokens. This will include customizing the `MuiButton`, `MuiTable`, and `MuiPaper` components to default to the Antigravity style.

- **File**: `aitest/frontend/src/theme/materialTheme.ts`

## Decision: Sidebar Collapsible Logic
The sidebar state will be managed using a `useState` hook in `App.tsx` but persisted in `localStorage`. We will use CSS `transition` for the width property. To avoid flickering of text during transition, we will use `overflow: hidden` and `white-space: nowrap` on labels.

- **Component**: Refactor `App.tsx` sidebar into a new `components/Navigation/Sidebar.tsx` for cleaner separation.

## Decision: Component Standardization
We will perform a sweep across all management components:
1. **Rules Management**: Update `RulesTable.tsx` and `RuleForm.tsx` to use the new spacing and color tokens.
2. **Official Data**: Standardize `FirmList.tsx` and `AtendimentoPicker.tsx`.
3. **History**: Improve TraceLog visualization using Material 3 layering.

## Alternatives Considered
- **Tailwind CSS**: Rejected. The project is already committed to Material UI (MUI), and using Tailwind alongside MUI would increase bundle size and complexity unnecessarily.
- **Global Store (Redux/Zustand) for Sidebar**: Rejected for now. `localStorage` + simple state is enough for a single UI preference.
