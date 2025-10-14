// cars.js - Carousel for Nightmare Racing Featured Cars
// Uses same data structure as featured-cars.js for database consistency

let carsData = [];
let currentSlide = 0;
let cardsPerView = 1;
let totalSlides = 0;

// Make carsData globally accessible for other pages
window.carsData = carsData;

// Load car data from database API
async function loadCarsData() {
    try {
        // Fetch cars from database API
        const response = await fetch('/.netlify/functions/api-cars');
        
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                carsData = data.filter(car => car.featured !== false);
                window.carsData = carsData; // Make globally accessible
                initializeCarousel();
                return; // Exit early if database worked
            } else {
                console.warn('Database returned no cars, using fallback data');
            }
        } else {
            console.warn(`Database API error (${response.status}), using fallback data`);
            
            // If it's a 500 error, likely a database connection issue
            if (response.status === 500) {
                console.error('Database connection error - check Netlify environment variables');
            }
        }
    } catch (error) {
        console.error('Error loading cars from database:', error);
        // No fallback data - carousel will be empty if database fails
        carsData = [];
        window.carsData = carsData;
        initializeCarousel();
    }
}





// Initialize carousel
function initializeCarousel() {
    displayCars();
    setupCarouselNavigation();
    setupResponsiveCarousel();
    
    // Auto-play carousel (optional)
    startAutoPlay();
}

// Display cars in carousel
function displayCars() {
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;
    
    // Clear existing cards
    carouselTrack.innerHTML = '';
    
    // Add featured cars
    const featuredCars = carsData.filter(car => car.featured);
    
    featuredCars.forEach(car => {
        const carCard = createCarCard(car);
        carouselTrack.appendChild(carCard);
    });
    
    totalSlides = Math.max(1, featuredCars.length - cardsPerView + 1);
    createCarouselIndicators();
    updateCarouselPosition();
}

// Create car card matching the existing style but with consistent data structure
function createCarCard(car) {
    const carCard = document.createElement('div');
    carCard.className = 'car-card';
    
    let specsHTML = '';
    if (car.specs) {
        const specs = car.specs;
        if (specs.zeroToSixty) specsHTML += `<span>0-60: ${specs.zeroToSixty}</span>`;
        if (specs.topSpeed) specsHTML += `<span>Top Speed: ${specs.topSpeed}</span>`;
        if (specs.horsepower) specsHTML += `<span>${specs.horsepower}</span>`;
        if (specs.custom1) specsHTML += `<span>${specs.custom1}</span>`;
        if (specs.custom2) specsHTML += `<span>${specs.custom2}</span>`;
    }
    
    // Use different emoji placeholders for variety or actual images
    const emojis = ['🏎️', '🚗', '🏁', '🚙', '⚡'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Determine which image to use
    let imageHTML;
    if (car.mainImage) {
        imageHTML = `<img src="${car.mainImage}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else if (car.gallery && car.gallery.length > 0) {
        // Use first gallery image if no main image
        const firstImage = typeof car.gallery[0] === 'string' ? car.gallery[0] : car.gallery[0].image;
        imageHTML = `<img src="${firstImage}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
        imageHTML = `<div class="car-placeholder">${randomEmoji}</div>`;
    }
    
    carCard.innerHTML = `
        <div class="car-image">
            ${imageHTML}
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
    
    return carCard;
}

// Setup carousel navigation
function setupCarouselNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            previousSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }
}

// Create carousel indicators
function createCarouselIndicators() {
    const indicatorsContainer = document.getElementById('carousel-indicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(dot);
    }
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

// Update carousel position
function updateCarouselPosition() {
    const carouselTrack = document.getElementById('carousel-track');
    const indicators = document.querySelectorAll('.carousel-dot');
    
    if (carouselTrack) {
        const cardWidth = 320 + 32; // card width + gap
        const offset = currentSlide * cardWidth;
        carouselTrack.style.transform = `translateX(-${offset}px)`;
    }
    
    // Update indicators
    indicators.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Setup responsive carousel
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
        
        // Recalculate total slides
        const featuredCars = carsData.filter(car => car.featured);
        totalSlides = Math.max(1, featuredCars.length - cardsPerView + 1);
        
        // Reset to first slide if current slide is out of bounds
        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        }
        
        createCarouselIndicators();
        updateCarouselPosition();
    }
    
    // Update on resize
    window.addEventListener('resize', updateCardsPerView);
    updateCardsPerView(); // Initial call
}

// Auto-play functionality
let autoPlayInterval;

function startAutoPlay() {
    stopAutoPlay(); // Clear any existing interval
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

// Pause auto-play on hover
function setupAutoPlayControls() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
}

// View car details - Updated for database structure
function viewCarDetails(carName) {
    const car = carsData.find(c => c.name === carName);
    if (!car) {
        alert(`Car details for ${carName} not found.`);
        return;
    }
    
    // Check if car has images
    const hasImages = car.mainImage || (car.gallery && car.gallery.length > 0);
    
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
    
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    });
    
    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });
    
    carouselTrack.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - currentX;
        
        if (Math.abs(diffX) > 50) { // Minimum swipe distance
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