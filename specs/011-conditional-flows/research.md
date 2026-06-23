# Research: Conditional Flows

## Decision 1: LangGraph Routing Implementation
**Decision**: Use `workflow.add_conditional_edges(source_id, router_fn, mapping)`.
**Rationale**: This is the native, idiomatic way to handle non-linear logic in LangGraph. The `router_fn` will evaluate the state against the rules defined in the UI and return the ID of the next node.
**Alternatives considered**:
- Custom execution loop (Rejected: defeats the purpose of using LangGraph).

## Decision 2: Rule Evaluation Logic
**Decision**: Implement a simple string equality engine in Python for MVP. It will check if `str(state["outputs"].get(key)) == str(value)`.
**Rationale**: Meets the current requirements for checking exact statuses (e.g., "OK", "REPROVADO"). It keeps the frontend UI simple and the backend execution fast. Complex rules (Regex, >, <) can be added later.
**Alternatives considered**:
- Full rules engine library (Rejected: Over-engineering for the MVP scope).

## Decision 3: React Flow Handle Management
**Decision**: Render handles dynamically in `ConditionNode.tsx` based on the `rules` array in the node's data. Each rule gets a specific `source` handle ID (e.g., `rule-1`, `rule-2`), and a fallback `default` handle is always rendered.
**Rationale**: React Flow edges store the `sourceHandle` property, which allows the `GraphCompiler` to map which connection corresponds to which rule.
**Alternatives considered**:
- Single handle with edge data (Rejected: Harder to visualize in the UI).

## Decision 4: TraceLog Representation
**Decision**: The router function will execute the `log_callback` just like an LLM node, but with `prompt_sent` showing the evaluated rule and `response_json` showing the decision/next node.
**Rationale**: Provides seamless integration with the existing `History.tsx` UI without requiring database schema changes.
**Alternatives considered**:
- New table for routing logs (Rejected: Fragments the history view).
