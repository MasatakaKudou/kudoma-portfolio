// Origins allowed to write to the cache (and to pass CORS preflight).
// Note: the Origin header can be forged by non-browser clients, so this only
// stops other websites from writing through a visitor's browser.
const ALLOWED_ORIGINS = [
  "https://www.kudoma.net",
  "http://localhost:3000",
];

export default {
  async fetch(request, env) {
    const redisUrl = env.REDIS_REST_URL;
    const redisToken = env.REDIS_REST_TOKEN;

    const url = new URL(request.url);
    const path = url.pathname;

    const headers = buildHeaders();
    const origin = request.headers.get("Origin");
    const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);

    if (request.method === "OPTIONS") {
      return handleOptionsRequest(headers, origin, isAllowedOrigin);
    }

    if (path === "/get") {
      const key = url.searchParams.get("key");
      if (!key) {
        return new Response("Key is required", { status: 400, headers });
      }
      
      const { ok, result: cache } = await getCache(redisUrl, redisToken, key);
      if (!ok) {
        return new Response("Failed to fetch data from Upstash", { status: 502, headers });
      }
      if (!cache) {
        return new Response("Not Found", { status: 404, headers});
      }

      return new Response(JSON.stringify({ key, value: cache }), {
        status: 200,
        headers,
      });
    }
    
    if (path === "/set") {
      // Writes are only accepted from the allowed origins.
      if (!isAllowedOrigin) {
        return new Response("Forbidden", { status: 403 });
      }
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Vary", "Origin");

      // SETリクエストの処理
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return new Response("Invalid JSON", { status: 400, headers });
      }
      const { key, value } = body ?? {};

      if (!key) {
        return new Response("Key is required", { status: 400, headers });
      }
      if (!value) {
        return new Response("Value is required", { status: 400, headers });
      }

      const isSuccess = await setCache(redisUrl, redisToken, key, value);
      if (!isSuccess) {
        return new Response("Failed to save data to Upstash", { status: 500, headers });
      }

      return new Response("Data saved to Upstash", { status: 200, headers });
    }

    return new Response("Invalid request", { status: 404, headers });
  },
};

function handleOptionsRequest(headers, origin, isAllowedOrigin) {
  // Preflight is only approved for the allowed origins.
  if (isAllowedOrigin) {
    headers.set("Access-Control-Allow-Origin", origin);
  } else {
    headers.delete("Access-Control-Allow-Origin");
  }
  headers.set("Vary", "Origin");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(null, { status: 204, headers });
}

async function getCache(url, token, key) {
  const response = await fetch(`${url}/get/${key}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    return { ok: false };
  }

  const data = await response.json();
  return { ok: true, result: data.result };
}

async function setCache(url, token, key, value, ttl=3600) {
  const response = await fetch(`${url}/set/${key}?EX=${ttl}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: value,
  });
  if (!response.ok) {
    return false;
  }

  return true;
}

function buildHeaders() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  return headers;
}
