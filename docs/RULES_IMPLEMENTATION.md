# Implementação de Regras de IA (NPS Inteligente)

## 1. Visão Geral
As regras de IA no projeto NPS Inteligente são diretrizes formais que orientam os avaliadores LLM sobre como interpretar atendimentos e atribuir notas. O sistema permite a criação, refinamento e persistência dessas regras para garantir consistência nas avaliações.

## 2. Modelo de Dados (`Rule`)
A entidade central é a `Rule`, definida em `aitest/backend/domain/models/rule.py`.

### Atributos:
*   **ID**: UUID único da regra.
*   **Nome**: Título curto e profissional.
*   **Texto**: A instrução formal para a IA (ex: "Se o atendente usar gírias, diminua a nota de profissionalismo em 2 pontos").
*   **Dimensão**: A qual categoria a regra se aplica (ex: `comunicacao_clareza`, `profissionalismo`, ou `todas`).
*   **Escopo**:
    *   `global`: Aplica-se a todos os atendimentos.
    *   `especifico`: Aplica-se apenas a um contexto ou contabilidade específica.
*   **Contexto**: Identificador (ex: `external_id` da contabilidade) para regras de escopo específico.
*   **Is Active**: Flag booleana para ativar/desativar a regra.
*   **Origin**: Indica se a regra foi criada manualmente (`manual`) ou gerada a partir de um feedback (`feedback`).

## 3. Ciclo de Vida da Regra

### 3.1 Geração via Feedback (`RuleGenerationService`)
Uma das funcionalidades mais poderosas é a capacidade de aprender com erros. Quando um supervisor contesta uma nota, o sistema utiliza o LLM para:
1.  Analisar o **Transcript** original.
2.  Analisar a **Avaliação** que foi contestada.
3.  Analisar o **Feedback** do supervisor.
4.  **Generalizar**: A IA cria uma regra genérica baseada na contestação, evitando regras "viciadas" em um único atendimento.

### 3.2 Refinamento Manual
O sistema permite que o usuário escreva uma regra em linguagem natural, que é então refinada pelo LLM para um formato técnico otimizado para os prompts de avaliação.

## 4. Persistência (`SqliteRuleRepository`)
As regras do Laboratório Visual são armazenadas em um banco SQLite local (`audit.db`).
*   **Implementação**: Utiliza SQLAlchemy para mapeamento objeto-relacional.
*   **Filtragem**: O repositório possui métodos específicos para buscar regras ativas baseadas no escopo (ex: trazer todas as globais + as específicas da contabilidade atual).

## 5. Aplicação das Regras
No fluxo de avaliação, as regras são injetadas dinamicamente no prompt do sistema (System Prompt). O avaliador recebe o bloco de regras aplicáveis antes de processar o texto do atendimento, garantindo que as diretrizes do negócio sejam respeitadas.

---
*Documentação gerada em 16/06/2026.*
