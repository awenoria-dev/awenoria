// ====== Include Awenoria (Header / Footer) ======
document.addEventListener("DOMContentLoaded", () => {
  // Charger le header
  fetch("partials/header.html")
    .then(r => r.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;
      // Charger le JS de navigation après insertion du header
      const navScript = document.createElement("script");
      navScript.src = "assets/nav.js";
      navScript.defer = true;
      document.body.appendChild(navScript);
    })
    .catch(err => console.error("Erreur chargement header:", err));

  // Charger le footer
  fetch("partials/footer.html")
    .then(r => r.text())
    .then(html => {
      document.getElementById("footer").innerHTML = html;
    })
    .catch(err => console.error("Erreur chargement footer:", err));
});
