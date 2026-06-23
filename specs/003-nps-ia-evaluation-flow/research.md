# Research: NPS IA Evaluation Flow

## 1. Architectural Strategy: DDD + Hexagonal

To ensure the system is maintainable and the AI provider is truly pluggable, we will apply Hexagonal Architecture.

**Decision**:
- **Domain Layer**: Contains the core logic for evaluation rules, scoring logic, and the `EvaluationFlow` domain service. It defines **Ports** (interfaces) for LLM interaction and persistence.
- **Infrastructure Layer**: Implements **Adapters**. 
    - `OpenAIAdapter` will implement the `ILLMProvider` port.
    - `SQLiteRepository` will implement the `IAtendimentoRepository` port.
- **Application Layer**: Orchestrates the use cases, connecting the ports to the adapters.

## 2. LLM Strategy: OpenAI First

**Decision**:
- Standardize on **OpenAI** (GPT-4o/GPT-4o-mini) for all structured outputs.
- The `ia_client.py` will be refactored into an adapter. 
- Structured outputs will be enforced via Pydantic models in the Domain layer, with the adapter handling the specific mapping to OpenAI's `json_mode`.

## 3. Parallel Execution Strategy

The current `EvaluationFlow` processes scoring dimensions sequentially.

**Decision**: 
- Use `concurrent.futures.ThreadPoolExecutor` within the Application layer to execute dimension scoring in parallel.
- The domain service will define the dimension logic, and the application service will handle the concurrent execution of the adapters.

## 4. Dynamic Rules & Configuration

**Decision**:
- **Rules Domain**: Create a `Rule` aggregate that defines the conditions (Service Name) and actions (Dimensions to run).
- **UI Editor**: Implement a Streamlit-based editor in `aitest/app.py` that interacts with the `Rule` aggregate through an application service.

## 5. Observability (Mandatory)

**Decision**:
- Implement a `TokenTracker` decorator or middleware for the LLM adapters.
- Every evaluation must persist the `input_tokens` and `output_tokens` to the database via the repository adapter.
