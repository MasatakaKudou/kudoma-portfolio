# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Site (repo root):

- `npm start` — dev server (Create React App / react-scripts)
- `npm run build` — production build to `build/`
- `npm run lint` — ESLint over `src` (CRA's `react-app` config)
- `npm test` — Jest (ts-jest, node environment) over `./tests`
- `npx jest tests/utils/CacheClient.spec.ts` — run a single test file (add `-t "name"` for a single test)

Workers (`workers/` has its own `package.json`, separate from the site's):

- `npm ci --prefix workers && npm run typecheck --prefix workers` — type-check both Workers
- `cd workers/<name> && npx wrangler@4.156.2 deploy --dry-run --outdir <dir>` — bundle without deploying (no login needed)

Node version is pinned in `.node-version` (26.13.0) and used by CI. The site's `typescript` stays on 4.9 for react-scripts; the Workers use a newer one.

## Architecture

Single-page personal portfolio (React 18 + TypeScript + MUI/Emotion) at www.kudoma.net, plus a Cloudflare Worker that backs its blog section.

### Site (`src/`)

- `src/App.tsx` composes the page from `src/components/*` sections. Static content (experiences, products, skills) lives in `src/data/*` and is typed by the props of the corresponding component — edit data there rather than in components.
- `src/theme.ts` holds the MUI theme and shared design tokens (`ocean`, `elevation`, …) imported directly by components.
- **Blog articles** are the only dynamic data. `App.tsx` calls `ArticleService.fetchArticles` for each `Site` (`qiita | zenn | kudoma`, see `src/types/BlogType.ts`). The service fetches `<REACT_APP_ARTICLE_BASE_URL>/articles/<site>` and tags each article with the capitalized site name. Caching is done server-side by `article-backend` (Upstash Redis), not by the browser. `Blog.tsx` maps tag → brand color (`TAG_COLORS`), so adding a new `Site` means updating the type, `App.tsx`, the Worker, and that map.
- `HttpClient` swallows errors and returns `undefined` (logging via `console.error`), so callers treat a missing result as "not found" rather than catching exceptions.
- Upstream failures are cached by `article-backend` as an empty list for only 60 seconds (successes for 1 hour) — see `workers/article-backend/src/index.ts` before changing this.

### Workers (`workers/`)

Source of the API `REACT_APP_ARTICLE_BASE_URL` points to. TypeScript, bundled by `wrangler` (no build step); see `workers/README.md`.

- `article-backend` — `GET /articles/{qiita,zenn,kudoma}`; fetches the upstream APIs (URLs come from dashboard env vars) and normalizes them to `{title, updatedAt, url}`. It also owns the cache: a read-through cache in Upstash Redis (key `articles:<site>`, 1 hour on success, 60 seconds on an upstream failure), written only by the Worker itself, so there is no public write endpoint. Without the Redis vars it just does not cache. Adding a new `Site` means adding it to `SOURCES` in the Worker.
- `wrangler.toml` sets `keep_vars = true`: env vars and secrets (`QIITA_API_ENDPOINT`, …, `REDIS_REST_URL`, `REDIS_REST_TOKEN`) live in the Cloudflare dashboard, not in the repo. Do not remove it, or a deploy would wipe them. `compatibility_date` is pinned to the deployed value per Worker.

### CI/CD (`.github/workflows/`)

Merging to `main` deploys automatically:

- `deploy.yml` — site to GitHub Pages on every push to `main`.
- `deploy-article-backend.yml` — the Worker, only when `workers/article-backend/**` changes (or via manual "Run workflow"). Tokens are repo secrets: `CLOUDFLARE_API_TOKEN` (scoped to that one Worker) and `CLOUDFLARE_ACCOUNT_ID`.
- Both deploy workflows post the result to Slack via the `SLACK_WEBHOOK_URL` secret (skipped if unset).
- `ci.yml` — on PRs and pushes: `npm run lint`, `npm test`, and the Workers type check. Job name `lint-and-test` is the required status check.
- `.github/dependabot.yml` — weekly (Monday, JST) grouped PRs for the root npm, `workers/` npm and GitHub Actions. The site's `typescript` major updates are ignored (react-scripts needs 4.9). Dependabot cannot track `.node-version` or the `wrangler@4.156.2` pin inside the deploy workflows, so bump those by hand.

`main` is protected: changes go through a PR, `lint-and-test` must pass, and this applies to admins too. Repo auto-merge is disabled, so merge manually after checks pass. For stacked PRs, don't delete the base branch before retargeting the next PR to `main` — GitHub closes it instead.

## Environment

`.env` (committed to the repo) defines `REACT_ENV` and `REACT_APP_ARTICLE_BASE_URL`. These are inlined at build time by CRA; `jest.setup.js` loads them via dotenv. `tests/service/ArticleService.spec.ts` mocks `fetch`, so tests make no network calls.
