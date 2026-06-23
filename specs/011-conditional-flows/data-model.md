# Data Model: Conditional Flows

## Frontend Node Data Structure

The `ConditionNode` in React Flow uses the following `data` object structure:

```typescript
interface ConditionRule {
  id: string; // e.g., "rule-1" (used as sourceHandle ID)
  variable: string; // The key from state.outputs to check
  operator: "equals" | "not_equals" | "contains";
  value: string; // The value to compare against
}

interface ConditionNodeData {
  label: string;
  rules: ConditionRule[];
}
```

## Backend Compiler Schema

The `GraphCompiler` will transform the React Flow JSON into a logical representation:

```python
{
    "id": "condition-1",
    "type": "condition",
    "title": "Verifica Status",
    "rules": [
        {
            "variable": "sentiment",
            "operator": "equals",
            "value": "positive",
            "targetHandle": "rule-1"
        }
    ],
    "targets": {
        "rule-1": "llm-2", # Next node if rule 1 is true
        "default": "llm-3" # Next node if no rules match
    }
}
```

## TraceLog Integration
When a condition node executes, it writes a `TraceLog`:
- `prompt_sent`: Stringified description of the evaluation (e.g., "Evaluating rules: `[{...}]` against state `{'sentiment': 'positive'}`")
- `response_raw`: The ID of the chosen target node (e.g., `"llm-2"`).
- `status`: "SUCCESS" or "ERROR".
