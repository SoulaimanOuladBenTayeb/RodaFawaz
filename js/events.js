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

window.submitted = false;

function showThanks() {
  alert("Merci ! Roda vous tiendra au courant des prochains événements.");
}

// Refresh 30s + au load
setInterval(loadEvents, 30000);
loadEvents();


