document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("status");

  const data = {
    name: e.target.name.value,
    email: e.target.email.value,
    message: e.target.message.value
  };

  try {
    const response = await fetch("https://formspree.io/f/XXXXXXX", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      status.textContent = "Message envoyé avec succès ✅";
      e.target.reset();
    } else {
      status.textContent = "Erreur lors de l’envoi ❌";
    }
  } catch {
    status.textContent = "Problème réseau ❌";
  }
});
