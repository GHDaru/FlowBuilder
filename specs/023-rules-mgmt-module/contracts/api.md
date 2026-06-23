# API Contract: Rules Management

## Rules CRUD

### GET /rules
List all active and inactive rules.

### POST /rules
Create a new rule.

### PUT /rules/{id}
Update an existing rule or toggle status.

### DELETE /rules/{id}
Remove a rule.

## Rule Generation (IA)

### POST /rules/generate/feedback
Generates a rule from transcript, evaluation, and feedback.

**Request Body**:
```json
{
  "transcript": "...",
  "avaliacao_dimensao": {...},
  "feedback_supervisor": "...",
  "atendimento_ref": "atd-123"
}
```

**Response `200 OK`**:
```json
{
  "name": "...",
  "text": "...",
  "dimension": "...",
  "scope": "...",
  "context": null
}
```

### POST /rules/generate/manual
Helps refine a manual rule description into a formal instruction.

**Request Body**:
```json
{
  "description": "Punish if the attendant says goodbye with a joke"
}
```

**Response `200 OK`**:
```json
{
  "name": "Joke detection on goodbye",
  "text": "If the transcript shows the attendant making a joke in the goodbye phase, decrease Communication score by 1."
}
```
