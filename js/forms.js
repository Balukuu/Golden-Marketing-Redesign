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
          const service = formData.get('service') || '';
          const message = formData.get('message') || '';

          // Format WhatsApp message
          let waMessage = `Hi Golden Marketing, I'd like to get a proposal.\n\n`;
          if (name) waMessage += `*Name:* ${name}\n`;
          if (company) waMessage += `*Company:* ${company}\n`;
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
});
