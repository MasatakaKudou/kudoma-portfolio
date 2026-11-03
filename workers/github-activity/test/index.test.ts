import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";

import worker from "../src/index.ts";

const REDIS = "https://redis.test";
const ENV = { GITHUB_TOKEN: "gh-secret" };
const ENV_WITH_REDIS = { ...ENV, UPSTASH_REDIS_REST_URL: REDIS, UPSTASH_REDIS_REST_TOKEN: "secret" };

const days = Array.from({ length: 100 }, (_, i) => ({ date: `d${i}`, contributionCount: i }));
const GRAPHQL = {
  data: {
    user: {
      pinnedItems: {
        nodes: [
          { name: "a", description: "desc", url: "https://github.com/u/a", stargazerCount: 3, primaryLanguage: { name: "TypeScript" } },
          { name: "b", description: null, url: "https://github.com/u/b", stargazerCount: 0, primaryLanguage: null },
          {},
        ],
      },
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 1234,
          weeks: [{ contributionDays: days.slice(0, 50) }, { contributionDays: days.slice(50) }],
        },
      },
    },
  },
};

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
    upstream: () => json(GRAPHQL),
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

const upstreamCalls = () => calls.filter((c) => c.url.startsWith("https://api.github.com"));
const redisCalls = (kind: "get" | "set") => calls.filter((c) => c.url.startsWith(`${REDIS}/${kind}/`));
const EMPTY = { pinned: [], contributions: { total: 0, days: [] } };

describe("normalization", () => {
  test("pinned repositories and the most recent 84 days", async () => {
    const res = await call("/github-activity");
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("Content-Type"), "application/json");
    const body = (await res.json()) as { pinned: unknown[]; contributions: { total: number; days: unknown[] } };
    assert.deepEqual(body.pinned, [
      { name: "a", description: "desc", url: "https://github.com/u/a", stars: 3, language: "TypeScript" },
      { name: "b", description: null, url: "https://github.com/u/b", stars: 0, language: null },
    ]);
    assert.equal(body.contributions.total, 1234);
    assert.equal(body.contributions.days.length, 84);
    assert.deepEqual(body.contributions.days.at(-1), { date: "d99", count: 99 });
  });

  test("sends the token and the default login to GitHub", async () => {
    await call("/github-activity");
    const [{ init }] = upstreamCalls();
    assert.equal((init?.headers as Record<string, string>).Authorization, "Bearer gh-secret");
    assert.equal(JSON.parse(String(init?.body)).variables.login, "MasatakaKudou");
  });

  test("GITHUB_USERNAME overrides the login", async () => {
    await call("/github-activity", { ...ENV, GITHUB_USERNAME: "someone" });
    assert.equal(JSON.parse(String(upstreamCalls()[0].init?.body)).variables.login, "someone");
  });
});

describe("routing", () => {
  test("unknown path is 404", async () => {
    assert.equal((await call("/other")).status, 404);
  });

  test("OPTIONS is a CORS preflight", async () => {
    const res = await call("/github-activity", ENV, { method: "OPTIONS" });
    assert.equal(res.status, 204);
    assert.equal(res.headers.get("Access-Control-Allow-Origin"), "*");
  });

  test("there is no public write endpoint", async () => {
    const res = await call("/github-activity", ENV, { method: "POST", body: "{}" });
    assert.equal(res.status, 405);
    assert.equal(upstreamCalls().length, 0);
  });
});

describe("failures", () => {
  test("non-200 from GitHub is an empty activity", async () => {
    handlers.upstream = () => json({}, 502);
    const res = await call("/github-activity");
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), EMPTY);
  });

  test("GraphQL errors with a 200 status are a failure", async () => {
    handlers.upstream = () => json({ errors: [{ message: "bad credentials" }], data: null });
    assert.deepEqual(await (await call("/github-activity")).json(), EMPTY);
  });

  test("network error is an empty activity", async () => {
    handlers.upstream = () => {
      throw new Error("down");
    };
    assert.deepEqual(await (await call("/github-activity")).json(), EMPTY);
  });

  test("missing token does not call GitHub", async () => {
    assert.deepEqual(await (await call("/github-activity", {})).json(), EMPTY);
    assert.equal(upstreamCalls().length, 0);
  });
});

describe("cache", () => {
  test("a hit skips GitHub", async () => {
    handlers.redisGet = () => json({ result: JSON.stringify(EMPTY) });
    const res = await call("/github-activity", ENV_WITH_REDIS);
    assert.deepEqual(await res.json(), EMPTY);
    assert.equal(res.headers.get("Content-Type"), "application/json");
    assert.equal(upstreamCalls().length, 0);
  });

  test("a success is cached for an hour", async () => {
    await call("/github-activity", ENV_WITH_REDIS);
    assert.match(redisCalls("set")[0].url, /EX=3600$/);
  });

  test("a failure is cached for 60 seconds", async () => {
    handlers.upstream = () => json({}, 500);
    await call("/github-activity", ENV_WITH_REDIS);
    assert.match(redisCalls("set")[0].url, /EX=60$/);
  });

  test("a Redis outage falls back to GitHub", async () => {
    handlers.redisGet = () => json({}, 500);
    handlers.redisSet = () => json({}, 500);
    const res = await call("/github-activity", ENV_WITH_REDIS);
    assert.equal(res.status, 200);
    assert.equal(upstreamCalls().length, 1);
  });
});
