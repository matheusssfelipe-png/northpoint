// Interações do site. Leve de propósito: as animações são CSS; aqui só marcamos estados.
import { track } from './track';

type LenisLike = { scrollTo: (target: HTMLElement | number, opts?: { offset?: number }) => void; stop: () => void; start: () => void };

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const HEADER_OFFSET = -88;
let lenis: LenisLike | null = null;

/** Rolagem suave com inércia só no desktop; no celular a rolagem nativa é melhor e mais leve. */
async function smoothScroll() {
  if (reduce() || !finePointer()) return;
  const { default: Lenis } = await import('lenis');
  lenis = new Lenis({ duration: 1.1, autoRaf: true });
}

/** Âncoras da mesma página: rolagem suave respeitando o cabeçalho fixo. */
function anchors() {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || a.target === '_blank') return;
    const url = new URL(a.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    history.pushState(null, '', url.hash);
    if (lenis) lenis.scrollTo(target, { offset: HEADER_OFFSET });
    else target.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
  });
}

/** Entrada dos elementos ao rolar: adiciona .is-in (a animação é CSS). */
function reveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduce() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.style.setProperty('--d', `${Math.min(n++, 6) * 80}ms`); // cascata entre irmãos que entram juntos
        el.classList.add('is-in');
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  els.forEach((el) => io.observe(el));
}

/** Contadores numéricos que sobem quando aparecem. */
function counters() {
  if (reduce()) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      io.unobserve(entry.target);
      const el = entry.target as HTMLElement;
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix ?? '';
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / 1600, 1);
        el.textContent = `${Math.round(end * (1 - (1 - p) ** 3))}${suffix}`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  });
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => io.observe(el));
}

function header() {
  const el = document.querySelector<HTMLElement>('[data-header]');
  if (!el) return;
  const bar = document.querySelector<HTMLElement>('[data-mobile-cta]');
  let barSuppressed = false; // some no diagnóstico, no formulário de contato e no rodapé (já têm seus próprios botões)

  const update = () => {
    el.toggleAttribute('data-scrolled', window.scrollY > 24);
    bar?.toggleAttribute('data-visible', !barSuppressed && window.scrollY > window.innerHeight * 0.55);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });

  if (bar && 'IntersectionObserver' in window) {
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      barSuppressed = visible.size > 0;
      update();
    });
    document.querySelectorAll('#diagnostico, #contato, footer').forEach((t) => io.observe(t));
  }

  // Menu mobile
  const toggle = el.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !panel) return;
  const setOpen = (open: boolean, restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    panel.toggleAttribute('data-open', open);
    document.documentElement.classList.toggle('overflow-hidden', open);
    if (open) {
      lenis?.stop();
      // Espera o painel ficar visível (visibility entra na transição) para poder receber o foco.
      setTimeout(() => panel.querySelector<HTMLElement>('a')?.focus({ preventScroll: true }), 80);
    } else {
      lenis?.start();
      if (restoreFocus) toggle.focus();
    }
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.hasAttribute('data-open')) setOpen(false, true);
  });
}

function spotlight() {
  if (!finePointer()) return;
  document.querySelectorAll<HTMLElement>('[data-spotlight], .card').forEach((el) =>
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }),
  );
}

function faq() {
  // Acordeão: abrir um item fecha os outros
  const items = document.querySelectorAll<HTMLDetailsElement>('[data-faq] details');
  items.forEach((d) =>
    d.addEventListener('toggle', () => {
      if (d.open) items.forEach((o) => o !== d && (o.open = false));
    }),
  );
}

function leadForm() {
  const form = document.querySelector<HTMLFormElement>('[data-lead-form]');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const msg = [
      'Olá! Vim pelo site da Northpoint.',
      `Nome: ${data.get('nome')}`,
      `Empresa/Loja: ${data.get('empresa') || '-'}`,
      `Faturamento mensal: ${data.get('faturamento')}`,
      `Interesse: ${data.get('interesse')}`,
      data.get('mensagem') ? `Mensagem: ${data.get('mensagem')}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    track('form_submit', { interest: String(data.get('interesse')), revenue: String(data.get('faturamento')) });
    const url = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(msg)}`;
    // Se o navegador bloquear a nova aba, abre na mesma.
    if (!window.open(url, '_blank', 'noopener')) location.href = url;
  });
}

/** De onde veio o clique: data-track explícito, área fixa da página ou id da seção. */
function ctaLocation(a: HTMLElement) {
  if (a.dataset.track) return a.dataset.track;
  if (a.closest('[data-mobile-cta]')) return 'barra_mobile';
  if (a.closest('[data-menu]')) return 'menu';
  if (a.closest('header')) return 'cabecalho';
  if (a.closest('footer')) return 'rodape';
  return a.closest<HTMLElement>('section[id]')?.id ?? 'pagina';
}

/** Mede cliques que levam ao WhatsApp, identificando de qual seção vieram. */
function whatsappTracking() {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="wa.me/"]');
    if (!a) return;
    const text = (a.querySelector('h3')?.textContent || a.innerText || a.textContent || '').trim().replace(/\s+/g, ' ');
    track('whatsapp_click', { cta_location: ctaLocation(a), cta_text: text.slice(0, 60) });
  });
}

export function initMotion() {
  anchors();
  reveal();
  counters();
  header();
  spotlight();
  faq();
  leadForm();
  whatsappTracking();
  document.documentElement.classList.add('motion-ready');
  smoothScroll();
}
