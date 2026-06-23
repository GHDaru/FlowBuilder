# Casos de Uso: AI Visual Lab

Este documento consolida as jornadas funcionais do **AI Visual Lab**, formalizando como os usuários interagem com o sistema para construir e avaliar inteligência artificial.

## UC01: Orquestração Visual de Fluxos
**Ator**: Construtor de Fluxos / Pesquisador de IA
**Fluxo Principal**:
1. O usuário acessa o **Flow Builder**.
2. Cria uma sequência de nós (`LLM Nodes`) conectados logicamente.
3. Define prompts e esquemas de saída JSON para cada nó.
4. O sistema resolve variáveis dinâmicas (ex: `{{atendimento}}` ou saídas de nós anteriores) em tempo de execução.

## UC02: Configuração Multi-Modelo
**Ator**: Pesquisador de IA
**Fluxo Principal**:
1. Durante a edição de um nó, o usuário seleciona o **Motor de IA (Model)** desejado (ex: GPT-4o, Gemini 1.5 Pro).
2. O backend descobre modelos disponíveis dinamicamente através de adapters plugáveis.
3. Na execução, cada nó utiliza seu motor específico, permitindo orquestração híbrida entre diferentes provedores.

## UC03: Auditoria de Dados Oficiais
**Ator**: Avaliador de IA
**Fluxo Principal**:
1. O usuário acessa a aba **Base Oficial**.
2. O sistema lista as contabilidades e o volume de atendimentos reais do banco de dados PostgreSQL (modo Read-Only).
3. O usuário seleciona um ou mais atendimentos reais.
4. O usuário escolhe um **Flow** visual e dispara o processamento.
5. O sistema executa o fluxo sobre o texto real e registra os resultados no histórico local.

## UC04: Observabilidade e Controle de Custos
**Ator**: Gestor de Operações / Desenvolvedor
**Fluxo Principal**:
1. O usuário acessa o **Histórico** de execuções.
2. Para cada passo (Node) de um atendimento, o sistema exibe:
    - O modelo utilizado.
    - O prompt final enviado (pós-resolução de variáveis).
    - O consumo exato de **Input Tokens**, **Output Tokens** e **Thinking Tokens**.
3. O sistema apresenta um resumo total do custo da execução no topo do trace.

## UC05: Portabilidade de Inteligência (Import/Export)
**Ator**: Desenvolvedor / Pesquisador de IA
**Fluxo Principal**:
1. O usuário exporta a definição de um fluxo como um arquivo `.json`.
2. O usuário pode realizar backup local ou transferir o fluxo para outro ambiente.
3. Na tela principal, o usuário importa um arquivo `.json` para recriar o fluxo integralmente no banco de dados local.
