// MinhaGrana Animations
// Advanced animations and interactions for the landing page

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animations = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
        this.setupTypingEffect();
        this.setupLoadingAnimations();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => {
            this.intersectionObserver.observe(el);
        });
    }

    animateElement(element) {
        const animationType = element.dataset.animate;
        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in');
            
            // Trigger specific animations
            switch (animationType) {
                case 'fade-up':
                    this.fadeUpAnimation(element);
                    break;
                case 'fade-in':
                    this.fadeInAnimation(element);
                    break;
                case 'slide-left':
                    this.slideLeftAnimation(element);
                    break;
                case 'slide-right':
                    this.slideRightAnimation(element);
                    break;
                case 'scale-in':
                    this.scaleInAnimation(element);
                    break;
                case 'counter':
                    this.animateCounter(element);
                    break;
            }
        }, delay);
    }

    fadeUpAnimation(element) {
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
    }

    fadeInAnimation(element) {
        element.style.opacity = '1';
    }

    slideLeftAnimation(element) {
        element.style.transform = 'translateX(0)';
        element.style.opacity = '1';
    }

    slideRightAnimation(element) {
        element.style.transform = 'translateX(0)';
        element.style.opacity = '1';
    }

    scaleInAnimation(element) {
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
    }

    setupScrollAnimations() {
        let ticking = false;

        const updateScrollAnimations = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Parallax effect for hero background
            const heroBg = document.querySelector('.hero-bg');
            if (heroBg) {
                const speed = 0.5;
                heroBg.style.transform = `translateY(${scrollY * speed}px)`;
            }

            // Header background opacity
            const header = document.querySelector('header');
            if (header) {
                const opacity = Math.min(scrollY / 100, 1);
                header.style.background = `rgba(255, 255, 255, ${0.95 + opacity * 0.05})`;
            }

            // Progress bar animation
            this.updateProgressBar(scrollY, windowHeight);

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    updateProgressBar(scrollY, windowHeight) {
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const progress = (scrollY / documentHeight) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
    }

    setupHoverEffects() {
        // Card hover effects
        const cards = document.querySelectorAll('.card, .testimonial-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addHoverEffect(e.target);
            });

            card.addEventListener('mouseleave', (e) => {
                this.removeHoverEffect(e.target);
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.hero-button-primary, .hero-button-secondary, .cta-button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.addButtonHoverEffect(e.target);
            });

            button.addEventListener('mouseleave', (e) => {
                this.removeButtonHoverEffect(e.target);
            });
        });
    }

    addHoverEffect(element) {
        element.style.transform = 'translateY(-8px) scale(1.02)';
        element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    }

    removeHoverEffect(element) {
        element.style.transform = 'translateY(0) scale(1)';
        element.style.boxShadow = '';
    }

    addButtonHoverEffect(element) {
        element.style.transform = 'translateY(-2px)';
        element.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
    }

    removeButtonHoverEffect(element) {
        element.style.transform = 'translateY(0)';
        element.style.boxShadow = '';
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            
            const updateParallax = () => {
                const rect = element.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                const rate = scrolled * -speed;
                
                if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                    element.style.transform = `translateY(${rate}px)`;
                }
            };

            window.addEventListener('scroll', updateParallax, { passive: true });
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.counter);
            const duration = parseInt(counter.dataset.duration) || 2000;
            const suffix = counter.dataset.suffix || '';
            const prefix = counter.dataset.prefix || '';
            
            this.animateCounter(counter, target, duration, prefix, suffix);
        });
    }

    animateCounter(element, target, duration = 2000, prefix = '', suffix = '') {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = prefix + Math.floor(start) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = prefix + target + suffix;
            }
        };
        
        updateCounter();
    }

    setupTypingEffect() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.dataset.typing;
            const speed = parseInt(element.dataset.speed) || 100;
            
            this.typeText(element, text, speed);
        });
    }

    typeText(element, text, speed) {
        let i = 0;
        element.textContent = '';
        
        const typeChar = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            }
        };
        
        typeChar();
    }

    setupLoadingAnimations() {
        // Page load animation
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Animate hero elements
            const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 200);
            });
        });

        // Loading spinner for forms
        this.setupFormLoadingAnimations();
    }

    setupFormLoadingAnimations() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    this.showLoadingSpinner(submitButton);
                }
            });
        });
    }

    showLoadingSpinner(button) {
        const originalText = button.textContent;
        button.innerHTML = '<span class="spinner"></span> Enviando...';
        button.disabled = true;
        
        // Store original text for restoration
        button.dataset.originalText = originalText;
    }

    hideLoadingSpinner(button) {
        const originalText = button.dataset.originalText || 'Enviar';
        button.innerHTML = originalText;
        button.disabled = false;
    }

    // Utility methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public API
    animateOnScroll(element, animationType, delay = 0) {
        element.dataset.animate = animationType;
        element.dataset.delay = delay;
        this.intersectionObserver.observe(element);
    }

    triggerAnimation(element, animationType) {
        this.animateElement(element);
    }

    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
    }
}

// CSS for animations
const animationStyles = `
    [data-animate] {
        opacity: 0;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    [data-animate="fade-up"] {
        transform: translateY(30px);
    }

    [data-animate="fade-in"] {
        opacity: 0;
    }

    [data-animate="slide-left"] {
        transform: translateX(-30px);
    }

    [data-animate="slide-right"] {
        transform: translateX(30px);
    }

    [data-animate="scale-in"] {
        transform: scale(0.9);
    }

    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) translateX(0) scale(1) !important;
    }

    .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #10b981, #059669);
        z-index: 9999;
        transition: width 0.1s ease;
    }

    .hero-title,
    .hero-description,
    .hero-buttons {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    body.loaded .hero-title,
    body.loaded .hero-description,
    body.loaded .hero-buttons {
        opacity: 1;
        transform: translateY(0);
    }

    .card,
    .testimonial-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hero-button-primary,
    .hero-button-secondary,
    .cta-button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .pulse {
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    .bounce {
        animation: bounce 1s infinite;
    }

    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
        }
        40%, 43% {
            transform: translate3d(0, -8px, 0);
        }
        70% {
            transform: translate3d(0, -4px, 0);
        }
        90% {
            transform: translate3d(0, -2px, 0);
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Export for use in other scripts
window.AnimationController = AnimationController;
