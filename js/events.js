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
          ? 'Plus d\'informations'
          : 'Réservations';
        buttonHtml = `<a href="${event.link}" target="_blank" rel="noopener">${label}</a>`;
      }

      return `
        <section class="event">
          <p class="event-title">
            <span class="event-main">
              ${event.city || event.title ? (event.city || event.title.split('—')[0]) : 'Événement'}
              ${event.description ? `— ${event.description}` : ''}
            </span>
            <span class="event-date">
              ${event.date || ''}
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

// Formulaire newsletter avec validation
const form = document.getElementById('newsletter-form');
const thanks = document.getElementById('thanks');
const emailInput = form.querySelector('input[type="email"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailValue = emailInput.value.trim();

  if (!isValidEmail(emailValue)) {
    alert("Adresse e-mail invalide (exemple : nom@domaine.com)");
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
    thanks.style.display = "block";

  } catch (err) {
    console.error(err);
    alert("Erreur, réessaie plus tard.");
  }
});

// Refresh 30s + au load
setInterval(loadEvents, 30000);
loadEvents();
