<script>
document.addEventListener("DOMContentLoaded", () => {
  const headMount = document.getElementById("header");
  const footMount = document.getElementById("footer");

  // Ne rien faire si la page n'a pas ces conteneurs
  if (!headMount && !footMount) return;

  // Charger le header
  if (headMount) {
    fetch("/partials/header.html")
      .then(r => r.text())
      .then(html => {
        headMount.innerHTML = html;
        // Charger le JS de navigation APRÈS insertion (une seule fois)
        const s = document.createElement("script");
        s.src = "/assets/nav.js";
        s.defer = true;
        document.body.appendChild(s);
      })
      .catch(err => console.error("Header load error:", err));
  }

  // Charger le footer
  if (footMount) {
    fetch("/partials/footer.html")
      .then(r => r.text())
      .then(html => { footMount.innerHTML = html; })
      .catch(err => console.error("Footer load error:", err));
  }
});
</script>
