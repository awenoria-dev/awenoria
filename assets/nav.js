/* ====== Navigation Awenoria (dropdowns + compte) ====== */
(function () {
  const ddList = Array.from(document.querySelectorAll('.dropdown'));
  const accountBtn = document.getElementById('accountBtn');
  const accountMenu = document.getElementById('accountMenu');

  // Helpers
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

  // ===== Compte
  function openAcc() {
    accountMenu?.classList.add('open');
    accountBtn?.setAttribute('aria-expanded', 'true');
  }
  function closeAcc() {
    accountMenu?.classList.remove('open');
    accountBtn?.setAttribute('aria-expanded', 'false');
  }
  function toggleAcc() {
    accountMenu?.classList.contains('open') ? closeAcc() : openAcc();
  }

  accountBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAcc();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.account')) closeAcc();
  });

  accountBtn?.addEventListener('keydown', (e) => {
    if (['Enter', ' '].includes(e.key)) { e.preventDefault(); toggleAcc(); }
    if (e.key === 'Escape') { closeAcc(); accountBtn.focus(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); openAcc(); accountMenu?.querySelector('a')?.focus(); }
  });

  accountMenu?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeAcc(); accountBtn?.focus(); }
  });
})();
