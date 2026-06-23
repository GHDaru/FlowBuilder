# 📖 Guia de Variáveis e Orquestração de Contexto

Este documento detalha como o **AI Visual Lab** gerencia o fluxo de dados entre nós, permitindo a criação de cadeias de inteligência complexas onde cada passo enriquece o contexto do próximo.

## 1. Conceitos Fundamentais (Linguagem Ubíqua)

Para entender as variáveis, é preciso dominar os termos do domínio:

*   **Atendimento**: O objeto de estudo. É o texto bruto (chat, transcrição ou e-mail) que serve como input inicial do fluxo.
*   **Node (Nó)**: Uma unidade de processamento. Pode ser um `StartNode`, `LLMNode` ou `ConditionNode`.
*   **GraphState (Estado do Grafo)**: O "cérebro" da execução. É um dicionário compartilhado que armazena tudo o que foi aprendido durante o fluxo.
*   **JSON Schema (Output)**: O contrato de saída de um nó. Define quais chaves o nó vai "escrever" no Estado do Grafo.
*   **Variable (Variável)**: Um marcador no formato `{{nome}}` ou `{{objeto.campo}}` usado no prompt ou nas regras de decisão que o motor resolve dinamicamente.

---

## 2. Funcionamento Técnico (Deep Dive)

O motor de execução utiliza o **`VariableResolver`** (um Serviço de Domínio) para processar variáveis.

### A. Resolução de Caminhos (Dot Notation)
O sistema suporta acesso a objetos aninhados. Se um nó anterior retornou um JSON complexo, você não precisa "achatá-lo" (flatten).
Exemplo: `{{metadados.cliente.razao_social}}` navegará pelos níveis do JSON até encontrar o valor.

### B. Extração Dinâmica
Diferente de versões anteriores, você não precisa mais declarar quais variáveis um nó usa na barra lateral. O motor varre o prompt em tempo real, identifica tudo o que estiver entre `{{ }}` e tenta resolver contra o estado global.

### C. Fallback Seguro
Se uma variável for referenciada mas não for encontrada no estado (ex: erro de digitação ou nó anterior falhou), o sistema injetará uma **string vazia (`""`)** no prompt para evitar erros de interrupção na IA.

---

## 3. Guia de Uso e Exemplos

### A Variável Especial: `{{atendimento}}`
Esta é a única variável reservada. Ela sempre conterá o texto integral do arquivo processado.

### Acesso a Objetos Aninhados
Se o **Nó A** produz:
```json
{
  "analise": {
    "sentimento": "positivo",
    "confianca": 0.98
  }
}
```
Você pode usar no **Nó B**:
*   `{{analise.sentimento}}` -> Resulta em `positivo`
*   `{{analise.confianca}}` -> Resulta em `0.98`

---

### Exemplo Prático: Extração Estruturada

**Nó 1: Extrator**
*   **JSON Schema**: 
    ```json
    { "info": { "cliente": "string", "id": "number" } }
    ```

**Nó 2: Validador**
*   **Prompt**: `Valide os dados do cliente {{info.cliente}} (ID: {{info.id}}) baseados no texto: {{atendimento}}`

---

## 💡 Dicas de Ouro

1.  **Sintaxe Uniforme**: Use sempre chaves duplas `{{ }}` tanto em Prompts quanto em Nós de Condição.
2.  **Case Sensitivity**: O sistema diferencia maiúsculas de minúsculas. `{{Nome}}` é diferente de `{{nome}}`.
3.  **Representação de Objetos**: Se você injetar um objeto inteiro (ex: `{{info}}`), o sistema injetará a representação string do JSON. Sempre que possível, acesse o campo final (ex: `{{info.nome}}`).
4.  **Limpeza**: Espaços em branco dentro das chaves são ignorados. `{{ user.name }}` funciona igual a `{{user.name}}`.
