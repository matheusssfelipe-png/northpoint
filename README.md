# Northpoint: site institucional

Site da Northpoint Global Holding: consultoria e fulfillment para sellers do Mercado Livre (São Paulo + online).

- **No ar (prévia):** https://northpoint-five.vercel.app
- **Deploy:** automático na Vercel a cada `git push` na branch `main` (preview para outras branches).

## Stack

- [Astro](https://astro.build) (site estático, foco em performance e SEO)
- Tailwind CSS v4
- Animações em CSS puro + IntersectionObserver (sem biblioteca de animação)
- Lenis (rolagem suave, carregado só no desktop)
- Transições entre páginas nativas do navegador (`@view-transition`)

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera a versão final em /dist
npm run preview  # serve o /dist localmente
npm run images   # regenera og.png, apple-touch-icon.png e logo.png (precisa do Chrome instalado)
```

## Estrutura

- `src/pages`: páginas (home, consultoria, fulfillment, 404) e `robots.txt`
- `src/components`: seções e componentes (Quiz de diagnóstico, CTAs, FAQ etc.)
- `src/data/site.ts`: **contatos, chave de lançamento, GTM e textos centrais**
- `src/data/faq.ts`: perguntas frequentes (também geram os dados estruturados para o Google)
- `src/scripts/motion.ts`: interações (entrada ao rolar, menu, âncoras, formulário)
- `src/scripts/track.ts`: eventos de conversão enviados ao `dataLayer`
- `scripts/generate-images.mjs`: gerador das imagens de marca
- `vercel.json`: URLs sem `.html`, cabeçalhos de segurança e cache

## Eventos de conversão (dataLayer)

Prontos para o Google Tag Manager / GA4 / Meta Pixel:

| Evento | Quando | Parâmetros |
|---|---|---|
| `whatsapp_click` | qualquer clique que abre o WhatsApp | `cta_location` (seção), `cta_text` |
| `quiz_start` | primeira resposta do diagnóstico | |
| `quiz_complete` | resultado do diagnóstico exibido | `recommendation`, `revenue`, `challenge`, `service_mode` |
| `form_submit` | envio do formulário de contato | `interest`, `revenue` |

## Checklist de lançamento

- [ ] WhatsApp, e-mail e Instagram reais (`src/data/site.ts`)
- [ ] Domínio próprio adicionado na Vercel (o canonical, o sitemap e o robots se ajustam sozinhos no próximo deploy;
      se quiser forçar, defina a variável `SITE_URL` no projeto da Vercel)
- [ ] `launched: true` em `src/data/site.ts` (libera a indexação no Google; hoje está `noindex`)
- [ ] ID do Google Tag Manager em `src/data/site.ts` + banner de consentimento de cookies (LGPD)
- [ ] Cadastrar o site no Google Search Console e enviar o sitemap
- [ ] Criar o Perfil da Empresa no Google (SEO local "São Paulo")

## Pendências de conteúdo (aguardando o cliente)

- [ ] Logo original em vetor (hoje há uma versão provisória em `CompassMark.astro`; depois rodar `npm run images`)
- [ ] Escopo exato do fulfillment (Flex, coleta, preparação para o Full)
- [ ] Depoimentos autorizados, fotos reais e CNPJ para o rodapé
- [ ] Confirmar se pode oferecer "diagnóstico gratuito"
