# Data Model: Official Data Metrics and Scores

## Backend Schema Updates

### OfficialAtendimento (SQLAlchemy Model)
Ensure these columns from the `atendimentos` table are mapped:
- `nota_media`: Numeric(5,2) -> Float
- `nota_comunicacao`: Numeric(5,2) -> Float
- `nota_profissionalismo`: Numeric(5,2) -> Float
- `nota_resolucao`: Numeric(5,2) -> Float

### OfficialInteraction (Pydantic DTO)
Updated to transfer the scores to the frontend:
```python
class OfficialInteraction(BaseModel):
    id: int
    ticket_id: str
    has_evaluation: bool
    created_at: Optional[datetime]
    nota_media: Optional[float] = None
    nota_comunicacao: Optional[float] = None
    nota_profissionalismo: Optional[float] = None
    nota_resolucao: Optional[float] = None
```

## Frontend Interfaces

### OfficialInteraction (TypeScript)
```typescript
export interface OfficialInteraction {
  id: number;
  ticket_id: string;
  has_evaluation: boolean;
  created_at: string;
  nota_media?: number;
  nota_comunicacao?: number;
  nota_profissionalismo?: number;
  nota_resolucao?: number;
}
```
