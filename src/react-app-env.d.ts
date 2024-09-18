/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_ENV: string;
    readonly REACT_APP_QIITA_API_ENDPOINT: string;
    readonly REACT_APP_UPSTASH_REDIS_REST_URL: string;
    readonly REACT_APP_UPSTASH_REDIS_REST_TOKEN: string;
  }
}
