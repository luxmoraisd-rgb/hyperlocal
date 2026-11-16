# Repository instructions

These instructions apply to the whole HyperLocal repository. Read `docs/PROJECT_GUIDE.md` for the full setup and implementation guide.

## Architecture rules

- Keep `apps/web-react` and `apps/web-vue` as separate applications. Do not mount one framework inside the other without an explicit product requirement.
- Both clients use the versioned FastAPI service under `/api/v1`; keep business rules and authoritative validation on the backend.
- Keep HTTP route handlers thin. Put input/output models in `backend/app/schemas`, business operations in `backend/app/services`, and persistence operations in `backend/app/repositories`.
- Group API endpoints by product domain as the API grows; keep `backend/app/api/v1/router.py` as the versioned router aggregator.
- Use `.env.example` to document environment variables. Never commit secrets or a local `.env` file.
- Do not invent product screens, entities, or app ownership. Confirm them from the product brief/design before implementing product behavior.

## File and naming rules

- React and Vue source files use TypeScript. Use `.tsx` for React components, `.vue` for Vue single-file components, and `.ts` for shared logic, API clients, types, and utilities.
- Use PascalCase for component files and component names, for example `StoreCard.tsx` or `StoreCard.vue`.
- Use camelCase for TypeScript functions, variables, and non-component modules, for example `getStores.ts` and `formatPrice`.
- Use snake_case for Python modules, functions, variables, and packages, for example `store_service.py` and `get_store`.
- Use PascalCase for Python classes and Pydantic models; suffix API models with `Create`, `Update`, or `Read` when their role differs.
- Use lowercase kebab-case for Markdown documents and general asset filenames. Keep filenames descriptive and avoid spaces, abbreviations, and names such as `utils2` or `new-file`.
- Put a feature's code with that feature when practical; do not grow a miscellaneous catch-all directory.

## Change workflow

1. Read the project guide and the relevant neighboring files before adding code.
2. Put new files in the appropriate app, API, schema, service, or repository directory.
3. Add or update configuration examples and documentation when a change introduces a setting, command, or architectural decision.
4. Keep changes scoped; do not add dependencies without a clear need.
5. Before handing off, summarize files changed and describe any checks that were run. Do not claim a check was run unless it actually was.
