// assets/awenoria-cookies.js
(function(){
  if (window.__awenoriaCookiesLoaded) return; // no duplicate
  window.__awenoriaCookiesLoaded = true;

  // ---------- Styles (scoped by IDs we inject) ----------
  const css = `
  #aw-cookies *, #aw-cookies *::before, #aw-cookies *::after{box-sizing:border-box}
  #aw-cookies{position:fixed;inset:auto 16px 16px 16px;z-index:9999;font-family:Manrope,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#16233a}
  #awc-bar{max-width:980px;margin:0 auto;background:#fff;border:1px solid #e9eef4;border-radius:14px;box-shadow:0 16px 32px rgba(16,32,48,.12);padding:16px 16px 14px}
  #awc-bar h2{margin:0 0 6px;font-size:18px;line-height:1.3}
  #awc-bar p{margin:0 0 10px;color:#5d6b7c}
  #awc-actions{display:flex;gap:10px;flex-wrap:wrap}
  #awc-actions .btn{appearance:none;border:none;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer}
  #awc-accept{background:#005a8e;color:#fff;box-shadow:0 1px 0 rgba(255,255,255,.35) inset}
  #awc-accept:hover{background:#ff6600}
  #awc-refuse{background:#fff;color:#005a8e;border:1px solid #e9eef4}
  #awc-customize{background:#0073b6;color:#fff}
  #awc-link{background:transparent;border:none;color:#005a8e;text-decoration:underline;font-weight:800;padding:0 4px;cursor:pointer}
  #awc-modal{position:fixed;inset:0;background:rgba(10,22,34,.45);display:none;align-items:center;justify-content:center;z-index:10000;padding:20px}
  #awc-panel{max-width:820px;width:100%;background:#fff;border:1px solid #e9eef4;border-radius:16px;box-shadow:0 24px 48px rgba(16,32,48,.10)}
  #awc-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #e9eef4}
  #awc-hd strong{font-size:16px}
  #awc-close{background:transparent;border:none;font-size:22px;cursor:pointer}
  #awc-bd{padding:14px 18px}
  .awc-row{display:flex;gap:12px;align-items:flex-start;border:1px solid #e9eef4;border-radius:12px;padding:12px;margin:0 0 10px;background:#fff}
  .awc-row h3{margin:2px 0 4px;font-size:15px}
  .awc-row p{margin:0;color:#5d6b7c;font-size:14px}
  .awc-switch{margin-left:auto;display:flex;align-items:center;gap:8px}
  .awc-switch input{width:44px;height:24px;appearance:none;background:#e6f1f9;border:1px solid #d5e7f4;border-radius:30px;position:relative;outline:none;cursor:pointer}
  .awc-switch input:checked{background:#0073b6}
  .awc-switch input::after{content:"";position:absolute;top:50%;left:2px;transform:translateY(-50%);width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.15);transition:transform .2s}
  .awc-switch input:checked::after{transform:translate(20px,-50%)}
  .awc-switch .lock{font-size:13px;color:#5d6b7c}
  #awc-ft{display:flex;gap:10px;justify-content:flex-end;border-top:1px solid #e9eef4;padding:12px 18px}
  #awc-save{background:#005a8e;color:#fff;border:none;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer}
  #awc-refuse-all{background:#fff;color:#005a8e;border:1px solid #e9eef4;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer}
  #awc-accept-all{background:#0073b6;color:#fff;border:none;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer}
  #awc-manage{position:fixed;right:16px;bottom:16px;z-index:9998;background:#fff;border:1px solid #e9eef4;border-radius:999px;box-shadow:0 12px 24px rgba(16,32,48,.12);padding:8px 12px;font-weight:800;color:#005a8e;display:none}
  #awc-manage:hover{color:#ff6600}
  @media(max-width:560px){#aw-cookies{inset:auto 8px 8px 8px} #awt{display:block}}
  `;
  const style = document.createElement('style');
  style.setAttribute('data-awenoria','cookies');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- HTML container ----------
  if (!document.getElementById('aw-cookies')) {
    const wrap = document.createElement('div');
    wrap.id = 'aw-cookies';
    wrap.setAttribute('role','region');
    wrap.setAttribute('aria-label',"Information sur l'utilisation des cookies");
    wrap.innerHTML = `
      <div id="awc-bar" role="dialog" aria-modal="false" aria-describedby="awc-desc" hidden>
        <h2>Cookies & traceurs</h2>
        <p id="awc-desc">Nous utilisons des cookies pour le fonctionnement du site, mesurer l’audience et améliorer nos services. Les cookies non essentiels ne sont déposés qu’avec votre consentement.</p>
        <div id="awt" style="font-size:13px;color:#5d6b7c;margin:2px 0 10px">
          Vous pouvez changer d’avis à tout moment via « Gérer les cookies ».
          <button id="awc-link" type="button" aria-haspopup="dialog">En savoir plus</button>
        </div>
        <div id="awc-actions">
          <button id="awc-accept" class="btn" type="button">Tout accepter</button>
          <button id="awc-refuse" class="btn" type="button">Tout refuser</button>
          <button id="awc-customize" class="btn" type="button" aria-haspopup="dialog">Personnaliser</button>
        </div>
      </div>
      <div id="awc-modal" role="dialog" aria-modal="true" aria-labelledby="awc-title">
        <div id="awc-panel">
          <div id="awc-hd">
            <strong id="awc-title">Centre de préférences</strong>
            <button id="awc-close" type="button" aria-label="Fermer">×</button>
          </div>
          <div id="awc-bd">
            <div class="awc-row">
              <div><h3>Nécessaires</h3><p>Indispensables au fonctionnement du site (sécurité, choix de consentement, session). Toujours actifs.</p></div>
              <div class="awc-switch"><span class="lock">Activés</span></div>
            </div>
            <div class="awc-row">
              <div><h3>Mesure d’audience</h3><p>Statistiques anonymisées quand c’est possible (ex. Plausible / Matomo), sinon avec consentement.</p></div>
              <div class="awc-switch"><label for="awc-audience" class="sr-only">Autoriser Mesure d’audience</label><input id="awc-audience" type="checkbox"></div>
            </div>
            <div class="awc-row">
              <div><h3>Fonctionnalités</h3><p>Améliorations UX (ex. chat, feedback). Peut déposer des traceurs tiers.</p></div>
              <div class="awc-switch"><label for="awc-func" class="sr-only">Autoriser Fonctionnalités</label><input id="awc-func" type="checkbox"></div>
            </div>
            <div class="awc-row">
              <div><h3>Publicité / Réseaux sociaux</h3><p>Mesure et personnalisation publicitaires, boutons sociaux.</p></div>
              <div class="awc-switch"><label for="awc-ads" class="sr-only">Autoriser Publicité</label><input id="awc-ads" type="checkbox"></div>
            </div>
          </div>
          <div id="awc-ft">
            <button id="awc-refuse-all" type="button">Tout refuser</button>
            <button id="awc-accept-all" type="button">Tout accepter</button>
            <button id="awc-save" type="button">Enregistrer</button>
          </div>
        </div>
      </div>
      <button id="awc-manage" type="button" aria-haspopup="dialog">Gérer les cookies</button>
    `;
    document.body.appendChild(wrap);
  }

  // ---------- Logic ----------
  const KEY='awenoria_consent_v1';
  const $ = (sel) => document.querySelector(sel);
  const bar   = $('#awc-bar');
  const modal = $('#awc-modal');
  const manage= $('#awc-manage');
  const chkAudience = $('#awc-audience');
  const chkFunc     = $('#awc-func');
  const chkAds      = $('#awc-ads');

  function read(){ try{ return JSON.parse(localStorage.getItem(KEY)||''); }catch(e){ return null; } }
  function write(obj){ localStorage.setItem(KEY, JSON.stringify(Object.assign({ts:Date.now()}, obj))); }
  function setUIFromConsent(c){
    chkAudience.checked = !!(c && c.audience);
    chkFunc.checked     = !!(c && c.functionality);
    chkAds.checked      = !!(c && c.ads);
  }
  function allow(cat){ const c = read(); if(!c) return false; if(cat==='necessary') return true; return !!c[cat]; }

  function loadDeferred(){
    document.querySelectorAll('script[type="text/plain"][data-cookie-category]').forEach(node=>{
      const cat=node.getAttribute('data-cookie-category'); if(!allow(cat)) return;
      const s=document.createElement('script');
      if(node.getAttribute('data-src')) s.src=node.getAttribute('data-src');
      s.async = node.hasAttribute('data-async');
      s.defer = node.hasAttribute('data-defer');
      s.text  = node.text || '';
      [...node.attributes].forEach(a=>{
        if(!/^data-/.test(a.name)) return;
        if(a.name==='data-cookie-category' || a.name==='data-src') return;
        s.setAttribute(a.name.replace(/^data-/,''), a.value);
      });
      node.replaceWith(s);
    });
    document.querySelectorAll('iframe[data-cookie-category][data-src]').forEach(ifr=>{
      const cat=ifr.getAttribute('data-cookie-category'); if(!allow(cat)) return;
      if(!ifr.src) ifr.src = ifr.getAttribute('data-src');
    });
  }

  function openBar(){ bar.hidden=false; manage.style.display='none'; }
  function closeBar(){ bar.hidden=true; manage.style.display='inline-flex'; }
  function openModal(){ modal.style.display='flex'; modal.setAttribute('aria-hidden','false'); }
  function closeModal(){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); }

  const current = read();
  if(!current){ openBar(); } else { closeBar(); setUIFromConsent(current); loadDeferred(); }

  $('#awc-accept').addEventListener('click', ()=>{ const c={audience:true,functionality:true,ads:true}; write(c); setUIFromConsent(c); closeBar(); loadDeferred(); });
  $('#awc-refuse').addEventListener('click', ()=>{ const c={audience:false,functionality:false,ads:false}; write(c); setUIFromConsent(c); closeBar(); });
  $('#awc-customize').addEventListener('click', ()=>{ setUIFromConsent(read()||{}); openModal(); });
  $('#awc-link').addEventListener('click', ()=>{ window.location.href='politique-cookies.html'; });
  manage.addEventListener('click', ()=>{ setUIFromConsent(read()||{}); openModal(); });
  $('#awc-close').addEventListener('click', closeModal);
  $('#awc-accept-all').addEventListener('click', ()=>{ chkAudience.checked=chkFunc.checked=chkAds.checked=true; });
  $('#awc-refuse-all').addEventListener('click', ()=>{ chkAudience.checked=chkFunc.checked=chkAds.checked=false; });
  $('#awc-save').addEventListener('click', ()=>{ const c={audience:chkAudience.checked,functionality:chkFunc.checked,ads:chkAds.checked}; write(c); closeModal(); closeBar(); loadDeferred(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal.style.display==='flex'){ closeModal(); }});
})();
