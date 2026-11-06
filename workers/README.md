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

`wrangler` もこの `package.json` の devDependency にある（Dependabot が更新する）。デプロイのワークフローも、ここの `wrangler` を使う。

## 環境変数

Cloudflare のダッシュボードで設定する（このリポジトリにはない）。`wrangler.toml` は `keep_vars = true` を設定しているので、デプロイしても消えない。

- `article-backend`: `QIITA_API_ENDPOINT`、`ZENN_API_ENDPOINT`、`KUDOMA_API_ENDPOINT`、`UPSTASH_REDIS_REST_URL`、`UPSTASH_REDIS_REST_TOKEN`（secret。任意で、なければ Worker はキャッシュしないだけ）
- `github-activity`: `GITHUB_TOKEN`（secret。公開のプロフィール情報を読める GitHub のトークン。追加の権限のない fine-grained トークンで足りる）、`GITHUB_USERNAME`（任意。既定は `MasatakaKudou`）、そして任意の `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`（`article-backend` と同じ）

## デプロイ（手動）

```bash
npm ci --prefix workers       # wrangler は workers/package.json の devDependency
cd workers/article-backend
npx wrangler login            # 初回のみ
npx wrangler deploy --dry-run # デプロイされる内容を確認
npx wrangler deploy
```

## デプロイ（GitHub Actions）

Worker ごとに専用のワークフローがあり、`main` でそのディレクトリが変わったとき（または手動実行）にデプロイする（`npm ci --prefix workers` のあと、ここの `wrangler` を使う）:

- `.github/workflows/deploy-article-backend.yml`（トークン: `CLOUDFLARE_API_TOKEN`）
- `.github/workflows/deploy-github-activity.yml`（トークン: `CLOUDFLARE_API_TOKEN`）

リポジトリの secret は、これらの Worker の編集だけに限定した API トークン（`CLOUDFLARE_API_TOKEN`）と `CLOUDFLARE_ACCOUNT_ID`。新しい Worker は、トークンのスコープに含める前に、一度作成（最初の手動デプロイ）しておく必要がある。

## キャッシュの確認

キャッシュ（Upstash Redis）が動いているかは、次の 2 つで確認できる。API のレスポンスには、キャッシュに当たったかどうかを示すヘッダーはない。

### Upstash の Data Browser でキーを見る

1. Upstash のコンソールで、このアプリの Redis データベースを開き、Data Browser を選ぶ。
2. キーを検索する。
   - `article-backend`: `articles*`。キーは `articles:<デプロイのコミット SHA>:<site>`（`site` は `qiita` / `zenn` / `kudoma`）。デプロイのたびに SHA が変わるので、古いデプロイのキーは、TTL が切れて消えるまで残る。
   - `github-activity`: `github-activity`
   - 画面によっては、`:` が `%3A` と表示されることがある。検索は `articles*` で足りる。
3. キーを開いて、TTL と値を確認する。
   - TTL: 成功した結果は 3600 秒（1 時間）以下、上流の取得に失敗した直後の（空の）結果は 60 秒以下
   - 値: `article-backend` は記事のリスト（`{title, updatedAt, url, ...}` の配列）、`github-activity` は `{pinned, contributions}`。失敗時は空のリスト・空の活動

### Worker のログでエラーを見る

Cloudflare のダッシュボードで対象の Worker を開き、リアルタイムログ（Real-time Logs）を見ながら、サイトを開いて（または `GET /articles/<site>` / `GET /github-activity` を呼んで）ログを確認する。

- `Failed to read cache` / `Failed to write cache`: Upstash への読み書きに失敗している。API のレスポンスは、上流から取得して返すので、止まらない（キャッシュが効かないだけ）。
- `UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set: serving without a cache`: 環境変数が設定されていない（または名前が違う）。キャッシュなしで動いている。

ログの保存（Observability）は有効にしていないので、過去のログは見られない。
