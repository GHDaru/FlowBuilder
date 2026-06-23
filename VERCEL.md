# 🚀 Guia de Implantação no Vercel (FlowBuilder)

Este guia explica como implantar e rodar o **Frontend** e o **Backend** do FlowBuilder no Vercel.

Tanto a pasta `frontend` quanto a `backend` já foram preparadas com as configurações necessárias (`vercel.json`, pontos de entrada de serverless e dependências compiladas).

---

## 🛠️ O que foi preparado

1.  **Backend (`/backend`):**
    *   `vercel.json`: Configurado para rodar a aplicação via runtime `@vercel/python`.
    *   `api/index.py`: Script wrapper de entrada que expõe a instância FastAPI para o Vercel.
    *   `requirements.txt`: Compilado de forma otimizada via `uv` com todas as dependências necessárias fixadas.
    *   `infrastructure/utils/config.py`: Ajustado para detectar dinamicamente o Vercel e clonar automaticamente o banco SQLite `audit.db` para a pasta `/tmp` (única pasta com permissão de escrita em ambientes Serverless do Vercel) caso não seja fornecido um banco externo.

2.  **Frontend (`/frontend`):**
    *   `vercel.json`: Configurado com redirecionamentos corretos para evitar erros 404 em rotas e atualizações de página.

---

## 📋 Passo a Passo para Implantação

Você pode implantar ambos os projetos separadamente no painel do Vercel a partir do mesmo repositório do GitHub.

### 1. Implantando o Backend

1. Vá no painel do Vercel e clique em **Add New > Project**.
2. Importe o repositório do seu projeto.
3. Nas configurações do projeto:
   * **Project Name**: `flowbuilder-backend` (ou de sua escolha).
   * **Framework Preset**: Selecione `Other` (pois é um projeto Python puro).
   * **Root Directory**: Defina como **`backend`**.
4. Expanda a seção **Environment Variables** e adicione as seguintes variáveis de ambiente:
   * `OPENAI_API_KEY`: A sua chave de API da OpenAI (necessária para os fluxos de IA).
   * `OPENAI_MODEL`: `gpt-4o-mini` (ou outro de preferência).
   * `GEMINI_API_KEY`: Sua chave Gemini (caso aplicável).
   * *(Opcional)* `AITEST_DATABASE_URL`: Caso queira usar um banco externo PostgreSQL em vez do SQLite local replicado em `/tmp`.
5. Clique em **Deploy**.
6. Copie a URL gerada para o seu backend implantado (ex: `https://flowbuilder-backend.vercel.app`).

---

### 2. Implantando o Frontend

1. No painel do Vercel, clique novamente em **Add New > Project**.
2. Importe o mesmo repositório.
3. Nas configurações do projeto:
   * **Project Name**: `flowbuilder-frontend` (ou de sua escolha).
   * **Framework Preset**: Selecione **`Vite`** (o Vercel detectará automaticamente).
   * **Root Directory**: Defina como **`frontend`**.
4. Expanda a seção **Environment Variables** e adicione:
   * **`VITE_API_URL`**: Insira a URL gerada no deploy do backend (ex: `https://flowbuilder-backend.vercel.app`).
5. Clique em **Deploy**.

Pronto! Seu ambiente completo estará no ar e integrado.
