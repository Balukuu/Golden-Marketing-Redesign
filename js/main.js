// main.js - Premium Interactions for Golden Marketing Uganda

document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // CUSTOM PREMIUM CURSOR
  // =========================================
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
  });

  // Expand cursor on interactive elements
  const interactives = document.querySelectorAll('a, button, .bento-card, .menu-toggle');
  interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // Hide native cursor completely
  document.body.style.cursor = 'none';

  // =========================================
  // BENTO CARD SPOTLIGHT (Mouse Tracking)
  // =========================================
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
      });
  });

  // =========================================
  // STICKY NAVBAR (Glassmorphic trigger)
  // =========================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 10) {
              navbar.classList.add('scrolled');
          } else {
              navbar.classList.remove('scrolled');
          }
      });
      if (window.scrollY > 10) navbar.classList.add('scrolled');
  }

  // =========================================
  // MOBILE MENU
  // =========================================
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const dropdowns = document.querySelectorAll('.dropdown');

  if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
          navLinks.classList.toggle('active');
          
          // Animate hamburger to X
          const spans = menuToggle.querySelectorAll('span');
          if (navLinks.classList.contains('active')) {
              spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
              spans[1].style.opacity = '0';
              spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
          } else {
              spans[0].style.transform = 'none';
              spans[1].style.opacity = '1';
              spans[2].style.transform = 'none';
          }
      });
  }

  // Handle dropdowns on mobile
  dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', (e) => {
          if (window.innerWidth <= 992) {
              const content = dropdown.querySelector('.dropdown-content');
              if (content.style.opacity === '1') {
                  content.style.opacity = '0';
                  content.style.visibility = 'hidden';
                  content.style.position = 'absolute';
              } else {
                  content.style.opacity = '1';
                  content.style.visibility = 'visible';
                  content.style.position = 'relative';
                  content.style.transform = 'none';
              }
          }
      });
  });

  // =========================================
  // PREMIUM SCROLL REVEAL (Intersection Observer)
  // =========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-img');
  
  const revealOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
          }
      });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================
  // NUMBER COUNTERS
  // =========================================
  const counters = document.querySelectorAll('.counter-value');
  const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const target = entry.target;
              const targetNumber = parseInt(target.getAttribute('data-target'));
              const duration = 2000;
              const step = Math.ceil(targetNumber / (duration / 16));
              
              let currentNumber = 0;
              const updateCounter = () => {
                  currentNumber += step;
                  if (currentNumber < targetNumber) {
                      target.innerText = currentNumber;
                      requestAnimationFrame(updateCounter);
                  } else {
                      target.innerText = targetNumber + (target.getAttribute('data-suffix') || '');
                  }
              };
              
              updateCounter();
              observer.unobserve(target);
          }
      });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // =========================================
  // ACTIVE NAV LINK LOGIC
  // =========================================
  const currentPath = location.pathname;
  const navItems = document.querySelectorAll('.nav-links a:not(.btn)');
  navItems.forEach(link => {
      const linkPath = new URL(link.href, location.href).pathname;
      // Skip hash-only links and links already hardcoded as active in HTML
      if (link.getAttribute('href') === '#') return;
      if (linkPath === currentPath || 
          (currentPath.endsWith('/') && linkPath === currentPath + 'index.html')) {
          link.classList.add('active');
          const parentDropdown = link.closest('.dropdown');
          if (parentDropdown) parentDropdown.querySelector('a').classList.add('active');
      }
  });
});
