// Origins allowed to write to the cache (and to pass CORS preflight).
// Note: the Origin header can be forged by non-browser clients, so this only
// stops other websites from writing through a visitor's browser.
const ALLOWED_ORIGINS = [
  "https://www.kudoma.net",
  "http://localhost:3000",
];

// The only keys the site ever reads or writes (`<site>-blog`, see ArticleService).
// Anything else is rejected, so a key can never address other data or other Redis commands.
// Add a new key here when a new `Site` is added.
const ALLOWED_KEYS = ["qiita-blog", "zenn-blog", "kudoma-blog"];

// Upper bound for a cached value, in bytes. The article lists are a few KB;
// this only stops someone from filling Redis with large payloads.
const MAX_VALUE_BYTES = 256 * 1024;

interface Env {
  REDIS_REST_URL: string;
  REDIS_REST_TOKEN: string;
}

interface SetRequestBody {
  key?: string;
  value?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const redisUrl = env.REDIS_REST_URL;
    const redisToken = env.REDIS_REST_TOKEN;

    const url = new URL(request.url);
    const path = url.pathname;

    const headers = buildHeaders();
    const origin = request.headers.get("Origin");
    // The request's Origin when it is on the allow list, otherwise null.
    const allowedOrigin = origin !== null && ALLOWED_ORIGINS.includes(origin) ? origin : null;

    if (request.method === "OPTIONS") {
      return handleOptionsRequest(headers, allowedOrigin);
    }

    if (path === "/get") {
      const key = url.searchParams.get("key");
      if (!key) {
        return new Response("Key is required", { status: 400, headers });
      }
      if (!isAllowedKey(key)) {
        return new Response("Invalid key", { status: 400, headers });
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
      if (allowedOrigin === null) {
        return new Response("Forbidden", { status: 403 });
      }
      headers.set("Access-Control-Allow-Origin", allowedOrigin);
      headers.set("Vary", "Origin");

      // SETリクエストの処理
      let body: SetRequestBody | null;
      try {
        body = await request.json<SetRequestBody | null>();
      } catch (e) {
        return new Response("Invalid JSON", { status: 400, headers });
      }
      const { key, value } = body ?? {};

      if (!key) {
        return new Response("Key is required", { status: 400, headers });
      }
      if (!isAllowedKey(key)) {
        return new Response("Invalid key", { status: 400, headers });
      }
      if (!value) {
        return new Response("Value is required", { status: 400, headers });
      }
      if (typeof value !== "string") {
        return new Response("Value must be a string", { status: 400, headers });
      }
      if (new TextEncoder().encode(value).length > MAX_VALUE_BYTES) {
        return new Response("Value is too large", { status: 413, headers });
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

function isAllowedKey(key: string): boolean {
  return ALLOWED_KEYS.includes(key);
}

function handleOptionsRequest(headers: Headers, allowedOrigin: string | null): Response {
  // Preflight is only approved for the allowed origins.
  if (allowedOrigin !== null) {
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
  } else {
    headers.delete("Access-Control-Allow-Origin");
  }
  headers.set("Vary", "Origin");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(null, { status: 204, headers });
}

interface CacheResult {
  ok: boolean;
  result?: string | null;
}

async function getCache(url: string, token: string, key: string): Promise<CacheResult> {
  const response = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    return { ok: false };
  }

  const data = await response.json<{ result: string | null }>();
  return { ok: true, result: data.result };
}

async function setCache(url: string, token: string, key: string, value: string, ttl = 3600): Promise<boolean> {
  const response = await fetch(`${url}/set/${encodeURIComponent(key)}?EX=${ttl}`, {
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

function buildHeaders(): Headers {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  return headers;
}
