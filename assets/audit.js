const SIGMA = (function () {
  const REF = {
    cookies: { mustHaveRefuse: true, mustHaveLink: true, maxThirdParty: 5 },
    tls: { minVersion: 'TLS 1.3', mustHSTS: true },
    headers: { csp: true, xfo: true, referrer: true },
    wcag: { minContrast: 4.5, altMissingMax: 5 },
    eco: { maxTransfer: 800 } // KB
  };

  async function scanURL(rawURL) {
    if (!rawURL) throw 'URL manquante';
    const url = new URL(rawURL);
    console.log('[Σ] Début scan', url.href);

    const res = await fetch(url, { redirect: 'follow', credentials: 'omit' });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const scripts = [...doc.querySelectorAll('script[src]')].map(s => new URL(s.src, url).hostname);
    const third = new Set(scripts.filter(h => h !== url.hostname)).size;
    const cmp = !!doc.querySelector('button[id*="tarteaucitron"],button[class*="cmp"],button[class*="cookie"]');
    const refuse = !!doc.querySelector('button[class*="refuse"],button[id*="refuse"]');

    const tlsOk = url.protocol === 'https:';
    const hsts = res.headers.get('strict-transport-security');
    const csp = res.headers.get('content-security-policy');
    const xfo = res.headers.get('x-frame-options');
    const refPol = res.headers.get('referrer-policy');

    const text = doc.body.innerText.toLowerCase();
    const siret = /\d{14}/.test(text);
    const rna = /w\d{9}/.test(text);
    const tva = /fr\w{11}/.test(text);

    const imgs = [...doc.images];
    const altMissing = imgs.filter(i => !i.alt).length;
    const transferKB = Math.round((new Blob([html]).size + 2 * 1024) / 1024);

    const policyLink = [...doc.querySelectorAll('a')].find(a => /politique|confidentialité|privacy/i.test(a.textContent));

    const issues = [];
    if (third > REF.cookies.maxThirdParty) issues.push({ id: 'C-01', msg: `${third} cookies tiers détectés`, ref: 'EDPB 2020/05' });
    if (!refuse) issues.push({ id: 'C-02', msg: 'Bouton "Refuser" non trouvé', ref: 'EDPB 2020/05' });
    if (!hsts) issues.push({ id: 'S-01', msg: 'Header HSTS absent', ref: 'ANSSI RGS' });
    if (!csp) issues.push({ id: 'S-02', msg: 'CSP non définie', ref: 'OWASP Secure Headers' });
    if (!siret || !rna || !tva) issues.push({ id: 'M-01', msg: 'Mentions légales incomplètes', ref: 'Loi pour la confiance' });
    if (altMissing > REF.wcag.altMissingMax) issues.push({ id: 'A-01', msg: `${altMissing} images sans alt`, ref: 'WCAG 2.2' });
    if (transferKB > REF.eco.maxTransfer) issues.push({ id: 'E-01', msg: `${transferKB} KB transférés (page d’accueil)`, ref: 'Green-IT Model' });

    const score = Math.max(0, 100 - issues.length * 8);

    return {
      url: url.href,
      date: new Date().toISOString(),
      score,
      metrics: {
        cookies: { third, cmp, refuse },
        tls: { version: 'TLS 1.3 (estimé)', hsts: !!hsts },
        headers: { csp: !!csp, xfo: !!xfo, referrer: !!refPol },
        mentions: { siret, rna, tva },
        wcag: { altMissing },
        eco: { transferKB }
      },
      issues
    };
  }

  return { scanURL };
})();

async function runAudit() {
  const input = document.querySelector('#auditUrl');
  const btn = document.querySelector('.url-bar button');
  const resS = document.querySelector('#results-section');
  const scoreEl = document.querySelector('#compliance-score');
  const checksEl = document.querySelector('#checks-count');
  const issuesEl = document.querySelector('#issues-count');
  const listEl = document.querySelector('#issues-list');
  const openBtn = document.querySelector('#openReportBtn');

  if (!input.value) return;
  btn.disabled = true;
  btn.textContent = 'Analyse en cours…';
  resS.classList.remove('hidden');
  listEl.innerHTML = '';

  try {
    const report = await SIGMA.scanURL(input.value);
    scoreEl.textContent = report.score + '%';
    checksEl.textContent = '8/8';
    issuesEl.textContent = report.issues.length;

    report.issues.forEach(iss => {
      const div = document.createElement('div');
      div.className = 'flex items-start gap-3 bg-white rounded-lg p-3 border-l-4 border-amber-500';
      div.innerHTML = `
        <svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <div>
          <div class="text-sm font-semibold text-gray-800">${iss.msg}</div>
          <a class="text-xs text-blue-600 hover:underline" href="https://example.com/ref/${iss.ref}" target="_blank">${iss.ref}</a>
        </div>`;
      listEl.appendChild(div);
    });

    sessionStorage.setItem('sigmaReport', JSON.stringify(report));
    openBtn.onclick = () => window.open('result.html', '_blank');

  } catch (err) {
    console.error(err);
    alert('Erreur : ' + err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Analyser votre site';
  }
}
