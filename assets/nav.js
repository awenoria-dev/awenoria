/* ====== Navigation Awenoria (dropdowns + compte) ====== */
(function () {
  const ddList = Array.from(document.querySelectorAll('.dropdown'));

  // Helpers dropdowns
  const openDD = (dd) => {
    ddList.forEach(d => closeDD(d));
    const btn = dd.querySelector('.dropdown-toggle');
    const panel = dd.querySelector('.mega');
    if (!btn || !panel) return;
    dd.classList.add('opening');
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  };
  const closeDD = (dd) => {
    const btn = dd.querySelector('.dropdown-toggle');
    const panel = dd.querySelector('.mega');
    if (!btn || !panel) return;
    dd.classList.remove('opening');
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  };

  // Init dropdowns
  ddList.forEach(dd => {
    const btn = dd.querySelector('.dropdown-toggle');
    const panel = dd.querySelector('.mega');
    if (!btn || !panel) return;

    // Click toggle
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.contains('open') ? closeDD(dd) : openDD(dd);
    });

    // Hover (desktop)
    dd.addEventListener('mouseenter', () => openDD(dd));
    dd.addEventListener('mouseleave', () => closeDD(dd));

    // Keyboard
    btn.addEventListener('keydown', (e) => {
      if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        openDD(dd);
        const first = panel.querySelector('[role="menuitem"]');
        first && first.focus();
      }
      if (e.key === 'Escape') closeDD(dd);
    });
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDD(dd);
        btn.focus();
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) ddList.forEach(closeDD);
  });

  // ===== Compte (survol + click + clavier)
  (function () {
    const account = document.querySelector('.account');
    if (!account) return;

    const btn  = account.querySelector('#accountBtn');
    const menu = account.querySelector('#accountMenu');
    const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
    items.forEach(a => a.tabIndex = 0);

    let hoverTimer = null;
    const isOpen  = () => menu.classList.contains('open');
    const open    = () => { if (!isOpen()) { menu.classList.add('open'); btn.setAttribute('aria-expanded','true'); } };
    const close   = () => { if (isOpen())   { menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); } };
    const toggle  = () => (isOpen() ? close() : open());

    // Survol (comme sur l’accueil)
    account.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); open(); });
    account.addEventListener('mouseleave', () => { clearTimeout(hoverTimer); hoverTimer = setTimeout(close, 140); });

    // Click + click dehors
    btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    document.addEventListener('pointerdown', (e) => { if (isOpen() && !account.contains(e.target)) close(); });

    // Clavier
    btn.addEventListener('keydown', (e) => {
      const { key } = e;
      if (key === 'Escape') { close(); return; }
      if (key === 'Enter' || key === ' ') {
        e.preventDefault(); toggle(); if (isOpen()) items[0]?.focus();
      }
      if (key === 'ArrowDown') { e.preventDefault(); open(); items[0]?.focus(); }
      if (key === 'ArrowUp')   { e.preventDefault(); open(); items[items.length - 1]?.focus(); }
    });
    menu.addEventListener('keydown', (e) => {
      const { key, shiftKey } = e;
      const i = items.indexOf(document.activeElement);
      if (key === 'Escape')    { e.preventDefault(); close(); btn.focus(); }
      if (key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
      if (key === 'ArrowUp')   { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus(); }
      if (key === 'Home')      { e.preventDefault(); items[0]?.focus(); }
      if (key === 'End')       { e.preventDefault(); items[items.length - 1]?.focus(); }
      if (key === 'Tab' && isOpen()) {
        e.preventDefault();
        shiftKey ? items[(i - 1 + items.length) % items.length]?.focus()
                 : items[(i + 1) % items.length]?.focus();
      }
    });

    // Fermer après clic sur un lien
    items.forEach(a => a.addEventListener('click', () => close()));
  })();

})();
