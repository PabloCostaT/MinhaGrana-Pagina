// MinhaGrana A/B Testing
// Simple A/B testing framework for landing page optimization

class ABTesting {
    constructor() {
        this.tests = new Map();
        this.userId = this.getUserId();
        this.init();
    }

    init() {
        this.loadTests();
        this.runTests();
        this.trackPageView();
    }

    getUserId() {
        let userId = localStorage.getItem('minhagrana_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('minhagrana_user_id', userId);
        }
        return userId;
    }

    loadTests() {
        // Define A/B tests
        this.tests.set('hero_title', {
            name: 'Hero Title Test',
            variants: [
                {
                    id: 'control',
                    name: 'Control',
                    weight: 50,
                    content: 'Controle financeiro <span class="emerald">simples</span>, colaboração <span class="teal">real</span>.'
                },
                {
                    id: 'variant_a',
                    name: 'Variant A - Focus on AI',
                    weight: 25,
                    content: 'Finanças <span class="emerald">inteligentes</span> com <span class="teal">Assistente AI</span>.'
                },
                {
                    id: 'variant_b',
                    name: 'Variant B - Focus on Family',
                    weight: 25,
                    content: 'Organize as finanças da sua <span class="emerald">família</span> de forma <span class="teal">colaborativa</span>.'
                }
            ]
        });

        this.tests.set('cta_button', {
            name: 'CTA Button Test',
            variants: [
                {
                    id: 'control',
                    name: 'Control',
                    weight: 50,
                    text: 'Quero usar na prática',
                    color: 'linear-gradient(135deg, #10b981, #059669)'
                },
                {
                    id: 'variant_a',
                    name: 'Variant A - Urgency',
                    weight: 25,
                    text: 'Começar agora',
                    color: 'linear-gradient(135deg, #ef4444, #dc2626)'
                },
                {
                    id: 'variant_b',
                    name: 'Variant B - Benefit',
                    weight: 25,
                    text: 'Economizar 20%',
                    color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                }
            ]
        });

        this.tests.set('pricing_section', {
            name: 'Pricing Section Test',
            variants: [
                {
                    id: 'control',
                    name: 'Control - No Pricing',
                    weight: 50,
                    show: false
                },
                {
                    id: 'variant_a',
                    name: 'Variant A - Show Pricing',
                    weight: 50,
                    show: true,
                    plans: [
                        {
                            name: 'Família',
                            price: 'R$ 29,90',
                            period: '/mês',
                            features: ['Até 5 membros', 'Assistente AI', 'Lista de compras', 'Relatórios']
                        },
                        {
                            name: 'Empresa',
                            price: 'R$ 99,90',
                            period: '/mês',
                            features: ['Membros ilimitados', 'API completa', 'Suporte prioritário', 'Integrações']
                        }
                    ]
                }
            ]
        });

        this.tests.set('testimonials_count', {
            name: 'Testimonials Count Test',
            variants: [
                {
                    id: 'control',
                    name: 'Control - 6 Testimonials',
                    weight: 50,
                    count: 6
                },
                {
                    id: 'variant_a',
                    name: 'Variant A - 3 Testimonials',
                    weight: 50,
                    count: 3
                }
            ]
        });
    }

    runTests() {
        this.tests.forEach((test, testId) => {
            const variant = this.getVariant(testId, test);
            this.applyVariant(testId, variant);
            this.trackTestAssignment(testId, variant);
        });
    }

    getVariant(testId, test) {
        // Check if user already has a variant assigned
        const storedVariant = localStorage.getItem(`minhagrana_test_${testId}`);
        if (storedVariant) {
            return test.variants.find(v => v.id === storedVariant);
        }

        // Assign new variant based on weights
        const random = Math.random() * 100;
        let cumulativeWeight = 0;

        for (const variant of test.variants) {
            cumulativeWeight += variant.weight;
            if (random <= cumulativeWeight) {
                localStorage.setItem(`minhagrana_test_${testId}`, variant.id);
                return variant;
            }
        }

        // Fallback to first variant
        return test.variants[0];
    }

    applyVariant(testId, variant) {
        switch (testId) {
            case 'hero_title':
                this.applyHeroTitleVariant(variant);
                break;
            case 'cta_button':
                this.applyCTAButtonVariant(variant);
                break;
            case 'pricing_section':
                this.applyPricingSectionVariant(variant);
                break;
            case 'testimonials_count':
                this.applyTestimonialsCountVariant(variant);
                break;
        }
    }

