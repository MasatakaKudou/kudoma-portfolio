import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, mock, test } from "node:test";

import worker from "../src/index.ts";

const ENV = {
  QIITA_API_ENDPOINT: "https://upstream.test/qiita",
  ZENN_API_ENDPOINT: "https://upstream.test/zenn",
  KUDOMA_API_ENDPOINT: "https://upstream.test/kudoma",
};
const REDIS = "https://redis.test";
const ENV_WITH_REDIS = { ...ENV, CACHE_VERSION: "v1", UPSTASH_REDIS_REST_URL: REDIS, UPSTASH_REDIS_REST_TOKEN: "secret" };

const QIITA = [{ title: "q", updated_at: "2026-01-01", url: "https://qiita.com/a" }];
const ZENN = { articles: [{ title: "z", body_updated_at: "2026-02-02", path: "/u/articles/1" }] };
const KUDOMA = [{ title: { rendered: "k" }, date: "2026-03-03", link: "https://k.test/1" }];

type FetchCall = { url: string; init?: RequestInit };
type Handler = (url: string, init?: RequestInit) => Response | Promise<Response>;

const realFetch = globalThis.fetch;
let calls: FetchCall[];
let handlers: { upstream: Handler; redisGet: Handler; redisSet: Handler };
let pending: Promise<unknown>[];

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

beforeEach(() => {
  calls = [];
  pending = [];
  handlers = {
    upstream: (url) => {
      if (url.endsWith("/qiita")) return json(QIITA);
      if (url.endsWith("/zenn")) return json(ZENN);
      return json(KUDOMA);
    },
    redisGet: () => json({ result: null }),
    redisSet: () => json({ result: "OK" }),
  };
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    if (url.startsWith(`${REDIS}/get/`)) return handlers.redisGet(url, init);
    if (url.startsWith(`${REDIS}/set/`)) return handlers.redisSet(url, init);
    return handlers.upstream(url, init);
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

// Calls the Worker and waits for the background cache write (ctx.waitUntil).
async function call(path: string, env: object = ENV, init?: RequestInit) {
  const ctx = { waitUntil: (p: Promise<unknown>) => void pending.push(p), passThroughOnException: () => {} };
  const response = await worker.fetch(new Request(`https://worker.test${path}`, init), env as never, ctx as never);
  await Promise.all(pending);
  return response;
}

const upstreamCalls = () => calls.filter((c) => c.url.startsWith("https://upstream.test"));
const redisCalls = (kind: "get" | "set") => calls.filter((c) => c.url.startsWith(`${REDIS}/${kind}/`));

describe("normalization", () => {
  test("qiita", async () => {
    const res = await call("/articles/qiita");
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), [{ title: "q", updatedAt: "2026-01-01", url: "https://qiita.com/a" }]);
  });

  test("zenn builds absolute URLs from the path", async () => {
    const res = await call("/articles/zenn");
    assert.deepEqual(await res.json(), [{ title: "z", updatedAt: "2026-02-02", url: "https://zenn.dev/u/articles/1" }]);
  });

  test("zenn without an articles field is an empty list", async () => {
    handlers.upstream = () => json({});
    const res = await call("/articles/zenn");
    assert.deepEqual(await res.json(), []);
  });

  test("kudoma uses the rendered title", async () => {
    const res = await call("/articles/kudoma");
    assert.deepEqual(await res.json(), [{ title: "k", updatedAt: "2026-03-03", url: "https://k.test/1" }]);
  });
});

describe("optional card metadata", () => {
  test("qiita: likes and a plain-text excerpt", async () => {
    handlers.upstream = () =>
      json([{ ...QIITA[0], likes_count: 7, body: "# Title\n\nHello **world** [link](https://x.test) " + "あ".repeat(200) }]);
    const [a] = (await (await call("/articles/qiita")).json()) as { likes: number; excerpt: string }[];
    assert.equal(a.likes, 7);
    assert.ok(a.excerpt.startsWith("Title Hello world link"));
    assert.ok(a.excerpt.endsWith("…"));
    assert.equal(Array.from(a.excerpt).length, 101);
  });

  test("zenn: likes", async () => {
    handlers.upstream = () => json({ articles: [{ ...ZENN.articles[0], liked_count: 2 }] });
    const [a] = (await (await call("/articles/zenn")).json()) as { likes: number }[];
    assert.equal(a.likes, 2);
  });

  test("kudoma: https thumbnail and excerpt without HTML; non-https thumbnail dropped", async () => {
    handlers.upstream = () =>
      json([
        { ...KUDOMA[0], excerpt: { rendered: "<p>Hi &amp; bye</p>" }, jetpack_featured_media_url: "https://k.test/i.png" },
        { ...KUDOMA[0], jetpack_featured_media_url: "http://k.test/i.png" },
      ]);
    const [a, b] = (await (await call("/articles/kudoma")).json()) as Record<string, unknown>[];
    assert.equal(a.excerpt, "Hi & bye");
    assert.equal(a.thumbnail, "https://k.test/i.png");
    assert.equal("thumbnail" in b, false);
  });

  test("only the cache key for the deployed version is read, so entries in the old shape are never served", async () => {
    const old = JSON.stringify([{ title: "old", updatedAt: "x", url: "https://c.test" }]);
    handlers.redisGet = (url) => json({ result: url.endsWith("articles:zenn") ? old : null });
    const res = await call("/articles/zenn", ENV_WITH_REDIS);
    assert.equal(redisCalls("get")[0].url, `${REDIS}/get/articles:v1:zenn`);
    assert.notEqual(await res.text(), old);
  });
});

