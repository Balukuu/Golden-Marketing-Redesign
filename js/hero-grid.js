// hero-grid.js - Organized 3x3 Animated Image Grid for Hero Section

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.hero-animated-grid');
    if (!gridContainer) return;

    const isSubfolder = window.location.pathname.includes('/services') ||
                         window.location.href.includes('/services/');
    const pathPrefix = isSubfolder ? '../' : '';

    const allImages = [
        'Images/Activations/IMG_0190.jpg',
        'Images/Activations/GM-10.jpg',
        'Images/Activations/GM-11.jpg',
        'Images/Activations/GM-41.jpg',
        'Images/Activations/GM-49.jpg',
        'Images/Activations/GM-59.jpg',
        'Images/Merchandising/4.png',
        'Images/Merchandising/GM-1.jpg',
        'Images/Merchandising/GM-5.jpg',
        'Images/Merchandising/IMG_8133.jpg',
        'Images/Merchandising/IMG_8184.jpg',
        'Images/Merchandising/IMG_9100.jpg'
    ];

    const category = gridContainer.getAttribute('data-category');
    let images = allImages;
    if (category === 'merchandising') {
        images = allImages.filter(img => img.includes('Merchandising'));
    } else if (category === 'activations') {
        images = allImages.filter(img => img.includes('Activations'));
    }

    // Create a 9-cell staggered masonry grid
    const totalCells = 9;
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'hero-grid-cell';
        // Give each cell a random height between 130px and 240px to create the staggered masonry look
        const randomHeight = Math.floor(Math.random() * (240 - 130 + 1)) + 130;
        cell.style.height = `${randomHeight}px`;
        gridContainer.appendChild(cell);
    }

    const cells = Array.from(gridContainer.children);

    function animateRandomCell() {
        if (!cells || cells.length === 0) return;
        
        // Find cells that aren't currently active
        const inactiveCells = cells.filter(c => !c.classList.contains('active'));
        if (inactiveCells.length === 0) return; // All cells are busy

        // Pick a random inactive cell
        const randomCell = inactiveCells[Math.floor(Math.random() * inactiveCells.length)];
        
        // Pick a random image
        const randomImage = images[Math.floor(Math.random() * images.length)];

        // Preload image visually
        randomCell.style.backgroundImage = `url('${pathPrefix}${randomImage}')`;
        
        // Force reflow
        void randomCell.offsetWidth;
        
        // Fade it in
        randomCell.classList.add('active');

        // Display for 2.5s to 4.5s
        const displayTime = Math.random() * 2000 + 2500;
        
        // Fade it out
        setTimeout(() => {
            if (randomCell) {
                randomCell.classList.remove('active');
            }
        }, displayTime);
    }

    // Main animation loop — stops automatically if the grid is removed from DOM
    let loopTimeout = null;
    function loop() {
        if (!document.body.contains(gridContainer)) return; // Stop if unmounted
        animateRandomCell();
        // Trigger next image appearance at a random interval (600ms to 1200ms)
        loopTimeout = setTimeout(loop, Math.random() * 600 + 600);
    }

    // Initial burst of images on load (populate 4 out of 9 cells immediately)
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            if (document.body.contains(gridContainer)) animateRandomCell();
        }, Math.random() * 1000);
    }

    // Start continuous loop after a short delay
    loopTimeout = setTimeout(loop, 500);
});
