export default {
  async fetch(request, env) {
    const redisUrl = env.REDIS_REST_URL;
    const redisToken = env.REDIS_REST_TOKEN;

    const url = new URL(request.url);
    const path = url.pathname;

    const headers = buildHeaders();

    if (request.method === "OPTIONS") {
      return handleOptionsRequest(headers);
    }

    if (path === "/get") {
      const key = url.searchParams.get("key");
      if (!key) {
        return new Response("Key is required", { status: 400, headers });
      }
      
      const cache = await getCache(redisUrl, redisToken, key);
      if (!cache) {
        return new Response("Not Found", { status: 404, headers});
      }

      return new Response(JSON.stringify({ key, value: cache }), {
        status: 200,
        headers,
      });
    }
    
    if (path === "/set") {
      // SETリクエストの処理
      const { key, value } = await request.json();

      if (!key) {
        return new Response("Key is required", { status: 400, headers });
      }
      if (!value) {
        return new Response("Value is required", { status: 400, headers });
      }

      const isSuccess = await setCache(redisUrl, redisToken, key, value);
      if (!isSuccess) {
        new Response("Failed to save data to Upstash", { status: 500, headers });
      }

      return new Response("Data saved to Upstash", { status: 200, headers });
    }

    return new Response("Invalid request", { status: 404, headers });
  },
};

function handleOptionsRequest(headers) {
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(null, { status: 204, headers });
}

async function getCache(url, token, key) {
  const headers = buildHeaders();

  const response = await fetch(`${url}/get/${key}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    return new Response("Failed to fetch data from Upstash", { status: 500, headers });
  }

  const data = await response.json();
  return data.result;
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
