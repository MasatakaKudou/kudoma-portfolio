interface Env {
  /** GitHub token (secret, set in the Cloudflare dashboard). Public read access is enough. */
  GITHUB_TOKEN?: string;
  /** GitHub login to show. Defaults to DEFAULT_USERNAME. */
  GITHUB_USERNAME?: string;
  // Upstash Redis (REST) — the names Upstash itself uses. Optional: without them the Worker
  // works, just without caching (and logs a warning).
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
}

interface PinnedRepository {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
}

interface ContributionDay {
  date: string;
  count: number;
}

interface GithubActivity {
  pinned: PinnedRepository[];
  contributions: {
    /** Total contributions in the last year. */
    total: number;
    /** Daily counts for the most recent RECENT_DAYS days, oldest first. */
    days: ContributionDay[];
  };
}

interface GraphqlResponse {
  data?: {
    user?: {
      pinnedItems: {
        nodes: ({
          name?: string;
          description?: string | null;
          url?: string;
          stargazerCount?: number;
          primaryLanguage?: { name: string } | null;
        } | null)[];
      };
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
        };
      };
    } | null;
  };
  errors?: unknown[];
}

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const DEFAULT_USERNAME = "MasatakaKudou";
const RECENT_DAYS = 84; // 12 weeks

const QUERY = `
query($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          url
          stargazerCount
          primaryLanguage { name }
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

// A successful result is cached for an hour.
const CACHE_TTL_SECONDS = 3600;
// An upstream failure is cached briefly, so a down upstream is not hit on every visit
// but the activity comes back soon after it recovers.
const FAILURE_TTL_SECONDS = 60;

const CACHE_KEY = "github-activity";

const EMPTY: GithubActivity = { pinned: [], contributions: { total: 0, days: [] } };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const headers = buildHeaders();

    if (request.method === "OPTIONS") {
      return handleOptionsRequest(headers);
    }
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405, headers });
    }
    if (url.pathname !== "/github-activity") {
      return new Response("Not Found", { status: 404, headers });
    }

    const cached = await readCache(env, CACHE_KEY);
    if (cached !== undefined) {
      return new Response(cached, { status: 200, headers });
    }

    // On an upstream failure the response is still 200 with an empty activity (the site shows
    // "could not fetch"), but it is cached only for FAILURE_TTL_SECONDS.
    const activity = await fetchActivity(env);
    const body = JSON.stringify(activity ?? EMPTY);
    ctx.waitUntil(writeCache(env, CACHE_KEY, body, activity ? CACHE_TTL_SECONDS : FAILURE_TTL_SECONDS));

    return new Response(body, { status: 200, headers });
  },
};

// Returns undefined when the upstream fails (missing token, network error, non-200 or unexpected body).
async function fetchActivity(env: Env): Promise<GithubActivity | undefined> {
  if (!env.GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN is not set");
    return undefined;
  }
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "kudoma-portfolio-github-activity",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: env.GITHUB_USERNAME || DEFAULT_USERNAME } }),
    });
    if (response.status !== 200) {
      console.error(`Failed to fetch GitHub activity: ${response.status}`);
      return undefined;
    }
    return normalize(await response.json<GraphqlResponse>());
  } catch (error) {
    console.error(`Failed to fetch GitHub activity: ${error}`);
    return undefined;
  }
}

// GraphQL reports errors with a 200 status, so an `errors` field or a missing user is a failure too.
function normalize(json: GraphqlResponse): GithubActivity | undefined {
  const user = json.data?.user;
  if (json.errors?.length || !user) {
    console.error(`Unexpected GitHub response: ${JSON.stringify(json.errors ?? null)}`);
    return undefined;
  }

  const pinned = user.pinnedItems.nodes.flatMap((node) =>
    node?.name && node.url
      ? [
          {
            name: node.name,
            description: node.description ?? null,
            url: node.url,
            stars: node.stargazerCount ?? 0,
            language: node.primaryLanguage?.name ?? null,
          },
        ]
      : [],
  );

  const calendar = user.contributionsCollection.contributionCalendar;
  const days = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .map(({ date, contributionCount }) => ({ date, count: contributionCount }))
    .slice(-RECENT_DAYS);

  return { pinned, contributions: { total: calendar.totalContributions, days } };
}

function hasCache(env: Env): env is Env & { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string } {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) return true;
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
  headers.set("Content-Type", "application/json");
  return headers;
}
