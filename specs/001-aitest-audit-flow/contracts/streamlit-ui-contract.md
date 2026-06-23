# UI Contract: Streamlit Audit Tool

Este documento define os componentes e comportamentos esperados da interface Streamlit.

## Sidebar (Configuração)
- **Input de Texto**: Caminho da pasta de atendimentos (Default: `../data/test_samples`).
- **Dropdown**: Seleção de Modelo (GPT-4o-mini, Gemini-2.0-Flash).
- **Botão**: "Iniciar Processamento em Lote".
- **Botão**: "Limpar Banco de Dados" (com confirmação).

## Main View (Abas)

### Aba 1: Execução Atual
- **Progresso**: `st.progress` e `st.status` mostrando qual arquivo está sendo processado.
- **Métricas**: Cards com "Total Processado", "Nota Média", "Falhas".
- **Tabela Viva**: Dataframe sendo atualizado à medida que os resultados chegam.

### Aba 2: Histórico de Execuções
- **Seleção**: Dropdown para escolher uma execução anterior pelo timestamp.
- **Resumo**: Tabela com os resultados consolidados daquela execução.
- **Filtros**: Filtrar por nota mínima, status ou tags.

### Aba 3: Auditoria Detalhada
- **Seleção de Atendimento**: Selecionar um atendimento da execução atual/histórica.
- **Fluxo Visual**: Lista expansível (Expander) para cada etapa:
    - Metadados
    - Classificação & Tags
    - Dimensão: Comunicação
    - Dimensão: Profissionalismo
    - Dimensão: Resolução
    - Resumo Final
- **Conteúdo do Expander**:
    - **Prompt**: Mostra o texto enviado (útil para ver as regras injetadas).
    - **Response**: Mostra o JSON formatado.
    - **Status**: Ícone verde (OK) ou vermelho (Erro de Validação).

## Comportamentos Especiais
- **Auto-save**: Cada etapa concluída deve ser gravada no SQLite imediatamente (FR-013).
- **Visualização de Atendimento**: Ao clicar em uma linha da tabela de resultados, a aba de Auditoria deve focar naquele atendimento.
