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

// 🔥 ÉTAPE 2 : INITIALISATION EMAILJS AVEC TES ID
emailjs.init("5Sv5vF_AHr4EsBZS7");  // ← TON PUBLIC_KEY

// Gestion du formulaire newsletter
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form[name="newsletter"]');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = form.querySelector('input[name="email"]').value;
    const button = form.querySelector('button[type="submit"]');
    
    const originalText = button.textContent;
    button.textContent = 'Envoi...';
    button.disabled = true;
    
    try {
      const params = {
        to_email: email,
        user_email: email
      };
      
      // 🔥 ENVOI REEL avec TES identifiants
      await emailjs.send("service_mmjvu14", "template_fzmu3pv", params);
      
      alert(`✅ Parfait ! Confirmation envoyée à ${email}`);
      
    } catch (error) {
      console.error('EmailJS error:', error);
      alert('❌ Erreur envoi. Réessayez ou contacte-moi.');
    } finally {
      button.textContent = originalText;
      button.disabled = false;
      form.reset();
    }
  });
});

// Refresh 30s + au load
setInterval(loadEvents, 30000);
loadEvents();
