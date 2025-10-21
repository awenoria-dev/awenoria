/* =========================================================
   Awenoria — site.js (light)
   Effets globaux non liés à la navigation :
   - Typewriter (.type-on-view)
   - Back-to-top
   - Liens externes sécurisés
   - Défilement doux vers ancres #...
   ========================================================= */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------- Helpers -------------------- */
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);

  /* =================================================
     1) Effet "machine à écrire" sur .type-on-view
        - lit le texte depuis data-text (sinon innerText)
        - déclenche lorsque l’élément entre dans le viewport
     ================================================= */
  (function typewriterInit() {
    const els = $$('.type-on-view');
    if (!els.length) return;

    // Si l’utilisateur préfère moins d’animations, on affiche le texte direct
    if (prefersReduced) {
      els.forEach(el => {
        const full = (el.getAttribute('data-text') || el.textContent || '').trim();
        el.textContent = full;
      });
      return;
    }

    // Prépare chaque élément
    els.forEach(el => {
      const full = (el.getAttribute('data-text') || el.textContent || '').trim();
      el.dataset.fullText = full;
      el.textContent = '';
      el.__typing = false;
      el.setAttribute('aria-live', 'polite');
    });

    // Fonction de frappe
    function type(el, speed = 85) {
      if (el.__typing) return; // évite double déclenchement
      el.__typing = true;
      const full = el.dataset.fullText || '';
      el.textContent = '';
      let i = 0;
      (function tick() {
        el.textContent = full.slice(0, ++i);
        if (i < full.length) {
          setTimeout(tick, speed);
        }
      })();
    }

    // Déclenche au scroll (IntersectionObserver)
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) type(entry.target);
      });
    }, { threshold: 0.4, rootMargin: '0px 0px -10% 0px' });

    els.forEach(el => io.observe(el));
  })();

  /* =================================================
     2) Défilement doux vers ancres internes (#id)
     ================================================= */
  (function smoothAnchors() {
    if (prefersReduced) return; // pas de scroll animé si préférence réduite
    on(document, 'click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Accessibilité : focus visuel rapide
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      setTimeout(() => target.removeAttribute('tabindex'), 300);
      history.pushState(null, '', `#${id}`);
    });
  })();

  /* =================================================
     3) Bouton “Haut de page”
     - injecté dynamiquement
     - styles inline minimalistes (peu intrusifs)
     ================================================= */
  (function backToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Revenir en haut de page');
    btn.textContent = '↑';

    // Styles inline pour autonomie (tu peux déplacer en CSS si tu préfères)
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      width: '40px',
      height: '40px',
      display: 'none',
      placeItems: 'center',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.25)',
      background: 'rgba(255,255,255,0.10)',
      backdropFilter: 'blur(8px)',
      color: 'var(--color-text, #fff)',
      fontWeight: '900',
      cursor: 'pointer',
      zIndex: '999',
    });

    document.body.appendChild(btn);

    const toggle = () => {
      const show = (window.scrollY || window.pageYOffset) > 600;
      btn.style.display = show ? 'grid' : 'none';
    };

    on(window, 'scroll', toggle, { passive: true });
    toggle();

    on(btn, 'click', () => {
      if (prefersReduced) { window.scrollTo(0, 0); return; }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* =================================================
     4) Sécurisation des liens externes (target=_blank)
     ================================================= */
  (function secureExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
      const rel = (a.getAttribute('rel') || '').split(' ').filter(Boolean);
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('noreferrer')) rel.push('noreferrer');
      a.setAttribute('rel', rel.join(' '));
    });
  })();

})();
