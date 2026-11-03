interface Env {
  QIITA_API_ENDPOINT: string;
  ZENN_API_ENDPOINT: string;
  KUDOMA_API_ENDPOINT: string;
  // Upstash Redis (REST) — the names Upstash itself uses. Optional: without them the Worker
  // works, just without caching (and logs a warning).
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
  // Set to the commit SHA by the deploy workflow (`--var CACHE_VERSION:<sha>`). It is part of the
  // cache key, so a deploy never serves entries written by the previous code. "dev" when unset.
  CACHE_VERSION?: string;
}

interface Article {
  title: string;
  updatedAt: string;
  url: string;
  // Optional: not every site provides them, and entries cached before they were added lack them.
  likes?: number;
  thumbnail?: string;
  excerpt?: string;
}

interface QiitaItem {
  title: string;
  updated_at: string;
  url: string;
  likes_count?: number;
  body?: string;
}

interface ZennResponse {
  articles?: { title: string; body_updated_at: string; path: string; liked_count?: number }[];
}

interface KudomaPost {
  title: { rendered: string };
  date: string;
  link: string;
  excerpt?: { rendered?: string };
  jetpack_featured_media_url?: string;
}

interface Source {
  /** Where to fetch from (the URL is an env var set in the Cloudflare dashboard). */
  endpoint: (env: Env) => string;
  /** Normalizes the upstream response. */
  normalize: (json: unknown) => Article[];
}

// Add a new site here (and to `Site` in the site's src/types/BlogType.ts).
const SOURCES: Record<string, Source> = {
  qiita: {
    endpoint: (env) => env.QIITA_API_ENDPOINT,
    normalize: (json) =>
      (json as QiitaItem[]).map(({ title, updated_at, url, likes_count, body }) => ({
        title,
        updatedAt: updated_at,
        url,
        likes: count(likes_count),
        excerpt: toExcerpt(body),
      })),
  },
  zenn: {
    endpoint: (env) => env.ZENN_API_ENDPOINT,
    normalize: (json) =>
      ((json as ZennResponse).articles ?? []).map(({ title, body_updated_at, path, liked_count }) => ({
        title,
        updatedAt: body_updated_at,
        url: `https://zenn.dev${path}`,
        likes: count(liked_count),
      })),
  },
  kudoma: {
    endpoint: (env) => env.KUDOMA_API_ENDPOINT,
    normalize: (json) =>
      (json as KudomaPost[]).map(({ title, date, link, excerpt, jetpack_featured_media_url }) => ({
        title: title.rendered,
        updatedAt: date,
        url: link,
        thumbnail: httpsUrl(jetpack_featured_media_url),
        excerpt: toExcerpt(excerpt?.rendered),
      })),
  },
};

const EXCERPT_LENGTH = 100;

function count(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function httpsUrl(value: unknown): string | undefined {
  return typeof value === "string" && value.startsWith("https://") ? value : undefined;
}

/** Plain-text summary of an HTML/Markdown body (rough: tags and common Markdown marks are dropped). */
function toExcerpt(text: unknown): string | undefined {
  if (typeof text !== "string") return undefined;
  const plain = text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`_~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return undefined;
  const chars = Array.from(plain);
  return chars.length > EXCERPT_LENGTH ? `${chars.slice(0, EXCERPT_LENGTH).join("")}…` : plain;
}

// A successful result is cached for an hour.
const CACHE_TTL_SECONDS = 3600;
// An upstream failure is cached briefly, so a down upstream is not hit on every visit
// but the articles come back soon after it recovers.
const FAILURE_TTL_SECONDS = 60;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const headers = buildHeaders();

    if (request.method === "OPTIONS") {
      return handleOptionsRequest(headers);
    }

    const match = url.pathname.match(/^\/articles\/([a-z]+)$/);
    const site = match?.[1];
    if (!site || !Object.hasOwn(SOURCES, site)) {
      return new Response("Not Found", { status: 404, headers });
    }

    const cacheKey = `articles:${env.CACHE_VERSION ?? "dev"}:${site}`;
    const cached = await readCache(env, cacheKey);
    if (cached !== undefined) {
      return new Response(cached, { status: 200, headers });
    }

    // On an upstream failure the response is still 200 with `[]` (the site shows
    // "could not fetch articles"), but it is cached only for FAILURE_TTL_SECONDS.
    const articles = await fetchArticles(SOURCES[site], env);
    const body = JSON.stringify(articles ?? []);
    ctx.waitUntil(writeCache(env, cacheKey, body, articles ? CACHE_TTL_SECONDS : FAILURE_TTL_SECONDS));

    return new Response(body, { status: 200, headers });
  },
};

// Returns undefined when the upstream fails (network error, non-200 or unexpected body).
async function fetchArticles(source: Source, env: Env): Promise<Article[] | undefined> {
  try {
    const response = await fetch(source.endpoint(env));
    if (response.status !== 200) {
      return undefined;
    }
    return source.normalize(await response.json());
  } catch (error) {
    console.error(`Failed to fetch articles: ${error}`);
    return undefined;
  }
}

function hasCache(env: Env): env is Env & { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string } {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) return true;
  // Falling back silently made a misnamed variable hard to notice, so say so.
  console.warn("UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set: serving without a cache");
  return false;
}

// The cache is best-effort: any failure falls back to fetching from the upstream.
async function readCache(env: Env, key: string): Promise<string | undefined> {
  if (!hasCache(env)) return undefined;
  try {
    const response = await fetch(`${env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
    });
    if (!response.ok) {
      console.error(`Failed to read cache: ${response.status}`);
      return undefined;
    }
    const { result } = await response.json<{ result: string | null }>();
    return result ?? undefined;
  } catch (error) {
    console.error(`Failed to read cache: ${error}`);
    return undefined;
  }
}

async function writeCache(env: Env, key: string, value: string, ttl: number): Promise<void> {
  if (!hasCache(env)) return;
  try {
    const response = await fetch(`${env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(key)}?EX=${ttl}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: value,
    });
    if (!response.ok) {
      console.error(`Failed to write cache: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to write cache: ${error}`);
  }
}

function handleOptionsRequest(headers: Headers): Response {
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(null, { status: 204, headers });
}

function buildHeaders(): Headers {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  return headers;
}
