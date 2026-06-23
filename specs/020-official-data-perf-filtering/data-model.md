# Data Model: Official Data Performance & Filtering

## Interface Updates

### IOfficialDbPort
- `list_firms(search: Optional[str] = None) -> List[Dict[str, Any]]`

### PostgresAdapter
- Implements `list_firms` with `ILIKE` filtering on `OfficialContabilidade.nome`.

## Frontend State

### AtendimentoPicker State
- `statusFilter: 'all' | 'pending' | 'evaluated'`
- Computed `visibleInteractions` based on filter.

### FirmList State
- `searchQuery: string` (debounced)
- Loading indicator during search.
