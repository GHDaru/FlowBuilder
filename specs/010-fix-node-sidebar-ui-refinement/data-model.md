# Data Model: Node Sidebar Fix & UI Refinement

## UI State Logic

### Sidebar Component
- **Trigger**: Selection change (Node ID).
- **Effect**: Reset internal fields (`title`, `prompt`, `schema`, `selectedModel`) using new node data.

### Node Positioning
- **Input**: Current `nodes` array.
- **Output**: `{ x: number, y: number }` for the new node.
- **Logic**: 
    1. Find `rightmostX = max(n.position.x + nodeWidth)`.
    2. Set `newX = rightmostX + horizontalPadding`.
    3. Set `newY` based on the average Y of current nodes to keep it centered.

## Components Update

### CustomLLMNode
- New Field: `data.model_id` (rendered as MUI Chip).
- Style: `width` reduced by 30%.

### StartNode
- Style: `width` and `padding` reduced by 30%.
