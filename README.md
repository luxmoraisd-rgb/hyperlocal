# HyperLocal

Starter monorepo for the HyperLocal product. The repository contains separate React and Vue frontends and one FastAPI backend. The Figma screens will guide product features and visual styling once the file is accessible.

See [AGENTS.md](AGENTS.md) for repository instructions and [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md) for the full setup, file/folder naming, architecture, and development workflow.

## Architecture

```text
apps/
  web-react/       React + TypeScript + Vite client
  web-vue/         Vue + TypeScript + Vite client
backend/
  app/
    api/v1/         Versioned HTTP routes and router
    core/           Configuration and cross-cutting setup
    schemas/        Request/response models (add by feature)
    services/       Business rules (add by feature)
    repositories/   Database access (add with persistence)
```

Both frontends are independent deployable applications and call the same versioned API (`/api/v1`). Keep product rules in FastAPI; keep view state and presentation in each frontend. Choose a single primary frontend once the Figma screens and ownership of each app are confirmed. Avoid embedding one framework inside the other unless a specific integration requirement emerges.

## Run locally

Install JavaScript dependencies from the repository root:

```bash
npm install
npm run dev:react
# In another terminal: npm run dev:vue
```

Run the API in another terminal:

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API health endpoint is `http://localhost:8000/api/v1/health`; interactive API docs are at `http://localhost:8000/docs`.

## Configuration

Copy `.env.example` to `.env` when you need to override local settings. Frontend dev servers use ports 5173 (React) and 5174 (Vue); the API allows those origins by default.
