// cars.js - Dynamic car loading for Nightmare Racing
let carsData = [];

// Load car data from CMS
async function loadCarsData() {
    try {
        // Default cars (fallback)
        carsData = [
            {
                name: "Twin-Turbo Supra",
                description: "1200HP Beast • Custom Build",
                mainImage: null, // Will show emoji placeholder if no image
                specs: {
                    zeroToSixty: "2.8s",
                    topSpeed: "220mph"
                },
                featured: true
            },
            {
                name: "Widebody GTR",
                description: "Track Weapon • Full Build",
                mainImage: null,
                specs: {
                    zeroToSixty: "2.5s",
                    custom1: "Track Tested"
                },
                featured: true
            }
        ];
        
        // Try to load CMS cars (this will work once the admin adds some)
        await loadCMSCars();
        displayCars();
    } catch (error) {
        console.error('Error loading cars:', error);
        displayCars(); // Still show default cars
    }
}

// Load cars from CMS (when they exist)
async function loadCMSCars() {
    try {
        // This is a simple approach - we'll look for common car files
        const carFiles = ['supra-build-2025', 'gtr-build-2025', 'mustang-build-2025', 'custom-build-1', 'customer-car-1'];
        
        for (const filename of carFiles) {
            try {
                const response = await fetch(`/_data/cars/${filename}.json`);
                if (response.ok) {
                    const carData = await response.json();
                    // Add CMS car or update existing
                    const existingIndex = carsData.findIndex(car => car.name === carData.name);
                    if (existingIndex >= 0) {
                        carsData[existingIndex] = carData; // Update existing
                    } else {
                        carsData.push(carData); // Add new
                    }
                }
            } catch (e) {
                // File doesn't exist yet, skip
                continue;
            }
        }
    } catch (error) {
        console.log('CMS cars not loaded yet - using defaults');
    }
}

// Display cars in the existing grid
function displayCars() {
    const carsGrid = document.querySelector('.cars-grid');
    if (!carsGrid) return;
    
    // Keep the "see more" card
    const seeMoreCard = carsGrid.querySelector('.see-more-card');
    
    // Remove existing car cards (but keep see-more)
    const existingCards = carsGrid.querySelectorAll('.car-card');
    existingCards.forEach(card => card.remove());
    
    // Add featured cars (limit to 4 so we have room for see-more card)
    const featuredCars = carsData.filter(car => car.featured).slice(0, 4);
    
    featuredCars.forEach(car => {
        const carCard = createCarCard(car);
        if (seeMoreCard) {
            carsGrid.insertBefore(carCard, seeMoreCard);
        } else {
            carsGrid.appendChild(carCard);
        }
    });
}

// Create car card matching your existing style
function createCarCard(car) {
    const carCard = document.createElement('div');
    carCard.className = 'car-card';
    
    // Create specs HTML matching your format
    let specsHTML = '';
    if (car.specs) {
        const specs = car.specs;
        if (specs.zeroToSixty) specsHTML += `<span>0-60: ${specs.zeroToSixty}</span>`;
        if (specs.topSpeed) specsHTML += `<span>Top Speed: ${specs.topSpeed}</span>`;
        if (specs.horsepower) specsHTML += `<span>${specs.horsepower}</span>`;
        if (specs.custom1) specsHTML += `<span>${specs.custom1}</span>`;
        if (specs.custom2) specsHTML += `<span>${specs.custom2}</span>`;
    }
    
    carCard.innerHTML = `
        <div class="car-image">
            ${car.mainImage 
                ? `<img src="${car.mainImage}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover;">`
                : `<div class="car-placeholder">🏎️</div>`
            }
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

// View car details (placeholder for now)
function viewCarDetails(carName) {
    const car = carsData.find(c => c.name === carName);
    if (car && car.gallery && car.gallery.length > 0) {
        alert(`${carName} gallery coming soon! ${car.gallery.length} photos available.`);
    } else {
        alert(`More details for ${carName} coming soon!`);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the sections to load, then load cars
    setTimeout(loadCarsData, 500);
});