# Cloudflare Workers

Source of the backend API used by the portfolio site. Each directory is one Worker.

| Directory | Worker name | Endpoints |
| --- | --- | --- |
| `article-backend/` | `kudoma-portfolio-article-backend` | `GET /articles/{qiita,zenn,kudoma}` (read-through cache in Upstash Redis: 1h on success, 60s on an upstream failure) |

## Development

Workers are written in TypeScript (`src/index.ts`); `wrangler` bundles them, no build step. Type checking uses the dependencies in `workers/package.json` (kept separate from the site's):

```bash
npm ci --prefix workers
npm run typecheck --prefix workers
```

CI runs the type check on every pull request.

## Environment variables

Set in the Cloudflare dashboard (not in this repo). `wrangler.toml` uses `keep_vars = true` so deploys do not remove them.

- `article-backend`: `QIITA_API_ENDPOINT`, `ZENN_API_ENDPOINT`, `KUDOMA_API_ENDPOINT`, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (secret; optional — without them the Worker simply does not cache)

## Deploy (manual)

```bash
cd workers/article-backend
npx wrangler@4 login          # first time only
npx wrangler@4 deploy --dry-run   # check what would be deployed
npx wrangler@4 deploy
```

## Deploy (GitHub Actions)

The Worker has its own workflow that deploys it when its directory changes on `main` (or via manual run):

- `.github/workflows/deploy-article-backend.yml` (token: `CLOUDFLARE_API_TOKEN`)

Repository secrets: an API token scoped to editing that Worker only (`CLOUDFLARE_API_TOKEN`) and `CLOUDFLARE_ACCOUNT_ID`.
