// Professional Google Reviews Style Testimonials

// Add console log to verify script is loading
// Testimonials functionality

document.addEventListener('DOMContentLoaded', function() {
    
    const reviews = [
        {
            name: "John D.",
            initials: "JD",
            rating: 5,
            date: "2 weeks ago",
            text: "Great service and amazing parts! Highly recommend! The staff was incredibly knowledgeable and helped me find exactly what I needed for my build.",
            helpful: 12
        },
        {
            name: "Sarah K.",
            initials: "SK",
            rating: 5,
            date: "3 weeks ago",
            text: "The team at Nightmare Racing knows their stuff. My car has never run better! Professional installation and excellent customer service throughout the entire process.",
            helpful: 8
        },
        {
            name: "Mike L.",
            initials: "ML",
            rating: 5,
            date: "1 month ago",
            text: "Fast shipping and excellent customer service. Will definitely shop again! Order arrived perfectly packaged and exactly as described.",
            helpful: 15
        },
        {
            name: "Emily R.",
            initials: "ER",
            rating: 4,
            date: "1 month ago",
            text: "Quality parts at competitive prices. The only reason for 4 stars instead of 5 is the slightly longer delivery time, but the parts were worth the wait.",
            helpful: 6
        },
        {
            name: "David M.",
            initials: "DM",
            rating: 5,
            date: "2 months ago",
            text: "Outstanding expertise and customer support. They went above and beyond to ensure I got the right performance upgrades for my specific vehicle.",
            helpful: 19
        },
        {
            name: "Jessica T.",
            initials: "JT",
            rating: 5,
            date: "2 months ago",
            text: "Been a customer for years and they never disappoint. Premium quality parts and honest advice. Nightmare Racing is my go-to for all automotive needs.",
            helpful: 22
        },
        {
            name: "Robert H.",
            initials: "RH",
            rating: 5,
            date: "3 months ago",
            text: "Incredible transformation of my vehicle! The performance gains exceeded my expectations. Professional installation and detailed explanations throughout.",
            helpful: 11
        },
        {
            name: "Amanda W.",
            initials: "AW",
            rating: 4,
            date: "3 months ago",
            text: "Great selection of parts and knowledgeable staff. Pricing is fair and the quality is excellent. Minor delay in shipping but overall very satisfied.",
            helpful: 7
        },
        {
            name: "Chris P.",
            initials: "CP",
            rating: 5,
            date: "4 months ago",
            text: "Top-notch service from start to finish. The team really knows racing and performance modifications. My track times improved significantly after their work.",
            helpful: 16
        }
    ];

    let currentPage = 0;
    const reviewsPerPage = 3;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    // DOM Elements
    const reviewsGrid = document.getElementById('reviews-grid');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageIndicator = document.getElementById('page-indicator');
    const writeReviewBtn = document.getElementById('write-review-btn');
    const viewMoreBtn = document.getElementById('view-more-btn');

    // Check if elements exist
    if (!reviewsGrid) {
        console.error('Reviews grid element not found!');
        return;
    }
    
    console.log('All elements found, proceeding with initialization...');

    // Generate star rating HTML
    function generateStars(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += `<span class="star ${i <= rating ? 'filled' : ''}">${i <= rating ? '★' : '☆'}</span>`;
        }
        return starsHTML;
    }

    // Create review card HTML
    function createReviewCard(review) {
        return `
            <div class="review-card">
                <div class="google-badge">G</div>
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        ${review.initials}
                    </div>
                    <div class="reviewer-details">
                        <h4>${review.name}</h4>
                        <div class="review-meta">
                            <div class="review-stars">
                                ${generateStars(review.rating)}
                            </div>
                            <span class="review-date">${review.date}</span>
                        </div>
                    </div>
                </div>
                <div class="review-text">
                    ${review.text}
                </div>
                <div class="review-actions">
                    <button class="helpful-btn" onclick="markHelpful(this)">
                        👍 Helpful (${review.helpful})
                    </button>
                </div>
            </div>
        `;
    }

    // Display reviews for current page
    function displayReviews() {
                // Update page display
        const startIndex = currentPage * reviewsPerPage;
        const endIndex = startIndex + reviewsPerPage;
        const pageReviews = reviews.slice(startIndex, endIndex);
        
        reviewsGrid.innerHTML = pageReviews.map(review => createReviewCard(review)).join('');
        
        // Add fade-in animation
        const cards = reviewsGrid.querySelectorAll('.review-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Update page indicator
    function updatePageIndicator() {
        if (!pageIndicator) return;
        
        pageIndicator.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = `page-dot ${i === currentPage ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                currentPage = i;
                displayReviews();
                updatePageIndicator();
                updateNavigationButtons();
            });
            pageIndicator.appendChild(dot);
        }
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        if (prevBtn) prevBtn.disabled = currentPage === 0;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages - 1;
    }

    // Event Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                displayReviews();
                updatePageIndicator();
                updateNavigationButtons();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                displayReviews();
                updatePageIndicator();
                updateNavigationButtons();
            }
        });
    }

    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', () => {
            alert('This would normally open Google Reviews for customers to leave a review!');
        });
    }

    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            alert('This would normally open all Google Reviews for Nightmare Racing.');
        });
    }

    // Global function for helpful button
    window.markHelpful = function(button) {
        const currentCount = parseInt(button.textContent.match(/\d+/)[0]);
        button.innerHTML = `👍 Helpful (${currentCount + 1})`;
        button.style.color = '#1a73e8';
        button.disabled = true;
        
        // Add a small animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    };

    // Initialize
    console.log('Initializing testimonials...');
    displayReviews();
    updatePageIndicator();
    updateNavigationButtons();
    console.log('Testimonials initialized successfully!');
});