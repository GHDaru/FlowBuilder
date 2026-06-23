# Quickstart: Interface de Teste de Fluxos de Avaliacao IA

Siga estes passos para rodar a ferramenta de auditoria localmente.

## 1. Preparar o Ambiente

Certifique-se de estar na pasta `aitest/`:

```bash
cd aitest
```

Crie e ative o ambiente virtual:

```bash
uv venv
# Windows:
. .venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate
```

Instale as dependências:

```bash
uv pip install streamlit pandas openai google-generativeai pydantic sqlalchemy python-dotenv
```

## 2. Configurar Variáveis de Ambiente

A ferramenta utiliza o arquivo `.env` localizado na raiz do projeto (`../.env`). Certifique-se de que ele contenha as chaves necessárias:

```env
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
```

## 3. Rodar a Aplicação

Inicie o Streamlit:

```bash
streamlit run app.py
```

A interface abrirá automaticamente no seu navegador (geralmente em `http://localhost:8501`).

## 4. Como Usar

1. **Configuração**: Informe o caminho da pasta contendo os arquivos de chat (ex: `../data/atendimentos_teste`).
2. **Executar**: Clique em "Iniciar Processamento em Lote".
3. **Acompanhar**: Veja a tabela de resultados ser preenchida em tempo real.
4. **Auditar**: Clique em um atendimento na tabela e mude para a aba "Auditoria Detalhada" para ver os logs de cada etapa da IA.
