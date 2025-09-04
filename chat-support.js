// Sistema de Chat de Suporte para MinhaGrana
class ChatSupport {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.isTyping = false;
    this.init();
  }

  init() {
    this.createChatWidget();
    this.loadMessages();
    this.setupEventListeners();
  }

  createChatWidget() {
    // Botão flutuante do chat
    const chatButton = document.createElement('div');
    chatButton.id = 'chat-button';
    chatButton.innerHTML = `
      <div class="chat-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
        </svg>
        <span class="chat-notification">1</span>
      </div>
    `;
    document.body.appendChild(chatButton);

    // Janela do chat
    const chatWindow = document.createElement('div');
    chatWindow.id = 'chat-window';
    chatWindow.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">
            <img src="favicon-32x32.png" alt="MinhaGrana" class="w-full h-full object-contain" />
          </div>
          <div>
            <h3>Suporte MinhaGrana</h3>
            <p>Online agora</p>
          </div>
        </div>
        <button id="chat-close" class="chat-close">×</button>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="chat-message bot">
          <div class="message-content">
            <p>Olá! 👋 Como posso ajudar você hoje?</p>
            <span class="message-time">${this.getCurrentTime()}</span>
          </div>
        </div>
      </div>
              <div class="chat-input-container">
          <div class="chat-quick-actions">
            <button class="quick-action" data-message="Como funciona o MinhaGrana?">Como funciona?</button>
            <button class="quick-action" data-message="Quero fazer uma demonstração">Ver demo</button>
            <button class="quick-action" data-message="Preciso de ajuda técnica">Suporte técnico</button>
          </div>
          <div class="chat-footer-links">
            <a href="termos-de-uso.html" target="_blank" class="text-xs text-slate-500 hover:text-slate-700">Termos</a>
            <span class="text-slate-400">•</span>
            <a href="politica-privacidade.html" target="_blank" class="text-xs text-slate-500 hover:text-slate-700">Privacidade</a>
          </div>
        <div class="chat-input-wrapper">
          <input type="text" id="chat-input" placeholder="Digite sua mensagem..." maxlength="500">
          <button id="chat-send" class="chat-send">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(chatWindow);

    this.addStyles();
  }

  addStyles() {
    const styles = `
      <style>
        #chat-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          cursor: pointer;
        }

        .chat-button {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #10B981, #0D9488);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
          transition: all 0.3s ease;
          position: relative;
        }

        .chat-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
        }

        .chat-notification {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #EF4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        #chat-window {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          display: none;
          flex-direction: column;
          z-index: 1001;
          border: 1px solid #E2E8F0;
        }

        .chat-header {
          padding: 16px;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F8FAFC;
          border-radius: 16px 16px 0 0;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10B981, #0D9488);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .chat-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1E293B;
        }

        .chat-header p {
          margin: 0;
          font-size: 12px;
          color: #10B981;
        }

        .chat-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748B;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-message {
          display: flex;
          max-width: 80%;
        }

        .chat-message.user {
          align-self: flex-end;
        }

        .chat-message.bot {
          align-self: flex-start;
        }

        .message-content {
          background: #F1F5F9;
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
        }

        .chat-message.user .message-content {
          background: linear-gradient(135deg, #10B981, #0D9488);
          color: white;
        }

        .message-content p {
          margin: 0;
          font-size: 14px;
          line-height: 1.4;
        }

        .message-time {
          font-size: 11px;
          color: #64748B;
          margin-top: 4px;
          display: block;
        }

        .chat-message.user .message-time {
          color: rgba(255, 255, 255, 0.7);
        }

        .chat-input-container {
          padding: 16px;
          border-top: 1px solid #E2E8F0;
          background: #F8FAFC;
          border-radius: 0 0 16px 16px;
        }

        .chat-quick-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .quick-action {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 12px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-action:hover {
          background: #10B981;
          color: white;
          border-color: #10B981;
        }

        .chat-input-wrapper {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        #chat-input {
          flex: 1;
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
          background: white;
        }

        #chat-input:focus {
          border-color: #10B981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .chat-send {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10B981, #0D9488);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .chat-send:hover {
          transform: scale(1.05);
        }

        .chat-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .chat-footer-links {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
          margin-top: 8px;
          padding-top: 8px;
          padding-left: 8px;
          border-top: 1px solid #E2E8F0;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          background: #F1F5F9;
          border-radius: 18px;
          max-width: 80px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: #64748B;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
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
          #chat-window {
            width: calc(100vw - 40px);
            right: 20px;
            left: 20px;
          }
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
  }

  setupEventListeners() {
    const chatButton = document.getElementById('chat-button');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const quickActions = document.querySelectorAll('.quick-action');

    chatButton.addEventListener('click', () => this.toggleChat());
    chatClose.addEventListener('click', () => this.closeChat());
    chatSend.addEventListener('click', () => this.sendMessage());
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    quickActions.forEach(button => {
      button.addEventListener('click', (e) => {
        const message = e.target.getAttribute('data-message');
        this.sendQuickMessage(message);
      });
    });

    // Fechar chat ao clicar fora
    document.addEventListener('click', (e) => {
      if (this.isOpen && !chatWindow.contains(e.target) && !chatButton.contains(e.target)) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    const chatWindow = document.getElementById('chat-window');
    const chatButton = document.getElementById('chat-button');
    
    chatWindow.style.display = 'flex';
    chatButton.style.display = 'none';
    this.isOpen = true;

    // Focar no input
    setTimeout(() => {
      document.getElementById('chat-input').focus();
    }, 100);

    // Tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'chat_opened', {
        event_category: 'engagement',
        event_label: 'support_chat'
      });
    }
  }

  closeChat() {
    const chatWindow = document.getElementById('chat-window');
    const chatButton = document.getElementById('chat-button');
    
    chatWindow.style.display = 'none';
    chatButton.style.display = 'block';
    this.isOpen = false;
  }

  sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;

    this.addMessage(message, 'user');
    input.value = '';

    // Simular resposta do bot
    setTimeout(() => {
      this.simulateBotResponse(message);
    }, 1000);
  }

  sendQuickMessage(message) {
    this.addMessage(message, 'user');
    
    setTimeout(() => {
      this.simulateBotResponse(message);
    }, 1000);
  }

  addMessage(content, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${content}</p>
        <span class="message-time">${this.getCurrentTime()}</span>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    this.messages.push({ content, sender, time: new Date() });
  }

  simulateBotResponse(userMessage) {
    this.showTypingIndicator();
    
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.getBotResponse(userMessage);
      this.addMessage(response, 'bot');
    }, 1500);
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-message';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    this.isTyping = true;
  }

  hideTypingIndicator() {
    const typingMessage = document.querySelector('.typing-message');
    if (typingMessage) {
      typingMessage.remove();
    }
    this.isTyping = false;
  }

  getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('como funciona') || message.includes('demo')) {
      return 'O MinhaGrana é uma aplicação completa de gestão financeira! 🚀\n\n• Controle de despesas e receitas\n• Carteira digital\n• Lista de compras colaborativa\n• Assistente AI\n• Relatórios detalhados\n\nQuer agendar uma demonstração personalizada?';
    }
    
    if (message.includes('preço') || message.includes('valor') || message.includes('custo')) {
      return 'Temos planos flexíveis para diferentes necessidades! 💰\n\n• Plano Individual: R$ 29/mês\n• Plano Família: R$ 49/mês\n• Plano Empresarial: R$ 99/mês\n\nTodos incluem suporte completo e atualizações. Quer saber mais sobre algum plano específico?';
    }
    
    if (message.includes('suporte') || message.includes('ajuda') || message.includes('problema')) {
      return 'Estou aqui para ajudar! 🛠️\n\nPosso te auxiliar com:\n• Configuração inicial\n• Dúvidas sobre funcionalidades\n• Problemas técnicos\n• Treinamento da equipe\n\nQual é sua dúvida específica?';
    }
    
    if (message.includes('contato') || message.includes('falar') || message.includes('humano')) {
      return 'Claro! Posso conectar você com nossa equipe humana. 👥\n\n• WhatsApp: (11) 99999-9999\n• Email: suporte@minhagrana.com\n• Horário: Seg-Sex, 8h-18h\n\nOu preencha o formulário na página para receber um contato personalizado!';
    }
    
    // Resposta padrão
    return 'Entendi! 😊\n\nPosso te ajudar com informações sobre o MinhaGrana, preços, funcionalidades ou conectar você com nossa equipe.\n\nO que você gostaria de saber?';
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  loadMessages() {
    // Carregar mensagens salvas (implementar conforme necessário)
    const saved = localStorage.getItem('minhagrana-chat-messages');
    if (saved) {
      this.messages = JSON.parse(saved);
    }
  }

  saveMessages() {
    localStorage.setItem('minhagrana-chat-messages', JSON.stringify(this.messages));
  }
}

// Inicializar chat quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  window.chatSupport = new ChatSupport();
});
