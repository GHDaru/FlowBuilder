# API Contract: Lab Postgres Integration

## GET /official/firms
*Returns a list of accounting firms from the official database.*

### Response (200 OK)
```json
[
  {
    "id": "uuid",
    "name": "Firma Exemplo",
    "evaluation_count": 150
  }
]
```

## GET /official/firms/{id}/interactions
*Returns recent service interactions for a specific firm.*

### Response (200 OK)
```json
[
  {
    "id": 12345,
    "ticket_id": "TKT-001",
    "has_evaluation": true,
    "created_at": "2026-06-01T12:00:00Z"
  }
]
```

## POST /official/process
*Triggers processing of selected interactions using a specific flow.*

### Request
```json
{
  "flow_id": "uuid",
  "interaction_ids": [12345, 12346]
}
```

### Response (200 OK)
```json
{
  "execution_id": 99,
  "tracking_ids": ["uuid-1", "uuid-2"]
}
```
