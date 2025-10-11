// featured-cars.js - Dynamic project loading for Our Projects page

let carsData = [];
let currentModalCar = null;
let currentImageIndex = 0;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Our Projects Page JavaScript
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

// Load all projects from database
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

    const images = buildImageArray(car);
    const previewDescription = getOverviewPreview(car.description);
    const statusLabel = (car.status || 'COMPLETED').toUpperCase();
    const formattedDate = formatBuildDate(car.dateAdded);

    const metaChips = [];
    if (formattedDate) {
        metaChips.push(`<span class="meta-chip">${formattedDate}</span>`);
    }
    if (car.featured) {
        metaChips.push('<span class="meta-chip meta-chip-featured">Featured</span>');
    }
    const metaHTML = metaChips.length ? `<div class="car-card-meta">${metaChips.join('')}</div>` : '';

    const specsHTML = buildSpecsPreview(car.specs);

    card.innerHTML = `
        <div class="car-status-badge">${statusLabel}</div>
        <div class="car-image-gallery" id="gallery-${index}">
            ${images.length > 0
                ? `<img src="${images[0]}" alt="${car.name || 'Project build'}" class="gallery-main-image">`
                : `<div class="gallery-placeholder">🏎️</div>`
            }
            ${images.length > 1 ? `
                <div class="gallery-count">${images.length} photos</div>
                <div class="gallery-controls">
                    ${images.map((_, i) => `<div class="gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('')}
                </div>
            ` : ''}
        </div>
        <div class="car-info-section">
            <div class="car-card-header">
                <h3 class="car-name">${car.name || 'Unnamed Build'}</h3>
                ${metaHTML}
            </div>
            <p class="car-description">${previewDescription}</p>
            ${specsHTML ? `
                <div class="car-specs-grid">
                    ${specsHTML}
                </div>
            ` : ''}
            <div class="car-card-footer">
                <button type="button" class="view-details-btn">View Full Details</button>
            </div>
        </div>
    `;

    if (images.length > 1) {
        setupCardGallery(card, images, index);
    }

    card.addEventListener('click', () => openCarModal(car));

    const detailsButton = card.querySelector('.view-details-btn');
    if (detailsButton) {
        detailsButton.addEventListener('click', (event) => {
            event.stopPropagation();
            openCarModal(car);
        });
    }

    return card;
}

function buildImageArray(car) {
    const images = [];
    if (car.mainImage && car.mainImage !== 'null') {
        images.push(car.mainImage);
    }
    if (Array.isArray(car.gallery)) {
        car.gallery.forEach((item) => {
            if (!item) return;
            if (typeof item === 'string' && item !== 'null') {
                images.push(item);
                return;
            }
            if (typeof item === 'object') {
                if (typeof item.url === 'string' && item.url !== 'null') {
                    images.push(item.url);
                    return;
                }
                if (typeof item.image === 'string' && item.image !== 'null') {
                    images.push(item.image);
                }
            }
        });
    }
    return images;
}

function buildSpecsPreview(specs) {
    if (!specs) return '';
    const specEntries = [];

    if (specs.zeroToSixty) specEntries.push({ label: '0-60', value: specs.zeroToSixty });
    if (specs.topSpeed) specEntries.push({ label: 'Top Speed', value: specs.topSpeed });
    if (specs.horsepower) specEntries.push({ label: 'Horsepower', value: specs.horsepower });
    if (specs.engine) specEntries.push({ label: 'Engine', value: specs.engine });
    if (specs.weight) specEntries.push({ label: 'Weight', value: specs.weight });
    if (specs.custom1) specEntries.push({ label: '', value: specs.custom1 });
    if (specs.custom2) specEntries.push({ label: '', value: specs.custom2 });

    const limitedSpecs = specEntries.slice(0, 4);
    return limitedSpecs.map((spec) => createSpecItem(spec.label, spec.value)).join('');
}

function getOverviewPreview(text, options = {}) {
    const { maxSentences = 2, maxChars = 220 } = options;
    if (!text) {
        return 'Overview coming soon.';
    }

    const normalized = String(text).replace(/\s+/g, ' ').trim();
    if (!normalized) {
        return 'Overview coming soon.';
    }

    const sentences = normalized.match(/[^.!?]+[.!?]?/g) || [normalized];
    let preview = '';

    for (const sentence of sentences) {
        const trimmed = sentence.trim();
        if (!trimmed) continue;

        const candidate = preview ? `${preview} ${trimmed}` : trimmed;
        if (preview && candidate.length > maxChars) {
            break;
        }

        preview = candidate;

        const sentenceCount = (preview.match(/[.!?]/g) || []).length;
        if (sentenceCount >= maxSentences || preview.length >= maxChars) {
            break;
        }
    }

    if (preview.length > maxChars) {
        preview = preview.slice(0, maxChars);
    }

    const needsEllipsis = preview.length < normalized.length;
    if (needsEllipsis) {
        preview = preview.replace(/\s[^\s]*$/, '').replace(/[.,;:\-\s]*$/, '');
        preview += '…';
    }

    return preview;
}

function formatBuildDate(dateInput) {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
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
    
    const images = buildImageArray(car);
    const statusLabel = (car.status || 'COMPLETED').toUpperCase();
    
    // Update modal content
    document.getElementById('modal-car-name').textContent = car.name || 'Unnamed Build';
    document.getElementById('modal-car-description').textContent = car.description || 'No description available';
    document.getElementById('modal-status').textContent = statusLabel;
    
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