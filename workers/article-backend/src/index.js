export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const headers = buildHeaders();

    if (request.method === "OPTIONS") {
      return handleOptionsRequest(headers);
    }

    // Temporary endpoint to verify automatic deployment. Change the message and redeploy to confirm.
    if (path === "/ping") {
      return new Response(JSON.stringify({ message: "pong v2" }), {
        status: 200,
        headers,
      });
    }

    if (path === "/articles/qiita") {
      const json = await fetchReponse(env.QIITA_API_ENDPOINT);
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
      const json = await fetchReponse(env.ZENN_API_ENDPOINT);
      const articles = json.articles.map(({ title, body_updated_at, path }) => {
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
      const json = await fetchReponse(env.KUDOMA_API_ENDPOINT);
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
  },
};

async function fetchReponse(endpoint) {
  const response = await fetch(endpoint);
  if (response.status !== 200) {
    return [];
  }
  return response.json();
}

function handleOptionsRequest(headers) {
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(null, { status: 204, headers });
}

function buildHeaders() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  return headers;
}
