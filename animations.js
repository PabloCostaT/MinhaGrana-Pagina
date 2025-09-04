// Sistema de Animações Avançadas para MinhaGrana
class AdvancedAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupLoadingAnimations();
    this.setupCounterAnimations();
    this.setupParallaxEffects();
  }

  setupScrollAnimations() {
    // Intersection Observer para animações de scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);

    // Elementos para animar
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Adicionar classes de animação aos elementos
    this.addAnimationClasses();
  }

  addAnimationClasses() {
    // Hero section
    const heroTitle = document.querySelector('h1');
    if (heroTitle) {
      heroTitle.classList.add('animate-on-scroll', 'fade-in-up');
    }

    const heroSubtitle = document.querySelector('h1 + p');
    if (heroSubtitle) {
      heroSubtitle.classList.add('animate-on-scroll', 'fade-in-up', 'delay-200');
    }

    const heroButtons = document.querySelector('.mt-8');
    if (heroButtons) {
      heroButtons.classList.add('animate-on-scroll', 'fade-in-up', 'delay-400');
    }

    // Cards de benefícios
    const benefitCards = document.querySelectorAll('.grid > div');
    benefitCards.forEach((card, index) => {
      card.classList.add('animate-on-scroll', 'fade-in-up');
      card.style.animationDelay = `${index * 100}ms`;
    });

    // Testimonials
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
      card.classList.add('animate-on-scroll', 'fade-in-up');
      card.style.animationDelay = `${index * 150}ms`;
    });

    // Screenshots
    const screenshotCards = document.querySelectorAll('.bg-white.rounded-2xl.border');
    screenshotCards.forEach((card, index) => {
      card.classList.add('animate-on-scroll', 'fade-in-up');
      card.style.animationDelay = `${index * 100}ms`;
    });
  }

  animateElement(element) {
    element.classList.add('animated');
  }

  setupHoverEffects() {
    // Efeito de hover nos cards
    const cards = document.querySelectorAll('.bg-white, .bg-slate-50');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.addHoverEffect(card);
      });
      
      card.addEventListener('mouseleave', () => {
        this.removeHoverEffect(card);
      });
    });

    // Efeito de hover nos botões
    const buttons = document.querySelectorAll('a[class*="px-"], button[class*="px-"]');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        this.addButtonHoverEffect(button);
      });
      
      button.addEventListener('mouseleave', () => {
        this.removeButtonHoverEffect(button);
      });
    });
  }

  addHoverEffect(element) {
    element.style.transform = 'translateY(-5px)';
    element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
    element.style.transition = 'all 0.3s ease';
  }

  removeHoverEffect(element) {
    element.style.transform = 'translateY(0)';
    element.style.boxShadow = '';
  }

  addButtonHoverEffect(button) {
    button.style.transform = 'scale(1.05)';
    button.style.transition = 'all 0.2s ease';
  }

  removeButtonHoverEffect(button) {
    button.style.transform = 'scale(1)';
  }

  setupLoadingAnimations() {
    // Animação de loading para o formulário
    const form = document.getElementById('leadForm');
    if (form) {
      form.addEventListener('submit', () => {
        this.showFormLoading();
      });
    }

    // Animação de loading para imagens
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('load', () => {
        this.fadeInImage(img);
      });
    });
  }

  showFormLoading() {
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      const originalText = submitButton.textContent;
      submitButton.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Enviando...
      `;
      submitButton.disabled = true;

      // Restaurar após 3 segundos (ou quando a resposta chegar)
      setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }, 3000);
    }
  }

  fadeInImage(img) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
      img.style.opacity = '1';
    }, 100);
  }

  setupCounterAnimations() {
    // Animar contadores quando visíveis
    const counters = document.querySelectorAll('.text-3xl.font-bold');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      if (this.isNumeric(counter.textContent)) {
        counterObserver.observe(counter);
      }
    });
  }

  animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const start = performance.now();
    const suffix = element.textContent.replace(/\d/g, '');

    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(progress * target);
      element.textContent = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  isNumeric(str) {
    return /^\d/.test(str);
  }

  setupParallaxEffects() {
    // Efeito parallax suave no scroll
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Métodos para animações customizadas
  bounceIn(element) {
    element.style.animation = 'bounceIn 0.6s ease';
  }

  slideInLeft(element) {
    element.style.animation = 'slideInLeft 0.5s ease';
  }

  slideInRight(element) {
    element.style.animation = 'slideInRight 0.5s ease';
  }

  pulse(element) {
    element.style.animation = 'pulse 1s ease-in-out';
  }

  shake(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
  }
}

// CSS para as animações
const animationStyles = `
  <style>
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      10%, 30%, 50%, 70%, 90% {
        transform: translateX(-5px);
      }
      20%, 40%, 60%, 80% {
        transform: translateX(5px);
      }
    }

    .animate-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s ease;
    }

    .animate-on-scroll.animated {
      opacity: 1;
      transform: translateY(0);
    }

    .fade-in-up {
      animation: fadeInUp 0.6s ease forwards;
    }

    .fade-in-left {
      animation: fadeInLeft 0.6s ease forwards;
    }

    .fade-in-right {
      animation: fadeInRight 0.6s ease forwards;
    }

    .delay-200 {
      animation-delay: 0.2s;
    }

    .delay-400 {
      animation-delay: 0.4s;
    }

    .delay-600 {
      animation-delay: 0.6s;
    }

    /* Efeitos de hover suaves */
    .hover-lift {
      transition: all 0.3s ease;
    }

    .hover-lift:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    /* Gradiente animado */
    .animated-gradient {
      background: linear-gradient(-45deg, #10B981, #0D9488, #059669, #047857);
      background-size: 400% 400%;
      animation: gradientShift 3s ease infinite;
    }

    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    /* Loading spinner */
    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #10B981;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
`;

// Adicionar estilos ao head
document.head.insertAdjacentHTML('beforeend', animationStyles);

// Inicializar animações quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  window.advancedAnimations = new AdvancedAnimations();
});
