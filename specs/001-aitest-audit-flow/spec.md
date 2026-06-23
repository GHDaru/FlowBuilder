# Feature Specification: Interface de Teste de Fluxos de Avaliacao IA

**Feature Branch**: `001-aitest-audit-flow`  
**Created**: 2026-05-28  
**Status**: Draft  
**Input**: User description: "Pode gerar uma interface em streamlite python para que eu teste os fluxos. ele le a pasta de atendimentos, e vai aplicar o fluxo, extracao de metadados, classificacao e tagueamento, pre-processmaneto, preparacao dos prompts com injecao das regras de avaliacao, consolidacao das notas e resultado final em tabela. Cada saida da ia e um structured output auditavel, no final ele deve gravar os dados em um sqlite. lembre de colocar na pasta aitest"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Executar avaliacao em lote de atendimentos (Priority: P1)

Como analista de qualidade, quero selecionar uma pasta de atendimentos e executar o fluxo completo de avaliacao para validar rapidamente se os artefatos gerados pela IA estao consistentes.

**Why this priority**: Este e o fluxo principal: sem processamento em lote dos atendimentos, a interface nao entrega valor para teste operacional.

**Independent Test**: Pode ser testado com uma pasta contendo atendimentos validos e confirma que cada item passa pelas etapas obrigatorias ate gerar um resultado final.

**Acceptance Scenarios**:

1. **Given** uma pasta com atendimentos validos, **When** o usuario inicia a execucao, **Then** o sistema processa cada atendimento pelas etapas de extracao de metadados, classificacao, tagueamento, pre-processamento, preparacao de prompt, avaliacao e consolidacao de notas.
2. **Given** uma execucao em andamento, **When** uma etapa e concluida ou falha, **Then** o usuario ve o status atualizado por atendimento e por etapa.

---

### User Story 2 - Auditar saidas estruturadas da IA (Priority: P2)

Como responsavel pela avaliacao, quero inspecionar cada saida estruturada produzida pela IA para entender quais dados sustentam classificacoes, tags, notas e resultado final.

**Why this priority**: A auditabilidade e requisito central para confiar no fluxo e revisar divergencias antes de usar os resultados.

**Independent Test**: Pode ser testado abrindo qualquer atendimento processado e verificando os registros estruturados de cada etapa da IA, incluindo campos, validacao e erros.

**Acceptance Scenarios**:

1. **Given** um atendimento processado, **When** o usuario seleciona uma etapa do fluxo, **Then** o sistema apresenta a saida estruturada da IA associada aquela etapa.
2. **Given** uma resposta da IA fora do formato esperado, **When** o sistema valida a saida, **Then** a divergencia fica registrada e visivel para auditoria.

---

### User Story 3 - Revisar resultados consolidados e historico (Priority: P3)

Como gestor ou analista, quero ver os resultados finais em tabela e preservar o historico das execucoes para comparar notas, tags e falhas entre testes.

**Why this priority**: A consolidacao em tabela e persistencia do historico tornam o teste reutilizavel e comparavel ao longo das iteracoes.

**Independent Test**: Pode ser testado executando o fluxo e confirmando que os resultados finais ficam disponiveis em tabela e podem ser recuperados depois.

**Acceptance Scenarios**:

1. **Given** uma execucao concluida, **When** o usuario abre a visao de resultados, **Then** o sistema apresenta uma tabela com atendimento, metadados, classificacoes, tags, componentes de nota, nota final e status.
2. **Given** uma execucao concluida, **When** o usuario consulta o historico, **Then** o sistema exibe os dados persistidos da execucao, incluindo resultados finais e trilha auditavel.

### Edge Cases

