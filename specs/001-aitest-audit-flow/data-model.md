# Data Model: Interface de Teste de Fluxos de Avaliacao IA

Este documento descreve o esquema do banco de dados SQLite e os modelos de dados (Pydantic) utilizados na aplicação de teste.

## Banco de Dados (SQLite)

### Tabela: `executions`
Representa uma rodada de processamento em lote.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER (PK) | Identificador único |
| `timestamp` | DATETIME | Data e hora da execução |
| `folder_path` | TEXT | Caminho da pasta processada |
| `model_name` | TEXT | Nome do modelo de IA utilizado |
| `status` | TEXT | COMPLETED, FAILED, RUNNING |
| `total_files` | INTEGER | Total de arquivos identificados |
| `processed_files` | INTEGER | Total de arquivos processados com sucesso |
| `error_count` | INTEGER | Total de falhas |

### Tabela: `atendimentos`
Representa o resultado consolidado de um atendimento individual.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER (PK) | Identificador único |
| `execution_id` | INTEGER (FK) | Relacionamento com `executions` |
| `filename` | TEXT | Nome do arquivo original |
| `content` | TEXT | Conteúdo original do atendimento |
| `final_score` | REAL | Média das notas das dimensões |
| `summary` | TEXT | Resumo gerado pela IA |
| `status` | TEXT | SUCCESS, ERROR |

### Tabela: `audit_logs`
Registro detalhado de cada etapa da IA para auditoria.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER (PK) | Identificador único |
| `atendimento_id` | INTEGER (FK) | Relacionamento com `atendimentos` |
| `step_name` | TEXT | Nome da etapa (Metadados, Score, etc.) |
| `prompt` | TEXT | Prompt enviado para a IA |
| `response_raw` | TEXT | Resposta bruta da IA (JSON ou texto) |
| `validation_status` | TEXT | VALID, INVALID |
| `error_message` | TEXT | Mensagem de erro em caso de falha de parsing |

## Modelos de Saída Estruturada (Pydantic)

### `MetadataOutput`
```python
class MetadataOutput(BaseModel):
    numero_atendimento: str
    atendente_principal: str
    nome_cliente: str
    data_atendimento: Optional[str]
```

### `DimensionScoreOutput`
```python
class DimensionScoreOutput(BaseModel):
    dimensao: str
    nota: float
    justificativa: str
    evidencias: List[str]
```

### `TagsOutput`
```python
class TagsOutput(BaseModel):
    servico_principal: str
    marcadores: List[str]
```
