# HyperLocal project guide

This guide explains how to set up, extend, and build the HyperLocal starter repository. It documents the current scaffold; product features and screen ownership still need to be taken from the approved product requirements and Figma design.

## 1. Project architecture

The repository is a small monorepo with independent frontend applications and a shared backend:

```text
hyperlocal/
├── apps/
│   ├── web-react/                 React + TypeScript + Vite client
│   └── web-vue/                   Vue + TypeScript + Vite client
├── backend/
│   ├── requirements.txt           Python dependencies
│   └── app/
│       ├── main.py                FastAPI application and middleware
│       ├── api/v1/                Versioned HTTP routes and router
│       │   └── routes/            Endpoint modules, grouped by domain
│       ├── core/                  Configuration and cross-cutting setup
│       ├── schemas/               Request and response models
│       ├── services/              Product rules and use cases
│       └── repositories/          Database reads and writes
├── docs/                          Project documentation
├── .env.example                   Documented local environment variables
├── package.json                   JavaScript workspace and root scripts
└── README.md                      Short entry point and quick start
```

React and Vue are intentionally separate apps. They can serve different user experiences or be evaluated before choosing one primary client. They should not render inside each other by default. Both use the same HTTP API at `/api/v1`, so backend validation and business rules remain consistent.

The request path for a typical feature is:

```text
React or Vue view → frontend API client → FastAPI route → schema validation
                  → service/use case → repository → data store
```

The data store is not selected or configured yet. Add one when the product requirements identify the persistence needs.

## 2. Prerequisites

- Node.js and npm (Node 22 or a compatible current LTS release is recommended for the Vite toolchain).
- Python 3.10 or newer and `pip`.
- A terminal opened at the repository root.

## 3. First-time setup

### Install frontend dependencies

From the repository root:

```powershell
npm install
```

The root npm workspace installs both frontend applications and writes the shared `package-lock.json`. Run npm commands from the root unless a command specifically says to change directories.

### Set up the backend environment

From the repository root in PowerShell:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
cd ..
```

If PowerShell blocks activation, use the Python executable directly instead:

```powershell
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

### Configure local environment

Copy the example file when local overrides are needed:

```powershell
Copy-Item .env.example .env
```

`.env` is ignored by Git. Keep only non-secret local settings there. Add every new supported variable, its purpose, and a safe example value to `.env.example`. Do not place credentials or production secrets in source control.

Current settings:

| Variable | Default/example | Used by |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` | React and Vue API clients |
| `API_CORS_ORIGINS` | `http://localhost:5173,http://localhost:5174` | FastAPI CORS middleware |

## 4. Run the applications

Open three terminals at the repository root.

Terminal 1, React:

```powershell
npm run dev:react
```

Terminal 2, Vue:

```powershell
npm run dev:vue
```

Terminal 3, FastAPI:

```powershell
cd backend
..\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

The React client runs at `http://localhost:5173`, Vue at `http://localhost:5174`, and the API at `http://localhost:8000`. FastAPI's interactive API documentation is at `http://localhost:8000/docs`; its starter health endpoint is `http://localhost:8000/api/v1/health`.

## 5. Create folders and files

### General steps

1. Identify the owning application or backend layer before creating a file.
2. Add a folder only when it groups related files; avoid deeply nested folders for a single file.
3. Name the file for its feature or responsibility, using the conventions below.
4. Add an `__init__.py` to new Python package directories.
5. Update the relevant router, import, or workspace configuration so the new code is reachable.
6. Update this guide or `.env.example` if the change introduces a workflow or setting other developers need.

### PowerShell examples

Create a React feature folder and component:

```powershell
New-Item -ItemType Directory -Force apps/web-react/src/features/shops
New-Item -ItemType File apps/web-react/src/features/shops/ShopCard.tsx
```

Create a Vue feature folder and component:

```powershell
New-Item -ItemType Directory -Force apps/web-vue/src/features/shops
New-Item -ItemType File apps/web-vue/src/features/shops/ShopCard.vue
```

Create a FastAPI route module and Python package folder:

```powershell
New-Item -ItemType Directory -Force backend/app/api/v1/routes/shops
New-Item -ItemType File backend/app/api/v1/routes/shops/__init__.py
New-Item -ItemType File backend/app/api/v1/routes/shops/routes.py
```

For a simple domain with one route file, prefer `backend/app/api/v1/routes/shops.py` instead of a nested route package. Keep the structure as flat as practical.

### Naming conventions

