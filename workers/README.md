# Cloudflare Workers

Source of the backend APIs used by the portfolio site. Each directory is one Worker.

| Directory | Worker name | Endpoints |
| --- | --- | --- |
| `article-backend/` | `kudoma-portfolio-article-backend` | `GET /articles/{qiita,zenn,kudoma}` |
| `cache-backend/` | `kudoma-portfolio-cache-backend` | `GET /get?key=`, `POST /set` (Upstash Redis, TTL 1h) |

## Development

Workers are written in TypeScript (`src/index.ts`); `wrangler` bundles them, no build step. Type checking uses the dependencies in `workers/package.json` (kept separate from the site's):

```bash
npm ci --prefix workers
npm run typecheck --prefix workers
```

CI runs the type check on every pull request.

## Environment variables

Set in the Cloudflare dashboard (not in this repo). `wrangler.toml` uses `keep_vars = true` so deploys do not remove them.

- `article-backend`: `QIITA_API_ENDPOINT`, `ZENN_API_ENDPOINT`, `KUDOMA_API_ENDPOINT`
- `cache-backend`: `REDIS_REST_URL`, `REDIS_REST_TOKEN` (secret)

## Deploy (manual)

```bash
cd workers/article-backend
npx wrangler@4 login          # first time only
npx wrangler@4 deploy --dry-run   # check what would be deployed
npx wrangler@4 deploy
```

## Deploy (GitHub Actions)

Each Worker has its own workflow that deploys it when its directory changes on `main` (or via manual run):

- `.github/workflows/deploy-article-backend.yml` (token: `CLOUDFLARE_API_TOKEN`)
- `.github/workflows/deploy-cache-backend.yml` (token: `CLOUDFLARE_API_TOKEN_CACHE`)

Repository secrets: one API token per Worker (scoped to editing that Worker only) and the shared `CLOUDFLARE_ACCOUNT_ID`.
