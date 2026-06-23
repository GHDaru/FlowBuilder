# 🔀 Guia de Uso: Fluxos Condicionais (Routers)

Os Fluxos Condicionais permitem que o **AI Visual Lab** tome decisões dinâmicas baseadas nas respostas geradas pelas inteligências artificiais em passos anteriores. Em vez de um fluxo linear rígido, você pode criar árvores de decisão inteligentes.

## 1. O que é um Nó de Condição?

Um **Nó de Condição** (Router) não chama uma IA e não consome tokens. Ele é um avaliador lógico puro.
Ele olha para o **Estado Global** (o JSON acumulado de todos os passos anteriores) e avalia regras que você definiu. Dependendo de qual regra for verdadeira, ele envia a execução para um caminho diferente no canvas.

## 2. Como Configurar Regras

Ao clicar em um Nó de Condição e abrir a barra lateral, você verá o painel de **Regras de Roteamento**.

Cada regra é composta por três partes:
1.  **Variável**: O caminho para o dado (ex: `{{status}}` ou `{{meta.id}}`).
2.  **Operador**: Como comparar (Igual a, Diferente de, Contém).
3.  **Valor**: O valor esperado para acionar esta regra.

### Sintaxe Uniforme `{{ }}`
Para manter a consistência com os prompts, o campo **Variável** suporta (e recomenda) o uso de chaves duplas. O motor de execução resolverá o caminho automaticamente.

---

## 3. Exemplos Práticos de Roteamento

### Exemplo A: Roteamento Simples (Nível 1)

**Cenário**: O Nó 1 retorna `{"sentimento": "irritado"}`.
*   **Variável**: `{{sentimento}}`
*   **Operador**: `Igual a (==)`
*   **Valor**: `irritado`

### Exemplo B: Variáveis Aninhadas (Dot Notation)

O motor suporta navegação profunda em objetos JSON.
**Saída do Nó 1**:
```json
{
  "analise": {
    "decisao": {
      "status": "reprovado"
    }
  }
}
```

**Configuração da Regra**:
*   **Variável**: `{{analise.decisao.status}}`
*   **Operador**: `Igual a (==)`
*   **Valor**: `reprovado`

---

## 4. Dicas de Comparação

O motor de avaliação é **tolerante a tipos** (type-agnostic). Ele converte os valores para texto antes de comparar:

*   **Não use aspas no campo Valor**.
*   **Booleanos**: Para checar um boolean, digite `True` ou `False` (ou `true`/`false`).
*   **Números**: Digite apenas o número (ex: `10`).

---

## 5. O Caminho `Default` (Fallback)

Todo Nó de Condição possui uma alça de saída obrigatória chamada **Default**.
Se nenhuma das regras definidas for verdadeira, a execução seguirá obrigatoriamente por este caminho. Se ele não estiver conectado, o fluxo se encerra.

## 6. Auditoria no Histórico

No **Histórico**, o Nó de Condição mostra exatamente qual regra foi disparada:
```json
{
  "matched_rule": "rule-17409234",
  "target": "llm-node-id"
}
```
Isso permite validar se a lógica do seu grafo está alinhada com as respostas da IA.