- Pasta selecionada nao existe, esta vazia ou nao contem arquivos de atendimento reconheciveis.
- Atendimento contem conteudo incompleto, duplicado, malformado ou grande demais para uma avaliacao em uma unica passagem.
- Regras de avaliacao estao ausentes, incompletas ou entram em conflito entre si.
- A IA retorna uma saida invalida, incompleta ou incompativel com o formato esperado.
- Uma etapa falha para um atendimento, mas os demais atendimentos ainda devem poder continuar.
- A execucao e interrompida antes da conclusao de todos os atendimentos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que o usuario informe uma pasta de atendimentos para processamento em lote.
- **FR-002**: O sistema MUST identificar os atendimentos processaveis na pasta informada e reportar arquivos ignorados ou invalidos.
- **FR-003**: O sistema MUST executar, para cada atendimento valido, as etapas de extracao de metadados, classificacao, tagueamento, pre-processamento, preparacao de prompt com regras de avaliacao, avaliacao, consolidacao das notas e geracao do resultado final.
- **FR-004**: O sistema MUST preservar o conteudo original do atendimento e registrar quais transformacoes foram aplicadas durante o pre-processamento.
- **FR-005**: O sistema MUST registrar as regras de avaliacao injetadas em cada prompt preparado, permitindo auditoria posterior do contexto usado na avaliacao.
- **FR-006**: O sistema MUST tratar cada saida gerada pela IA como um registro estruturado com etapa, versao de formato, campos produzidos, status de validacao, horario e referencia ao atendimento.
- **FR-007**: O sistema MUST marcar como invalida qualquer saida da IA que nao cumpra o formato esperado e registrar o motivo da invalidade.
- **FR-008**: O sistema MUST consolidar componentes de nota, justificativas e resultado final por atendimento.
- **FR-009**: O sistema MUST apresentar uma tabela final contendo, no minimo, identificador do atendimento, metadados principais, classificacao, tags, notas parciais, nota final, status e alertas de auditoria.
- **FR-010**: O sistema MUST permitir que o usuario filtre ou selecione resultados por status, classificacao, tags ou faixa de nota.
- **FR-011**: O sistema MUST persistir cada execucao, atendimento processado, saida estruturada da IA, prompt preparado, regras aplicadas, notas e resultado final em armazenamento local consultavel.
- **FR-012**: O sistema MUST permitir recuperar execucoes anteriores para revisao sem exigir novo processamento dos mesmos atendimentos.
- **FR-013**: O sistema MUST registrar erros por atendimento e por etapa sem apagar os dados ja produzidos em etapas anteriores.
- **FR-014**: O sistema MUST disponibilizar a experiencia como ferramenta local de testes na area dedicada a experimentos de IA do projeto.

### Key Entities *(include if feature involves data)*

- **Atendimento**: Representa um arquivo ou registro de conversa a ser avaliado; inclui identificador, origem, conteudo original e status de leitura.
- **Execucao de Avaliacao**: Representa uma rodada de processamento; inclui data, pasta de origem, quantidade de atendimentos, status geral e resumo de erros.
- **Etapa do Fluxo**: Representa uma fase do processamento, como metadados, classificacao, tagueamento, pre-processamento, prompt, avaliacao ou consolidacao.
- **Saida Estruturada da IA**: Representa uma resposta auditavel da IA; inclui etapa, formato esperado, dados retornados, validacao, erros e relacao com o atendimento.
- **Regra de Avaliacao**: Representa criterio usado para compor prompts e notas; inclui identificador, descricao, peso ou prioridade quando aplicavel.
- **Prompt Preparado**: Representa o contexto enviado para avaliacao; inclui atendimento referenciado, regras aplicadas e versao do template.
- **Resultado Final**: Representa a consolidacao por atendimento; inclui tags finais, notas parciais, nota final, justificativas, alertas e status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuario consegue iniciar uma avaliacao em lote a partir de uma pasta valida em menos de 2 minutos.
- **SC-002**: 100% das respostas da IA geradas durante o fluxo ficam associadas a um registro estruturado auditavel ou a um erro explicito de validacao.
- **SC-003**: Para uma pasta com ate 50 atendimentos de tamanho comum, o sistema apresenta uma tabela final com todos os resultados ou falhas individuais sem interromper a execucao completa por causa de um unico atendimento.
- **SC-004**: O usuario consegue rastrear qualquer nota final ate as regras de avaliacao, prompt preparado e saidas estruturadas que a originaram.
- **SC-005**: Execucoes concluidas podem ser recuperadas posteriormente com os mesmos resultados finais e trilha de auditoria apresentados ao usuario.

## Assumptions

- Os usuarios principais sao analistas ou desenvolvedores validando fluxos de avaliacao de atendimentos em ambiente local de teste.
- A pasta de atendimentos contem arquivos em formatos textuais ou convertiveis para texto pelo sistema existente.
- As regras de avaliacao estao disponiveis antes da execucao ou podem ser carregadas pelo fluxo de teste.
- O usuario tem autorizacao para processar os atendimentos selecionados e revisar conteudos potencialmente sensiveis.
- A implementacao devera respeitar a solicitacao de concentrar a ferramenta na area `aitest` do projeto e de manter persistencia local para auditoria.
