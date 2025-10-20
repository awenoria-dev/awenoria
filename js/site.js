/* =========================================================
   Awenoria — site.js
   Petits scripts mutualisés : mega-menus, compte, typing H1,
   ancre douce, bouton “haut de page”, focus & accessibilité.
   ========================================================= */

(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------- Helpers -------------------- */
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const $  = (sel, ctx=document) => ctx.querySelector(sel);

  function smoothScrollTo(targetY, duration = 450){
    if (prefersReduced) { window.scrollTo(0, targetY); return; }
    const startY = window.scrollY || window.pageYOffset;
    const diff = targetY - startY;
    let start;

    function step(ts){
      if(!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      // easeInOutQuad
      const p = t < .5 ? 2*t*t : -1+(4-2*t)*t;
      window.scrollTo(0, startY + diff * p);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* -------------------- Focus visible only on Tab -------------------- */
  (function(){
    function handleFirstTab(e){
      if (e.key === 'Tab') {
        document.body.classList.add('user-tabbing');
        window.removeEventListener('keydown', handleFirstTab, true);
        window.addEventListener('mousedown', handleMouseDownOnce, true);
      }
    }
    function handleMouseDownOnce(){
      document.body.classList.remove('user-tabbing');
      window.removeEventListener('mousedown', handleMouseDownOnce, true);
      window.addEventListener('keydown', handleFirstTab, true);
    }
    window.addEventListener('keydown', handleFirstTab, true);
  })();

  /* -------------------- Mega menus (structure .dropdown/.dropdown-toggle/.mega) -------------------- */
  (function(){
    const dropdowns = $$('.dropdown');
    if (!dropdowns.length) return;
    const timers = new WeakMap();

    function open(dd){
      dropdowns.forEach(d => { if (d !== dd) close(d); });
      dd.querySelector('.mega')?.classList.add('open');
      dd.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded','true');
    }
    function close(dd){
      dd.querySelector('.mega')?.classList.remove('open');
      dd.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded','false');
    }
    function schedule(dd, ms=120){
      clearTimeout(timers.get(dd));
      timers.set(dd, setTimeout(() => close(dd), ms));
    }

    dropdowns.forEach(dd => {
      const btn = dd.querySelector('.dropdown-toggle');
      const panel = dd.querySelector('.mega');
      if (!btn || !panel) return;

      // Mouse / hover
      on(dd, 'mouseenter', () => { clearTimeout(timers.get(dd)); open(dd); });
      on(dd, 'mouseleave', () => schedule(dd));

      // Click / touch toggle
      on(btn, 'click', (e) => { e.stopPropagation(); panel.classList.contains('open') ? close(dd) : open(dd); });

      // Close on outside click
      on(document, 'pointerdown', (e) => { if (!dd.contains(e.target)) close(dd); });

      // Close on Escape when open
      on(document, 'keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('open')) {
          close(dd);
          btn.focus();
        }
      });
    });
  })();

  /* -------------------- Menu compte (structure .account / #accountBtn / #accountMenu) -------------------- */
  (function(){
    const account = $('.account'); if (!account) return;
    const btn = account.querySelector('#accountBtn');
    const menu = account.querySelector('#accountMenu');
    if (!btn || !menu) return;

    const items = $$('#accountMenu [role="menuitem"]', account);

    function isOpen(){ return menu.classList.contains('open'); }
    function open(){ menu.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
    function close(){ menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }

    on(account, 'mouseenter', open);
    on(account, 'mouseleave', () => setTimeout(()=>{ if(!account.matches(':hover')) close(); }, 140));
    on(btn, 'click', (e) => { e.stopPropagation(); isOpen() ? close() : open(); });
    on(document, 'pointerdown', (e) => { if (isOpen() && !account.contains(e.target)) close(); });
    items.forEach(a => on(a, 'click', close));
    on(document, 'keydown', (e) => { if (e.key === 'Escape' && isOpen()) { close(); btn.focus(); } });
  })();

  /* -------------------- Effet "typewriter" sur .type-on-view (lit data-text) -------------------- */
  (function(){
    const el = $('.type-on-view'); if (!el) return;
    const full = el.getAttribute('data-text') || el.textContent || '';
    el.textContent = '';
    if (prefersReduced) { el.textContent = full; return; }

    let i = 0;
    const speed = 85;
    (function tick(){
      el.textContent = full.slice(0, ++i);
      if (i < full.length) setTimeout(tick, speed);
    })();
  })();

  /* -------------------- Ancre douce pour liens internes -------------------- */
  (function(){
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - 8;
      smoothScrollTo(y, 450);
      history.pushState(null, '', `#${id}`);
      target.setAttribute('tabindex','-1'); // focusable pour SR
      target.focus({ preventScroll: true });
      setTimeout(()=> target.removeAttribute('tabindex'), 300);
    });
  })();

  /* -------------------- Bouton “Haut de page” (injection auto) -------------------- */
  (function(){
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label','Revenir en haut de page');
    btn.textContent = '↑';
    btn.style.display = 'none';
    document.body.appendChild(btn);

    function toggle(){
      const show = (window.scrollY || window.pageYOffset) > 600;
      btn.style.display = show ? 'grid' : 'none';
    }
    on(window, 'scroll', toggle, { passive: true });
    toggle();

    on(btn, 'click', () => smoothScrollTo(0, 500));
  })();

  /* -------------------- External links safety (target=_blank) -------------------- */
  (function(){
    $$('a[target="_blank"]').forEach(a => {
      const rel = (a.getAttribute('rel') || '').split(' ').filter(Boolean);
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('noreferrer')) rel.push('noreferrer');
      a.setAttribute('rel', rel.join(' '));
    });
  })();

})();
