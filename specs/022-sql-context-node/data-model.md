# Data Model: sql-context-node

## Entities

### SqlNodeData (Extension of Flow Node Data)
Data payload stored within the React Flow node definition when `type === 'sql'`.

- `database_type`: string (Enum: 'postgres', 'sqlite')
- `connection_details`: object
  - `host`: string (postgres only)
  - `port`: string (postgres only)
  - `user`: string (postgres only)
  - `password`: string (postgres only)
  - `database`: string (postgres only)
  - `file_path`: string (sqlite only)
- `sql_query`: string (The raw SQL query containing `{{variables}}`)

### SqlPreviewRequest
DTO for the backend preview endpoint.

- `database_type`: string
- `connection_details`: dict
- `sql_query`: string
- `variables`: dict (Key-value pairs for the variables found in the query to be used during the preview execution)

### SqlPreviewResponse
DTO for the result.

- `success`: boolean
- `data`: string (JSON stringified array of dicts representing the rows)
- `error`: string (Optional error message)
