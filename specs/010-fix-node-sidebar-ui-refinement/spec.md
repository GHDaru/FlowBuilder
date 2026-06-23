# Feature Specification: Node Sidebar Fix & UI Refinement

**Feature Branch**: `010-fix-node-sidebar-ui-refinement`  
**Created**: 2026-06-02  
**Status**: Draft  
**Input**: User description: "Tem um bug. Quando é clicado no nó e a janela de Configurar Nó está aberta, ela não é atualizada. Outro ponto, que cada llm tem um motor (modelo de IA), este deveria vir como um badge na capa do nó. Outro ponto que os nós estão enormes. Nascer cerca de 70% do valor atual. Ao se criar um nó colocá-lo um pounco mais a direita do nó mais a direita, utilizando a âncora direita + alguma coisa."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reactive Node Configuration (Bug Fix) (Priority: P1)

As a Flow Builder, I want the "Configure Node" window to automatically refresh its content when I click on a different node, so that I can edit multiple nodes sequentially without manually closing and reopening the sidebar.

**Why this priority**: Corrects a functional bug that causes data confusion and friction.

**Acceptance Scenarios**:
1. **Given** the Sidebar is open for Node A, **When** I click on Node B, **Then** the Sidebar MUST immediately update its fields (label, prompt, model) to match Node B.

---

### User Story 2 - At-a-Glance Model Identification (Priority: P2)

As an IA Evaluator, I want to see the selected AI model (motor) as a badge on the node itself, so that I can quickly understand the flow's orchestration without opening every node's configuration.

**Why this priority**: Enhances visual clarity of the flow logic.

**Acceptance Scenarios**:
1. **Given** a Node with a selected model (e.g., "gpt-4o"), **When** viewing the canvas, **Then** a visible badge with the model ID MUST be displayed on the node's card.

---

### User Story 3 - Compact Node Design (Priority: P2)

As a Flow Builder, I want the nodes to be more compact (approx. 70% of current size), so that I can view larger and more complex flows within the workspace without excessive zooming.

**Why this priority**: Improves overall workspace visibility.

**Acceptance Scenarios**:
1. **Given** the current node dimensions, **When** rendered on the canvas, **Then** the width and padding SHOULD be reduced by approximately 30%.

---

### User Story 4 - Intelligent Node Positioning (Priority: P3)

As a Flow Builder, I want newly created nodes to be positioned automatically to the right of existing nodes, so that the flow grows naturally in the expected horizontal direction.

**Why this priority**: Reduces manual positioning effort when building linear flows.

**Acceptance Scenarios**:
1. **Given** an existing flow, **When** I add a new node, **Then** its initial position MUST be calculated to the right of the rightmost existing node (relative to its right anchor).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Implement `useEffect` or state reset logic in the `Sidebar` component to react to `selectedNode` ID changes.
- **FR-002**: Add a `Chip` or `Badge` component to `CustomLLMNode.tsx` to display `data.model_id`.
- **FR-003**: Update CSS/MUI styles in `CustomLLMNode.tsx` and `StartNode.tsx` to reduce width and padding to ~70% of current values.
- **FR-004**: Implement positioning logic in `FlowBuilder.tsx` to calculate coordinates for new nodes based on the current rightmost node's position.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero lag when switching between node configurations in the sidebar.
- **SC-002**: Model information is readable on all LLM nodes at 100% zoom level.
- **SC-003**: New nodes appear with at least 50px of horizontal spacing from the previous rightmost node.

## Assumptions

- We will maintain the existing Dark Theme aesthetics.
- The 70% reduction applies mainly to containers and spacing; font sizes will be adjusted only if necessary for readability.
