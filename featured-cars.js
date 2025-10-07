// featured-cars.js - Dynamic car loading for Featured Cars page

let carsData = [];
let currentModalCar = null;
let currentImageIndex = 0;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Featured Cars Page JavaScript
    loadAllCars();
    setupModalEvents();
    
    // Handle direct car links from carousel
    handleDirectCarLink();
});

// Handle direct car links (e.g., from carousel)
function handleDirectCarLink() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
        const carName = decodeURIComponent(hash.substring(1));
        // Find specific car from URL parameter
        
        // Wait for cars to load, then try to open the specific car
        setTimeout(() => {
            const car = carsData.find(c => c.name === carName);
            if (car) {
                openCarModal(car);
            }
        }, 1000);
    }
}

// Load all featured cars from database
async function loadAllCars() {
    try {
        showLoadingState(true);
        
        // Fetch cars from database API
        const response = await fetch('/.netlify/functions/api-cars');
        
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                carsData = data;
                displayAllCars();
                showLoadingState(false);
                return;
            } else {
                console.warn('Database returned no cars');
            }
        } else {
            console.warn(`Database API error (${response.status}): ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error loading cars from database:', error);
    }
    
    // If API failed, try to use the same data source as the working carousel
    try {
        // Since carousel works, let's try to get its data
        if (window.carsData && window.carsData.length > 0) {
            carsData = window.carsData;
            displayAllCars();
        } else {
            // Last resort - show a helpful message
            showDatabaseError();
        }
    } catch (error) {
        console.error('Failed to load alternative data:', error);
        showDatabaseError();
    }
    
    showLoadingState(false);
}



// Display all cars in grid
function displayAllCars() {
    const container = document.getElementById('cars-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    carsData.forEach((car, index) => {
        const carCard = createCarCard(car, index);
        container.appendChild(carCard);
    });
}

// Create car card element
function createCarCard(car, index) {
    const card = document.createElement('div');
    card.className = 'featured-car-card';
    card.onclick = () => openCarModal(car);
    
    // Prepare images array from database structure
    const images = [];
    if (car.mainImage) images.push(car.mainImage);
    if (car.gallery && Array.isArray(car.gallery)) {
        car.gallery.forEach(item => {
            if (typeof item === 'string') {
                images.push(item);
            } else if (item.url) {
                images.push(item.url);
            } else if (item.image) {
                images.push(item.image);
            }
        });
    }
    
    // Create specs HTML
    let specsHTML = '';
    if (car.specs) {
        const specs = car.specs;
        if (specs.zeroToSixty) {
            specsHTML += createSpecItem('0-60', specs.zeroToSixty);
        }
        if (specs.topSpeed) {
            specsHTML += createSpecItem('Top Speed', specs.topSpeed);
        }
        if (specs.horsepower) {
            specsHTML += createSpecItem('Horsepower', specs.horsepower);
        }
        if (specs.engine) {
            specsHTML += createSpecItem('Engine', specs.engine);
        }
        if (specs.weight) {
            specsHTML += createSpecItem('Weight', specs.weight);
        }
        if (specs.custom1) {
            specsHTML += createSpecItem('', specs.custom1);
        }
        if (specs.custom2) {
            specsHTML += createSpecItem('', specs.custom2);
        }
    }
    
    card.innerHTML = `
        <div class="car-status-badge">${car.status || 'COMPLETED'}</div>
        
        <div class="car-image-gallery" id="gallery-${index}">
            ${images.length > 0 
                ? `<img src="${images[0]}" alt="${car.name}" class="gallery-main-image">`
                : `<div class="gallery-placeholder">🏎️</div>`
            }
            ${images.length > 1 ? `
                <div class="gallery-controls">
                    ${images.map((_, i) => `<div class="gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('')}
                </div>
            ` : ''}
        </div>
        
        <div class="car-info-section">
            <h3 class="car-name">${car.name || 'Unnamed Build'}</h3>
            <p class="car-description">${car.description || 'No description available'}</p>
            
            ${specsHTML ? `
                <div class="car-specs-grid">
                    ${specsHTML}
                </div>
            ` : ''}
            
            <button class="view-details-btn">View Full Details</button>
        </div>
    `;
    
    // Setup image gallery if multiple images
    if (images.length > 1) {
        setupCardGallery(card, images, index);
    }
    
    return card;
}

// Create spec item HTML
function createSpecItem(label, value) {
    return `
        <div class="spec-item">
            ${label ? `<div class="spec-label">${label}</div>` : ''}
            <div class="spec-value">${value}</div>
        </div>
    `;
}

// Setup image gallery for card
function setupCardGallery(card, images, cardIndex) {
    const galleryElement = card.querySelector(`#gallery-${cardIndex}`);
    const mainImage = galleryElement.querySelector('.gallery-main-image');
    const dots = galleryElement.querySelectorAll('.gallery-dot');
    
    let currentIndex = 0;
    let intervalId = null;
    
    // Auto-advance images
    function startAutoAdvance() {
        intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            updateGalleryImage();
        }, 3000);
    }
    
    function stopAutoAdvance() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
    
    function updateGalleryImage() {
        mainImage.src = images[currentIndex];
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Dot click handlers
    dots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = i;
            updateGalleryImage();
            stopAutoAdvance();
            startAutoAdvance();
        });
    });
    
    // Hover to pause
    card.addEventListener('mouseenter', stopAutoAdvance);
    card.addEventListener('mouseleave', startAutoAdvance);
    
    startAutoAdvance();
}

