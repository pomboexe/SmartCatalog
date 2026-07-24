# SmartCatalog

Mini SaaS multi-tenant de catálogo de produtos com agente de IA. Empresas cadastram produtos; usuários autenticados consultam o catálogo via chat, e o agente responde com dados reais do MongoDB (tool calling), isolados por `companyId`.

## Stack

| Camada   | Tecnologias                                                                              |
| -------- | ---------------------------------------------------------------------------------------- |
| Backend  | Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Zod, Groq (OpenAI-compatible SDK) |
| Frontend | React, TypeScript, Vite, Tailwind CSS, TanStack Query, Axios, React Router               |
| Infra    | Docker Compose (dev + prod)                                                              |

---

## Setup rápido (local)

### Pré-requisitos

- Node.js 22+
- MongoDB local **ou** Docker
- Conta/chave [Groq](https://console.groq.com)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Preencha MONGODB_URI, JWT_SECRET e GROQ_API_KEY

npm install
npm run seed
npm run dev
```

API em `http://localhost:3333`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:3333

npm install
npm run dev
```

App em `http://localhost:5173`.

### Contas do seed

Senha de todos: `senha123`

| Empresa     | Admin                   | User                   |
| ----------- | ----------------------- | ---------------------- |
| TechCorp    | `admin@techcorp.com`    | `user@techcorp.com`    |
| FreshMarket | `admin@freshmarket.com` | `user@freshmarket.com` |

### Docker (opcional)

Na raiz, copie o `.env.example` e preencha `JWT_SECRET` e `GROQ_API_KEY`:

```bash
cp .env.example .env

# Desenvolvimento (hot reload) → http://localhost:5173
npm run docker:dev

# Produção (nginx + build) → http://localhost:8080
npm run docker:prod

# Derrubar
npm run docker:dev:down
# ou
npm run docker:prod:down
```

---

## Arquitetura do backend

Monólito modular em camadas (inspirado em onion / clean architecture), com TypeScript.

```
backend/src/
  domain/          # Entidades, enums, contratos de repositório
  application/     # Use cases + ports (LLM, JWT, hasher)
  infrastructure/  # Mongo/Mongoose, Groq, bcrypt, JWT
  presentation/    # Rotas Express, middlewares, schemas Zod
  shared/          # AppError
```

### Por que essa estrutura?

- **Separação de responsabilidades**: regra de negócio não depende de Express ou Mongoose.
- **Multi-tenant seguro**: `companyId` vem do JWT (middleware), nunca do body — a camada de aplicação/infra filtra por tenant.
- **Troca de detalhes**: LLM (Groq), hash (bcrypt) e token (JWT) atrás de ports — dá para substituir sem reescrever use cases.
- **Testabilidade**: use cases recebem dependências por construtor (fácil mockar em testes futuros).

Fluxo típico:

```text
HTTP → Route (Zod) → Auth/Role → Use Case → Port → Infrastructure → Mongo / Groq
```

### Multi-tenant e permissões

- **JWT** carrega `userId`, `role` (`admin` | `user`) e `companyId`.
- **Admin**: CRUD de produtos da própria empresa.
- **User**: listagem + chat.
- Queries de produto sempre incluem `companyId` do token.

### Agente de IA (tool calling + SSE)

1. `POST /chat` — resposta completa (JSON).
2. `POST /chat/stream` — streaming via **SSE** (tokens em tempo real).

O `GroqLLMService` usa tool `search_products`, que consulta o Mongo filtrando pelo `companyId` do usuário autenticado. A resposta final pode ser streameada; tool calls rodam antes do stream.

---

## Arquitetura do frontend

SPA organizada por **features**, com páginas finas e services HTTP separados.

```
frontend/src/
  app/             # Router, QueryProvider
  features/        # auth, products, chat, theme
  pages/           # Login, Register, Dashboard
  components/      # Layout, UI, ProtectedRoute
  services/        # api (Axios), auth, products, chat
  types/
```

### Por que essa estrutura?

- **Feature-based**: auth, produtos e chat ficam próximos (hooks + UI + contexto), sem um “god folder” de components.
- **Services na borda**: `apiRequest` / Axios concentram base URL, token e erros — pages/hooks não falam HTTP cru.
- **Roles na UI**: `DashboardPage` mostra CRUD (admin) ou `UserProductsView` (user); permissão real continua no backend.
- **Chat como widget**: FAB flutuante no `AppLayout` (não é rota dedicada) — UX de assistente sem sair do catálogo.

Fluxo de dados:

```text
UI → hook (TanStack Query) → service → Axios → API
Chat stream → fetch + ReadableStream (SSE) → atualiza bubble token a token
```

---

## Tecnologias e motivações

### Backend

| Tech                   | Por quê                                                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js + Express**  | Ecossistema maduro para API REST, middleware simples (auth, Zod, errors). Express 5 atende o escopo do desafio sem overhead de Nest/Fastify. |
| **TypeScript**         | Tipagem de ponta a ponta (entities, use cases, rotas); menos regressão em multi-tenant e contratos de LLM.                                   |
| **MongoDB + Mongoose** | Modelo documental combina com produtos flexíveis; filtro por `companyId` é direto; requisito do desafio.                                     |
| **JWT**                | Auth stateless, adequada a SPA + API; payload leva `companyId`/`role` sem lookup a cada request (além da validação do token).                |
| **bcryptjs**           | Hash de senha padrão, sem binding nativo problemático em Docker Alpine.                                                                      |
| **Zod**                | Validação de body/params na borda HTTP, mensagens em PT, tipagem inferida — substitui `if` manuais.                                          |
| **Groq + SDK OpenAI**  | Tool calling compatível com a API OpenAI; Groq é rápido e barato para o desafio. `baseURL` aponta para Groq.                                 |
| **SSE**                | Streaming da resposta do agente sem WebSocket; reaproveita auth JWT no `POST` e é suficiente para unidirecional server→client.               |

### Frontend

| Tech                   | Por quê                                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **React + TypeScript** | UI componentizada e tipada; alinhado ao mercado e ao desafio.                                                                     |
| **Vite**               | Dev server rápido, build simples, DX melhor que CRA.                                                                              |
| **Tailwind CSS**       | Estilo utilitário, dark mode via tokens/`class`, UI consistente sem CSS espalhado.                                                |
| **TanStack Query**     | Cache, loading/error e mutações de produtos/auth sem reinventar estado de servidor.                                               |
| **Axios**              | Client HTTP com `baseURL` e tratamento de erro centralizado (`ApiError`).                                                         |
| **React Router**       | Rotas de auth + dashboard protegido; layouts (`AuthLayout` / `AppLayout`).                                                        |
| **fetch + SSE**        | Streaming do chat: Axios não é o melhor para `text/event-stream` com leitura incremental; `fetch` + `ReadableStream` encaixa bem. |

### Infra

| Tech                            | Por quê                                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Docker Compose (dev + prod)** | Setup reproduzível: Mongo + seed + API + front. Dev com volumes/hot reload; prod com nginx servindo o build estático. |

---

## Endpoints principais

| Método              | Rota             | Quem                         |
| ------------------- | ---------------- | ---------------------------- |
| POST                | `/auth/register` | público                      |
| POST                | `/auth/login`    | público                      |
| GET/POST/PUT/DELETE | `/products`      | autenticado (escrita: admin) |
| POST                | `/chat`          | autenticado                  |
| POST                | `/chat/stream`   | autenticado (SSE)            |
| GET                 | `/health`        | público                      |

---

## O que faria diferente em produção

- **Auth**: refresh tokens, rotação de secret, rate limit em login/chat, HTTPS obrigatório.
- **LLM**: fila/timeouts, circuit breaker, custo por tenant, logs de tool calls sem vazar PII; fallback de modelo.
- **Streaming**: proxy (nginx) com buffering desligado para SSE; métricas de latência TTFT.
- **Frontend**: validação Zod espelhada nos forms; error boundaries; E2E críticos (login, CRUD, chat).
- **Observabilidade**: structured logs, OpenTelemetry, health checks profundos (Mongo + Groq).

---

## Decisões conscientes (resumo)

1. **Onion no backend** — isola domínio e facilita justificar multi-tenant + troca de LLM na entrevista.
2. **`companyId` só do JWT** — evita IDOR clássico de body spoofing.
3. **Chat widget + SSE** — UX moderna e bônus de streaming sem complexidade de WebSocket.
4. **Zod na borda** — contrato da API explícito; use cases focam em regra de negócio (404, 409, etc.).
5. **Dois Compose (dev/prod)** — demonstrar ambiente local e imagem otimizada sem misturar concerns.

---

## License

Este projeto está sob a licença [MIT](./LICENSE).
