# Research: Node Sidebar Fix & UI Refinement

## Decision 1: Reactive Sidebar Content
**Decision**: Use `useEffect` with `selectedNode.id` as a dependency in `Sidebar.tsx`.
**Rationale**: The current implementation likely initializes state only on mount. By adding a dependency on the node ID, we can force the internal state (title, prompt, model) to reset whenever the selection changes.
**Alternatives considered**: 
- Lifting state to `FlowBuilder` (Rejected: makes Sidebar less encapsulated).

## Decision 2: Node Dimensions Reduction
**Decision**: Reduce `width` from 200px to ~140px and scale padding accordingly.
**Rationale**: A 30% reduction maintains readability while significantly clearing canvas space.
**Alternatives considered**:
- Scale transform (Rejected: makes interaction/selection regions brittle).

## Decision 3: New Node Positioning Logic
**Decision**: Calculate `x = max(nodes.x) + width + spacing` and `y = avg(nodes.y)`.
**Rationale**: This ensures new nodes are always visible and placed in the logical "next step" area of the flow.
**Alternatives considered**:
- Relative to selected node (Rejected: fails if no node is selected).
