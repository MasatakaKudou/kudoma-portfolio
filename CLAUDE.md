# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — dev server (Create React App / react-scripts)
- `npm run build` — production build to `build/`
- `npm test` — Jest (ts-jest, node environment) over `./tests`; this is the main test command
- `npx jest tests/utils/CacheClient.spec.ts` — run a single test file (add `-t "name"` for a single test)
- `npm run test-ui` — react-scripts test runner (CRA default; not used by the main suite)

Node version is pinned in `.node-version` (CI uses v20.8.1). No lint script; ESLint runs via CRA's `react-app` config.

## Architecture

Single-page personal portfolio (React 18 + TypeScript + MUI/Emotion), deployed to GitHub Pages at www.kudoma.net (`public/CNAME`) by `.github/workflows/deploy.yml` on every push to `main`.

- `src/App.tsx` composes the page from `src/components/*` sections. Static content (experiences, products, skills) lives in `src/data/*` and is typed by the props of the corresponding component — edit data there rather than in components.
- `src/theme.ts` holds the MUI theme and shared design tokens (`ocean`, `elevation`, …) imported directly by components.
- **Blog articles** are the only dynamic data. `App.tsx` calls `ArticleService.fetchArticles` for each `Site` (`qiita | zenn | kudoma`, see `src/types/BlogType.ts`). The service first checks a Redis-backed cache via `CacheClient` (key `<site>-blog`), and on a miss fetches from an external article API (`<REACT_APP_ARTICLE_BASE_URL>/articles/<site>`), tags each article with the capitalized site name, and writes back to the cache. `Blog.tsx` maps tag → brand color (`TAG_COLORS`), so adding a new `Site` means updating the type, `App.tsx`, and that map.
- `HttpClient` swallows errors and returns `undefined`/`false` (logging via `console.error`), so callers treat a missing result as "not found" rather than catching exceptions.

## Environment

`.env` (committed to the repo) defines `REACT_ENV`, `REACT_APP_ARTICLE_BASE_URL`, and `REACT_APP_CACHE_BASE_URL`. These are inlined at build time by CRA; `jest.setup.js` loads them via dotenv so tests hit the real cache endpoint configured there (`tests/utils/CacheClient.spec.ts`).
