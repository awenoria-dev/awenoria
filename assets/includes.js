(function(){
  async function injectIncludes() {
    const nodes = document.querySelectorAll('[data-include]');
    for (const el of nodes) {
      const file = el.getAttribute('data-include');
      try {
        const res = await fetch(file, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(res.statusText);
        const html = await res.text();
        el.outerHTML = html;
      } catch (e) {
        console.error('Include error:', file, e);
      }
    }
  }
  if (document.readyState !== 'loading') injectIncludes();
  else document.addEventListener('DOMContentLoaded', injectIncludes);
})();
