// forms.js - Form validation and WhatsApp integration for Golden Marketing Uganda

document.addEventListener('DOMContentLoaded', () => {
  const leadForms = document.querySelectorAll('.lead-form');

  leadForms.forEach(form => {
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          
          // Basic validation
          let isValid = true;
          const requiredFields = form.querySelectorAll('[required]');
          
          requiredFields.forEach(field => {
              if (!field.value.trim()) {
                  isValid = false;
                  field.style.borderColor = 'red';
                  field.style.boxShadow = '0 0 0 3px rgba(255,0,0,0.15)';
              } else {
                  field.style.borderColor = '';
                  field.style.boxShadow = '';
              }
          });

          if (!isValid) {
              alert('Please fill in all required fields.');
              return;
          }

          // Gather data
          const formData = new FormData(form);
          const name = formData.get('name') || '';
          const company = formData.get('company') || '';
          const phone = formData.get('phone') || '';
          const email = formData.get('email') || '';
          const service = formData.get('service') || '';
          const message = formData.get('message') || '';

          // Format WhatsApp message
          let waMessage = `Hi Golden Marketing, I'd like to get a proposal.\n\n`;
          if (name) waMessage += `*Name:* ${name}\n`;
          if (company) waMessage += `*Company:* ${company}\n`;
          if (phone) waMessage += `*Phone:* ${phone}\n`;
          if (email) waMessage += `*Email:* ${email}\n`;
          if (service) waMessage += `*Service:* ${service}\n`;
          if (message) waMessage += `*Message:* ${message}\n`;

          const encodedMessage = encodeURIComponent(waMessage);
          const whatsappUrl = `https://wa.me/256393112860?text=${encodedMessage}`;

          // Visual feedback
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn.innerText;
          submitBtn.innerText = 'Redirecting to WhatsApp...';
          submitBtn.style.opacity = '0.7';

          // Open WhatsApp
          setTimeout(() => {
              window.open(whatsappUrl, '_blank');
              submitBtn.innerText = originalText;
              submitBtn.style.opacity = '1';
              form.reset();
          }, 1000);
      });
  });

  // Pre-fill form from query params (e.g. contact.html?role=promoter)
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  if (role) {
    const serviceSelect = document.getElementById('service');
    const messageTextarea = document.getElementById('message');
    
    // Nice role names mapping
    const rolesMap = {
      'field-sales': 'Field Sales Agent',
      'promoter': 'Brand Promoter',
      'supervisor': 'Field Supervisor',
      'coordinator': 'Project Coordinator'
    };
    
    const roleTitle = rolesMap[role] || role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // Pre-fill the project textarea
    if (messageTextarea) {
      messageTextarea.value = `Hi Golden Marketing team,\n\nI am writing to apply for the ${roleTitle} position advertised on your Careers page. Please find my credentials attached/details below.`;
    }
    
    // Select the "Careers / Job Application" option if it exists, otherwise fallback to "Multiple Services"
    if (serviceSelect) {
      // Let's look for a careers option
      let careersOption = Array.from(serviceSelect.options).find(opt => opt.value.toLowerCase().includes('career'));
      if (careersOption) {
        serviceSelect.value = careersOption.value;
      } else {
        // Create the careers option dynamically if it is not present
        const opt = document.createElement('option');
        opt.value = 'Careers / Job Application';
        opt.textContent = 'Careers / Job Application';
        serviceSelect.appendChild(opt);
        serviceSelect.value = 'Careers / Job Application';
      }
    }
  }
});
