# Research: Interface de Teste de Fluxos de Avaliacao IA

Este documento detalha as decisões técnicas e pesquisas realizadas para a implementação da interface de auditoria de fluxos de IA.

## Decisões Técnicas

### 1. SDK de IA
- **Decisão**: Utilizar `openai` como SDK principal, mantendo compatibilidade com o código existente em `ai_flow_test.py`.
- **Racional**: O projeto já possui lógica de carregamento de prompts e chamadas para a OpenAI. Adicionar suporte a `google-generativeai` será feito via uma camada de abstração (Service Pattern) para permitir trocar o provedor.
- **Alternativas**: `langchain` foi considerado, mas rejeitado para manter a simplicidade e o "Zero Friction" mencionado no README do `aitest`.

### 2. Esquema do Banco de Dados (SQLite)
- **Decisão**: Utilizar um esquema normalizado para permitir auditoria detalhada.
- **Esquema**:
    - `executions`: Cabeçalho da rodada de testes.
    - `atendimentos`: Resultados consolidados por arquivo processado.
    - `audit_logs`: Registro bruto de cada interação com a IA (Prompt vs Response).
- **Racional**: Atende aos requisitos de persistência (FR-011) e recuperação de históricos (FR-012).

### 3. Interface Streamlit
- **Decisão**: Layout com `st.sidebar` para configurações e `st.tabs` para alternar entre "Nova Execução", "Resultados" e "Auditoria".
- **Racional**: Streamlit permite visualização rápida de tabelas (Dataframes) e inspeção de JSONs (st.json), ideal para auditoria.

## Pesquisa de Melhores Práticas

### Processamento em Lote no Streamlit
- Utilizar `st.progress` e `st.empty` para feedback em tempo real sem recarregar a página inteira.
- Implementar o processamento em uma thread separada ou usando geradores para manter a interface responsiva.

### Auditoria de Structured Output
- Utilizar `pydantic` para validar os JSONs retornados pela IA.
- Registrar tanto o JSON válido quanto o erro original em caso de falha de parsing, conforme FR-007.

## Resolvido: NEEDS CLARIFICATION
- **Modelos**: O sistema deve suportar `gpt-4o-mini` (padrão) e `gemini-2.0-flash` (via `.env`).
- **Pasta de Atendimentos**: O usuário informará o caminho absoluto ou relativo via input de texto na interface.
