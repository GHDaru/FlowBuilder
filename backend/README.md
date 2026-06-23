# 🚀 AI Visual Lab - NPS Inteligente

Bem-vindo ao laboratório visual de experimentação de IA. Este módulo agora possui um frontend React moderno e um backend FastAPI seguindo DDD/Hexagonal.

## 🏗 Estrutura
- **`backend/`**: API FastAPI com a lógica de orquestração de LLMs e persistência SQLite.
- **`frontend/`**: Aplicação React (Vite) com React Flow para construção visual de fluxos.

## ⚙️ Como Executar

### 1. Iniciar o Backend
Navegue até a pasta `backend` e use o `uv`:
```bash
cd backend
uv sync
uv run python main.py
```
A API estará disponível em `http://localhost:8003` (com Hot Reload ativado).

#### Configuração Alternativa (Variáveis de Ambiente)
Você pode definir a porta e outras configurações via variáveis de ambiente no frontend (arquivo `.env`):
```env
VITE_API_URL=http://localhost:8003
```

### 2. Iniciar o Frontend
Navegue até a pasta `frontend` e use o `npm`:
```bash
cd frontend
npm install
npm run dev
```
O dashboard estará disponível em `http://localhost:5173`.

## 🧠 Funcionalidades
1.  **Flow Builder**: Crie sequências de interação com LLM visualmente.
2.  **Variáveis Dinâmicas**: Use `{{variavel}}` nos prompts para injetar saídas de nós anteriores.
3.  **Assistente de IA**: Use o botão "Auxiliar com IA" para que o Arquiteto de Sistemas sugira prompts e schemas.
4.  **Batch Runner**: Processe pastas inteiras de atendimentos e acompanhe o progresso em tempo real.
5.  **Histórico Detalhado**: Veja o trace completo de cada execução, comparando prompts e respostas JSON.

---
*Vibe Coding Edition - Iterate fast, build visuals. ✌️*