// Open car detail modal
function openCarModal(car) {
    currentModalCar = car;
    currentImageIndex = 0;
    
    const modal = document.getElementById('car-modal');
    if (!modal) return;
    
    // Prepare images
    const images = [];
    if (car.mainImage) images.push(car.mainImage);
    if (car.gallery && Array.isArray(car.gallery)) {
        car.gallery.forEach(item => {
            if (typeof item === 'string') {
                images.push(item);
            } else if (item.image) {
                images.push(item.image);
            }
        });
    }
    
    // Update modal content
    document.getElementById('modal-car-name').textContent = car.name || 'Unnamed Build';
    document.getElementById('modal-car-description').textContent = car.description || 'No description available';
    document.getElementById('modal-status').textContent = car.status || 'COMPLETED';
    
    // Update main image
    const mainImage = document.getElementById('modal-main-image');
    if (images.length > 0) {
        mainImage.src = images[0];
        mainImage.alt = car.name;
    } else {
        mainImage.src = '';
        mainImage.alt = 'No image available';
    }
    
    // Update thumbnails
    const thumbnailsContainer = document.getElementById('modal-thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    if (images.length > 1) {
        images.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${img}" alt="View ${index + 1}">`;
            thumb.onclick = () => setModalImage(index, images);
            thumbnailsContainer.appendChild(thumb);
        });
    }
    
    // Update specs
    const specsContainer = document.getElementById('modal-specs');
    specsContainer.innerHTML = '';
    
    if (car.specs) {
        const specs = car.specs;
        if (specs.zeroToSixty) {
            specsContainer.innerHTML += createSpecItem('0-60 Time', specs.zeroToSixty);
        }
        if (specs.topSpeed) {
            specsContainer.innerHTML += createSpecItem('Top Speed', specs.topSpeed);
        }
        if (specs.horsepower) {
            specsContainer.innerHTML += createSpecItem('Horsepower', specs.horsepower);
        }
        if (specs.custom1) {
            specsContainer.innerHTML += createSpecItem('', specs.custom1);
        }
        if (specs.custom2) {
            specsContainer.innerHTML += createSpecItem('', specs.custom2);
        }
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Setup navigation
    setupModalNavigation(images);
}

// Close modal
function closeCarModal() {
    const modal = document.getElementById('car-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Set modal image
function setModalImage(index, images) {
    if (!images || images.length === 0) return;
    
    currentImageIndex = index;
    const mainImage = document.getElementById('modal-main-image');
    mainImage.src = images[index];
    
    // Update thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Setup modal navigation
function setupModalNavigation(images) {
    const prevBtn = document.querySelector('.prev-image');
    const nextBtn = document.querySelector('.next-image');
    
    if (!images || images.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }
    
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
    
    prevBtn.onclick = () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        setModalImage(currentImageIndex, images);
    };
    
    nextBtn.onclick = () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        setModalImage(currentImageIndex, images);
    };
}

// Setup modal events
function setupModalEvents() {
    const modal = document.getElementById('car-modal');
    const closeBtn = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCarModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeCarModal);
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeCarModal();
        }
    });
}

// Show/hide loading state
function showLoadingState(show) {
    const loadingState = document.getElementById('loading-state');
    const carsContainer = document.getElementById('cars-container');
    
    if (loadingState) {
        loadingState.style.display = show ? 'block' : 'none';
    }
    if (carsContainer) {
        carsContainer.style.display = show ? 'none' : 'grid';
    }
}

// Show empty state
function showEmptyState() {
    const emptyState = document.getElementById('empty-state');
    const carsContainer = document.getElementById('cars-container');
    
    if (emptyState) {
        emptyState.style.display = 'block';
    }
    if (carsContainer) {
        carsContainer.style.display = 'none';
    }
}

// Show database error state
function showDatabaseError() {
    const emptyState = document.getElementById('empty-state');
    const carsContainer = document.getElementById('cars-container');
    
    if (emptyState) {
        emptyState.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #ccc;">
                <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
                <h2 style="color: #e50000; margin-bottom: 20px;">Database Connection Error</h2>
                <p style="margin-bottom: 15px;">Unable to connect to the car database.</p>
                <p style="margin-bottom: 20px;">This might be due to missing environment variables on Netlify.</p>
                <button onclick="location.reload()" style="background: #e50000; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
        emptyState.style.display = 'block';
    }
    if (carsContainer) {
        carsContainer.style.display = 'none';
    }
}