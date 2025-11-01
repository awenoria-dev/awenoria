// assets/includes.js
document.addEventListener("DOMContentLoaded", () => {
  const headMount = document.getElementById("header");
  const footMount = document.getElementById("footer");
  if (!headMount && !footMount) return;

  // Détecte si on est sur GitHub Pages (sous-chemin)
  const isGh = /github\.io$/.test(location.hostname);
  let base = "/"; // prod racine
  if (isGh) {
    const parts = location.pathname.split("/").filter(Boolean);
    base = parts.length ? `/${parts[0]}/` : "/";
  }

  // Génère une liste de candidats pour retrouver un fichier
  const candidates = (p) => {
    const clean = p.replace(/^\//, "");
    return [
      base + clean,     // /repo/partials/header.html (GH Pages)
      "./" + clean,     // ./partials/header.html (sous-dossier)
      "../" + clean     // ../partials/header.html (si page à un niveau)
    ];
  };

  async function fetchAny(paths) {
    const queue = paths.flatMap(candidates);
    for (const u of queue) {
      try {
        const r = await fetch(u, { cache: "no-cache" });
        if (r.ok) return r.text();
      } catch (_) {}
    }
    throw new Error("Introuvable: " + paths.join(", "));
  }

  // Réécrit les URLs root-abs (commençant par "/") à la volée pour GH Pages/sous-dossiers
  function fixRootUrls(container) {
    container
      .querySelectorAll('a[href^="/"], img[src^="/"], link[href^="/"], script[src^="/"]')
      .forEach((el) => {
        const attr = el.hasAttribute("href") ? "href" : "src";
        const val = el.getAttribute(attr);
        if (!val || /^\/\//.test(val)) return; // ignore //cdn…
        el.setAttribute(attr, base + val.replace(/^\//, ""));
      });
  }

  // HEADER
  if (headMount) {
    fetchAny(["partials/header.html", "header.html"])
      .then((html) => {
        headMount.innerHTML = html;
        fixRootUrls(headMount);
        // Charger nav.js une seule fois
        if (!window.__aw_nav_loaded__) {
          window.__aw_nav_loaded__ = true;
          return fetchAny(["assets/nav.js", "nav.js"]).then((code) => {
            const s = document.createElement("script");
            // au cas où ce serait un module
            if (/\b(import|export)\b/.test(code)) s.type = "module";
            s.textContent = code;
            document.body.appendChild(s);
          });
        }
      })
      .catch((err) => {
        console.error("Header load error:", err);
        headMount.innerHTML = "<!-- Header introuvable -->";
      });
  }

  // FOOTER
  if (footMount) {
    fetchAny(["partials/footer.html", "footer.html"])
      .then((html) => {
        footMount.innerHTML = html;
        fixRootUrls(footMount);
      })
      .catch((err) => {
        console.error("Footer load error:", err);
        footMount.innerHTML = "<!-- Footer introuvable -->";
      });
  }
});
