import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis: Lenis | null = null;
let ctx: gsap.Context | null = null;

function smoothScroll() {
  if (lenis || reduce()) return;
  lenis = new Lenis({ duration: 1.1, anchors: { offset: -88 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function header() {
  const el = document.querySelector<HTMLElement>('[data-header]');
  if (!el) return;
  const bar = document.querySelector<HTMLElement>('[data-mobile-cta]');
  const update = () => {
    el.toggleAttribute('data-scrolled', window.scrollY > 24);
    bar?.toggleAttribute('data-visible', window.scrollY > window.innerHeight * 0.55);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  document.addEventListener('astro:before-swap', () => window.removeEventListener('scroll', update), { once: true });

  const toggle = el.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu]');
  const setOpen = (open: boolean) => {
    toggle?.setAttribute('aria-expanded', String(open));
    panel?.toggleAttribute('data-open', open);
    document.documentElement.classList.toggle('overflow-hidden', open);
    open ? lenis?.stop() : lenis?.start();
  };
  toggle?.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  panel?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
}

/** Quebra o título em palavras para animar uma a uma. Elementos internos (ex.: destaque em gradiente) viram uma unidade. */
function splitWords(el: HTMLElement) {
  if (el.dataset.splitReady) return [...el.querySelectorAll<HTMLElement>('.np-word')];
  const words: HTMLElement[] = [];
  [...el.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      (node.textContent ?? '').split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(document.createTextNode(' '));
        const span = document.createElement('span');
        span.className = 'np-word';
        span.textContent = part;
        frag.append(span);
        words.push(span);
      });
      node.replaceWith(frag);
    } else if (node instanceof HTMLElement && node.tagName !== 'BR') {
      node.classList.add('np-word');
      words.push(node);
    }
  });
  el.dataset.splitReady = '1';
  return words;
}

function animations() {
  ctx?.revert();
  if (reduce()) {
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => (el.dataset.splitReady = '1'));
    return;
  }
  ctx = gsap.context(() => {
    // Título principal palavra por palavra
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
      const words = splitWords(el);
      gsap.from(words, { yPercent: 60, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: 'expo.out', stagger: 0.06, delay: 0.1 });
    });

    // Contadores
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => (el.textContent = `${Math.round(obj.v)}${el.dataset.suffix ?? ''}`),
      });
    });

    // Entrada ao rolar
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: (els) =>
        gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, overwrite: true }),
    });

    // Rosa dos ventos: gira e assenta no norte
    document.querySelectorAll<SVGElement>('[data-compass]').forEach((svg) => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(svg.querySelector('.np-ring'), { scale: 0.6, opacity: 0, transformOrigin: '50% 50%', duration: 1.4 })
        .from(svg.querySelector('.np-star'), { rotate: -135, scale: 0.4, opacity: 0, transformOrigin: '50% 50%', duration: 1.6 }, 0.1)
        .from(svg.querySelectorAll('.np-dots circle'), { opacity: 0, scale: 0, transformOrigin: '50% 50%', stagger: 0.08, duration: 0.6 }, 0.7);
    });

    // Linhas de rota desenhadas
    document.querySelectorAll<SVGPathElement>('[data-draw]').forEach((path, i) => {
      const len = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.2, delay: 0.4 + i * 0.15, ease: 'power2.inOut' });
    });

    // Linha de progresso do "Como funciona"
    const progress = document.querySelector<HTMLElement>('[data-progress]');
    if (progress) {
      gsap.fromTo(progress, { scaleX: 0 }, {
        scaleX: 1, ease: 'none', transformOrigin: 'left center',
        scrollTrigger: { trigger: progress.parentElement, start: 'top 75%', end: 'bottom 45%', scrub: true },
      });
    }

    // Leve parallax
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      gsap.to(el, { yPercent: Number(el.dataset.parallax || 12), ease: 'none', scrollTrigger: { trigger: el, scrub: true } });
    });
  });
}

function spotlight() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-spotlight], .card').forEach((el) =>
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }),
  );
}

function faq() {
  // Fecha os outros itens ao abrir um (comportamento de acordeão)
  const items = document.querySelectorAll<HTMLDetailsElement>('[data-faq] details');
  items.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) items.forEach((o) => o !== d && (o.open = false));
  }));
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
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
}

export function initMotion() {
  document.addEventListener('astro:page-load', () => {
    document.documentElement.classList.add('js');
    smoothScroll();
    header();
    animations();
    spotlight();
    faq();
    leadForm();
    ScrollTrigger.refresh();
  });
  document.addEventListener('astro:after-swap', () => {
    document.documentElement.classList.add('js');
    if (!location.hash) lenis?.scrollTo(0, { immediate: true });
  });
}
