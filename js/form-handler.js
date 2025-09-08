// MinhaGrana Form Handler
// Alternative to PHP backend using Formspree or similar services

class FormHandler {
    constructor() {
        this.formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID'; // Replace with your Formspree ID
        this.init();
    }

    init() {
        this.setupLeadForm();
        this.setupAffiliateForm();
    }

    setupLeadForm() {
        const form = document.getElementById('leadForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(form, 'lead');
        });
    }

    setupAffiliateForm() {
        const form = document.getElementById('affiliateForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(form, 'affiliate');
        });
    }

    async handleFormSubmission(form, type) {
        const msgElement = document.getElementById(type === 'lead' ? 'formMsg' : 'affiliateMsg');
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Show loading state
        this.setLoadingState(submitButton, true);
        this.clearMessage(msgElement);

        try {
            const formData = new FormData(form);
            const data = this.formatFormData(formData, type);

            // Validate data
            if (!this.validateData(data, type)) {
                throw new Error('Por favor, preencha todos os campos obrigatórios.');
            }

            // Send to Formspree or similar service
            const response = await this.sendToService(data, type);
            
            if (response.ok) {
                this.showSuccess(msgElement, type);
                form.reset();
                this.trackEvent(type === 'lead' ? 'lead_captured' : 'affiliate_application', data);
            } else {
                throw new Error('Erro no servidor. Tente novamente.');
            }

        } catch (error) {
            this.showError(msgElement, error.message);
        } finally {
            this.setLoadingState(submitButton, false);
        }
    }

    formatFormData(formData, type) {
        const data = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            tipo: type
        };

        if (type === 'affiliate') {
            data.origem = formData.get('origem');
            data.area = formData.get('area');
            data.seguidores = formData.get('seguidores');
            data.plataformas = formData.getAll('plataformas');
            data.sobre = formData.get('sobre');
        } else {
            data.tipo_interesse = formData.get('tipo');
        }

        return data;
    }

    validateData(data, type) {
        const required = ['nome', 'email', 'telefone'];
        
        if (type === 'affiliate') {
            required.push('origem', 'area', 'seguidores');
        } else {
            required.push('tipo_interesse');
        }

        return required.every(field => data[field] && data[field].trim() !== '');
    }

    async sendToService(data, type) {
        // Option 1: Formspree
        return await this.sendToFormspree(data, type);
        
        // Option 2: Netlify Forms (uncomment if using Netlify)
        // return await this.sendToNetlify(data, type);
        
        // Option 3: Custom endpoint (uncomment if you have a custom API)
        // return await this.sendToCustomAPI(data, type);
    }

    async sendToFormspree(data, type) {
        const formData = new FormData();
        
        // Add all fields to FormData
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
                data[key].forEach(value => formData.append(`${key}[]`, value));
            } else {
                formData.append(key, data[key]);
            }
        });

        // Add metadata
        formData.append('_subject', type === 'lead' ? 'Novo Lead - MinhaGrana' : 'Nova Solicitação de Afiliado - MinhaGrana');
        formData.append('_replyto', data.email);
        formData.append('_next', window.location.href + '?success=true');

        return await fetch(this.formspreeEndpoint, {
            method: 'POST',
            body: formData
        });
    }

    async sendToNetlify(data, type) {
        const formData = new FormData();
        
        // Netlify Forms requires specific field names
        formData.append('form-name', type === 'lead' ? 'lead-form' : 'affiliate-form');
        
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
                data[key].forEach(value => formData.append(key, value));
            } else {
                formData.append(key, data[key]);
            }
        });

        return await fetch('/', {
            method: 'POST',
            body: formData
        });
    }

    async sendToCustomAPI(data, type) {
        return await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    }

    setLoadingState(button, loading) {
        if (!button) return;
        
        if (loading) {
            button.disabled = true;
            button.textContent = 'Enviando...';
            button.style.opacity = '0.7';
        } else {
            button.disabled = false;
            button.textContent = button.getAttribute('data-original-text') || 'Enviar interesse';
            button.style.opacity = '1';
        }
    }

    showSuccess(element, type) {
        if (!element) return;
        
        const message = type === 'lead' 
            ? 'Obrigado pelo seu interesse! Entraremos em contato em breve com mais informações sobre o MinhaGrana.'
            : 'Obrigado! Recebemos sua solicitação de afiliado. Entraremos em contato em até 24 horas.';
        
        element.textContent = message;
        element.className = 'text-sm mt-1 text-emerald-700';
    }

    showError(element, message) {
        if (!element) return;
        
        element.textContent = message;
        element.className = 'text-sm mt-1 text-red-600';
    }

    clearMessage(element) {
        if (!element) return;
        
        element.textContent = '';
        element.className = 'text-sm mt-1';
    }

    trackEvent(eventName, data) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'engagement',
                event_label: data.tipo || data.tipo_interesse,
                value: 1
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, {
                content_name: 'MinhaGrana Lead',
                content_category: data.tipo || data.tipo_interesse
            });
        }

        // Custom analytics
        if (typeof analytics !== 'undefined') {
            analytics.track(eventName, {
                email: data.email,
                tipo: data.tipo || data.tipo_interesse,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});

// Handle success parameter from Formspree redirect
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('success') === 'true') {
    const msgElement = document.getElementById('formMsg') || document.getElementById('affiliateMsg');
    if (msgElement) {
        msgElement.textContent = 'Obrigado! Recebemos sua mensagem. Entraremos em contato em breve.';
        msgElement.className = 'text-sm mt-1 text-emerald-700';
    }
}

// Export for use in other scripts
window.FormHandler = FormHandler;
