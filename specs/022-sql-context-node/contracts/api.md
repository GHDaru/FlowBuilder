# API Contract: SQL Context Node

## POST /tools/sql/preview

Executes a SQL query against a specified database and returns the results formatted as JSON.

### Request Body
```json
{
  "database_type": "postgres",
  "connection_details": {
    "host": "localhost",
    "port": "5432",
    "user": "postgres",
    "password": "password123",
    "database": "my_db"
  },
  "sql_query": "SELECT id, name FROM users WHERE role = {{role}}",
  "variables": {
    "role": "admin"
  }
}
```

### Response `200 OK` (Success)
```json
{
  "success": true,
  "data": "[{\"id\": 1, \"name\": \"Admin User\"}]"
}
```

### Response `200 OK` (SQL Error / Connection Error)
*We return 200 OK because the preview endpoint successfully processed the request, but the underlying execution failed (this is useful for UI feedback).*
```json
{
  "success": false,
  "error": "connection to server at \"localhost\" failed: Connection refused"
}
```
