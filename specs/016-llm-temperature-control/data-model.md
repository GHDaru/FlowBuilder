# Data Model: LLM Node Temperature Control

## Domain Ports

### `ILLMProvider`
```python
class ILLMProvider(ABC):
    @abstractmethod
    def call(self, prompt: str, schema: Optional[Any] = None, json_mode: bool = True, temperature: float = 0.0) -> Dict[str, Any]:
        pass
```

## Entity (Visual JSON Definition)

### Node Data
- **temperature**: `float` (range: 0.0 to 1.0, default: 0.0)

## Frontend State

### Sidebar State
- **temperature**: `number` (state synced with node data)