| Kind | Convention | Example |
|---|---|---|
| React component file and component | PascalCase | `ShopCard.tsx`, `ShopCard` |
| Vue component file and component | PascalCase | `ShopCard.vue`, `ShopCard` |
| TypeScript module, function, variable | camelCase | `shopApi.ts`, `getShopById` |
| TypeScript type/interface | PascalCase | `Shop`, `ShopRead` |
| Python module and package | snake_case | `shop_service.py`, `shops` |
| Python function and variable | snake_case | `get_shop`, `shop_id` |
| Python class and Pydantic model | PascalCase | `ShopService`, `ShopCreate` |
| Documentation file | lowercase kebab-case | `project-guide.md` |
| Environment variable | UPPER_SNAKE_CASE | `API_CORS_ORIGINS` |

Avoid spaces, generic names (`stuff`, `misc`, `helpers`), unexplained abbreviations, and numeric suffixes. Use a feature name consistently across the frontend and backend, for example `shops`.

## 6. Add a backend feature

For a feature such as shops, keep responsibilities separated:

1. Define input/output shapes in `backend/app/schemas/shop.py` (`ShopCreate`, `ShopUpdate`, `ShopRead`).
2. Implement data access in `backend/app/repositories/shop_repository.py` when persistence is introduced.
3. Put business rules in `backend/app/services/shop_service.py`.
4. Add HTTP endpoints in `backend/app/api/v1/routes/shops.py`. Route handlers parse HTTP input, call a service, and return the response; they should not contain database queries or long business workflows.
5. Register the feature router in `backend/app/api/v1/router.py` with a clear prefix such as `/shops` and a tag such as `shops`.
6. Document authentication, validation, status codes, and any new environment settings.

Keep route paths plural for collections, use HTTP methods according to their purpose (`GET` read, `POST` create/action, `PATCH` partial update, `DELETE` delete), and return consistent response models. Never trust client-side validation as the only validation.

## 7. Add a frontend feature

1. Add feature-specific files beneath the selected app's `src/features/<feature>/` directory. Keep `App` and the app entry point focused on bootstrapping and top-level layout.
2. Add the HTTP calls to `src/api/` (or a feature-local API module when the app grows), not directly into reusable presentation components.
3. Keep API response types in a nearby `types.ts` or a shared types folder. Keep component-specific view state in the component; move reusable state logic into a feature hook/composable.
4. Use the design's spacing, color, typography, component, and responsive rules once Figma access and screen ownership are confirmed. Do not treat the current generic starter screen as final product design.
5. Handle loading, empty, success, and error states for data-driven views. Ensure controls have labels and keyboard-visible focus states.

Keep React-specific code in `apps/web-react` and Vue-specific code in `apps/web-vue`. If both apps truly need shared framework-independent assets or API types, first establish a shared workspace package rather than importing source files across app boundaries.

## 8. Build and common commands

Run both frontend production builds from the root:

```powershell
npm run build
```

Run one frontend build directly:

```powershell
npm run build --workspace @hyperlocal/web-react
npm run build --workspace @hyperlocal/web-vue
```

Build output is written to each app's `dist/` directory and is ignored by Git. Run the API locally with Uvicorn as shown above; deployment packaging and hosting are not configured in this starter yet.

Other useful commands:

```powershell
npm run dev:react
npm run dev:vue
python -m pip install -r backend/requirements.txt
```

## 9. Change and review workflow

1. Start from the relevant product requirement and design flow.
2. Identify whether the change belongs in React, Vue, FastAPI, or more than one layer.
3. Add the API contract first when frontend and backend work together.
4. Implement the backend schema, route, service, and repository responsibilities as needed; implement the frontend API client and view.
5. Keep config examples and this guide in sync with the code.
6. Review the diff for accidental generated files, secrets, duplicated business rules, and incorrect imports.
7. Run the appropriate checks for the change and report which checks ran and their outcome.

## 10. Troubleshooting

- **Frontend cannot reach the API:** make sure Uvicorn is running on port 8000, check `VITE_API_BASE_URL`, and confirm the frontend origin is listed in `API_CORS_ORIGINS`.
- **Frontend port is already in use:** Vite is configured to fail instead of silently selecting a different port; stop the conflicting process or change the port and update CORS settings.
- **Python import error for `app`:** run Uvicorn from the `backend` directory using `uvicorn app.main:app --reload`.
- **Missing frontend packages:** run `npm install` at the repository root.
- **Python dependency missing:** activate `backend/.venv` and run `python -m pip install -r backend/requirements.txt`.

## 11. Decisions still to make

- What product roles/screens each frontend owns, and whether both clients are needed long term.
- The domain model, database, migrations, authentication, and authorization requirements.
- Deployment targets, production environment configuration, and API hosting.
- Final page layouts and design tokens from the Figma file.
