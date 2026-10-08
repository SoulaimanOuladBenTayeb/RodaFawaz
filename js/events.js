// Validation email stricte
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

async function loadEvents() {
  const container = document.querySelector('.events');
  
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`/data/events.json?t=${timestamp}`);
    const events = await response.json();
    
    const html = events.map(event => {
      let buttonHtml = '';

      if (event.link && event.linkType !== 'none') {
        const label = event.linkType === 'info'
          ? 'Informations'
          : 'Réservations';
        buttonHtml = `<a class="event-link" href="${event.link}" target="_blank" rel="noopener">${label}</a>`;
      }

      // Texte d’inscription (optionnel)
      let inscriptionHtml = '';
      if (event.inscription) {
        inscriptionHtml = `
          <span class="event-line event-line-3">
            ${event.inscription}
          </span>
        `;
      }

      // Séparer play (pièce) et venue (lieu), seulement si description existe
      let play = '';
      let venue = '';

      if (event.description && typeof event.description === 'string') {
        if (event.description.includes(',')) {
          const parts = event.description.split(',').map(p => p.trim());
          play = parts[0] || '';
          venue = parts.slice(1).join(', ') || '';
        } else {
          play = event.description;
          venue = '';
        }
      }

      // Construire les deux premières lignes uniquement si city / date existent
      const line1 = (event.city || '') || play ? `${event.city || ''}${event.city && play ? ' — ' : ''}${play}` : '';
      const line2 = [venue, event.date].filter(Boolean).join(' — ');

      return `
        <section class="event">
          <p class="event-title">
            <span class="event-top">
              ${line1 ? `<span class="event-line event-line-1">${line1}</span>` : ''}
              ${line2 ? `<span class="event-line event-line-2">${line2}</span>` : ''}
            </span>
            ${inscriptionHtml}
          </p>
          ${buttonHtml}
        </section>
      `;
    }).join('') || '<p class="backendMessage">Aucun événement.</p>';
    
    container.innerHTML = html;
  } catch {
    container.innerHTML = '<p class="backendMessage">Chargement...</p>';
  }
}

// Newsletter avec erreur en paragraphe rouge (EN DEHORS du form)
const form = document.getElementById('newsletter-form');
const thanks = document.getElementById('thanks');

// Créer élément erreur EN DEHORS du form (comme thanks)
const errorMessage = document.createElement('p');
errorMessage.id = 'email-error';
errorMessage.style.cssText = `
  display: none;
  color:
