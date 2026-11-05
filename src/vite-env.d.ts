/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: string;
  readonly VITE_ARTICLE_BASE_URL: string;
  readonly VITE_GITHUB_ACTIVITY_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
