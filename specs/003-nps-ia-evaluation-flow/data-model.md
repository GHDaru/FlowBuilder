# Data Model: NPS IA Evaluation Flow (Domain-Driven)

## Domain Entities & Aggregates

### EvaluationRule (Aggregate)
Defines the business logic for selecting scoring dimensions.

| Field | Type | Description |
|-------|------|-------------|
| id | Guid | Unique identifier. |
| service_name | string | The domain service name (e.g., "Folha"). |
| dimensions | list[string] | List of dimension names (Value Objects). |
| status | RuleStatus | Enum: ACTIVE, INACTIVE. |

### Atendimento (Aggregate Root)
The primary unit of work in the domain.

| Field | Type | Description |
|-------|------|-------------|
| id | Guid | Unique identifier. |
| source_content | string | The raw interaction text. |
| metadata | Metadata | Value Object: date, client, ticket_id. |
| classification | Classification | Value Object: service_name, markers. |
| scores | list[Score] | List of Score Value Objects (dimension, nota, justificativa). |
| final_score | float | Calculated based on domain logic. |
| token_usage | TokenUsage | Value Object: input_tokens, output_tokens. |
| status | EvaluationStatus | Enum: PENDING, COMPLETED, FAILED. |

## Persistence Mapping (Infrastructure)

The domain aggregates will be mapped to the following database tables in the `SQLiteRepository` adapter:

- `atendimentos`: Stores the aggregate root and its value objects.
- `audit_logs`: Detailed log of adapter calls (Infrastructure concern).
- `evaluation_rules`: Stores the rule configurations.
