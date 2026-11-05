# Cloudflare Workers

ポートフォリオサイトが使うバックエンド API のソース。ディレクトリ 1 つが Worker 1 つ。

| ディレクトリ | Worker 名 | エンドポイント |
| --- | --- | --- |
| `article-backend/` | `kudoma-portfolio-article-backend` | `GET /articles/{qiita,zenn,kudoma}`（Upstash Redis のリードスルーキャッシュ: 成功は 1 時間、上流の失敗は 60 秒） |
| `github-activity/` | `kudoma-portfolio-github-activity` | `GET /github-activity`（GitHub GraphQL API で、ピン留めリポジトリ + 直近のコントリビューションを取得。キャッシュは同じ方式） |

## 開発

Worker は TypeScript（`src/index.ts`）で書いていて、`wrangler` がバンドルする（ビルド手順はなし）。型チェックは `workers/package.json` の依存を使う（サイトのものとは別）:

```bash
npm ci --prefix workers
npm run typecheck --prefix workers
```

CI は、プルリクエストのたびに型チェックを実行する。

## 環境変数

Cloudflare のダッシュボードで設定する（このリポジトリにはない）。`wrangler.toml` は `keep_vars = true` を設定しているので、デプロイしても消えない。

- `article-backend`: `QIITA_API_ENDPOINT`、`ZENN_API_ENDPOINT`、`KUDOMA_API_ENDPOINT`、`UPSTASH_REDIS_REST_URL`、`UPSTASH_REDIS_REST_TOKEN`（secret。任意で、なければ Worker はキャッシュしないだけ）
- `github-activity`: `GITHUB_TOKEN`（secret。公開のプロフィール情報を読める GitHub のトークン。追加の権限のない fine-grained トークンで足りる）、`GITHUB_USERNAME`（任意。既定は `MasatakaKudou`）、そして任意の `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`（`article-backend` と同じ）

## デプロイ（手動）

```bash
cd workers/article-backend
npx wrangler@4 login          # 初回のみ
npx wrangler@4 deploy --dry-run   # デプロイされる内容を確認
npx wrangler@4 deploy
```

## デプロイ（GitHub Actions）

Worker ごとに専用のワークフローがあり、`main` でそのディレクトリが変わったとき（または手動実行）にデプロイする:

- `.github/workflows/deploy-article-backend.yml`（トークン: `CLOUDFLARE_API_TOKEN`）
- `.github/workflows/deploy-github-activity.yml`（トークン: `CLOUDFLARE_API_TOKEN`）

リポジトリの secret は、これらの Worker の編集だけに限定した API トークン（`CLOUDFLARE_API_TOKEN`）と `CLOUDFLARE_ACCOUNT_ID`。新しい Worker は、トークンのスコープに含める前に、一度作成（最初の手動デプロイ）しておく必要がある。
