# Data Model: Enhanced Variable Syntax

## Entity Updates

### ConditionRule (Value Object)
- **variable**: Now supports strings wrapped in `{{}}` or plain paths (e.g., `{{meta.id}}` or `meta.id`).

## Domain Services

### VariableResolver
- `resolve(state: dict, path: str) -> Any`: The core logic to traverse the state dictionary.
- `extract_variable_names(text: str) -> List[str]`: Utility to find all `{{}}` patterns in a prompt template.
