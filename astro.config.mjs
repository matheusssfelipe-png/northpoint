// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Endereço público usado em canonical, sitemap, robots e Open Graph.
// 1) SITE_URL (definir na Vercel quando o domínio próprio estiver pronto, ex.: https://www.seudominio.com.br)
// 2) Domínio de produção informado automaticamente pela Vercel no build
// 3) Endereço atual na Vercel
const siteUrl =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  'https://northpoint-five.vercel.app';

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'never',
  build: {
    format: 'file',
    // CSS embutido no HTML: elimina uma requisição que bloqueava a renderização no celular.
    inlineStylesheets: 'always',
  },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: { plugins: [tailwindcss()] },
});
