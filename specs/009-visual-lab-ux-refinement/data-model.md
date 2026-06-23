# Data Model: Visual Lab UX/UI Refinement

## Exported JSON Structure

The exported file will be a `.json` file containing the full flow definition.

```json
{
  "name": "Flow Name",
  "version": "1.0",
  "exportedAt": "2026-06-02T00:00:00Z",
  "nodes": [],
  "edges": [],
  "settings": {
    "theme": "dark"
  }
}
```

## Validation Rules
- **Import**: The system MUST validate that the JSON contains `nodes` and `edges` arrays.
- **Renaming**: Flow names MUST NOT be empty strings.

## State Management
- **selectedNodeId**: tracks which node is currently active to show the `NodeToolbar`.
- **isCodePanelOpen**: tracks visibility of the code drawer.
- **isEditingName**: tracks the inline renaming state.
