# API Contract: Global Variables

## GET /official/variables

Returns the list of available global variables that can be selected in the Start node.

### Response `200 OK`
```json
[
  {
    "id": "contabilidade_nome",
    "label": "Nome da Contabilidade",
    "description": "Nome da empresa contábil responsável pelo atendimento"
  },
  {
    "id": "cliente_nome",
    "label": "Nome do Cliente",
    "description": "Nome do cliente final que solicitou o atendimento"
  },
  {
    "id": "atendente_nome",
    "label": "Nome do Atendente",
    "description": "Nome do colaborador que realizou o atendimento"
  },
  {
    "id": "ticket_id",
    "label": "ID do Ticket",
    "description": "Identificador único do ticket no sistema oficial"
  },
  {
    "id": "data_atendimento",
    "label": "Data do Atendimento",
    "description": "Data e hora em que o atendimento foi iniciado"
  }
]
```
