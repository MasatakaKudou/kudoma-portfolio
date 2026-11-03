import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Output stays in `build/` (same as the old CRA setup) so .github/workflows/deploy.yml is unchanged.
// `public/` (CNAME, favicon, sitemap, ...) is copied to the output root as-is.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
});
