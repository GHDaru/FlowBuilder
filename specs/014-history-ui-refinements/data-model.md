# Data Model: History UI Refinements

## Database Schema Updates (SQLite)

### Table: `trace_logs`
- Add column: `node_label` (String, nullable).

## Backend Schemas (`aitest/backend/models/schemas.py`)

### TraceLog (Pydantic)
```python
class TraceLog(BaseModel):
    # ... existing fields
    node_id: str
    node_label: Optional[str] = None # NEW
    prompt_sent: str
    # ... existing fields
```

## Internal APIs

### `log_callback` signature update
The internal logging callback used during flow execution needs to accept the label.

**Old**:
```python
def log_callback(track_id, node_id, prompt, raw, json_data, status, error=None, usage=None, model=None)
```

**New**:
```python
def log_callback(track_id, node_id, node_label, prompt, raw, json_data, status, error=None, usage=None, model=None)
```
