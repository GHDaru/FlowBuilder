# Quickstart: UI Refactoring

## Design Implementation Guide

### 1. Theming
All colors must be derived from `theme.palette`. Avoid hardcoded HEX values in components.
```tsx
sx={{ color: 'primary.main', bgcolor: 'background.paper' }}
```

### 2. Spacing
Use the 8px base spacing.
- Small: `p: 1` (8px)
- Medium: `p: 2` (16px)
- Large: `p: 4` (32px)

### 3. Sidebar Toggle
The sidebar can be toggled via the chevron button at the bottom left.
- **Persistent**: The state is saved in the browser.
- **Mini-view**: Labels are hidden, but tooltips provide context.

### 4. Table Standards
Use `size="small"` for data-heavy management views.
```tsx
<Table size="small">
  <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
    ...
  </TableHead>
</Table>
```