    applyHeroTitleVariant(variant) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = variant.content;
        }
    }

    applyCTAButtonVariant(variant) {
        const ctaButton = document.getElementById('hero-cta-button');
        if (ctaButton) {
            ctaButton.textContent = variant.text;
            ctaButton.style.background = variant.color;
        }
    }

    applyPricingSectionVariant(variant) {
        if (variant.show) {
            this.createPricingSection(variant.plans);
        }
    }

    applyTestimonialsCountVariant(variant) {
        const testimonials = document.querySelectorAll('.testimonial-card');
        if (testimonials.length > variant.count) {
            for (let i = variant.count; i < testimonials.length; i++) {
                testimonials[i].style.display = 'none';
            }
        }
    }

    createPricingSection(plans) {
        const pricingSection = document.createElement('section');
        pricingSection.className = 'section section-white';
        pricingSection.id = 'pricing';
        
        pricingSection.innerHTML = `
            <div class="container">
                <div class="max-w-3xl">
                    <h2 class="section-title">Planos e Preços</h2>
                    <p class="section-description">Escolha o plano ideal para sua família ou empresa.</p>
                </div>
                
                <div class="mt-10 grid-3">
                    ${plans.map(plan => `
                        <div class="card">
                            <h3 class="card-title">${plan.name}</h3>
                            <div class="pricing-price">
                                <span class="price-amount">${plan.price}</span>
                                <span class="price-period">${plan.period}</span>
                            </div>
                            <ul class="pricing-features">
                                ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                            <button class="pricing-button">Escolher Plano</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Insert before the interest section
        const interestSection = document.getElementById('interesse');
        if (interestSection) {
            interestSection.parentNode.insertBefore(pricingSection, interestSection);
        }

        // Add pricing styles
        this.addPricingStyles();
    }

    addPricingStyles() {
        const styles = `
            .pricing-price {
                text-align: center;
                margin: 1.5rem 0;
            }
            
            .price-amount {
                font-size: 3rem;
                font-weight: 700;
                color: #0f172a;
            }
            
            .price-period {
                font-size: 1rem;
                color: #64748b;
                margin-left: 0.5rem;
            }
            
            .pricing-features {
                list-style: none;
                margin: 1.5rem 0;
            }
            
            .pricing-features li {
                padding: 0.5rem 0;
                border-bottom: 1px solid #f1f5f9;
                position: relative;
                padding-left: 1.5rem;
            }
            
            .pricing-features li:before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #10b981;
                font-weight: 600;
            }
            
            .pricing-button {
                width: 100%;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem 2rem;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .pricing-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    trackTestAssignment(testId, variant) {
        this.trackEvent('ab_test_assigned', {
            test_id: testId,
            variant_id: variant.id,
            variant_name: variant.name,
            user_id: this.userId
        });
    }

    trackPageView() {
        this.trackEvent('page_view', {
            page: 'landing_page',
            user_id: this.userId,
            timestamp: new Date().toISOString()
        });
    }

    trackConversion(conversionType, value = null) {
        this.trackEvent('conversion', {
            conversion_type: conversionType,
            value: value,
            user_id: this.userId,
            timestamp: new Date().toISOString()
        });
    }

    trackEvent(eventName, eventData) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'ab_testing',
                event_label: eventData.test_id || 'general',
                custom_map: eventData
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, eventData);
        }

        // Custom analytics endpoint
        this.sendToAnalytics(eventName, eventData);
    }

    async sendToAnalytics(eventName, eventData) {
        try {
            const payload = {
                event: eventName,
                data: eventData,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                user_agent: navigator.userAgent
            };

            // Send to your analytics endpoint
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Failed to send analytics data:', error);
        }
    }

    // Public API methods
    getTestVariant(testId) {
        return localStorage.getItem(`minhagrana_test_${testId}`);
    }

    getAllTestVariants() {
        const variants = {};
        this.tests.forEach((test, testId) => {
            variants[testId] = this.getTestVariant(testId);
        });
        return variants;
    }

    trackButtonClick(buttonId, testId = null) {
        this.trackEvent('button_click', {
            button_id: buttonId,
            test_id: testId,
            user_id: this.userId
        });
    }

    trackFormSubmission(formType, testId = null) {
        this.trackConversion('form_submission', formType);
        this.trackEvent('form_submission', {
            form_type: formType,
            test_id: testId,
            user_id: this.userId
        });
    }

    trackVideoPlay(videoId, testId = null) {
        this.trackEvent('video_play', {
            video_id: videoId,
            test_id: testId,
            user_id: this.userId
        });
    }

    trackScrollDepth(depth, testId = null) {
        this.trackEvent('scroll_depth', {
            depth: depth,
            test_id: testId,
            user_id: this.userId
        });
    }

    // Setup automatic tracking
    setupAutomaticTracking() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .cta-button, .hero-button-primary, .hero-button-secondary')) {
                const buttonId = e.target.id || e.target.className;
                this.trackButtonClick(buttonId);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formType = form.id || 'unknown';
            this.trackFormSubmission(formType);
        });

        // Track video plays
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="openVideoModal"]')) {
                const videoId = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.trackVideoPlay(videoId);
            }
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        const trackScrollDepth = () => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                if (maxScrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.trackScrollDepth(maxScrollDepth);
                }
            }
        };

        window.addEventListener('scroll', this.throttle(trackScrollDepth, 1000));
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

    // Get test results (for admin dashboard)
    getTestResults() {
        const results = {};
        this.tests.forEach((test, testId) => {
            results[testId] = {
                name: test.name,
                variants: test.variants.map(variant => ({
                    id: variant.id,
                    name: variant.name,
                    weight: variant.weight
                }))
            };
        });
        return results;
    }
}

// Initialize A/B testing when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.abTesting = new ABTesting();
    window.abTesting.setupAutomaticTracking();
});

// Export for use in other scripts
window.ABTesting = ABTesting;
