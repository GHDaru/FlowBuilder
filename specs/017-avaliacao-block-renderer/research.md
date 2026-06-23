# Research: AvaliacaoBlock Component

## Decision 1: Component Decomposition
**Decision**: Split the implementation into three main functional areas:
1.  **Summary Layer (`ScoreCards.tsx`)**: Handles the horizontal cards and progress bars.
2.  **Audit Layer (`AuditTree.tsx`)**: Manages the recursive hierarchy and global expansion state.
3.  **Presentation Layer (`visualRules.ts`)**: Pure functions to map band names and NPS status to specific MUI colors/styles.
**Rationale**: The rendering logic for `avalia.consolidacao.v1` is complex. Decomposition ensures that UI changes (e.g., changing a color for "exemplar") are isolated from the tree traversal logic.

## Decision 2: Tree Implementation Strategy
**Decision**: Use a recursive functional component for `AuditTreeItem` rather than a flat list.
**Rationale**: The data is inherently hierarchical (4 levels). A recursive approach is cleaner and handles the variable number of dimensions and sub-axes naturally. Global state for "Expand all" will be controlled via a `boolean` flag or a `Map` of opened node IDs in the parent.

## Decision 3: Visualization of Rules
**Decision**: Rules in the tree will be displayed as "Rule Highlight Blocks" with a solid left border using the specified colors (`contexto`: blue, `piso_teto`: orange, `suspensao`: red).
**Rationale**: This visual pattern (commonly seen in code editors or citation blocks) effectively highlights the "reasoning" without adding visual clutter.
