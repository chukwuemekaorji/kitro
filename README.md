# Kitro Product Manager

A scoped slice of Kitro's product management web app: sign in, view key stats on an
Overview dashboard, and search/manage products on a Products page. Built for the
software engineer intern take-home assignment.

## Features Implemented

### Starred-in-brief features (built even though this submission targets the junior track)

- ✅ Persistent sidebar with Overview and Products navigation, active-state highlight
- ✅ Kitro branding applied via a Material-UI theme (brand color palette, backgrounds, text)
- ✅ Sign-in screen, backend-verified, JWT-backed session

### This submission's 5 chosen stories

- ✅ Overview: total products sold (stat card)
- ✅ Overview: total products available (stat card)
- ✅ Searchable product table (name, stock quantity, total sold, price) — filters by name as you type
- ✅ Delete product, with a confirmation dialog
- ✅ Favourite a product (star toggle)

### Also included, not in the original story list

- ✅ Sign-out button


## Tech Stack

- **Frontend**: React 19 + TypeScript (Vite) + Material-UI + React Router
- **Backend**: Python 3.12 + FastAPI + SQLAlchemy
- **Database**: PostgreSQL 16
- **Auth**: JWT bearer tokens, bcrypt password hashing
- **Data seeding**: Faker (local library, not an external API)
- **Infra**: Docker + docker-compose — one command runs the whole stack

## Setup Instructions

### Prerequisites

- Docker + Docker Compose

That's the only prerequisite — no local Node, Python, or PostgreSQL install needed,
everything runs in containers.

### Run it

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Start everything:
   ```bash
   docker-compose up --build
   ```
3. Wait for all three containers (`db`, `backend`, `frontend`) to start.
4. Open **http://localhost:5173**.

A demo user and 20 seed products are created automatically on first boot — no manual
seeding step.

The API is available at `http://localhost:8000`, with interactive Swagger docs at
`http://localhost:8000/docs`.

### Troubleshooting

- **Postgres fails to start / backend never comes up** — almost always means step 1
  above was skipped. `docker-compose.yml` reads its Postgres credentials and JWT secret
  from `.env`, and Postgres refuses to start without a password.
- **Ports in use** — the app expects `5173` (frontend), `8000` (backend), and `5432`
  (Postgres) free on the host.

## Default Users

- **Demo user**: `demo@kitro.dev` / `KitroDemo123!` — the only seeded user. This build
  doesn't implement role-based authorization (out of scope, see above), so there's one
  login rather than several roles.

## Project Structure

```
kitro/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app: CORS, router wiring, startup seeding
│   │   ├── models.py         # SQLAlchemy models (Product, User)
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   ├── auth.py           # Password hashing, JWT issue/verify, get_current_user
│   │   ├── database.py       # Engine, session factory, declarative Base
│   │   ├── config.py         # Env-driven settings (DATABASE_URL, JWT_SECRET)
│   │   ├── seed.py           # Faker-based product + demo user seeding
│   │   └── routers/          # auth.py, products.py, overview.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/            # SignInPage, OverviewPage, ProductsPage
│   │   ├── components/       # ConfirmDialog, layout/ (AppShell, Sidebar)
│   │   ├── auth/              # AuthContext, RequireAuth (route guard)
│   │   ├── api/                # client.ts (fetch wrapper, attaches JWT)
│   │   ├── theme.ts            # Kitro brand palette (MUI theme)
│   │   └── types.ts            # shared Product type
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Feature Details

### Authentication

- JWT-based: signing in returns a token, stored client-side and sent as an
  `Authorization: Bearer` header on every subsequent request
- Failed sign-in returns the same generic error whether the email or the password was
  wrong, so neither leaks which one it was
- Every `/products` and `/overview` endpoint requires a valid token — enforced on the
  backend, not just hidden in the UI, and the frontend route guard bounces an
  unauthenticated visitor to sign-in and back again afterward

### Overview Page

- Total products sold and total products available, both computed with `SUM()` in
  Postgres rather than summed client-side

### Products Page

- Searchable table (name, stock quantity, total sold, price), filtering by name as you
  type (debounced, hits the backend's `ILIKE` search rather than filtering client-side)
- Delete with a confirmation dialog naming the specific product being removed
- Favourite toggle (star icon) per row, backed by the actual stored `is_favourite` value

## API Endpoints

### Auth

- `POST /auth/login` — email + password → JWT

### Products (all require a valid token)

- `GET /products` — list all products; optional `?search=` filters by name
- `DELETE /products/{id}` — delete a product
- `PATCH /products/{id}/favourite` — toggle a product's favourite status

### Overview (requires a valid token)

- `GET /overview/stats` — total products sold, total products available

## Notable Decisions

- JWTs are sent as `Authorization: Bearer` headers rather than cookies, which is also
  why there's no CSRF protection — a bearer header isn't auto-attached by the browser,
  so there's no cross-site request to forge.
- The database schema is created via SQLAlchemy's `create_all()` on backend startup —
  no migration tool. The schema is small and stable enough that a tool like Alembic
  would be overhead rather than value at this scope.
- Seed data (20 products, 1 demo user) is generated automatically on first boot only if
  those tables are empty, so restarting the stack never duplicates data.
