// Nightmare Racing - Mobile & Tablet Enhanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ================================
    // HERO SECTION HEIGHT MATCHING
    // ================================
    
    function matchHeroHeights() {
        const heroText = document.querySelector('.hero-text');
        const heroImageContainer = document.querySelector('.hero-image-container');
        
        if (heroText && heroImageContainer && window.innerWidth > 768) {
            // Reset heights first
            heroImageContainer.style.height = 'auto';
            
            // Get the natural height of the text section
            const textHeight = heroText.offsetHeight;
            
            // Set the image container to match
            heroImageContainer.style.height = textHeight + 'px';
            heroImageContainer.style.minHeight = Math.max(textHeight, 500) + 'px';
            
            // Ensure images scale proportionally
            const heroImages = heroImageContainer.querySelectorAll('.hero-image');
            heroImages.forEach(img => {
                img.style.height = Math.min(textHeight * 0.85, 600) + 'px';
            });
        } else if (heroImageContainer && window.innerWidth <= 768) {
            // Reset for mobile
            heroImageContainer.style.height = '300px';
            heroImageContainer.style.minHeight = 'auto';
            
            const heroImages = heroImageContainer.querySelectorAll('.hero-image');
            heroImages.forEach(img => {
                img.style.height = '100%';
            });
        }
    }
    
    // ================================
    // MOBILE NAVIGATION FUNCTIONALITY
    // ================================
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    let mobileMenu = null;
    let mobileMenuOverlay = null;
    let mobileMenuClose = null;
    let mobileNavLinks = null;
    
    // Create mobile menu overlay and menu
    function createMobileMenu() {
        // Create overlay
        mobileMenuOverlay = document.createElement('div');
        mobileMenuOverlay.className = 'mobile-menu-overlay';
        document.body.appendChild(mobileMenuOverlay);
        
        // Create mobile menu
        mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-content">
                <div class="mobile-menu-header">
                    <h2>NIGHTMARE <span class="text-accent">RACING</span></h2>
                    <button class="mobile-menu-close">&times;</button>
                </div>
                <ul class="mobile-nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#cars">Our Cars</a></li>
                    <li><a href="#parts">Parts & Merch</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <div class="mobile-menu-footer">
                    <p>📞 (555) 123-RACE</p>
                    <p>📧 info@nightmareracing.com</p>
                </div>
            </div>
        `;
        document.body.appendChild(mobileMenu);
        
        // Now get references to the created elements
        mobileMenuClose = mobileMenu.querySelector('.mobile-menu-close');
        mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-links a');
        
        // Add event listeners
        setupMobileMenuEvents();
    }
    
    // Setup mobile menu event listeners
    function setupMobileMenuEvents() {
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }
        
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }
        
        // Close menu when clicking on overlay
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // Close menu when clicking nav links
        if (mobileNavLinks) {
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }
        
        // Touch gestures for mobile menu
        setupTouchGestures();
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        if (!mobileMenu) return;
        
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        if (!mobileMenu) return;
        
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    // Initialize mobile menu
    createMobileMenu();
    
    // ================================
    // TOUCH GESTURES FOR MOBILE
    // ================================
    
    let touchStartX = 0;
    let touchStartY = 0;
    
    function setupTouchGestures() {
        if (!mobileMenu) return;
        
        // Swipe to close mobile menu
        mobileMenu.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        mobileMenu.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Swipe right to close menu (minimum 100px swipe)
            if (deltaX > 100 && Math.abs(deltaY) < 100) {
                closeMobileMenu();
            }
        }, { passive: true });
        
        // Also allow swipe left from edge to open menu
        document.addEventListener('touchstart', function(e) {
            if (e.touches[0].clientX < 20 && !mobileMenu.classList.contains('active')) {
                touchStartX = e.touches[0].screenX;
                touchStartY = e.touches[0].screenY;
            }
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (e.changedTouches[0].clientX > 100 && touchStartX < 20 && !mobileMenu.classList.contains('active')) {
                const deltaX = e.changedTouches[0].screenX - touchStartX;
                const deltaY = e.changedTouches[0].screenY - touchStartY;
                
                if (deltaX > 100 && Math.abs(deltaY) < 100) {
                    toggleMobileMenu();
                }
            }
        }, { passive: true });
    }
    
    // ================================
    // RESPONSIVE VIEWPORT HANDLING
    // ================================
    
    function handleViewportChanges() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Match hero heights on viewport change
        matchHeroHeights();
    }
    
    handleViewportChanges();
    window.addEventListener('resize', handleViewportChanges);
    
    // Handle orientation changes on mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            handleViewportChanges();
            matchHeroHeights();
        }, 500);
        // Close mobile menu on orientation change
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // ================================
    // SMOOTH SCROLLING NAVIGATION
    // ================================
    
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Add smooth scrolling to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target && target !== '#') {
                smoothScroll(target);
            }
        });
    });
    
    // ================================
    // DYNAMIC CONTENT SIZING
    // ================================
    
    function adjustContentSizing() {
        const screenWidth = window.innerWidth;
        const hero = document.querySelector('.hero');
        
        // Adjust hero section for different screen sizes
        if (hero) {
            if (screenWidth <= 768) {
                hero.style.paddingTop = '70px';
                hero.style.minHeight = 'calc(100vh - 0px)';
            } else {
                hero.style.paddingTop = '70px';
                hero.style.minHeight = '100vh';
            }
        }
        
        // Update hero heights
        matchHeroHeights();
    }
    
    adjustContentSizing();
    
    // ================================
    // NAVBAR SCROLL BEHAVIOR
    // ================================
    
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
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
        
        // Hide/show navbar on mobile when scrolling down/up
        if (window.innerWidth <= 768) {
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
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // ================================
    // FORM HANDLING FOR MOBILE
    // ================================
    
    const contactForm = document.querySelector('.contact-form form');
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    // Improve form experience on mobile
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
        
        // Auto-resize textarea on mobile
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
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'SENDING...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                
                // Simulate form submission (replace with actual form handling)
                setTimeout(() => {
                    submitBtn.textContent = 'MESSAGE SENT!';
                    submitBtn.style.background = '#28a745';
                    submitBtn.style.opacity = '1';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        this.reset();
                        // Remove focused classes
                        formInputs.forEach(input => {
                            input.parentElement.classList.remove('focused');
                        });
                    }, 3000);
                }, 2000);
            }
        });
    }
    
    // ================================
    // LOADING ANIMATIONS
    // ================================
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Add small delay for staggered effect
                const delay = Math.random() * 0.2;
                entry.target.style.animationDelay = `${delay}s`;
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .car-card, .category-card, .product-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // ================================
    // TOUCH FEEDBACK
    // ================================
    
    // Add touch feedback to buttons and cards
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
    
    // ================================
    // ACCESSIBILITY IMPROVEMENTS
    // ================================
    
    // Keyboard navigation for mobile menu
    document.addEventListener('keydown', function(e) {
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
    
    // Focus management
    if (mobileMenu) {
        mobileMenu.addEventListener('transitionend', function() {
            if (this.classList.contains('active')) {
                const firstLink = this.querySelector('.mobile-nav-links a');
                if (firstLink) firstLink.focus();
            }
        });
    }
    
    // ================================
    // ENHANCED INTERACTIVITY
    // ================================
    
    // Service card interactions
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
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
                // Add your car details functionality here
                console.log('Opening car details...');
                alert('Car details feature coming soon!');
            });
        }
    });
    
    // Product card interactions
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add your product details functionality here
            console.log('Opening product details...');
            alert('Product details feature coming soon!');
        });
    });
    
    // Category button interactions
    const categoryButtons = document.querySelectorAll('.category-card .btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            // Add your shopping functionality here
            console.log('Opening shop...');
            alert('Shop feature coming soon!');
        });
    });
    
    // Hero button interactions
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.toLowerCase();
            
            if (buttonText.includes('service')) {
                smoothScroll('#contact');
            } else if (buttonText.includes('parts')) {
                smoothScroll('#parts');
            }
        });
    });
    
    // ================================
    // DEVICE DETECTION & OPTIMIZATION
    // ================================
    
    function detectDevice() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isDesktop = window.innerWidth > 1024;
        
        document.body.classList.toggle('is-mobile', isMobile);
        document.body.classList.toggle('is-tablet', isTablet);
        document.body.classList.toggle('is-desktop', isDesktop);
        
        // Optimize animations for mobile devices
        if (isMobile) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
        
        // Adjust content sizing
        adjustContentSizing();
        
        // Update hero heights
        matchHeroHeights();
    }
    
    // Debounce function for resize events
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
    
    // Initialize device detection
    detectDevice();
    
    // Optimized resize handler
    const optimizedResize = debounce(() => {
        detectDevice();
        handleViewportChanges();
        matchHeroHeights();
        
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }, 250);
    
    window.addEventListener('resize', optimizedResize);
    
    // ================================
    // PERFORMANCE OPTIMIZATIONS
    // ================================
    
    // Lazy loading for background images (if you add them later)
    function lazyLoadImages() {
        const images = document.querySelectorAll('[data-bg]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.style.backgroundImage = `url(${img.dataset.bg})`;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.style.backgroundImage = `url(${img.dataset.bg})`;
            });
        }
    }
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // ================================
    // ADDITIONAL SMOOTH INTERACTIONS
    // ================================
    
    // Parallax effect for hero section (subtle)
    function handleParallax() {
        if (window.innerWidth <= 768) return; // Skip on mobile for performance
        
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroImages = document.querySelectorAll('.hero-image');
        
        if (hero && scrolled < window.innerHeight) {
            const rate = scrolled * -0.1;
            heroImages.forEach((img, index) => {
                img.style.transform = `translateY(${rate * (index + 1) * 0.3}px)`;
            });
        }
    }
    
    // Add parallax to scroll event (throttled)
    let parallaxTicking = false;
    window.addEventListener('scroll', function() {
        if (!parallaxTicking) {
            requestAnimationFrame(function() {
                handleParallax();
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    });
    
    // ================================
    // ERROR HANDLING & FALLBACKS
    // ================================
    
    // Handle errors gracefully
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // You could send this to an error reporting service
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault();
    });
    
    // Fallback for older browsers that don't support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // Simple fallback animation
        const cards = document.querySelectorAll('.service-card, .car-card, .category-card, .product-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100);
        });
    }
    
    // ================================
    // ADDITIONAL MOBILE ENHANCEMENTS
    // ================================
    
    // Prevent zoom on input focus (iOS Safari)
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Set font-size to 16px or larger to prevent zoom
            if (this.style.fontSize === '' || parseInt(this.style.fontSize) < 16) {
                this.style.fontSize = '16px';
            }
        });
    });
    
    // Handle iOS Safari viewport issues
    function handleIOSViewport() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
            }
        }
    }
    
    handleIOSViewport();
    
    // ================================
    // ACTIVE SECTION HIGHLIGHTING
    // ================================
    
    function updateActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
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
    
    // Add active section highlighting to scroll event
    let activeSectionTicking = false;
    window.addEventListener('scroll', function() {
        if (!activeSectionTicking) {
            requestAnimationFrame(function() {
                updateActiveNavItem();
                activeSectionTicking = false;
            });
            activeSectionTicking = true;
        }
    });
    
    // ================================
    // HERO IMAGE LOADING OPTIMIZATION
    // ================================
    
    // Ensure hero images are loaded and positioned correctly
    function optimizeHeroImages() {
        const heroImages = document.querySelectorAll('.hero-image');
        let loadedImages = 0;
        
        heroImages.forEach((img, index) => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', function() {
                    loadedImages++;
                    if (loadedImages === heroImages.length) {
                        // All images loaded, adjust heights
                        setTimeout(matchHeroHeights, 100);
                    }
                });
            }
        });
        
        // If all images are already loaded
        if (loadedImages === heroImages.length) {
            setTimeout(matchHeroHeights, 100);
        }
    }
    
    // Initialize hero image optimization
    optimizeHeroImages();
    
    // ================================
    // CONSOLE LOG FOR DEBUGGING
    // ================================
    
    console.log('🏁 Nightmare Racing Mobile/Tablet JavaScript Loaded Successfully!');
    console.log('📱 Device Detection Active');
    console.log('🔧 Mobile Menu Initialized');
    console.log('✨ Touch Gestures Enabled');
    console.log('🎯 All Interactive Elements Ready');
    console.log('🚀 Performance Optimizations Applied');
    console.log('📐 Hero Height Matching Enabled');
    
    // Feature detection logging
    console.log('Feature Support:');
    console.log('- IntersectionObserver:', 'IntersectionObserver' in window);
    console.log('- Touch Events:', 'ontouchstart' in window);
    console.log('- Service Worker:', 'serviceWorker' in navigator);
    console.log('- WebP Support:', document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
    
    // ================================
    // INITIALIZATION COMPLETE
    // ================================
    
    // Mark initialization as complete
    document.body.classList.add('js-loaded');
    
    // Optional: Remove loading states or show content
    setTimeout(() => {
        document.body.classList.add('fully-loaded');
        // Final height adjustment after everything is loaded
        matchHeroHeights();
    }, 300);
    
    // Additional load event listener for final adjustments
    window.addEventListener('load', function() {
        setTimeout(() => {
            matchHeroHeights();
        }, 500);
    });
});