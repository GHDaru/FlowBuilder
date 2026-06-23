# Data Model: rules-mgmt-module

## Entities

### Rule (Aggregate Root)
Represents a scoring instruction for the AI.

- `id`: string (UUID)
- `name`: string
- `text`: string (IA instruction)
- `dimension`: string (e.g., 'comunicacao_clareza', 'todas')
- `scope`: string ('global' | 'especifico')
- `context`: string (nullable, office/attendant ID)
- `is_active`: boolean
- `origin`: object
    - `type`: string ('manual' | 'feedback')
    - `atendimento_ref`: string (optional)
    - `feedback_original`: string (optional)
- `created_at`: datetime

## Persistence (SQLite)
The `Rule` entity maps to the `rules` table in `audit.db`.

## Backup Structure
Backups will be stored as JSON arrays:
```json
{
  "rules": [...],
  "flows": [...]
}
```
In `aitest/backend/data/backups/latest_backup.json`.
