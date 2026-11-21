// Dados centrais do site. Tudo que o cliente ainda precisa confirmar está marcado com TODO.

export const site = {
  name: 'Northpoint Global Holding',
  shortName: 'Northpoint',
  tagline: 'O norte para vender mais no Mercado Livre',
  description:
    'Consultoria e fulfillment para quem vende no Mercado Livre. Estratégia, gestão de conta, anúncios, Mercado Ads, armazenagem e envios em São Paulo, com atendimento online para todo o Brasil.',
  locale: 'pt_BR',
  city: 'São Paulo',
  region: 'SP',
  country: 'BR',
  contact: {
    // TODO: número real do WhatsApp (somente dígitos, com DDI 55)
    whatsapp: '5511999999999',
    whatsappLabel: '(11) 99999-9999',
    // TODO: e-mail profissional no domínio
    email: 'contato@northpointglobal.com.br',
    // TODO: @ do Instagram
    instagram: 'https://www.instagram.com/northpoint',
  },
};

export const waLink = (message = 'Olá! Vim pelo site e quero vender mais no Mercado Livre. Pode me ajudar?') =>
  `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;

/** Links de âncora da home: relativos na própria home, absolutos nas demais páginas. */
export const homeAnchor = (pathname: string, hash: string) => (pathname === '/' ? `#${hash}` : `/#${hash}`);

export const nav = [
  { label: 'Consultoria', href: '/consultoria-mercado-livre' },
  { label: 'Fulfillment', href: '/fulfillment-mercado-livre' },
  { label: 'Como funciona', hash: 'como-funciona' },
  { label: 'Diagnóstico', hash: 'diagnostico' },
  { label: 'Dúvidas', hash: 'duvidas' },
] as { label: string; href?: string; hash?: string }[];

export const navHref = (item: (typeof nav)[number], pathname: string) =>
  item.href ?? homeAnchor(pathname, item.hash!);
