# Data Model: Execution History Enhancements

## Database Schema Updates (SQLite)

### Table: `trackings`
- Add column: `finished_at` (DateTime, nullable).
- Add column: `total_duration_ms` (Integer, nullable).
- Add column: `flow_name` (String, nullable) - Cached from the `Flow` table.
- Add column: `metadata_json` (Text, nullable) - Stores Firm, Client, Attendant for quick header display.

### Table: `trace_logs`
- Add column: `duration_ms` (Integer, nullable).

## Backend Schemas (`aitest/backend/models/schemas.py`)

### Tracking (Pydantic)
```python
class Tracking(BaseModel):
    # ... existing fields
    finished_at: Optional[datetime] = None
    total_duration_ms: Optional[int] = None
    flow_name: Optional[str] = None
    metadata_json: Optional[str] = None
```

### TraceLog (Pydantic)
```python
class TraceLog(BaseModel):
    # ... existing fields
    duration_ms: Optional[int] = None
```

## Internal API Updates

### `log_callback` signature
```python
def log_callback(track_id, node_id, node_label, prompt, raw, json_data, status, duration_ms, error=None, usage=None, model=None)
```
- Added `duration_ms` to the parameters.
