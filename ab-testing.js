// Sistema de A/B Testing para MinhaGrana
class ABTesting {
  constructor() {
    this.experiments = {
      'hero-cta': {
        variants: {
          'A': 'Quero usar na prática',
          'B': 'Começar grátis agora',
          'C': 'Testar MinhaGrana'
        },
        element: 'hero-cta-button'
      },
      'form-headline': {
        variants: {
          'A': 'Fale com a gente',
          'B': 'Receba acesso prioritário',
          'C': 'Junte-se a 2.5k+ famílias'
        },
        element: 'form-headline'
      },
      'testimonials-count': {
        variants: {
          'A': 6, // Mostrar 6 testimonials
          'B': 3, // Mostrar apenas 3
          'C': 4  // Mostrar 4
        },
        element: 'testimonials-section'
      }
    };
    
    this.init();
  }

  init() {
    // Carregar experimentos salvos
    this.loadExperiments();
    
    // Aplicar variantes
    this.applyVariants();
    
    // Tracking de conversões
    this.trackConversions();
  }

  loadExperiments() {
    this.activeExperiments = {};
    
    Object.keys(this.experiments).forEach(experimentId => {
      const saved = localStorage.getItem(`ab-test-${experimentId}`);
      if (saved) {
        this.activeExperiments[experimentId] = saved;
      } else {
        // Atribuir variante aleatória
        const variants = Object.keys(this.experiments[experimentId].variants);
        const randomVariant = variants[Math.floor(Math.random() * variants.length)];
        this.activeExperiments[experimentId] = randomVariant;
        localStorage.setItem(`ab-test-${experimentId}`, randomVariant);
      }
    });
  }

  applyVariants() {
    Object.keys(this.activeExperiments).forEach(experimentId => {
      const variant = this.activeExperiments[experimentId];
      const experiment = this.experiments[experimentId];
      
      this.applyVariant(experimentId, variant, experiment);
    });
  }

  applyVariant(experimentId, variant, experiment) {
    const element = document.getElementById(experiment.element);
    if (!element) return;

    switch (experimentId) {
      case 'hero-cta':
        if (element) {
          element.textContent = experiment.variants[variant];
        }
        break;
        
      case 'form-headline':
        if (element) {
          element.textContent = experiment.variants[variant];
        }
        break;
        
      case 'testimonials-count':
        this.showTestimonials(experiment.variants[variant]);
        break;
    }

    // Tracking do experimento
    this.trackExperiment(experimentId, variant);
  }

  showTestimonials(count) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach((testimonial, index) => {
      if (index < count) {
        testimonial.style.display = 'block';
      } else {
        testimonial.style.display = 'none';
      }
    });
  }

  trackExperiment(experimentId, variant) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test_view', {
        experiment_id: experimentId,
        variant: variant,
        event_category: 'ab_testing'
      });
    }

    // Console log para debug
    console.log(`A/B Test: ${experimentId} - Variant: ${variant}`);
  }

  trackConversions() {
    // Tracking de cliques no CTA principal
    const heroCta = document.getElementById('hero-cta-button');
    if (heroCta) {
      heroCta.addEventListener('click', () => {
        this.trackConversion('hero-cta', 'cta_click');
      });
    }

    // Tracking de envio do formulário
    const form = document.getElementById('leadForm');
    if (form) {
      form.addEventListener('submit', () => {
        this.trackConversion('form-headline', 'form_submit');
      });
    }

    // Tracking de scroll até testimonials
    this.trackScrollToTestimonials();
  }

  trackScrollToTestimonials() {
    const testimonialsSection = document.getElementById('testimonials-section');
    if (!testimonialsSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.trackConversion('testimonials-count', 'testimonials_view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(testimonialsSection);
  }

  trackConversion(experimentId, action) {
    const variant = this.activeExperiments[experimentId];
    
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test_conversion', {
        experiment_id: experimentId,
        variant: variant,
        action: action,
        event_category: 'ab_testing'
      });
    }

    // Console log para debug
    console.log(`A/B Test Conversion: ${experimentId} - Variant: ${variant} - Action: ${action}`);
  }

  // Método para obter resultados (para dashboard interno)
  getResults() {
    return {
      experiments: this.activeExperiments,
      timestamp: new Date().toISOString()
    };
  }
}

// Inicializar A/B Testing quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  window.abTesting = new ABTesting();
});

// Função para debug (disponível no console)
window.getABResults = () => {
  return window.abTesting.getResults();
};
