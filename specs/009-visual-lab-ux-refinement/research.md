# Research: Visual Lab UX/UI Refinement

## Decision 1: Contextual Node Actions (NodeToolbar)
**Decision**: Use the native `NodeToolbar` component from `reactflow`.
**Rationale**: It handles positioning and visibility relative to node selection automatically. It is more robust than a custom absolute-positioned div.
**Alternatives considered**: 
- Custom overlay (Rejected: hard to maintain alignment during zoom/pan).

## Decision 2: Global Keyboard Shortcuts
**Decision**: Use `window.addEventListener('keydown', ...)` within a custom hook or the main `FlowBuilder` component.
**Rationale**: For simple shortcuts like `Ctrl+S`, native listeners are lightweight and sufficient.
**Alternatives considered**:
- `react-hotkeys-hook` (Rejected: avoids adding a new dependency if native is enough).

## Decision 3: JSON Import/Export
**Decision**: Implement browser-side JSON parsing and `Blob` generation.
**Rationale**: Allows for instant export without backend roundtrips. Import will use the existing `POST /flows` endpoint but will be client-driven.
**Alternatives considered**:
- Backend-generated export (Rejected: unnecessary complexity).

## Decision 4: Inline Renaming
**Decision**: Use a simple conditional render (`input` vs `span`) in the header.
**Rationale**: High-fidelity visual control. Aligns with Flowise.
**Alternatives considered**:
- MUI `Editable` text components (Rejected: standard HTML input gives better styling control for this specific design).
