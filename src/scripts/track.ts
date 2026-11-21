// Eventos de conversão. Vão para o dataLayer, lido pelo Google Tag Manager (GA4, Meta Pixel etc.)
// quando o ID do GTM for configurado em src/data/site.ts. Sem GTM, não faz nada além de registrar.
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, params: Record<string, string> = {}) {
  (window.dataLayer ??= []).push({ event, ...params });
}
