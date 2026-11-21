# Northpoint: site institucional

Site da Northpoint Global Holding: consultoria e fulfillment para sellers do Mercado Livre (São Paulo + online).

## Stack

- [Astro](https://astro.build) (site estático, foco em performance e SEO)
- Tailwind CSS v4
- GSAP + ScrollTrigger e Lenis (animações e rolagem suave)
- View Transitions do Astro (transição entre páginas)

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera a versão final em /dist
npm run preview  # serve o /dist localmente
```

## Estrutura

- `src/pages`: páginas (home, consultoria, fulfillment, 404)
- `src/components`: seções e componentes (Quiz de diagnóstico, CTAs, FAQ etc.)
- `src/data/site.ts`: **contatos, domínio e textos centrais**
- `src/data/faq.ts`: perguntas frequentes (também geram os dados estruturados para o Google)
- `src/scripts/motion.ts`: animações, rolagem e menu

## Pendências (aguardando o cliente)

- [ ] WhatsApp, e-mail e Instagram reais (`src/data/site.ts`)
- [ ] Domínio definitivo (`astro.config.mjs` e `public/robots.txt`)
- [ ] Logo original em vetor (hoje há uma versão provisória em `CompassMark.astro`)
- [ ] Imagem de compartilhamento `public/og.png` (1200x630)
- [ ] Escopo exato do fulfillment (Flex, coleta, preparação para o Full)
- [ ] Depoimentos autorizados e fotos reais
