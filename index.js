// Hide video background when .cars or .contact are in view
function checkSectionInView() {
    const carsSection = document.querySelector('.cars');
    const contactSection = document.querySelector('.contact');
    const body = document.body;
    let hide = false;
    [carsSection, contactSection].forEach(section => {
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                hide = true;
            }
        }
    });
    if (hide) {
        body.classList.add('hide-bg-video');
    } else {
        body.classList.remove('hide-bg-video');
    }
}
window.addEventListener('scroll', checkSectionInView);
window.addEventListener('resize', checkSectionInView);
document.addEventListener('DOMContentLoaded', checkSectionInView);

// Enhanced Video Autoplay Handler for Mobile
function ensureVideoAutoplay() {
    const bgVideo = document.getElementById('bg-video');
    const heroVideo = document.querySelector('.hero-video');
    const videos = [bgVideo, heroVideo].filter(video => video);
    
    videos.forEach(video => {
        if (video) {
            // Set required attributes for mobile autoplay
            video.muted = true;
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.setAttribute('preload', 'auto');
            video.style.pointerEvents = 'none';
            
            // Force play
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Video autoplay started successfully');
                }).catch(error => {
                    console.log('Video autoplay failed, will try on user interaction:', error);
                    
                    // Fallback: play on any user interaction
                    const playOnInteraction = () => {
                        video.play().then(() => {
                            console.log('Video started after user interaction');
                        }).catch(err => {
                            console.log('Video still failed to play:', err);
                        });
                    };
                    
                    // Multiple event listeners for different interaction types
                    ['click', 'touchstart', 'touchend', 'scroll'].forEach(eventType => {
                        document.addEventListener(eventType, playOnInteraction, { once: true });
                    });
                });
            }
        }
    });
}

// Simple Mobile Menu Functionality - NO AUTO-SCROLLING
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    const body = document.body;

    // Toggle mobile menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Close mobile menu
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        body.style.overflow = '';
    }

    // Event listeners
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking on navigation links (NO SCROLLING)
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Close menu for internal navigation links
            if (href && href.startsWith('#')) {
                closeMobileMenu();
                // DO NOT SCROLL - let browser handle it naturally
            } else if (href && href.startsWith('https://nmrauto.com')) {
                // For external shop links, close the menu after a brief delay
                setTimeout(() => closeMobileMenu(), 200);
            }
        });
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 900 && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // REMOVED: All smooth scrolling and auto-scroll functionality
    // REMOVED: Active navigation link highlighting (causes auto-scroll)
    // REMOVED: All scroll-based animations that might trigger scrolling
    
    // Simple navbar scroll effect (NO AUTO-SCROLL)
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling ONLY
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Initialize video autoplay
    setTimeout(ensureVideoAutoplay, 100);
});