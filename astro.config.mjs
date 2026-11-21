// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO: trocar pelo domínio definitivo assim que o cliente confirmar.
export default defineConfig({
  site: 'https://www.northpointglobal.com.br',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  vite: { plugins: [tailwindcss()] },
});
