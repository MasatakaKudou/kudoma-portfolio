// Vite inlines `import.meta.env.VITE_*` at build time. Kept in one module so Jest (CommonJS, no
// `import.meta`) can replace it with jest.mock.
export const ARTICLE_BASE_URL: string = import.meta.env.VITE_ARTICLE_BASE_URL;
export const GITHUB_ACTIVITY_BASE_URL: string = import.meta.env.VITE_GITHUB_ACTIVITY_BASE_URL;
