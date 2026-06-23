# Research: Enhanced Variable Syntax

## Decision 1: Variable Resolution Logic
**Decision**: Implement a recursive path resolver in `VariableResolver.resolve(data, path)`.
**Rationale**: Native Python doesn't have a built-in for deep path resolution strings like "a.b.c" (unlike JavaScript's optional chaining or libraries like `pydash`). A custom resolver allows us to handle both dictionary keys and potentially object attributes if the state evolves.
**Implementation Detail**: 
- `resolve({"a": {"b": 1}}, "a.b")` -> `1`.
- If path starts or ends with `{{}}`, they will be stripped before resolution.

## Decision 2: Legacy Support
**Decision**: The resolver will first attempt to find a key matching the exact string (to support legacy variables with dots in the key name, if any), then fall back to nested resolution.
**Rationale**: Ensures backward compatibility with existing flows that might use non-standard naming conventions.

## Decision 3: Default Values for Missing Keys
**Decision**: If a path cannot be resolved, return an empty string `""` for prompt injection and `None` for routing logic.
**Rationale**: Prevents LLM crashes due to `NoneType` string formatting and provides a falsy value for routers.
