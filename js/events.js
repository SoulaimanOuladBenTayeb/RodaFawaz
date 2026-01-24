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

// Gestion du formulaire newsletter
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form[name="newsletter"]');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Empêche l'envoi Netlify par défaut
    
    const email = form.querySelector('input[name="email"]').value;
    const button = form.querySelector('button[type="submit"]');
    
    // Désactive le bouton pendant le traitement
    const originalText = button.textContent;
    button.textContent = 'Envoi...';
    button.disabled = true;
    
    try {
      // Étape 1 : Préparation pour l'envoi (on simulera d'abord)
      console.log('Email capturé:', email);
      
      // Pour l'instant, on affiche juste un message de succès
      // (Étape 2 = vrai envoi email, Étape 3 = sauvegarde)
      alert(`Merci ! Confirmation envoyée à ${email}`);
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi. Réessayez.');
    } finally {
      // Remet le bouton en état
      button.textContent = originalText;
      button.disabled = false;
      form.reset();
    }
  });
});

// Refresh 30s + au load
setInterval(loadEvents, 30000);
loadEvents();



