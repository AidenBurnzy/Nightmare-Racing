// featured-cars.js - Dynamic project loading for Our Projects page

let carsData = [];
let filteredCars = [];
let currentModalCar = null;
let currentImageIndex = 0;

const filtersState = {
    search: '',
    status: 'all',
    make: 'all',
    year: 'all'
};

const sanitizeFrontendMediaUrl = (rawUrl) => {
    if (typeof rawUrl !== 'string') return null;
    const trimmed = rawUrl.trim();
    if (!trimmed || trimmed.startsWith('data:')) {
        return null;
    }
    return trimmed;
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    setupFilterControls();
    loadAllCars();
    setupModalEvents();
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

function setupFilterControls() {
    const searchInput = document.getElementById('filter-search');
    const statusSelect = document.getElementById('filter-status');
    const makeSelect = document.getElementById('filter-make');
    const yearSelect = document.getElementById('filter-year');
    const resetButton = document.getElementById('filter-reset');
    const emptyResetButton = document.getElementById('empty-state-reset');

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            filtersState.search = event.target.value.trim().toLowerCase();
            applyFilters();
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener('change', (event) => {
            const value = event.target.value;
            filtersState.status = value === 'all' ? 'all' : value.toUpperCase();
            applyFilters();
        });
    }

    if (makeSelect) {
        makeSelect.addEventListener('change', (event) => {
            const value = event.target.value;
            filtersState.make = value === 'all' ? 'all' : value;
            applyFilters();
        });
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', (event) => {
            const value = event.target.value;
            filtersState.year = value === 'all' ? 'all' : value;
            applyFilters();
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }

    if (emptyResetButton) {
        emptyResetButton.addEventListener('click', resetFilters);
    }
}

function resetFilters() {
    filtersState.search = '';
    filtersState.status = 'all';
    filtersState.make = 'all';
    filtersState.year = 'all';

    const searchInput = document.getElementById('filter-search');
    const statusSelect = document.getElementById('filter-status');
    const makeSelect = document.getElementById('filter-make');
    const yearSelect = document.getElementById('filter-year');

    if (searchInput) {
        searchInput.value = '';
    }
    if (statusSelect) {
        statusSelect.value = 'all';
    }
    if (makeSelect) {
        makeSelect.value = 'all';
    }
    if (yearSelect) {
        yearSelect.value = 'all';
    }

    applyFilters();
}

function refreshFiltersOptions() {
    const statusSelect = document.getElementById('filter-status');
    const makeSelect = document.getElementById('filter-make');
    const yearSelect = document.getElementById('filter-year');

    if (!statusSelect || !makeSelect || !yearSelect) {
        return;
    }

    const statuses = getUniqueStatuses(carsData);
    populateSelect(
        statusSelect,
        statuses.map((status) => ({ value: status, label: formatStatusLabel(status) })),
        'All statuses',
        filtersState.status
    );
    if (!statuses.includes(filtersState.status)) {
        filtersState.status = 'all';
        statusSelect.value = 'all';
    }

    const makes = getUniqueMakes(carsData);
    populateSelect(makeSelect, makes, 'All makes', filtersState.make);
    if (!makes.some((item) => item.value === filtersState.make)) {
        filtersState.make = 'all';
        makeSelect.value = 'all';
    }

    const years = getUniqueYears(carsData);
    populateSelect(
        yearSelect,
        years.map((year) => ({ value: year, label: year })),
        'All years',
        filtersState.year
    );
    if (!years.includes(filtersState.year)) {
        filtersState.year = 'all';
        yearSelect.value = 'all';
    }
}

function populateSelect(selectEl, items, allLabel, activeValue) {
    if (!selectEl) return;

    selectEl.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = allLabel;
    selectEl.appendChild(allOption);

    items.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.label;
        selectEl.appendChild(option);
    });

    if (activeValue && activeValue !== 'all' && items.some((item) => item.value === activeValue)) {
        selectEl.value = activeValue;
    } else {
        selectEl.value = 'all';
    }
}

function formatStatusLabel(status) {
    if (!status) return '';
    return status
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getUniqueStatuses(cars) {
    const statuses = new Set();
    if (!Array.isArray(cars)) {
        return [];
    }
    cars.forEach((car) => {
        const status = typeof car.status === 'string' ? car.status.toUpperCase() : '';
        if (status) {
            statuses.add(status);
        }
    });
    return Array.from(statuses).sort((a, b) => a.localeCompare(b));
}

function getUniqueMakes(cars) {
    const makes = new Map();
    if (!Array.isArray(cars)) {
        return [];
    }
    cars.forEach((car) => {
        if (typeof car.make !== 'string') {
            return;
        }
        const trimmed = car.make.trim();
        if (!trimmed) {
            return;
        }
        const key = trimmed.toLowerCase();
        if (!makes.has(key)) {
            makes.set(key, trimmed);
        }
    });
    return Array.from(makes.entries())
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label));
}

