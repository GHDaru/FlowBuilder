# Data Model: Node Editor UX Improvements

## UI Component State: Sidebar

The `Sidebar` component will require new state variables to manage the UX features:

```typescript
// Tracking copy feedback status
const [copiedPrompt, setCopiedPrompt] = useState(false);
const [copiedSchema, setCopiedSchema] = useState(false);

// Tracking modal visibility and context
const [expandedEditor, setExpandedEditor] = useState<{
  isOpen: boolean;
  field: 'prompt' | 'schema' | null;
  title: string;
  value: string;
}>({
  isOpen: false,
  field: null,
  title: '',
  value: ''
});
```

## UI Component State: ExpandedEditorModal

The modal needs to manage its own internal draft state so that edits are only applied when explicitly saved.

```typescript
interface ExpandedEditorModalProps {
  open: boolean;
  title: string;
  initialValue: string;
  onSave: (newValue: string) => void;
  onClose: () => void;
}

// Internal State
const [value, setValue] = useState(initialValue); // Syncs on mount/open
```
