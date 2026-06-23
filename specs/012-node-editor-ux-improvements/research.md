# Research: Node Editor UX Improvements

## Decision 1: Copy to Clipboard Implementation
**Decision**: Use `navigator.clipboard.writeText(value)`.
**Rationale**: It is the modern web standard for interacting with the clipboard asynchronously. We will manage a local state (e.g., `copiedPrompt`, `copiedSchema`) in the `Sidebar` to provide visual feedback (swap icon to Check) for a short duration using `setTimeout`.
**Alternatives considered**: 
- `document.execCommand('copy')` (Rejected: deprecated).
- Third-party library like `copy-to-clipboard` (Rejected: unnecessary dependency for simple text).

## Decision 2: Expanded Editing Modal Component
**Decision**: Create a generic `ExpandedEditorModal` using MUI's `Dialog`.
**Rationale**: `Dialog` provides built-in accessibility, backdrop, and focus management. We can configure it to be `fullWidth` and `maxWidth="lg"` or `xl` to give the user maximum screen real estate.
**Alternatives considered**:
- Expanding the sidebar width (Rejected: would push the canvas too far, causing jarring layout shifts and still not providing enough vertical space).

## Decision 3: Keyboard Shortcuts for Modal
**Decision**: MUI `Dialog` natively handles closing on `Escape`. We will explicitly wire the "Save" action to a button, and potentially `Ctrl+Enter` to save and close for power users.
**Rationale**: Native MUI behavior covers the main requirement.
