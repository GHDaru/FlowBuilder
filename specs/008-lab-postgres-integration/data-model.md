# Data Model: Lab Postgres Integration

## Official Database Entities (Read-Only)

These entities represent the tables in the production PostgreSQL database. They will be accessed via a separate SQLAlchemy base.

### Contabilidade (Official)
- `id`: String (UUID) - Primary Key.
- `nome`: String - Name of the accounting firm.
- `evaluation_count`: Computed (Join with Atendimentos) - Total records with `avaliacao_json` NOT NULL.

### Atendimento (Official)
- `id`: BigInteger - Primary Key.
- `contabilidade_id`: String - Foreign Key to Contabilidade.
- `ticket_id`: String - External ticket identifier.
- `avaliacao_json`: Text (JSON) - Existing evaluation result.

### AtendimentoChat (Official)
- `atendimento_id`: BigInteger - Foreign Key.
- `text_content`: Text - The raw interaction content to be processed by the Lab.

## Lab Internal Entities (Persistent)

The existing Lab entities will be used to store the *new* evaluations triggered by this feature.

### Execution
- `folder_path`: Will store a marker like `OFFICIAL_DB:<firm_id>` when triggered from this feature.

### Tracking
- `atendimento_id`: Will store the `ticket_id` from the official database.

## State Transitions
1. **Browse**: Fetch firms and counts from `OfficialBase`.
2. **Select**: Fetch list of interaction IDs for a selected firm.
3. **Trigger**: Fetch `text_content` for selected interaction -> Run Lab execution -> Save results in `LocalBase` (SQLite).
