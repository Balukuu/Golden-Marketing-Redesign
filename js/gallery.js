// gallery.js - Masonry gallery and Lightbox for Golden Marketing Uganda

document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.querySelector('.gallery-grid');
  
  // Example image arrays
  const merchandisingImages = [
      '4.png', 'GM-1.jpg', 'GM-23.jpg', 'GM-25.jpg', 'GM-5.jpg', 
      'GM-7.jpg', 'IMG_8133.jpg', 'IMG_8184.jpg', 'IMG_8239.jpg', 
      'IMG_9003.jpg', 'IMG_9012.jpg', 'IMG_9066.jpg', 'IMG_9100.jpg', 'IMG_9128.jpg'
  ].map(img => `Images/Merchandising/${img}`);

  const activationImages = [
      'ASK_7993.jpg', 'ASK_8003.jpg', 'ASK_8157.jpg', 'ASK_8274.jpg', 
      'ASK_8339.jpg', 'GM-10.jpg', 'GM-11.jpg', 'GM-14.jpg', 'GM-23.jpg', 
      'GM-28.jpg', 'GM-41.jpg', 'GM-49.jpg', 'GM-59.jpg', 'GM-6.jpg', 
      'GM-64.jpg', 'GM-70.jpg', 'GM-88.jpg', 'IMG_0036.JPG', 'IMG_0050.JPG', 
      'IMG_0142.jpg', 'IMG_0190.jpg'
  ].map(img => `Images/Activations/${img}`);

  // Combine for 'All' view, with categories
  const allImages = [
      ...merchandisingImages.map(src => ({ src, category: 'merchandising' })),
      ...activationImages.map(src => ({ src, category: 'activations' }))
  ];

  if (galleryContainer) {
      // Determine which images to load based on data attribute
      const galleryType = galleryContainer.getAttribute('data-gallery-type') || 'all';
      let imagesToLoad = [];
      
      if (galleryType === 'merchandising') {
          imagesToLoad = merchandisingImages.map(src => ({ src, category: 'merchandising' }));
      } else if (galleryType === 'activations') {
          imagesToLoad = activationImages.map(src => ({ src, category: 'activations' }));
      } else {
          imagesToLoad = allImages;
      }

      // Render gallery
      renderGallery(imagesToLoad);

      // Filtering logic
      const filterButtons = document.querySelectorAll('.filter-btn');
      filterButtons.forEach(btn => {
          btn.addEventListener('click', () => {
              // Update active state
              filterButtons.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');

              const filterValue = btn.getAttribute('data-filter');
              
              if (filterValue === 'all') {
                  renderGallery(allImages);
              } else {
                  const filtered = allImages.filter(img => img.category === filterValue);
                  renderGallery(filtered);
              }
          });
      });
  }

  function renderGallery(images) {
      if(!galleryContainer) return;
      
      galleryContainer.innerHTML = '';
      
      const isSubfolder = window.location.pathname.includes('/services/');
      const pathPrefix = isSubfolder ? '../' : '';

      images.forEach((item, index) => {
          const wrapper = document.createElement('div');
          wrapper.className = `gallery-item category-${item.category}`;
          
          const imgEl = document.createElement('img');
          imgEl.src = pathPrefix + item.src;
          imgEl.alt = `${item.category} image ${index + 1}`;
          imgEl.setAttribute('loading', 'lazy');
          
          const overlay = document.createElement('div');
          overlay.className = 'gallery-overlay';
          
          const text = document.createElement('div');
          text.className = 'overlay-text';
          text.innerText = item.category === 'merchandising' ? 'Merchandising' : 'Activation';
          
          overlay.appendChild(text);
          wrapper.appendChild(imgEl);
          wrapper.appendChild(overlay);
          
          // Lightbox trigger
          wrapper.addEventListener('click', () => openLightbox(imgEl.src));
          
          galleryContainer.appendChild(wrapper);
      });
  }

  // Lightbox Implementation using existing DOM elements
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  function openLightbox(src) {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
  }

  if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
  }
  
  if (lightbox) {
      lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) {
              closeLightbox();
          }
      });
  }

  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
          closeLightbox();
      }
  });
});
