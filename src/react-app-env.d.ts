/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_ENV: string;
    readonly REACT_APP_ARTICLE_BASE_URL: string;
    readonly REACT_APP_CACHE_BASE_URL: string;
  }
}
