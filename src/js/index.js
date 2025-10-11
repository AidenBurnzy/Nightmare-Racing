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
                    // Video autoplay started successfully
                }).catch(error => {
                    // Video autoplay failed, will try on user interaction
                    
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

// Nightmare Racing - Enhanced Responsive JavaScript with Slow Smooth Scrolling
document.addEventListener('DOMContentLoaded', function() {
    const navigationEntries = typeof performance !== 'undefined' && performance.getEntriesByType
        ? performance.getEntriesByType('navigation')
        : [];
    const navigationType = navigationEntries.length > 0 ? navigationEntries[0].type : '';

    if (navigationType === 'reload' && window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        window.scrollTo(0, 0);
    }
    // Handle anchor links from other pages (like index.html#services)
    else if (window.location.hash && document.referrer && !document.referrer.includes(window.location.hostname)) {
        // Coming from external site with hash - allow scroll
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 500); // Small delay to ensure page is fully loaded
        }
    } else if (window.location.hash && document.referrer && document.referrer.includes(window.location.hostname)) {
        // Coming from same site with hash (like clicking Services from another page)
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 300); // Scroll to section after brief delay
        }
    } else {
        // Direct page load - remove hash and start at top
        if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }
    
    // Always set scroll restoration to manual
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Only scroll to top if no hash was present
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }
    
    // ================================
    // FIX FOR AUTO-SCROLL ISSUE
    // ================================
    
    // Flag to prevent automatic scrolling on page load
    let isInitialLoad = true;
    let hasUserInteracted = false;
    
    // Mark user interaction to enable smooth scrolling
    function markUserInteraction() {
        hasUserInteracted = true;
    }
    
    // Add interaction listeners
    ['click', 'touchstart', 'keydown', 'scroll'].forEach(eventType => {
        document.addEventListener(eventType, markUserInteraction, { once: true });
    });
    
    // ================================
    // RESPONSIVE BREAKPOINTS
    // ================================
    const breakpoints = {
        extraSmall: 320,
        small: 481,
        medium: 641,
        large: 769,
        tablet: 901,
        desktop: 1024,
        large_desktop: 1200,
        extraLarge: 1440
    };
    
    let currentBreakpoint = '';
    let isInitialized = false;
    
    // ================================
    // DEVICE & VIEWPORT DETECTION
    // ================================
    
    function getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width >= breakpoints.extraLarge) return 'extraLarge';
        if (width >= breakpoints.large_desktop) return 'large_desktop';
        if (width >= breakpoints.desktop) return 'desktop';
        if (width >= breakpoints.tablet) return 'tablet';
        if (width >= breakpoints.large) return 'large';
        if (width >= breakpoints.medium) return 'medium';
        if (width >= breakpoints.small) return 'small';
        return 'extraSmall';
    }
    
    function updateViewportClasses() {
        const newBreakpoint = getCurrentBreakpoint();
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Remove old breakpoint classes
        document.body.className = document.body.className.replace(/breakpoint-\w+/g, '');
        
        // Add new breakpoint class
        document.body.classList.add(`breakpoint-${newBreakpoint}`);
        
        // Update device type classes
        document.body.classList.toggle('is-mobile', width <= breakpoints.large);
        document.body.classList.toggle('is-tablet', width > breakpoints.large && width <= breakpoints.desktop);
        document.body.classList.toggle('is-desktop', width > breakpoints.desktop);
        
        // Add orientation classes
        document.body.classList.toggle('is-landscape', width > height);
        document.body.classList.toggle('is-portrait', width <= height);
        
        // Add viewport size classes
        document.body.classList.toggle('small-height', height < 600);
        document.body.classList.toggle('large-width', width > 1400);
        
        currentBreakpoint = newBreakpoint;
        
        return newBreakpoint;
    }
    
    // ================================
    // HERO SECTION RESPONSIVE HANDLING
    // ================================
    
    function adjustHeroForBreakpoint() {
        const heroContent = document.querySelector('.hero-content');
        const heroText = document.querySelector('.hero-text');
        const heroImageContainer = document.querySelector('.hero-image-container');
        const heroImages = document.querySelectorAll('.hero-image');
        
        if (!heroContent || !heroText || !heroImageContainer) return;
        
        const breakpoint = getCurrentBreakpoint();
        const width = window.innerWidth;
        
        // Reset inline styles
        heroImageContainer.style.height = '';
        heroImages.forEach(img => {
            img.style.height = '';
            img.style.width = '';
            img.style.position = '';
            img.style.left = '';
            img.style.transform = '';
            img.style.marginLeft = '';
        });
        
        switch (breakpoint) {
            case 'extraLarge':
            case 'large_desktop':
            case 'desktop':
                // Desktop layout - side by side
                heroContent.style.gridTemplateColumns = '1fr 1fr';
                heroImageContainer.style.order = '';
                setupDesktopHeroImages();
                break;
                
            case 'tablet':
                // Tablet landscape - adjust grid ratio
                if (width > 900) {
                    heroContent.style.gridTemplateColumns = '1fr 0.8fr';
                    heroImageContainer.style.order = '';
                    setupTabletHeroImages();
                } else {
                    // Tablet portrait - stack vertically
                    heroContent.style.gridTemplateColumns = '1fr';
                    heroImageContainer.style.order = '-1';
                    setupMobileHeroImages();
                }
                break;
                
            case 'large':
            case 'medium':
            case 'small':
            case 'extraSmall':
            default:
                // Mobile layout - stacked
                heroContent.style.gridTemplateColumns = '1fr';
                heroImageContainer.style.order = '-1';
                setupMobileHeroImages();
                break;
        }
    }
    
    function setupDesktopHeroImages() {
        const heroImages = document.querySelectorAll('.hero-image');
        const width = window.innerWidth;
        
        let imageWidth = 280;
        if (width >= breakpoints.extraLarge) imageWidth = 320;
        else if (width <= breakpoints.desktop) imageWidth = 260;
        
        heroImages.forEach((img, index) => {
            img.style.position = 'relative';
            img.style.width = `${imageWidth}px`;
            
            switch (index) {
                case 0:
                    img.style.height = `${Math.floor(imageWidth * 1.8)}px`;
                    img.style.zIndex = '3';
                    break;
                case 1:
                    img.style.height = `${Math.floor(imageWidth * 1.6)}px`;
                    img.style.zIndex = '2';
                    img.style.marginLeft = '-50px';
                    break;
                case 2:
                    img.style.height = `${Math.floor(imageWidth * 1.4)}px`;
                    img.style.zIndex = '1';
                    img.style.marginLeft = '-50px';
                    break;
            }
        });
    }
    
    function setupTabletHeroImages() {
        const heroImages = document.querySelectorAll('.hero-image');
        const imageWidth = 220;
        
        heroImages.forEach((img, index) => {
            img.style.position = 'relative';
            img.style.width = `${imageWidth}px`;
            
            switch (index) {
                case 0:
                    img.style.height = `${imageWidth * 1.8}px`;
                    img.style.zIndex = '3';
                    break;
                case 1:
                    img.style.height = `${imageWidth * 1.6}px`;
                    img.style.zIndex = '2';
                    img.style.marginLeft = '-40px';
                    break;
                case 2:
                    img.style.height = `${imageWidth * 1.4}px`;
                    img.style.zIndex = '1';
                    img.style.marginLeft = '-40px';
                    break;
            }
        });
    }
    
    function setupMobileHeroImages() {
        const heroImages = document.querySelectorAll('.hero-image');
        const heroImageContainer = document.querySelector('.hero-image-container');
        const width = window.innerWidth;
        
        let imageWidth = 160;
        let containerHeight = 250;
        let offset = 20;
        
        if (width <= breakpoints.extraSmall) {
            imageWidth = 120;
            containerHeight = 220;
            offset = 15;
        } else if (width <= breakpoints.small) {
            imageWidth = 140;
            containerHeight = 220;
            offset = 15;
        } else if (width <= breakpoints.medium) {
            imageWidth = 160;
            containerHeight = 250;
            offset = 20;
        } else if (width <= breakpoints.large) {
            imageWidth = 180;
            containerHeight = 280;
            offset = 25;
        }
        
        heroImageContainer.style.height = `${containerHeight}px`;
        heroImageContainer.style.minHeight = 'auto';
        
        heroImages.forEach((img, index) => {
            img.style.position = 'absolute';
            img.style.width = `${imageWidth}px`;
            
            const baseLeft = '50%';
            const transform = `translateX(-50%)`;
            
            switch (index) {
                case 0:
                    img.style.height = `${Math.floor(imageWidth * 1.4)}px`;
                    img.style.left = baseLeft;
                    img.style.transform = transform;
                    img.style.zIndex = '3';
                    break;
                case 1:
                    img.style.height = `${Math.floor(imageWidth * 1.2)}px`;
                    img.style.left = `calc(50% + ${offset}px)`;
                    img.style.transform = transform;
                    img.style.zIndex = '2';
                    break;
                case 2:
                    img.style.height = `${Math.floor(imageWidth * 1.0)}px`;
                    img.style.left = `calc(50% + ${offset * 2}px)`;
                    img.style.transform = transform;
                    img.style.zIndex = '1';
                    break;
            }
        });
    }
    
    // ================================
    // MOBILE NAVIGATION SYSTEM
    // ================================
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    let mobileMenu = null;
    let mobileMenuOverlay = null;
    let mobileMenuClose = null;
    let mobileNavLinks = null;
    
    function createMobileMenu() {
        mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        mobileMenu = document.querySelector('.mobile-menu');

        if (!mobileMenuOverlay) {
            mobileMenuOverlay = document.createElement('div');
            mobileMenuOverlay.className = 'mobile-menu-overlay';
            document.body.appendChild(mobileMenuOverlay);
        }

        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = `
                <div class="mobile-menu-content">
                    <div class="mobile-menu-header">
                        <h2>NIGHTMARE<span class="text-accent">RACING</span></h2>
                        <button class="mobile-menu-close" aria-label="Close menu">&times;</button>
                    </div>

                    <ul class="mobile-nav-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="#services">Services</a></li>
                        <li class="mobile-submenu-heading">Shop Our Expertise</li>
                        <li><a class="mobile-sub-link" href="services/coilover-installation.html">Coilover Installation</a></li>
                        <li><a class="mobile-sub-link" href="services/wiring-electrical-repair.html">Wiring & Electrical Repair</a></li>
                        <li><a class="mobile-sub-link" href="services/engine-repair-modification.html">Engine Repair & Modification</a></li>
                        <li><a class="mobile-sub-link" href="services/engine-swaps.html">Engine Swaps</a></li>
                        <li><a class="mobile-sub-link" href="services/aftermarket-components.html">Aftermarket Components</a></li>
                        <li><a class="mobile-sub-link" href="services/brake-system-upgrades.html">Brake System Upgrades</a></li>
                        <li><a class="mobile-sub-link" href="services/lift-kits.html">Lift Kits</a></li>
                        <li><a class="mobile-sub-link" href="services/exhaust-fabrication.html">Exhaust Fabrication</a></li>
                        <li><a class="mobile-sub-link" href="services/intake-valve-carbon-cleaning.html">Intake Valve Carbon Cleaning</a></li>
                        <li><a class="mobile-sub-link" href="services/suspension-repair-tuning.html">Suspension Repair & Tuning</a></li>
                        <li><a class="mobile-sub-link" href="services/fluid-service.html">Fluid Service</a></li>
                        <li><a class="mobile-sub-link" href="services/camshaft-swaps-upgrades.html">Camshaft Swaps & Upgrades</a></li>
                        <li><a href="src/pages/featured-cars.html">Our Projects</a></li>
                        <li><a href="src/pages/shopParts.html">Shop Parts</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li class="mobile-sign-in">
                            <a href="https://nmrauto.com/" target="_blank" rel="noopener noreferrer">
                                <svg class="profile-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                                </svg>
                                Sign In to Shop
                            </a>
                        </li>
                    </ul>

                    <div class="mobile-menu-footer">
                        <p>© 2025 Nightmare Racing</p>
                        <p>Premium Auto Services</p>
                    </div>
                </div>
            `;
            document.body.appendChild(mobileMenu);
        }

        mobileMenuClose = mobileMenu.querySelector('.mobile-menu-close');
        mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-links a');

        setupMobileMenuEvents();
    }
    
    function setupMobileMenuEvents() {
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }
        
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }
        
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }
        
        if (mobileNavLinks) {
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');

                    if (!href) {
                        return;
                    }

                    if (href.startsWith('#')) {
                        e.preventDefault();
                        closeMobileMenu();
                        // Only scroll if user has interacted and it's not initial load
                        if (hasUserInteracted && !isInitialLoad) {
                            setTimeout(() => smoothScroll(href), 300);
                        }
                        return;
                    }

                    // Close menu for any other navigation target so the overlay clears before navigation
                    closeMobileMenu();
                });
            });
        }
        
        setupTouchGestures();
    }
    
    function toggleMobileMenu() {
        if (!mobileMenu) return;
        
        const isActive = mobileMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        if (!mobileMenu) return;
        
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.classList.add('menu-open');
        
        // Focus management
        setTimeout(() => {
            const firstLink = mobileMenu.querySelector('.mobile-nav-links a');
            if (firstLink) firstLink.focus();
        }, 300);
    }
    
    function closeMobileMenu() {
        if (!mobileMenu) return;
        
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    // ================================
    // TOUCH GESTURES & MOBILE INTERACTIONS
    // ================================
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    
    function setupTouchGestures() {
        if (!mobileMenu) return;
        
        // Swipe to close mobile menu
        mobileMenu.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });
        
        mobileMenu.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const deltaTime = touchEndTime - touchStartTime;
            
            // Swipe right to close (minimum 80px swipe, max 500ms duration)
            if (deltaX > 80 && Math.abs(deltaY) < 100 && deltaTime < 500) {
                closeMobileMenu();
            }
        }, { passive: true });
        
        // Swipe left from edge to open menu
        document.addEventListener('touchstart', function(e) {
            if (e.touches[0].clientX < 30 && !mobileMenu.classList.contains('active')) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
            }
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (touchStartX < 30 && !mobileMenu.classList.contains('active')) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndTime = Date.now();
                
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                const deltaTime = touchEndTime - touchStartTime;
                
                if (deltaX > 80 && Math.abs(deltaY) < 100 && deltaTime < 500) {
                    openMobileMenu();
                }
            }
        }, { passive: true });
    }
    
    function setupDropdownAccessibility() {
        const dropdown = document.querySelector('.nav-menu .has-dropdown');
        if (!dropdown) return;

        const trigger = dropdown.querySelector('.dropdown-trigger');
        const submenu = dropdown.querySelector('.dropdown-menu');

        if (!trigger || !submenu) return;

        const firstMenuItem = submenu.querySelector('a, button');

        const openDropdown = () => {
            if (dropdown.classList.contains('open')) return;
            dropdown.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
        };

        const closeDropdown = () => {
            if (!dropdown.classList.contains('open')) return;
            dropdown.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        };

        const toggleDropdown = () => {
            if (dropdown.classList.contains('open')) {
                closeDropdown();
            } else {
                openDropdown();
            }
        };

        trigger.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleDropdown();
        });

        submenu.querySelectorAll('a, button').forEach(item => {
            item.addEventListener('click', () => {
                closeDropdown();
            });
        });

        trigger.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
                openDropdown();
                if (firstMenuItem) {
                    event.preventDefault();
                    firstMenuItem.focus();
                }
            }

            if (event.key === 'Escape') {
                closeDropdown();
            }
        });

        submenu.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeDropdown();
                trigger.focus();
            }
        });

        const handleFocusOut = (event) => {
            if (!dropdown.contains(event.relatedTarget)) {
                closeDropdown();
            }
        };

        trigger.addEventListener('blur', handleFocusOut);
        submenu.addEventListener('focusout', handleFocusOut);

        document.addEventListener('click', (event) => {
            if (!dropdown.contains(event.target)) {
                closeDropdown();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const activeElement = document.activeElement;
                closeDropdown();
                if (activeElement && dropdown.contains(activeElement)) {
                    trigger.focus();
                }
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 900) {
                closeDropdown();
            }
        });
    }

    // ================================
    // RESPONSIVE VIEWPORT HANDLING
    // ================================
    
    function handleViewportChanges() {
        // Update CSS custom property for viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Update breakpoint classes
        const newBreakpoint = updateViewportClasses();
        
        // Adjust hero section if breakpoint changed
        if (newBreakpoint !== currentBreakpoint || !isInitialized) {
            adjustHeroForBreakpoint();
        }
        
        // Close mobile menu if switching to desktop
        if (window.innerWidth > 900 && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // Adjust grid layouts based on breakpoint
        adjustGridLayouts(newBreakpoint);
    }
    
    function adjustGridLayouts(breakpoint) {
        const servicesGrid = document.querySelector('.services-grid');
        const carsGrid = document.querySelector('.cars-grid');
        const partsCategories = document.querySelector('.parts-categories');
        const featuredProducts = document.querySelector('.featured-products');
        
        // Reset grid styles
        [servicesGrid, carsGrid, partsCategories, featuredProducts].forEach(grid => {
            if (grid) grid.style.gridTemplateColumns = '';
        });
        
        switch (breakpoint) {
            case 'extraLarge':
            case 'large_desktop':
                if (servicesGrid) servicesGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                if (carsGrid) carsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                if (partsCategories) partsCategories.style.gridTemplateColumns = 'repeat(3, 1fr)';
                if (featuredProducts) featuredProducts.style.gridTemplateColumns = 'repeat(3, 1fr)';
                break;
                
            case 'desktop':
                if (servicesGrid) servicesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                if (carsGrid) carsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                if (partsCategories) partsCategories.style.gridTemplateColumns = 'repeat(3, 1fr)';
                if (featuredProducts) featuredProducts.style.gridTemplateColumns = 'repeat(3, 1fr)';
                break;
                
            case 'tablet':
                if (window.innerWidth > 900) {
                    if (servicesGrid) servicesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                    if (carsGrid) carsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                    if (partsCategories) partsCategories.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    if (featuredProducts) featuredProducts.style.gridTemplateColumns = 'repeat(3, 1fr)';
                } else {
                    // Tablet portrait
                    if (servicesGrid) servicesGrid.style.gridTemplateColumns = '1fr';
                    if (carsGrid) carsGrid.style.gridTemplateColumns = '1fr';
                    if (partsCategories) partsCategories.style.gridTemplateColumns = '1fr';
                    if (featuredProducts) featuredProducts.style.gridTemplateColumns = 'repeat(2, 1fr)';
                }
                break;
                
            case 'medium':
                if (servicesGrid) servicesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                if (carsGrid) carsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                if (partsCategories) partsCategories.style.gridTemplateColumns = 'repeat(2, 1fr)';
                if (featuredProducts) featuredProducts.style.gridTemplateColumns = 'repeat(3, 1fr)';
                break;
                
            case 'small':
                if (servicesGrid) servicesGrid.style.gridTemplateColumns = '1fr';
                if (carsGrid) carsGrid.style.gridTemplateColumns = '1fr';
                if (partsCategories) partsCategories.style.gridTemplateColumns = '1fr';
                if (featuredProducts) featuredProducts.style.gridTemplateColumns = 'repeat(2, 1fr)';
                break;
                
            case 'extraSmall':
            default:
                if (servicesGrid) servicesGrid.style.gridTemplateColumns = '1fr';
                if (carsGrid) carsGrid.style.gridTemplateColumns = '1fr';
                if (partsCategories) partsCategories.style.gridTemplateColumns = '1fr';
                if (featuredProducts) featuredProducts.style.gridTemplateColumns = '1fr';
                break;
        }
    }
    
    // ================================
    // SMOOTH SCROLLING NAVIGATION - FIXED FOR AUTO-SCROLL ISSUE
    // ================================
    
    function smoothScroll(target) {
        // Prevent scrolling on initial load or before user interaction
        if (isInitialLoad || !hasUserInteracted) {
            console.log('Smooth scroll prevented - initial load or no user interaction');
            return;
        }
        
        const element = document.querySelector(target);
        if (element) {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
            const offsetTop = element.offsetTop - navbarHeight - 20;
            
            // Always use custom animation for consistent slow scrolling
            animateScrollTo(offsetTop, 1500); // 1.5 seconds for slow, cinematic effect
        }
    }
    
    // Custom smooth scroll animation with slow, cinematic movement
    function animateScrollTo(to, duration) {
        const start = window.pageYOffset;
        const change = to - start;
        const startTime = performance.now();
        
        function animateScroll(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Enhanced easing function for smoother, more cinematic movement
            const easeInOutCubic = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, start + change * easeInOutCubic);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    // Setup smooth scrolling for navigation links - FIXED VERSION
    function setupSmoothScrolling() {
        // Add smooth scrolling ONLY to internal anchor links (starting with #)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = this.getAttribute('href');
                
                // Only apply smooth scrolling to internal anchor links
                if (target && target !== '#' && hasUserInteracted && !isInitialLoad) {
                    e.preventDefault();
                    console.log('Smooth scrolling to:', target); // Debug log
                    smoothScroll(target);
                    
                    // Close mobile menu if open
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                }
            });
        });
        
        // Ensure external links (like Book Service) are never intercepted
        // But handle cross-page anchor links (like index.html#services) specially
        document.querySelectorAll('a[href$=".html"], a[href^="http"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Check if this is a cross-page anchor link (like index.html#services)
                if (href && href.includes('#') && !href.startsWith('http')) {
                    // This is a cross-page anchor link - let it navigate normally
                    // The scroll-to-anchor will be handled by the browser or on page load
                } 
                
                // Allow normal navigation - do not prevent default
                // Just close mobile menu if it's open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        });
    }
    
    // Mobile Menu Functionality
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

        // Close menu when clicking on navigation links (except sign-in link)
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                // Close menu for internal navigation links
                if (href && href.startsWith('#')) {
                    closeMobileMenu();
                    // Only scroll if user has interacted and it's not initial load
                    if (hasUserInteracted && !isInitialLoad) {
                        e.preventDefault();
                        setTimeout(() => smoothScroll(href), 300);
                    }
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

        // FIXED: Prevent any anchor smooth scrolling on initial load
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // Only allow smooth scroll if user has interacted and not initial load
                if (!hasUserInteracted || isInitialLoad) {
                    // Do nothing, let browser handle default (no scroll)
                    e.preventDefault();
                    return;
                }
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect (optional)
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class for styling
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });

        // Active navigation link highlighting
        function updateActiveNavLink() {
            // Only update if user has interacted
            if (!hasUserInteracted || isInitialLoad) return;
            
            const sections = document.querySelectorAll('section[id], div[id]');
            const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .mobile-nav-links a[href^="#"]');
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // Update active link on scroll
        window.addEventListener('scroll', updateActiveNavLink);
        
        // REMOVED: updateActiveNavLink on page load to prevent auto-scroll
    });
    
    // ================================
    // NAVBAR SCROLL BEHAVIOR
    // ================================
    
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    let scrollTicking = false;
    
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (!navbar) return;
        
        // Add background opacity on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide/show navbar on mobile when scrolling
        if (window.innerWidth <= 900) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
    
    // Throttled scroll event
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                handleNavbarScroll();
                updateActiveNavItem();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
    
    // ================================
    // ACTIVE SECTION HIGHLIGHTING - FIXED
    // ================================
    
    function updateActiveNavItem() {
        // Only update if user has interacted and it's not initial load
        if (!hasUserInteracted || isInitialLoad) return;
        
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-links a');
        
        let currentSection = '';
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ================================
    // FORM HANDLING
    // ================================
    
    const contactForm = document.querySelector('.contact-form form');
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    function setupFormHandling() {
        formInputs.forEach(input => {
            // Add focus styles for better mobile UX
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Keep focused class if input has value
            input.addEventListener('input', function() {
                if (this.value) {
                    this.parentElement.classList.add('focused');
                } else {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Auto-resize textarea
            if (input.tagName === 'TEXTAREA') {
                input.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = this.scrollHeight + 'px';
                });
            }
        });
        
        // Form submission handling
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'SENDING...';
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.7';
                    
                    // Simulate form submission
                    setTimeout(() => {
                        submitBtn.textContent = 'MESSAGE SENT!';
                        submitBtn.style.background = '#28a745';
                        submitBtn.style.opacity = '1';
                        
                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.background = '';
                            this.reset();
                            formInputs.forEach(input => {
                                input.parentElement.classList.remove('focused');
                            });
                        }, 3000);
                    }, 2000);
                }
            });
        }
    }
    
    // ================================
    // SCROLL ANIMATIONS
    // ================================
    
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    const delay = Math.random() * 0.2;
                    entry.target.style.animationDelay = `${delay}s`;
                }
            });
        }, observerOptions);
        
        const animateElements = document.querySelectorAll('.service-card, .car-card, .category-card, .product-card');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // ================================
    // TOUCH FEEDBACK
    // ================================
    
    function setupTouchFeedback() {
        const touchElements = document.querySelectorAll('.btn, .service-card, .car-card, .category-card, .product-card');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
            
            element.addEventListener('touchcancel', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    }
    
    // ================================
    // INTERACTIVE ELEMENTS
    // ================================
    
    function setupInteractiveElements() {
        // Hero button interactions
        const heroButtons = document.querySelectorAll('.hero-buttons .btn');
        heroButtons.forEach(button => {
            button.addEventListener('click', function() {
                const buttonText = this.textContent.toLowerCase();
                
                if (buttonText.includes('service')) {
                    // Mark interaction and allow scrolling
                    hasUserInteracted = true;
                    isInitialLoad = false;
                    smoothScroll('#contact');
                } else if (buttonText.includes('parts')) {
                    // Redirect to external parts website
                    window.open('https://nmrauto.com', '_blank');
                }
            });
        });
        
        // Car card interactions
        const carCards = document.querySelectorAll('.car-card');
        carCards.forEach(card => {
            const overlay = card.querySelector('.car-overlay');
            const button = overlay ? overlay.querySelector('.btn') : null;
            
            if (button) {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('Opening car details...');
                    // Add your car details functionality here
                });
            }
        });
        
        // Category button interactions
        const categoryButtons = document.querySelectorAll('.category-card .btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Opening shop...');
                // Add your shopping functionality here
            });
        });
    }
    
    // ================================
    // KEYBOARD NAVIGATION
    // ================================
    
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Close mobile menu with Escape
            if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // Tab navigation through mobile menu
            if (e.key === 'Tab' && mobileMenu && mobileMenu.classList.contains('active')) {
                const focusableElements = mobileMenu.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    // ================================
    // ORIENTATION CHANGE HANDLING
    // ================================
    
    function handleOrientationChange() {
        // Close mobile menu on orientation change
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // Delay to allow for orientation change completion
        setTimeout(() => {
            handleViewportChanges();
            // Ensure videos play after orientation change
            ensureVideoAutoplay();
        }, 500);
    }
    
    // ================================
    // DEBOUNCE UTILITY
    // ================================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ================================
    // EVENT LISTENERS SETUP
    // ================================
    
    function setupEventListeners() {
        // Viewport change events
        const debouncedViewportHandler = debounce(handleViewportChanges, 250);
        window.addEventListener('resize', debouncedViewportHandler);
        window.addEventListener('orientationchange', handleOrientationChange);
        
        // Load event for final adjustments
        window.addEventListener('load', function() {
            setTimeout(() => {
                handleViewportChanges();
                ensureVideoAutoplay();
                isInitialized = true;
                
                // IMPORTANT: Reset initial load flag after everything is loaded
                setTimeout(() => {
                    isInitialLoad = false;
                }, 1000); // Give 1 second for everything to settle
            }, 300);
        });
    }
    
    // ================================
    // INITIALIZATION
    // ================================
    
    function initialize() {
                // Initialize Nightmare Racing Enhanced Responsive JavaScript
        
        // Initial viewport setup
        handleViewportChanges();
        
        // Create and setup mobile menu
        createMobileMenu();
        
        // Setup all functionality
        setupSmoothScrolling(); // Setup smooth scrolling with fixes
        setupDropdownAccessibility();
        setupFormHandling();
        setupScrollAnimations();
        setupTouchFeedback();
        setupInteractiveElements();
        setupKeyboardNavigation();
        setupEventListeners();
        
        // Initialize video autoplay
        setTimeout(ensureVideoAutoplay, 100);
        
        // Mark as initialized
        document.body.classList.add('js-loaded');
        
        setTimeout(() => {
            document.body.classList.add('fully-loaded');
            isInitialized = true;
            
            // Reset initial load flag after full initialization
            setTimeout(() => {
                isInitialLoad = false;
                                // Initial load flag cleared - smooth scrolling now enabled
            }, 2000);
        }, 300);
        
        console.log('✅ Nightmare Racing JavaScript Fully Loaded!');
        console.log(`📱 Current Breakpoint: ${getCurrentBreakpoint()}`);
        console.log(`📐 Viewport: ${window.innerWidth}x${window.innerHeight}`);
    }
    
    // Start initialization
    initialize();
    
    // ================================
    // ERROR HANDLING
    // ================================
    
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault();
    });
    
});