function getUniqueYears(cars) {
    const years = new Set();
    if (!Array.isArray(cars)) {
        return [];
    }
    cars.forEach((car) => {
        if (!car?.year) {
            return;
        }
        const yearValue = String(car.year);
        if (yearValue) {
            years.add(yearValue);
        }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

function filtersActive() {
    return Boolean(
        filtersState.search ||
        filtersState.status !== 'all' ||
        filtersState.make !== 'all' ||
        filtersState.year !== 'all'
    );
}

function applyFilters() {
    if (!Array.isArray(carsData)) {
        filteredCars = [];
        renderCars([]);
        return;
    }

    const statusFilter = filtersState.status;
    const makeFilter = filtersState.make;
    const yearFilter = filtersState.year;
    const searchTerm = filtersState.search;

    const results = carsData.filter((car) => {
        const statusValue = typeof car.status === 'string' ? car.status.toUpperCase() : '';
        const makeValue = typeof car.make === 'string' ? car.make.trim().toLowerCase() : '';
        const yearValue = car.year ? String(car.year) : '';
        const searchableText = [car.name, car.make, car.model, car.description, car.mechanics]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        const matchesStatus = statusFilter === 'all' || statusValue === statusFilter;
        const matchesMake = makeFilter === 'all' || makeValue === makeFilter;
        const matchesYear = yearFilter === 'all' || yearValue === yearFilter;
        const matchesSearch = !searchTerm || searchableText.includes(searchTerm);

        return matchesStatus && matchesMake && matchesYear && matchesSearch;
    });

    results.sort((a, b) => {
        const timeA = new Date(a.dateAdded || a.created_at || 0).getTime();
        const timeB = new Date(b.dateAdded || b.created_at || 0).getTime();

        if (!Number.isNaN(timeA) && !Number.isNaN(timeB)) {
            return timeB - timeA;
        }

        return (Number(b.year) || 0) - (Number(a.year) || 0);
    });

    filteredCars = results;
    renderCars(filteredCars);
}

// Load all projects from database
async function loadAllCars() {
    try {
        showLoadingState(true);

        const response = await fetch('/.netlify/functions/api-cars');

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
                carsData = data;
                refreshFiltersOptions();
                applyFilters();
                showLoadingState(false);
                return;
            }
            console.warn('Database returned no cars');
        } else {
            console.warn(`Database API error (${response.status}): ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error loading cars from database:', error);
    }

    try {
        if (Array.isArray(window.carsData) && window.carsData.length > 0) {
            carsData = window.carsData;
            refreshFiltersOptions();
            applyFilters();
        } else {
            showDatabaseError();
        }
    } catch (error) {
        console.error('Failed to load alternative data:', error);
        showDatabaseError();
    }

    showLoadingState(false);
}



// Render car grid based on filtered results
function renderCars(cars = []) {
    const container = document.getElementById('cars-container');
    if (!container) return;

    if (!Array.isArray(cars) || cars.length === 0) {
        container.innerHTML = '';
        updateEmptyState({
            show: true,
            icon: filtersActive() ? '🧭' : '🏁',
            title: filtersActive() ? 'No Projects Match These Filters' : 'No Projects Yet',
            message: filtersActive()
                ? 'Try adjusting or clearing filters to see more Nightmare Racing builds.'
                : 'Check back soon for new builds and showcase highlights!',
            showReset: filtersActive()
        });
        return;
    }

    updateEmptyState({ show: false });
    container.style.display = 'grid';
    container.innerHTML = '';

    cars.forEach((car, index) => {
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
    const formattedDate = formatBuildDate(car.dateAdded || car.created_at);

    const metaChips = [];
    if (formattedDate) {
        metaChips.push(`<span class="meta-chip">${formattedDate}</span>`);
    }
    const buildLabelParts = [];
    if (car.year) buildLabelParts.push(car.year);
    if (car.make) buildLabelParts.push(car.make);
    if (car.model) buildLabelParts.push(car.model);
    const buildLabel = buildLabelParts.join(' ');
    if (buildLabel) {
        metaChips.push(`<span class="meta-chip">${buildLabel}</span>`);
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

    renderModalVideos(car);
    
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

function renderModalVideos(car) {
    const container = document.getElementById('modal-videos');
    const grid = document.getElementById('modal-video-grid');

    if (!container || !grid) {
        return;
    }

    grid.innerHTML = '';
    container.style.display = 'none';

    const videos = Array.isArray(car.videos) ? car.videos : [];
    const normalizedVideos = videos
        .map((video) => {
            if (!video) return null;
            if (typeof video === 'string') {
                const sanitizedUrl = sanitizeFrontendMediaUrl(video);
                return sanitizedUrl ? { url: sanitizedUrl, caption: null } : null;
            }
            if (typeof video.url === 'string') {
                const sanitizedUrl = sanitizeFrontendMediaUrl(video.url);
                return sanitizedUrl ? { url: sanitizedUrl, caption: video.caption || null } : null;
            }
            return null;
        })
        .filter(Boolean);

    if (normalizedVideos.length === 0) {
        return;
    }

    normalizedVideos.forEach(({ url, caption }) => {
        const card = document.createElement('div');
        card.className = 'modal-video-card';

        const embedWrapper = document.createElement('div');
        embedWrapper.className = 'modal-video-embed';
        const embedElement = createVideoEmbedElement(url);
        if (embedElement) {
            embedWrapper.appendChild(embedElement);
            card.appendChild(embedWrapper);

            if (caption) {
                const captionEl = document.createElement('p');
                captionEl.className = 'modal-video-caption';
                captionEl.textContent = caption;
                card.appendChild(captionEl);
            }

            grid.appendChild(card);
        }
    });

    if (grid.childNodes.length > 0) {
        container.style.display = '';
    }
}

function createVideoEmbedElement(url) {
    const youTubeId = extractYouTubeId(url);
    if (youTubeId) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${youTubeId}?rel=0&modestbranding=1`;
        iframe.setAttribute('title', 'Project video');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        return iframe;
    }

    const vimeoId = extractVimeoId(url);
    if (vimeoId) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${vimeoId}`;
        iframe.setAttribute('title', 'Project video');
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        return iframe;
    }

    if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm')) {
        const videoEl = document.createElement('video');
        videoEl.controls = true;
        videoEl.preload = 'metadata';
        const sourceEl = document.createElement('source');
        sourceEl.src = url;
        const extension = url.split('.').pop().toLowerCase();
        sourceEl.type = `video/${extension === 'mp4' ? 'mp4' : extension}`;
        videoEl.appendChild(sourceEl);
        return videoEl;
    }

    const fallbackLink = document.createElement('a');
    fallbackLink.href = url;
    fallbackLink.target = '_blank';
    fallbackLink.rel = 'noopener noreferrer';
    fallbackLink.textContent = 'View project video';
    fallbackLink.className = 'modal-video-caption';
    return fallbackLink;
}

function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i,
        /youtube\.com\/live\/([\w-]{11})/i
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

function extractVimeoId(url) {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    return match && match[1] ? match[1] : null;
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
    const emptyState = document.getElementById('empty-state');
    
    if (loadingState) {
        loadingState.style.display = show ? 'block' : 'none';
    }
    if (carsContainer && show) {
        carsContainer.style.display = 'none';
    }
    if (emptyState && show) {
        emptyState.style.display = 'none';
    }
}

// Manage empty state messaging and visibility
function updateEmptyState({ show, icon = '🏁', title = 'No Projects Yet', message = 'Check back soon for new builds and showcase highlights!', showReset = false } = {}) {
    const emptyState = document.getElementById('empty-state');
    const carsContainer = document.getElementById('cars-container');
    const iconEl = document.getElementById('empty-state-icon');
    const titleEl = document.getElementById('empty-state-title');
    const messageEl = document.getElementById('empty-state-message');
    const resetButton = document.getElementById('empty-state-reset');

    if (!emptyState) {
        return;
    }

    if (iconEl) {
        iconEl.textContent = icon;
    }
    if (titleEl) {
        titleEl.textContent = title;
    }
    if (messageEl) {
        messageEl.textContent = message;
    }
    if (resetButton) {
        resetButton.style.display = show && showReset ? 'inline-flex' : 'none';
    }

    const retryButton = emptyState.querySelector('button[data-retry]');
    if (retryButton && !show) {
        retryButton.style.display = 'none';
    }

    emptyState.style.display = show ? 'block' : 'none';

    if (carsContainer && show) {
        carsContainer.style.display = 'none';
    }
}

// Show database error state
function showDatabaseError() {
    updateEmptyState({
        show: true,
        icon: '⚠️',
        title: 'Database Connection Error',
        message: 'Unable to connect to the vehicle database. This might be due to missing environment variables on Netlify.',
        showReset: false
    });

    const emptyState = document.getElementById('empty-state');
    if (!emptyState) {
        return;
    }

    const resetButton = document.getElementById('empty-state-reset');
    if (resetButton) {
        resetButton.style.display = 'none';
    }

    let retryButton = emptyState.querySelector('button[data-retry]');
    if (!retryButton) {
        retryButton = document.createElement('button');
        retryButton.type = 'button';
        retryButton.dataset.retry = 'true';
        retryButton.className = 'btn btn-secondary';
        retryButton.style.marginBottom = '1.5rem';
        retryButton.textContent = 'Try Again';
        retryButton.addEventListener('click', () => window.location.reload());

        const homeLink = emptyState.querySelector('.btn.btn-primary');
        emptyState.insertBefore(retryButton, homeLink || null);
    } else {
        retryButton.style.display = 'inline-flex';
    }
}