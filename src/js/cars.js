const CARD_PIXEL_WIDTH = 352; // card width (320) + gap (32)
const MIN_SWIPE_DISTANCE = 50;
const EMOJI_PLACEHOLDERS = ['🏎️', '🚗', '🏁', '🚙', '⚡'];

let carsData = [];
let currentSlide = 0;
let cardsPerView = 1;
let totalSlides = 0;

window.carsData = carsData;

async function loadCarsData() {
    try {
        const response = await fetch('/.netlify/functions/api-cars');

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                carsData = data.filter(car => car.featured !== false);
                window.carsData = carsData;
                initializeCarousel();
                return;
            }

            console.warn('Database returned no cars, using fallback data');
        } else {
            console.warn(`Database API error (${response.status}), using fallback data`);

            if (response.status === 500) {
                console.error('Database connection error - check Netlify environment variables');
            }
        }
    } catch (error) {
        console.error('Error loading cars from database:', error);
        carsData = [];
        window.carsData = carsData;
        initializeCarousel();
    }
}

function initializeCarousel() {
    displayCars();
    setupCarouselNavigation();
    setupResponsiveCarousel();
    startAutoPlay();
}

function displayCars() {
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;

    carouselTrack.innerHTML = '';

    const featuredCars = getFeaturedCars();
    featuredCars.forEach(car => {
        carouselTrack.appendChild(createCarCard(car));
    });

    totalSlides = Math.max(1, featuredCars.length - cardsPerView + 1);
    createCarouselIndicators();
    updateCarouselPosition();
}

function getFeaturedCars() {
    return carsData.filter(car => car.featured);
}

function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';

    const specsHTML = [
        car.specs?.zeroToSixty && `0-60: ${car.specs.zeroToSixty}`,
        car.specs?.topSpeed && `Top Speed: ${car.specs.topSpeed}`,
        car.specs?.horsepower,
        car.specs?.custom1,
        car.specs?.custom2
    ].filter(Boolean).map(value => `<span>${value}</span>`).join('');

    card.innerHTML = `
        <div class="car-image">
            ${buildImageHTML(car)}
            <div class="car-overlay">
                <button class="btn btn-small" onclick="viewCarDetails('${car.name}')">View Details</button>
            </div>
        </div>
        <div class="car-info">
            <h3>${car.name}</h3>
            <p>${car.description}</p>
            <div class="car-specs">
                ${specsHTML}
            </div>
        </div>
    `;

    return card;
}

function buildImageHTML(car) {
    if (car.mainImage) {
        return `<img src="${car.mainImage}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
    }

    if (car.gallery && car.gallery.length > 0) {
        const firstImage = typeof car.gallery[0] === 'string' ? car.gallery[0] : car.gallery[0].image;
        return `<img src="${firstImage}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
    }

    const randomEmoji = EMOJI_PLACEHOLDERS[Math.floor(Math.random() * EMOJI_PLACEHOLDERS.length)];
    return `<div class="car-placeholder">${randomEmoji}</div>`;
}

function setupCarouselNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn?.addEventListener('click', previousSlide);
    nextBtn?.addEventListener('click', nextSlide);
}

function createCarouselIndicators() {
    const indicatorsContainer = document.getElementById('carousel-indicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';

    Array.from({ length: totalSlides }).forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(dot);
    });
}

// Navigation functions
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarouselPosition();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarouselPosition();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarouselPosition();
}

function updateCarouselPosition() {
    const carouselTrack = document.getElementById('carousel-track');
    const indicators = document.querySelectorAll('.carousel-dot');

    if (carouselTrack) {
        const offset = currentSlide * CARD_PIXEL_WIDTH;
        carouselTrack.style.transform = `translateX(-${offset}px)`;
    }

    indicators.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function setupResponsiveCarousel() {
    function updateCardsPerView() {
        const containerWidth = document.querySelector('.carousel-container')?.offsetWidth || 1200;

        if (containerWidth >= 1024) {
            cardsPerView = 3;
        } else if (containerWidth >= 768) {
            cardsPerView = 2;
        } else {
            cardsPerView = 1;
        }

        const featuredCars = getFeaturedCars();
        totalSlides = Math.max(1, featuredCars.length - cardsPerView + 1);

        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        }

        createCarouselIndicators();
        updateCarouselPosition();
    }

    window.addEventListener('resize', updateCardsPerView);
    updateCardsPerView();
}

// Auto-play functionality
let autoPlayInterval;

function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

// Pause auto-play on hover
function setupAutoPlayControls() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;

    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
}

// View car details - Updated for database structure
function viewCarDetails(carName) {
    const car = carsData.find(c => c.name === carName);
    if (!car) {
        alert(`Car details for ${carName} not found.`);
        return;
    }
    
    // Check if car has images
    const hasImages = car.mainImage || (car.gallery?.length > 0);
    
    if (hasImages) {
        // Redirect to featured cars page with car details
        window.location.href = `src/pages/featured-cars.html#${encodeURIComponent(carName)}`;
    } else {
        // Show basic info if no images
        const statusText = car.status || 'COMPLETED';
        const specsText = car.specs ? Object.values(car.specs).filter(v => v).join(', ') : 'No specs available';
        alert(`${carName}\nStatus: ${statusText}\nSpecs: ${specsText}\n\nFull gallery coming soon!`);
    }
}

// Touch/swipe support for mobile
function setupTouchSupport() {
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    carouselTrack.addEventListener('touchstart', event => {
        startX = event.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    });
    
    carouselTrack.addEventListener('touchmove', event => {
        if (!isDragging) return;
        currentX = event.touches[0].clientX;
    });
    
    carouselTrack.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - currentX;
        
        if (Math.abs(diffX) > MIN_SWIPE_DISTANCE) {
            if (diffX > 0) {
                nextSlide();
            } else {
                previousSlide();
            }
        }
        
        startAutoPlay();
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the sections to load, then load cars
    setTimeout(() => {
        loadCarsData();
        setupAutoPlayControls();
        setupTouchSupport();
    }, 500);
});