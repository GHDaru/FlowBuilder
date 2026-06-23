# Análise de Integração: FlowEngine (Java) vs FlowStudio (Visual Lab)

## 1. Visão Geral
Esta documentação detalha o confronto técnico entre o motor de execução de fluxos implementado em Java (`FlowExecutionService`) e o protótipo funcional no AI Visual Lab (`aitest`). O objetivo é alinhar os dois ambientes para que execuções de produção sejam visíveis no laboratório.

## 2. Comparativo de Motores de Execução

| Recurso | FlowEngine (Java) | FlowStudio (Visual Lab) |
| :--- | :--- | :--- |
| **Lógica de Grafo** | Baseada em nós e arestas (nodes/edges). | Baseada em nós e arestas (React Flow). |
| **Nós Suportados** | `start`, `llm`, `condition`. | `start`, `llm`, `condition`, `sql`. |
| **Execução Paralela** | Suportada via `CompletableFuture`. | Suportada via `asyncio`. |
| **Rastreabilidade (Trace)** | Apenas resultado final no contexto. | Persistência detalhada de cada passo (SQLite). |
| **Schema Strict Mode** | Implementado para OpenAI JSON Schema. | Implementado para OpenAI JSON Schema. |

## 3. Requisitos para Espelhamento (Trace Mirroring)

Para que o Visual Studio/FlowStudio atue como um espelho fiel das execuções do projeto principal, as seguintes implementações são necessárias:

### 3.1. Persistência de Auditoria (Java)
O motor Java deve persistir o rastro de execução em tempo real no PostgreSQL:
- **Tabela `trackings`**: Cabeçalho da execução vinculada a um `atendimento_id`.
- **Tabela `trace_logs`**: Detalhes de cada nó (Prompt enviado, resposta raw, JSON extraído, tokens consumidos e tempo).

### 3.2. Adaptador de Produção (Visual Lab Backend)
O backend FastAPI deve ser configurado com um adaptador que:
- Conecte ao PostgreSQL de produção (Read-Only).
- Unifique os endpoints `/trackings` e `/logs` para buscar dados locais (testes) e de produção (espelhamento).

## 4. Compatibilidade de JSON
O JSON exportado pelo Visual Lab é compatível com a entidade `Flow` do Java, desde que:
- A estrutura de `nodes` e `edges` preserve os campos `nodeKey`, `sourceHandle` e `targetHandle`.
- Os operadores de condição (`equals`, `contains`, etc.) estejam sincronizados entre as linguagens.

## 5. Conclusão da Análise
A integração é viável e arquiteturalmente simples, exigindo apenas que o projeto Java adote a mesma estratégia de "Trace Audit" utilizada no Lab. Uma vez que o Java comece a escrever os logs no banco compartilhado, o FlowStudio poderá renderizar o histórico de produção sem necessidade de modificações no seu motor local.
