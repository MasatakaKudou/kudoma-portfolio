# Cloudflare Workers

Source of the backend APIs used by the portfolio site. Each directory is one Worker.

| Directory | Worker name | Endpoints |
| --- | --- | --- |
| `article-backend/` | `kudoma-portfolio-article-backend` | `GET /articles/{qiita,zenn,kudoma}` |

## Environment variables

Set in the Cloudflare dashboard (not in this repo). `wrangler.toml` uses `keep_vars = true` so deploys do not remove them.

- `article-backend`: `QIITA_API_ENDPOINT`, `ZENN_API_ENDPOINT`, `KUDOMA_API_ENDPOINT`

## Deploy (manual)

```bash
cd workers/article-backend
npx wrangler@4 login          # first time only
npx wrangler@4 deploy --dry-run   # check what would be deployed
npx wrangler@4 deploy
```
