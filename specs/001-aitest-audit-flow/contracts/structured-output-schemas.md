# Contract: Structured AI Outputs

All AI responses must be persisted as auditable stage records. Each stage stores:

- `stage_name`
- `schema_version`
- `raw_response`
- `structured_json` when validation succeeds
- `validation_status`
- `validation_errors_json` when validation fails
- `prompt_snapshot_id` when the stage used a prompt

Invalid responses are not discarded. They are saved with `validation_status = invalid`, linked to the atendimento, and surfaced in the audit UI.

## Schema Versioning

Initial schemas use `schema_version = "1.0"`. Any future schema change that renames fields, changes required fields, or changes score meaning must use a new schema version.

## MetadataExtractionOutput

**Stage**: `metadata_extraction`

```json
{
  "numero_atendimento": "string",
  "nome_cliente": "string",
  "contato_cliente": "string",
  "atendente_principal": "string",
  "data_hora_atendimento": "string",
  "data_hora_fechamento": "string",
  "justificativa_selecao_cliente": "string",
  "justificativa_selecao_atendente": "string"
}
```

**Rules**:

- All fields are required and may be empty strings when data is not safely identified.
- Date/time values should preserve the normalized value returned by the prompt.
- The output must not include extra top-level fields unless the schema version changes.

## ClassificationTaggingOutput

**Stage**: `classification_tagging`

```json
{
  "servico_principal": "string",
  "classificacao": "string",
  "marcadores": ["string"],
  "justificativa": "string"
}
```

**Rules**:

- `marcadores` must be a list, even when empty.
- Tags should be stored with their original marker text.
- `justificativa` is required to support audit review.

## PreprocessingOutput

**Stage**: `preprocessing`

```json
{
  "texto_original_hash": "string",
  "texto_processado": "string",
  "transformacoes": [
    {
      "nome": "string",
      "descricao": "string"
    }
  ],
  "alertas": ["string"]
}
```

**Rules**:

- This can be deterministic and does not need an AI call.
- `texto_processado` must never overwrite the stored original text.
- `transformacoes` records every meaningful cleanup or normalization.

## PromptPreparationOutput

**Stage**: `prompt_preparation`

```json
{
  "template_name": "string",
  "template_hash": "string",
  "regras_injetadas": [
    {
      "id": "string",
      "nome": "string",
      "descricao": "string",
      "peso": 0
    }
  ],
  "prompt_renderizado": "string"
}
```

**Rules**:

- `prompt_renderizado` must be the exact text used in the AI request.
- `regras_injetadas` must include all rules that influence scoring or classification.

## DimensionScoreOutput

**Stage**: `dimension_scoring`

```json
{
  "dimensao": "string",
  "nota": 0,
  "justificativa": "string",
  "evidencias": ["string"],
  "alertas": ["string"]
}
```

**Rules**:

- `nota` must be numeric.
- `justificativa` is required.
- `evidencias` should include relevant excerpts or summarized evidence, not the entire atendimento.

## ScoreConsolidationOutput

**Stage**: `score_consolidation`

```json
{
  "componentes": [
    {
      "dimensao": "string",
      "nota": 0,
      "peso": 1,
      "justificativa": "string"
    }
  ],
  "nota_final": 0,
  "metodo": "string",
  "alertas": ["string"]
}
```

**Rules**:

- `nota_final` must be derived from `componentes`.
- `metodo` explains the consolidation rule, such as simple average or weighted average.
- Missing components must appear as alerts.

## FinalSummaryOutput

**Stage**: `final_summary`

```json
{
  "resumo": "string",
  "resultado_final": "string",
  "principais_tags": ["string"],
  "alertas_auditoria": ["string"]
}
```

**Rules**:

- `resumo` is the analyst-facing summary.
- `alertas_auditoria` must include invalid or missing upstream stage outputs.