describe("cache version", () => {
  test("falls back to \"dev\" when CACHE_VERSION is not set", async () => {
    await call("/articles/qiita", { ...ENV_WITH_REDIS, CACHE_VERSION: undefined });
    assert.equal(redisCalls("get")[0].url, `${REDIS}/get/articles:dev:qiita`);
  });
});

describe("routing", () => {
  test("article responses are application/json, on a miss and on a hit", async () => {
    assert.equal((await call("/articles/zenn")).headers.get("Content-Type"), "application/json");
    handlers.redisGet = () => json({ result: "[]" });
    assert.equal((await call("/articles/zenn", ENV_WITH_REDIS)).headers.get("Content-Type"), "application/json");
  });

  test("the plain-text 404 does not claim to be JSON", async () => {
    assert.notEqual((await call("/nope")).headers.get("Content-Type"), "application/json");
  });

  test("unknown sites and prototype names are 404", async () => {
    for (const path of ["/articles/foo", "/articles/constructor", "/articles/qiita/x", "/", "/get"]) {
      assert.equal((await call(path)).status, 404, path);
    }
    assert.equal(calls.length, 0, "no upstream or Redis call for an unknown route");
  });

  test("OPTIONS answers the preflight with GET only", async () => {
    const res = await call("/articles/qiita", ENV, { method: "OPTIONS" });
    assert.equal(res.status, 204);
    assert.equal(res.headers.get("Access-Control-Allow-Origin"), "*");
    assert.equal(res.headers.get("Access-Control-Allow-Methods"), "GET, OPTIONS");
  });
});

describe("cache", () => {
  test("miss: fetches the upstream and stores the result for an hour", async () => {
    const res = await call("/articles/qiita", ENV_WITH_REDIS);
    assert.equal(res.status, 200);
    assert.equal(upstreamCalls().length, 1);
    const [set] = redisCalls("set");
    assert.equal(set.url, `${REDIS}/set/articles:v1:qiita?EX=3600`);
    assert.equal((set.init?.headers as Record<string, string>).Authorization, "Bearer secret");
    assert.deepEqual(JSON.parse(String(set.init?.body)), await res.json());
  });

  test("hit: returns the cached body without touching the upstream", async () => {
    const cached = JSON.stringify([{ title: "cached", updatedAt: "x", url: "https://c.test" }]);
    handlers.redisGet = () => json({ result: cached });
    const res = await call("/articles/qiita", ENV_WITH_REDIS);
    assert.equal(await res.text(), cached);
    assert.equal(upstreamCalls().length, 0);
    assert.equal(redisCalls("set").length, 0);
  });

  test("upstream failure: 200 with [] cached for only 60 seconds", async () => {
    handlers.upstream = () => new Response("boom", { status: 500 });
    const res = await call("/articles/zenn", ENV_WITH_REDIS);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), []);
    assert.equal(redisCalls("set")[0].url, `${REDIS}/set/articles:v1:zenn?EX=60`);
  });

  test("upstream network error does not become a 500", async () => {
    handlers.upstream = () => {
      throw new Error("network");
    };
    const res = await call("/articles/kudoma", ENV_WITH_REDIS);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), []);
  });

  test("a Redis read failure falls back to the upstream", async () => {
    handlers.redisGet = () => new Response("down", { status: 500 });
    const res = await call("/articles/qiita", ENV_WITH_REDIS);
    assert.equal(res.status, 200);
    assert.equal(upstreamCalls().length, 1);
  });

  test("a Redis write failure does not affect the response", async () => {
    handlers.redisSet = () => {
      throw new Error("down");
    };
    const res = await call("/articles/qiita", ENV_WITH_REDIS);
    assert.equal(res.status, 200);
    assert.equal((await res.json() as unknown[]).length, 1);
  });

  test("without the Redis vars it works, never calls Redis and warns", async () => {
    const warn = mock.method(console, "warn", () => {});
    try {
      const res = await call("/articles/qiita");
      assert.equal(res.status, 200);
      assert.equal(redisCalls("get").length + redisCalls("set").length, 0);
      assert.match(String(warn.mock.calls[0]?.arguments[0]), /UPSTASH_REDIS_REST_URL/);
    } finally {
      warn.mock.restore();
    }
  });

  test("a misnamed variable (the old REDIS_REST_* names) is treated as not configured", async () => {
    const warn = mock.method(console, "warn", () => {});
    try {
      await call("/articles/qiita", { ...ENV, REDIS_REST_URL: REDIS, REDIS_REST_TOKEN: "secret" });
      assert.equal(redisCalls("get").length, 0);
      assert.equal(warn.mock.calls.length > 0, true);
    } finally {
      warn.mock.restore();
    }
  });

  test("failed Redis reads and writes are logged with their status", async () => {
    handlers.redisGet = () => new Response("no", { status: 401 });
    handlers.redisSet = () => new Response("no", { status: 403 });
    const error = mock.method(console, "error", () => {});
    try {
      const res = await call("/articles/qiita", ENV_WITH_REDIS);
      assert.equal(res.status, 200);
      const messages = error.mock.calls.map((c) => String(c.arguments[0]));
      assert.ok(messages.includes("Failed to read cache: 401"), messages.join("|"));
      assert.ok(messages.includes("Failed to write cache: 403"), messages.join("|"));
    } finally {
      error.mock.restore();
    }
  });
});
