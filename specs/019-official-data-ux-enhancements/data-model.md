# Data Model: Official Data UX Enhancements

## Interface Updates

### IOfficialDbPort (Domain Port)
- **list_interactions(firm_ids: List[str])**: Accept multiple firm IDs.

### PostgresAdapter (Infrastructure Adapter)
- **list_interactions**: Use `.filter(OfficialAtendimento.contabilidade_id.in_(firm_ids))`.

## Frontend State

### Selection State
- `selectedFirmIds: string[]`
- `selectedInteractionIds: number[]`

### Sorting State
```typescript
interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}
```
Used for both firms (by `evaluation_count`) and interactions (by `nota_media`, `nota_comunicacao`, etc.).
