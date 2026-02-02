// Validation email stricte
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

async function loadEvents() {
  const container = document.querySelector('.events');
  
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`./data/events.json?t=${timestamp}`);
    const events = await response.json();
    
    const html = events.map(event => {
      let buttonHtml = '';

      if (event.link && event.linkType !== 'none') {
        const label = event.linkType === 'info'
          ? 'Informations'
          : 'Réservations';
        buttonHtml = `<a class="event-link" href="${event.link}" target="_blank" rel="noopener">${label}</a>`;
      }

      // Séparer play (pièce) et venue (lieu)
      let play = event.description || '';
      let venue = '';

      if (event.description && event.description.includes(',')) {
        const parts = event.description.split(',').map(p => p.trim());
        play = parts[0];                    // "La Mouette"
        venue = parts.slice(1).join(', ');  // "Théâtre des Martyrs"
      }

      return `
        <section class="event">
          <p class="event-title">
            <span class="event-line event-line-1">
              ${event.city} — ${play}
            </span>
            <span class="event-line event-line-2">
              ${venue} — ${event.date}
            </span>
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
  color: #d00;
  font-size: 0.9em;
  margin-top: 0.5rem;
  text-align: center;
`;
form.parentNode.insertBefore(errorMessage, form.nextSibling);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailValue = form.querySelector('input[type="email"]').value.trim();

  // Cache erreur précédente
  errorMessage.style.display = 'none';

  if (!isValidEmail(emailValue)) {
    errorMessage.textContent = "Adresse invalide. Format : nom@domaine.com ou nom@domaine.be";
    errorMessage.style.display = 'block';
    return;
  }

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
    errorMessage.style.display = "none";
    thanks.style.display = "block";

  } catch (err) {
    console.error(err);
    alert("Erreur, réessaie plus tard.");
  }
});

// Refresh 30s + au load
setInterval(loadEvents, 30000);
loadEvents();
