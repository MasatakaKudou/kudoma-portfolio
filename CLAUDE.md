# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code (claude.ai/code) への指針です。

## コマンド

サイト（リポジトリのルート）:

- `npm start` — 開発サーバー（Vite）
- `npm run build` — 型チェック（`tsc --noEmit`）のあと、`build/` に本番ビルド（`vite build`。`outDir` を `build` にしてあるので `deploy.yml` は変更不要）
- `npm run preview` — ビルドした `build/` をローカルで配信
- `npm run lint` — `src` に対する ESLint（`eslint.config.js` のフラット設定: eslint recommended + typescript-eslint recommended + react-hooks）
- `npm test` — `./tests` に対する Jest（ts-jest、node 環境）
- `npx jest tests/service/ArticleService.spec.ts` — 1 つのテストファイルだけを実行（1 つのテストだけなら `-t "名前"` を追加）

Workers（`workers/` はサイトとは別の `package.json` を持つ）:

- `npm ci --prefix workers && npm run typecheck --prefix workers` — 2 つの Worker の型チェック
- `cd workers/<name> && npx wrangler@4.158.0 deploy --dry-run --outdir <dir>` — デプロイせずにバンドルだけ作る（ログイン不要）

Node のバージョンは `.node-version`（26.13.0）で固定されていて、CI も同じものを使う。サイトのビルドは Vite 8 で、Node 20.19 以上 / 22.12 以上が必要。

## アーキテクチャ

www.kudoma.net の 1 ページのポートフォリオ（React + TypeScript + MUI/Emotion、Vite でビルド）と、ブログと GitHub のセクションのデータを返す 2 つの Cloudflare Worker。

### サイト（`src/`）

- `src/App.tsx` が `src/components/*` のセクションからページを組み立てる。静的なコンテンツ（経歴・プロダクト・スキル）は `src/data/*` にあり、対応するコンポーネントの props で型が付いている。内容を変えるときは、コンポーネントではなくデータ側を編集する。
- `src/theme.ts` に MUI のテーマと、共通のデザイントークン（`ocean`、`elevation` など）がある。コンポーネントはそれを直接 import する。
- **ブログ記事**は動的なデータの 1 つ。`App.tsx` が `Site`（`qiita | zenn | kudoma`、`src/types/BlogType.ts` を参照）ごとに `ArticleService.fetchArticles` を呼ぶ。サービスは `<VITE_ARTICLE_BASE_URL>/articles/<site>` を取得し、各記事に、先頭を大文字にしたサイト名のタグを付ける。キャッシュはブラウザではなく、`article-backend`（Upstash Redis）がサーバー側で行う。`Blog.tsx` がタグ → ブランドカラー（`TAG_COLORS`）を対応づけているので、新しい `Site` を足すときは、型、`App.tsx`、Worker、このマップの 4 か所を更新する。
- **GitHub の活動**（ピン留めリポジトリ + 直近のコントリビューション）がもう 1 つの動的なデータ。`App.tsx` が `GithubActivityService.fetchActivity` を呼び、`<VITE_GITHUB_ACTIVITY_BASE_URL>/github-activity`（記事とは別の Worker）を取得して、`GithubActivity.tsx` で表示する。Worker は失敗時に空の活動を返し、サービスはそれを `undefined`（「取得できなかった」）にする。
- `HttpClient` はエラーを握りつぶして `undefined` を返す（ログは `console.error`）。呼び出し側は、例外を捕まえるのではなく、結果がないことを「見つからなかった」として扱う。
- 上流の失敗は、`article-backend` が空のリストとして 60 秒だけキャッシュする（成功は 1 時間）。変更する前に `workers/article-backend/src/index.ts` を読むこと。

### Workers（`workers/`）

`VITE_ARTICLE_BASE_URL` などが指す API のソース。TypeScript で、`wrangler` がバンドルする（ビルド手順はなし）。`workers/README.md` も参照。

- `article-backend` — `GET /articles/{qiita,zenn,kudoma}`。上流の API（URL はダッシュボードの環境変数）を取得して、`{title, updatedAt, url}` に正規化する。キャッシュもここが持つ。Upstash Redis のリードスルーキャッシュで、キーは `articles:<コミット SHA>:<site>`（デプロイのワークフローが SHA を `CACHE_VERSION` として渡すので、デプロイのたびにキャッシュが新しくなり、手で更新する必要はない。未設定なら `dev`）、TTL は成功が 1 時間、上流の失敗が 60 秒。書き込みは Worker 自身だけが行うので、公開の書き込みエンドポイントはない。Redis の環境変数がなければ、キャッシュしないだけ。新しい `Site` を足すときは、Worker の `SOURCES` にも足す。
- `github-activity` — `GET /github-activity`（ベース URL は `VITE_GITHUB_ACTIVITY_BASE_URL`）。`GITHUB_TOKEN`（ダッシュボードの secret。`GITHUB_USERNAME` は任意）で GitHub GraphQL API に問い合わせて、`{pinned: [{name, description, url, stars, language}], contributions: {total, days: [{date, count}]}}` に正規化する。キャッシュは同じ Upstash のリードスルー方式（キーは `github-activity`、成功 1 時間 / 失敗 60 秒、失敗時は空の活動を返す）。公開の書き込みエンドポイントはなく、`Content-Type: application/json` を返す。
- `wrangler.toml` は `keep_vars = true` を設定している。環境変数と secret（`QIITA_API_ENDPOINT` など、`UPSTASH_REDIS_REST_URL`、`UPSTASH_REDIS_REST_TOKEN`）は、リポジトリではなく Cloudflare のダッシュボードにある。これを消すと、デプロイで消えてしまうので、消さないこと。`compatibility_date` は、Worker ごとに、デプロイ済みの値で固定している。

### CI/CD（`.github/workflows/`）

`main` にマージすると、自動でデプロイされる:

- `deploy.yml` — `main` への push のたびに、サイトを GitHub Pages にデプロイする。`concurrency`（グループ `pages`）で、デプロイは同時に 1 つだけ。待っている実行は、新しいものに置き換わる。
- `deploy-article-backend.yml` — `workers/article-backend/**` が変わったときだけ（または手動の「Run workflow」で）Worker をデプロイする。トークンはリポジトリの secret: `CLOUDFLARE_API_TOKEN`（その Worker だけに限定）と `CLOUDFLARE_ACCOUNT_ID`。
- `deploy-github-activity.yml` — `workers/github-activity/**` について、同じ。`CLOUDFLARE_API_TOKEN` を使い回すので、そのスコープにこの Worker も含める必要がある。
- すべてのデプロイのワークフローは、結果を `SLACK_WEBHOOK_URL` の secret 経由で Slack に通知する（未設定なら何もしない）。ジョブには `timeout-minutes` を付けてある。
- `ci.yml` — PR と push で、`npm run lint`、`npm test`、Workers の型チェックを実行する。ジョブ名 `lint-and-test` が必須のステータスチェック。
- `.github/dependabot.yml` — ルートの npm、`workers/` の npm、GitHub Actions について、毎週（月曜、JST）グループ化した PR を作る。サイトの `typescript` の major 更新は ignore している（`ts-jest` と `typescript-eslint` が TypeScript 7 に未対応。外す条件は #78）。Dependabot は、`.node-version` と、デプロイのワークフロー内の `wrangler@4.158.0` の固定を追えないので、それらは手で上げる。

`main` は保護されている。変更は PR で行い、`lint-and-test` が通る必要があり、これは管理者にも適用される。リポジトリの auto-merge は無効なので、チェックが通ったら手動でマージする。PR を積み重ねるときは、次の PR のターゲットを `main` に付け替える前に、ベースのブランチを削除しないこと（GitHub が PR をクローズしてしまう）。

## 環境変数

`.env`（リポジトリにコミットしてある）に、`VITE_ENV`、`VITE_ARTICLE_BASE_URL`、`VITE_GITHUB_ACTIVITY_BASE_URL` を定義している。Vite がビルド時に `import.meta.env.VITE_*` を埋め込む。読むのは `src/env.ts` だけで、`tests/service/ArticleService.spec.ts` はこれを `jest.mock` で差し替える（Jest は CommonJS で動き、`import.meta` が使えないため）。このテストは `fetch` もモックしているので、テストはネットワークを呼ばない。
