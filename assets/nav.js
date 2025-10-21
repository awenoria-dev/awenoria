// ============== Menus déroulants (Services/Formations) ==============
(function(){
  const dropdowns = [...document.querySelectorAll('.dropdown')];
  let closeTimers = new WeakMap();

  function openDd(dd){
    dropdowns.forEach(d=>{ if(d!==dd) closeDd(d); });
    const btn = dd.querySelector('.dropdown-toggle');
    const panel = dd.querySelector('.mega');
    if(!btn || !panel) return;
    dd.classList.add('opening');
    panel.classList.add('open');
    btn.setAttribute('aria-expanded','true');
  }
  function closeDd(dd){
    const btn = dd.querySelector('.dropdown-toggle');
    const panel = dd.querySelector('.mega');
    if(!btn || !panel) return;
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    dd.classList.remove('opening');
  }
  function scheduleClose(dd, delay=120){
    clearTimeout(closeTimers.get(dd));
    const t = setTimeout(()=>closeDd(dd), delay);
    closeTimers.set(dd, t);
  }
  function cancelClose(dd){ clearTimeout(closeTimers.get(dd)); }

  function setup(dd){
    const btn = dd.querySelector('.dropdown-toggle');
    const panel = dd.querySelector('.mega');
    if(!btn || !panel) return;
    const items = [...panel.querySelectorAll('[role="menuitem"]')];
    btn.setAttribute('aria-expanded','false');
    items.forEach(a=>a.setAttribute('tabindex','0'));

    btn.addEventListener('click', e=>{
      e.stopPropagation();
      panel.classList.contains('open') ? closeDd(dd) : openDd(dd);
    });

    dd.addEventListener('mouseenter', ()=>{ cancelClose(dd); openDd(dd); });
    dd.addEventListener('mouseleave', ()=>{ scheduleClose(dd); });

    document.addEventListener('click', e=>{ if(!dd.contains(e.target)) closeDd(dd); });

    btn.addEventListener('keydown', e=>{
      if(['ArrowDown','Enter',' '].includes(e.key)){
        e.preventDefault(); openDd(dd); items[0]?.focus();
      }
    });
    panel.addEventListener('keydown', e=>{
      if(e.key==='Escape'){ e.preventDefault(); closeDd(dd); btn.focus(); }
      if(e.key==='ArrowDown'){
        e.preventDefault();
        const i = items.indexOf(document.activeElement);
        items[(i+1)%items.length]?.focus();
      }
      if(e.key==='ArrowUp'){
        e.preventDefault();
        const i = items.indexOf(document.activeElement);
        items[(i-1+items.length)%items.length]?.focus();
      }
      if(e.key==='Tab' && panel.classList.contains('open')){
        const first = items[0], last = items[items.length-1];
        if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
      }
    });
  }

  dropdowns.forEach(setup);
})();
  
// ============== Menu Compte (icône ronde) ==============
(function(){
  const account = document.querySelector('.account');
  if (!account) return;

  const btn  = account.querySelector('#accountBtn');
  const menu = account.querySelector('#accountMenu');
  const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
  items.forEach(a => a.tabIndex = 0);

  let hoverTimer = null;
  const isOpen = () => menu.classList.contains('open');
  const open = () => { if (!isOpen()) { menu.classList.add('open'); btn.setAttribute('aria-expanded','true'); } };
  const close = () => { if (isOpen()) { menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); } };
  const toggle = () => (isOpen() ? close() : open());

  account.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); open(); });
  account.addEventListener('mouseleave', () => { clearTimeout(hoverTimer); hoverTimer = setTimeout(close, 140); });
  btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  document.addEventListener('pointerdown', (e) => { if (isOpen() && !account.contains(e.target)) close(); });

  btn.addEventListener('keydown', (e) => {
    const { key } = e;
    if (key === 'Escape') { close(); return; }
    if (key === 'Enter' || key === ' ') { e.preventDefault(); toggle(); if (isOpen()) items[0]?.focus(); return; }
    if (key === 'ArrowDown') { e.preventDefault(); open(); items[0]?.focus(); return; }
    if (key === 'ArrowUp')   { e.preventDefault(); open(); items[items.length - 1]?.focus(); return; }
  });

  menu.addEventListener('keydown', (e) => {
    const { key, shiftKey } = e;
    const i = items.indexOf(document.activeElement);
    if (key === 'Escape')    { e.preventDefault(); close(); btn.focus(); return; }
    if (key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length]?.focus(); return; }
    if (key === 'ArrowUp')   { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus(); return; }
    if (key === 'Home')      { e.preventDefault(); items[0]?.focus(); return; }
    if (key === 'End')       { e.preventDefault(); items[items.length - 1]?.focus(); return; }
    if (key === 'Tab' && isOpen()) {
      e.preventDefault();
      shiftKey ? items[(i - 1 + items.length) % items.length]?.focus()
               : items[(i + 1) % items.length]?.focus();
    }
  });

  items.forEach(a => a.addEventListener('click', () => close()));
  account.addEventListener('focusout', () => {
    setTimeout(() => {
      const active = document.activeElement;
      if (!account.contains(active) && !account.matches(':hover')) close();
    }, 10);
  });
})();
