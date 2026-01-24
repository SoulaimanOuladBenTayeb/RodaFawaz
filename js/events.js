async function loadEvents() {
  const container = document.querySelector('.events');
  
  try {
    const response = await fetch('./data/events.json');
    const events = await response.json();
    console.log('JSON chargé:', events);  // Debug F12
    
    if (!events || !Array.isArray(events)) {
      container.innerHTML = '<p class="backendMessage">JSON mal formaté.</p>';
      return;
    }
    
    const html = events.map(event => `
      <section>
        <p>${event.title || event.event || 'Événement'}</p>
        <a href="${event.link || '#'}" target="_blank" rel="noopener">Réservations</a>
      </section>
    `).join('');
    
    container.innerHTML = html || '<p class="backendMessage">Aucun événement dans JSON.</p>';
  } catch (error) {
    console.error('Erreur JS:', error);
    container.innerHTML = '<p class="backendMessage">Erreur chargement JSON.</p>';
  }
}

loadEvents();


