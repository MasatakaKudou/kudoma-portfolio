interface Env {
  QIITA_API_ENDPOINT: string;
  ZENN_API_ENDPOINT: string;
  KUDOMA_API_ENDPOINT: string;
}

interface QiitaItem {
  title: string;
  updated_at: string;
  url: string;
}

interface ZennResponse {
  articles?: { title: string; body_updated_at: string; path: string }[];
}

interface KudomaPost {
  title: { rendered: string };
  date: string;
  link: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const headers = buildHeaders();

    if (request.method === "OPTIONS") {
      return handleOptionsRequest(headers);
    }

    if (path === "/articles/qiita") {
      const json = (await fetchJson<QiitaItem[]>(env.QIITA_API_ENDPOINT)) ?? [];
      const articles = json.map(({ title, updated_at, url }) => {
        return {
          title,
          updatedAt: updated_at,
          url,
        }
      });

      return new Response(JSON.stringify(articles), {
        status: 200,
        headers,
      });
    }

    if (path === "/articles/zenn") {
      const json = await fetchJson<ZennResponse>(env.ZENN_API_ENDPOINT);
      const articles = (json?.articles ?? []).map(({ title, body_updated_at, path }) => {
        return {
          title,
          updatedAt: body_updated_at,
          url: `https://zenn.dev${path}`,
        }
      });

      return new Response(JSON.stringify(articles), {
        status: 200,
        headers,
      });
    }

    if (path === "/articles/kudoma") {
      const json = (await fetchJson<KudomaPost[]>(env.KUDOMA_API_ENDPOINT)) ?? [];
      const articles = json.map(({ title, date, link }) => ({
        title: title.rendered,
        updatedAt: date,
        url: link,
      }));

      return new Response(JSON.stringify(articles), {
        status: 200,
        headers,
      });
    }

    return new Response("Not Found", { status: 404, headers });
  },
};

// Returns undefined when the upstream does not answer 200.
//
// 注意（ネガティブキャッシュ）: 呼び出し側はこの結果を空配列にして、200 で `[]` を返す。
// フロントはそれをキャッシュに保存する（ArticleService.fetchArticles を参照）。
// そのため上流の障害中は、キャッシュの TTL（1時間）のあいだ、その媒体の記事が表示されなくなる。
// これは、障害中の上流へアクセスし続けて負荷を上げないための意図的な挙動。
// 今後の改善案: 「上流の失敗」と「記事が0件」を区別できるようにする（502 を返す、
// レスポンスにフラグを持たせるなど）。失敗時はフロントでキャッシュしない、
// または短い TTL にする。
async function fetchJson<T>(endpoint: string): Promise<T | undefined> {
  const response = await fetch(endpoint);
  if (response.status !== 200) {
    return undefined;
  }
  return response.json<T>();
}

function handleOptionsRequest(headers: Headers): Response {
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(null, { status: 204, headers });
}

function buildHeaders(): Headers {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  return headers;
}
