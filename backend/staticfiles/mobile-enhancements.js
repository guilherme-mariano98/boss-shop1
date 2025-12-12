/**
 * Mobile Enhancements for BOSS SHOPP
 * Provides improved mobile experience and touch interactions
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile enhancements
    initMobileEnhancements();
});

function initMobileEnhancements() {
    // Add mobile-specific classes to body
    if (isMobileDevice()) {
        document.body.classList.add('mobile-device');
        optimizeForMobile();
    }
    
    // Add touch event listeners
    addTouchSupport();
    
    // Optimize navigation for mobile
    optimizeNavigation();
    
    // Improve touch targets
    enhanceTouchTargets();
    
    // Add mobile-specific animations
    initMobileAnimations();
    
    // Handle form elements for mobile
    optimizeForms();
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
}

function optimizeForMobile() {
    // Adjust font sizes for better readability
    adjustFontSizes();
    
    // Optimize images for mobile
    optimizeImages();
    
    // Add mobile-specific styles dynamically
    addMobileStyles();
}

function adjustFontSizes() {
    // Increase font sizes for better mobile readability
    const baseFontSize = isTablet() ? '18px' : '16px';
    document.documentElement.style.fontSize = baseFontSize;
}

function isTablet() {
    return window.innerWidth > 480 && window.innerWidth <= 768;
}

function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading="lazy" for better performance
        img.setAttribute('loading', 'lazy');
        
        // Use srcset if available for responsive images
        if (img.srcset) {
            img.sizes = '(max-width: 768px) 100vw, 50vw';
        }
    });
}

function addMobileStyles() {
    // Create style element for mobile-specific CSS
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .navbar .nav-content {
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .search-container {
                order: 3;
                width: 100%;
                margin-top: 10px;
            }
            
            .hero-content {
                flex-direction: column;
                text-align: center;
            }
            
            .hero-text, .hero-visual {
                width: 100%;
            }
            
            .hero-stats {
                justify-content: center;
            }
            
            .category-grid {
                grid-template-columns: 1fr;
            }
            
            .product-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .footer-content {
                flex-direction: column;
                text-align: center;
            }
            
            .footer-column {
                margin-bottom: 20px;
            }
            
            /* Hide text labels on mobile nav icons */
            .nav-icon span:not(.cart-count) {
                display: none;
            }
            
            .nav-icon {
                font-size: 1.2rem;
                padding: 8px;
            }
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 0 15px;
            }
            
            .hero-title {
                font-size: 2rem;
            }
            
            .product-grid {
                grid-template-columns: 1fr;
            }
            
            .btn {
                padding: 12px 20px;
                font-size: 16px;
            }
        }
        
        /* Touch-friendly adjustments */
        .btn, .category-card, .product-card {
            transition: all 0.2s ease;
        }
        
        .btn:active, .category-card:active, .product-card:active {
            transform: scale(0.98);
        }
        
        /* Ensure form inputs don't zoom on iOS */
        input, textarea, select {
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);
}

function addTouchSupport() {
    // Add touch-friendly hover effects
    const interactiveElements = document.querySelectorAll('.btn, .category-card, .product-card, .nav-icon');
    
    interactiveElements.forEach(element => {
        // Add touch events
        element.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function(e) {
            this.classList.remove('touch-active');
        });
        
        element.addEventListener('touchcancel', function(e) {
            this.classList.remove('touch-active');
        });
    });
}

function optimizeNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Add hamburger menu for mobile
    if (isMobileDevice()) {
        createHamburgerMenu();
    }
}

function createHamburgerMenu() {
    const navContent = document.querySelector('.nav-content');
    if (!navContent) return;
    
    // Check if hamburger already exists
    if (document.querySelector('.hamburger-menu')) return;
    
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger-menu';
    hamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    // Add hamburger styles
    const hamburgerStyle = document.createElement('style');
    hamburgerStyle.textContent = `
        .hamburger-menu {
            display: none;
            flex-direction: column;
            justify-content: space-around;
            width: 30px;
            height: 30px;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            z-index: 101;
        }
        
        .hamburger-menu span {
            width: 100%;
            height: 3px;
            background: #000;
            border-radius: 10px;
            transition: all 0.3s linear;
            position: relative;
            transform-origin: center;
        }
        
        @media (max-width: 768px) {
            .hamburger-menu {
                display: flex;
            }
            
            .nav-content .profile-button,
            .nav-content .nav-icons {
                display: none;
            }
            
            .nav-content.mobile-expanded .profile-button,
            .nav-content.mobile-expanded .nav-icons {
                display: flex;
                position: fixed;
                top: 70px;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 100;
            }
            
            .nav-content.mobile-expanded .nav-icons {
                top: 140px;
            }
        }
    `;
    document.head.appendChild(hamburgerStyle);
    
    // Add hamburger to nav
    navContent.insertBefore(hamburger, navContent.firstChild);
    
    // Add toggle functionality
    hamburger.addEventListener('click', function() {
        navContent.classList.toggle('mobile-expanded');
        this.classList.toggle('active');
    });
}

function enhanceTouchTargets() {
    // Ensure all interactive elements have adequate touch targets
    const smallButtons = document.querySelectorAll('button, a, .btn');
    
    smallButtons.forEach(button => {
        const rect = button.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
            // Add padding to make touch target larger
            const computedStyle = window.getComputedStyle(button);
            const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
            const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
            
            if (rect.width + paddingX < 44) {
                const additionalPadding = Math.max(5, (44 - rect.width - paddingX) / 2);
                button.style.paddingLeft = (parseFloat(computedStyle.paddingLeft) + additionalPadding) + 'px';
                button.style.paddingRight = (parseFloat(computedStyle.paddingRight) + additionalPadding) + 'px';
            }
            
            if (rect.height + paddingY < 44) {
                const additionalPadding = Math.max(5, (44 - rect.height - paddingY) / 2);
                button.style.paddingTop = (parseFloat(computedStyle.paddingTop) + additionalPadding) + 'px';
                button.style.paddingBottom = (parseFloat(computedStyle.paddingBottom) + additionalPadding) + 'px';
            }
        }
    });
}

function initMobileAnimations() {
    // Add mobile-optimized animations
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            * {
                animation-duration: 0.3s !important;
                transition-duration: 0.2s !important;
            }
            
            .preloader {
                animation-duration: 0.5s !important;
            }
        }
    `;
    document.head.appendChild(style);
}

function optimizeForms() {
    // Ensure form inputs don't cause zoom on iOS
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (!input.style.fontSize || parseInt(window.getComputedStyle(input).fontSize) < 16) {
            input.style.fontSize = '16px';
        }
    });
}

// Handle orientation changes
window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        // Re-optimize for new orientation
        if (isMobileDevice()) {
            optimizeForMobile();
        }
    }, 100);
});

// Handle resize events
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Re-optimize for new size
        if (isMobileDevice()) {
            document.body.classList.add('mobile-device');
            optimizeForMobile();
        } else {
            document.body.classList.remove('mobile-device');
        }
    }, 250);
});