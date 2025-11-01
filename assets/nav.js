/* ===== Navigation Awenoria (cartes + volet latéral) ===== */
(function () {

  /* ---------- dropdowns classiques (aria conservé) ---------- */
  const ddList = Array.from(document.querySelectorAll('.dropdown'));

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

  ddList.forEach(dd => {
    const btn = dd.querySelector('.dropdown-toggle');
    const panel = dd.querySelector('.mega');
    if (!btn || !panel) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.contains('open') ? closeDD(dd) : openDD(dd);
    });

    dd.addEventListener('mouseenter', () => openDD(dd));
    dd.addEventListener('mouseleave', () => closeDD(dd));

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

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) ddList.forEach(closeDD);
  });

  /* ---------- génération des cartes depuis window.COURSES ---------- */
  function buildCards(containerId, themesFilter) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const courses = (window.COURSES || []).filter(c => c.themes && c.themes.some(t => themesFilter.includes(t)));
    container.innerHTML = courses.map(c => `
      <div class="who-card" data-who="${c.slug}" role="menuitem" tabindex="0">
        <div class="who-ico">📘</div>
        <div class="who-title">${c.title}</div>
        <div class="who-desc">${c.duration} · ${c.level}</div>
      </div>
    `).join('');
  }

  function buildServicesCards() {
    const services = [
      {slug:'audit', ico:'📊', title:'Audit', desc:'Audit flash, analyse'},
      {slug:'juridique', ico:'⚖️', title:'Juridique', desc:'Modèles, mentions'},
      {slug:'conformite', ico:'🔒', title:'Conformité', desc:'RGPD, IA, accessibilité'},
      {slug:'web', ico:'🖥️', title:'Web & accessibilité', desc:'RGAA, cookies, mentions'}
    ];
    const container = document.getElementById('services-cards');
    if (!container) return;
    container.innerHTML = services.map(s => `
      <div class="who-card" data-who="${s.slug}" role="menuitem" tabindex="0">
        <div class="who-ico">${s.ico}</div>
        <div class="who-title">${s.title}</div>
        <div class="who-desc">${s.desc}</div>
      </div>
    `).join('');
  }

  buildCards('formations-cards', ['rgpd-essentiels', 'cookies', 'ia-act', 'access', 'cyber']);
  buildServicesCards();

  /* ---------- volet latéral fluide ---------- */
  const sidePanel = document.getElementById('sidePanel');
  const sideNav   = document.getElementById('sideNav');
  const sideClose = document.querySelector('.side-close');

  const datas = {
    rgpdBases: [
      {t: 'RGPD express', d: '2 h atelier'},
      {t: 'Audit gouvernance', d: '½ journée'},
      {t: 'Formation dirigeants', d: '1 journée'},
      {t: 'Pack abonnement', d: 'Sur mesure'}
    ],
    cookiesCmp: [
      {t: 'Cookies & CMP', d: '2 h'},
      {t: 'Accessibilité RGAA', d: '½ j'},
      {t: 'Cybersécurité de base', d: '1 j'},
      {t: 'IA & conformité UE', d: '1 j'}
    ],
    iaActIntro: [
      {t: 'IA Act intro', d: '1 jour'},
      {t: 'Classification des risques', d: '½ j'},
      {t: 'Dossier technique', d: 'Atelier'},
      {t: 'Plan de conformité', d: 'Sur mesure'}
    ],
    rgaaAccess: [
      {t: 'RGAA / EN 301 549', d: 'Audit + correctifs'},
      {t: 'Cookies & CMP', d: 'Bannière + registre'},
      {t: 'Mentions légales', d: 'Mise à jour auto'},
      {t: 'Écoconception', d: 'Référentiel + score'}
    ],
    cyberInitiation: [
      {t: 'Cyber initiation', d: '1 jour'},
      {t: 'Menaces & attaques', d: '½ j'},
      {t: 'Protection des postes', d: 'Atelier'},
      {t: 'Plan de sensibilisation', d: 'Sur mesure'}
    ],
    audit: [
      {t: 'Audit flash', d: '½ j'},
      {t: 'Audit complet', d: '1 j'},
      {t: 'Mission sur mesure', d: 'Sur devis'},
      {t: 'Suivi annuel', d: 'Abonnement'}
    ],
    juridique: [
      {t: 'Modèles juridiques', d: 'Pack à la carte'},
      {t: 'Politique de cookies', d: 'CMP prête à l’emploi'},
      {t: 'Mentions légales', d: 'Génération + hébergement'},
      {t: 'Politique de confidentialité', d: 'RGPD compliant'}
    ],
    conformite: [
      {t: 'Accompagnement RGPD', d: 'Audit + mise en conformité'},
      {t: 'Conformité IA (UE)', d: 'IA Act & règlementations'},
      {t: 'Accessibilité RGAA', d: 'Audit + déclaration'},
      {t: 'DPO externalisé', d: 'Forfait mensuel'}
    ],
    web: [
      {t: 'RGAA / EN 301 549', d: 'Audit + correctifs'},
      {t: 'Cookies & CMP', d: 'Bannière + registre'},
      {t: 'Mentions légales', d: 'Mise à jour automatique'},
      {t: 'Écoconception', d: 'Référentiel + score'}
    ]
  };

  document.querySelectorAll('.who-card').forEach(card => {
    card.addEventListener('click', () => {
      const who = card.dataset.who;
      const items = datas[who] || [];
      sideNav.innerHTML = `
        <h3 style="margin-top:0">Je veux…</h3>
        ${items.map(it => `
          <a class="side-item" href="#">
            ${it.t}
            <span style="margin-left:auto;font-size:12px;color:var(--muted)">${it.d}</span>
          </a>`).join('')}
        <a class="side-item" href="catalogue.html" style="margin-top:12px;font-weight:800">Tout voir</a>
      `;
      sidePanel.classList.add('open');
    });
  });

  sideClose.addEventListener('click', () => sidePanel.classList.remove('open'));

  /* ---------- compte (inchangé) ---------- */
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

    account.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); open(); });
    account.addEventListener('mouseleave', () => { clearTimeout(hoverTimer); hoverTimer = setTimeout(close, 140); });

    btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    document.addEventListener('pointerdown', (e) => { if (isOpen() && !account.contains(e.target)) close(); });

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

    items.forEach(a => a.addEventListener('click', () => close()));
  })();

})();
