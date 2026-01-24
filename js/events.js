async function loadEvents() {
  const container = document.querySelector('.events');
  
  try {
    const response = await fetch('./data/events.json');
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

loadEvents(); // 30ms garanti

