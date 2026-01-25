async function loadEvents() {
  const container = document.querySelector('.events');
  
  try {
    // ?t= timestamp = jamais cache
    const timestamp = new Date().getTime();
    const response = await fetch(`./data/events.json?t=${timestamp}`);
    const events = await response.json();
    
    const html = events.map(event => `
      <section>
        <p>${event.title}</p>
        <a href="${event.link}" target="_blank" rel="noopener">Réservations</a>
      </section>
    `).join('') || '<p class="backendMessage">Aucun événement.</p>';
    
    container.innerHTML = html;
  } catch {
    container.innerHTML = '<p class="backendMessage">Chargement...</p>';
  }
}

const form = document.getElementById('newsletter-form');
const thanks = document.getElementById('thanks');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    await fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSf57GcJQX4fe4zMy6xpsNNr0Vy3jGSGgBP0XwT0Cq9pnJcXzg/formResponse",
      {
        method: "POST",
        mode: "no-cors",
        body: formData
      }
    );

    form.style.display = "none";
    thanks.style.display = "block";

  } catch (err) {
    alert("Erreur, réessaie plus tard.");
  }
});

// Refresh 30s + au load
setInterval(loadEvents, 30000);
loadEvents();



