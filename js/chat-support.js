// MinhaGrana Chat Support
// Live chat widget and support system

class ChatSupport {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.createChatWidget();
        this.setupEventListeners();
        this.loadChatHistory();
        this.setupAutoGreeting();
    }

    createChatWidget() {
        // Create chat container
        this.chatContainer = document.createElement('div');
        this.chatContainer.id = 'chat-support';
        this.chatContainer.className = 'chat-widget';
        this.chatContainer.innerHTML = this.getChatHTML();
        
        document.body.appendChild(this.chatContainer);
        
        // Add styles
        this.addChatStyles();
    }

    getChatHTML() {
        return `
            <div class="chat-toggle" id="chat-toggle">
                <div class="chat-icon">💬</div>
                <div class="chat-badge" id="chat-badge">1</div>
            </div>
            
            <div class="chat-window" id="chat-window">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar">🤖</div>
                        <div class="chat-title">
                            <h4>Suporte MinhaGrana</h4>
                            <span class="chat-status">Online</span>
                        </div>
                    </div>
                    <div class="chat-controls">
                        <button class="chat-minimize" id="chat-minimize">−</button>
                        <button class="chat-close" id="chat-close">×</button>
                    </div>
                </div>
                
                <div class="chat-messages" id="chat-messages">
                    <div class="chat-message bot">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <div class="message-text">
                                Olá! 👋 Como posso ajudar você hoje?
                            </div>
                            <div class="message-time">Agora</div>
                        </div>
                    </div>
                </div>
                
                <div class="chat-input-container">
                    <div class="chat-quick-actions">
                        <button class="quick-action" data-action="demo">Ver Demo</button>
                        <button class="quick-action" data-action="pricing">Preços</button>
                        <button class="quick-action" data-action="support">Suporte</button>
                    </div>
                    <div class="chat-input-wrapper">
                        <input type="text" id="chat-input" placeholder="Digite sua mensagem..." maxlength="500">
                        <button id="chat-send" class="chat-send-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    addChatStyles() {
        const styles = `
            .chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .chat-toggle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #10b981, #059669);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
                transition: all 0.3s ease;
                position: relative;
            }

            .chat-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
            }

            .chat-icon {
                font-size: 24px;
                color: white;
            }

            .chat-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 600;
                display: none;
            }

            .chat-badge.show {
                display: flex;
            }

            .chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                border: 1px solid #e2e8f0;
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .chat-window.open {
                display: flex;
                animation: slideUp 0.3s ease;
            }

            .chat-window.minimized {
                height: 60px;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .chat-header {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chat-header-info {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .chat-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }

            .chat-title h4 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
            }

            .chat-status {
                font-size: 0.75rem;
                opacity: 0.9;
            }

            .chat-controls {
                display: flex;
                gap: 0.5rem;
            }

            .chat-minimize,
            .chat-close {
                width: 24px;
                height: 24px;
                border: none;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                transition: background 0.2s ease;
            }

            .chat-minimize:hover,
            .chat-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .chat-messages {
                flex: 1;
                padding: 1rem;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .chat-message {
                display: flex;
                gap: 0.75rem;
                max-width: 80%;
            }

            .chat-message.user {
                align-self: flex-end;
                flex-direction: row-reverse;
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                flex-shrink: 0;
            }

            .chat-message.bot .message-avatar {
                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                color: white;
            }

            .chat-message.user .message-avatar {
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
            }

            .message-content {
                background: #f8fafc;
                border-radius: 16px;
                padding: 0.75rem 1rem;
                border: 1px solid #e2e8f0;
            }

            .chat-message.user .message-content {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border-color: #10b981;
            }

            .message-text {
                font-size: 0.875rem;
                line-height: 1.4;
                margin-bottom: 0.25rem;
            }

            .message-time {
                font-size: 0.75rem;
                opacity: 0.7;
            }

            .chat-input-container {
                border-top: 1px solid #e2e8f0;
                padding: 1rem;
                background: #f8fafc;
            }

            .chat-quick-actions {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 0.75rem;
                flex-wrap: wrap;
            }

            .quick-action {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 20px;
                padding: 0.5rem 0.75rem;
                font-size: 0.75rem;
                color: #64748b;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .quick-action:hover {
                border-color: #10b981;
                color: #10b981;
            }

            .chat-input-wrapper {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }

            #chat-input {
                flex: 1;
                padding: 0.75rem 1rem;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                font-size: 0.875rem;
                outline: none;
                transition: border-color 0.2s ease;
            }

            #chat-input:focus {
                border-color: #10b981;
            }

            .chat-send-btn {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #10b981, #059669);
                border: none;
                border-radius: 12px;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .chat-send-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            }

            .chat-send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #64748b;
                font-size: 0.875rem;
                font-style: italic;
            }

            .typing-dots {
                display: flex;
                gap: 0.25rem;
            }

            .typing-dot {
                width: 4px;
                height: 4px;
                background: #64748b;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }

            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-10px);
                }
            }

            @media (max-width: 480px) {
                .chat-widget {
                    bottom: 10px;
                    right: 10px;
                }

                .chat-window {
                    width: calc(100vw - 20px);
                    right: -10px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        // Toggle chat
        const chatToggle = document.getElementById('chat-toggle');
        const chatWindow = document.getElementById('chat-window');
        const chatClose = document.getElementById('chat-close');
        const chatMinimize = document.getElementById('chat-minimize');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');

        chatToggle.addEventListener('click', () => {
            this.toggleChat();
        });

        chatClose.addEventListener('click', () => {
            this.closeChat();
        });

        chatMinimize.addEventListener('click', () => {
            this.minimizeChat();
        });

        // Send message
        chatSend.addEventListener('click', () => {
            this.sendMessage();
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick actions
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            action.addEventListener('click', (e) => {
                const actionType = e.target.dataset.action;
                this.handleQuickAction(actionType);
            });
        });

        // Auto-hide chat after inactivity
        this.setupAutoHide();
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chat-window');
        const chatToggle = document.getElementById('chat-toggle');
        
        if (this.isOpen) {
            chatWindow.classList.add('open');
            chatToggle.style.display = 'none';
            this.hideBadge();
            this.focusInput();
        } else {
            chatWindow.classList.remove('open');
            chatToggle.style.display = 'flex';
        }
    }

    closeChat() {
        this.isOpen = false;
        const chatWindow = document.getElementById('chat-window');
        const chatToggle = document.getElementById('chat-toggle');
        
        chatWindow.classList.remove('open');
        chatToggle.style.display = 'flex';
    }

    minimizeChat() {
        this.isMinimized = !this.isMinimized;
        const chatWindow = document.getElementById('chat-window');
        
        if (this.isMinimized) {
            chatWindow.classList.add('minimized');
        } else {
            chatWindow.classList.remove('minimized');
        }
    }

    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            this.handleBotResponse(message);
        }, 1000 + Math.random() * 2000);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        const time = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store message
        this.messages.push({ text, sender, time: new Date() });
        this.saveChatHistory();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'chat-message bot typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span>Assistente está digitando</span>
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.isTyping = true;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    handleBotResponse(userMessage) {
        const responses = this.getBotResponses();
        const response = this.findBestResponse(userMessage, responses);
        this.addMessage(response, 'bot');
    }

    getBotResponses() {
        return {
            'demo': 'Claro! Posso agendar uma demonstração personalizada para você. Quando seria um bom horário?',
            'preco': 'Nossos planos começam em R$ 29,90/mês para famílias. Temos também planos empresariais. Quer que eu envie mais detalhes?',
            'suporte': 'Estou aqui para ajudar! Você pode me fazer qualquer pergunta sobre o MinhaGrana.',
            'precos': 'Nossos planos começam em R$ 29,90/mês para famílias. Temos também planos empresariais. Quer que eu envie mais detalhes?',
            'preço': 'Nossos planos começam em R$ 29,90/mês para famílias. Temos também planos empresariais. Quer que eu envie mais detalhes?',
            'preços': 'Nossos planos começam em R$ 29,90/mês para famílias. Temos também planos empresariais. Quer que eu envie mais detalhes?',
            'default': 'Entendi! Posso ajudar você com informações sobre o MinhaGrana, agendar uma demo ou esclarecer dúvidas. O que você gostaria de saber?'
        };
    }

    findBestResponse(message, responses) {
        const lowerMessage = message.toLowerCase();
        
        // Check for specific keywords
        if (lowerMessage.includes('demo') || lowerMessage.includes('demonstração')) {
            return responses.demo;
        }
        
        if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custo')) {
            return responses.preco;
        }
        
        if (lowerMessage.includes('suporte') || lowerMessage.includes('ajuda') || lowerMessage.includes('problema')) {
            return responses.suporte;
        }
        
        return responses.default;
    }

    handleQuickAction(action) {
        const actions = {
            'demo': 'Gostaria de agendar uma demonstração do MinhaGrana',
            'pricing': 'Quero saber mais sobre os preços e planos',
            'support': 'Preciso de ajuda com o MinhaGrana'
        };
        
        const message = actions[action];
        if (message) {
            this.addMessage(message, 'user');
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.hideTypingIndicator();
                this.handleBotResponse(message);
            }, 1000);
        }
    }

    setupAutoGreeting() {
        // Show greeting after 30 seconds if user hasn't interacted
        setTimeout(() => {
            if (!this.isOpen && this.messages.length === 0) {
                this.showBadge();
            }
        }, 30000);
    }

    setupAutoHide() {
        let inactivityTimer;
        
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (this.isOpen && !this.isTyping) {
                    this.closeChat();
                }
            }, 300000); // 5 minutes
        };
        
        // Reset timer on user activity
        document.addEventListener('click', resetTimer);
        document.addEventListener('scroll', resetTimer);
        document.addEventListener('keypress', resetTimer);
        
        resetTimer();
    }

    showBadge() {
        const badge = document.getElementById('chat-badge');
        badge.classList.add('show');
    }

    hideBadge() {
        const badge = document.getElementById('chat-badge');
        badge.classList.remove('show');
    }

    focusInput() {
        const chatInput = document.getElementById('chat-input');
        setTimeout(() => {
            chatInput.focus();
        }, 300);
    }

    saveChatHistory() {
        try {
            localStorage.setItem('minhagrana_chat_history', JSON.stringify(this.messages));
        } catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const history = localStorage.getItem('minhagrana_chat_history');
            if (history) {
                this.messages = JSON.parse(history);
                // Only load recent messages (last 10)
                this.messages = this.messages.slice(-10);
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
            this.messages = [];
        }
    }

    // Public API
    openChat() {
        if (!this.isOpen) {
            this.toggleChat();
        }
    }

    closeChat() {
        if (this.isOpen) {
            this.toggleChat();
        }
    }

    sendSystemMessage(message) {
        this.addMessage(message, 'bot');
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatSupport = new ChatSupport();
});

// Export for use in other scripts
window.ChatSupport = ChatSupport;
