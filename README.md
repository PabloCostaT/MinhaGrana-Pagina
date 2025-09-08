# MinhaGrana - Landing Page

Uma landing page completa e moderna para o MinhaGrana, aplicação de gestão financeira familiar.

## 🚀 Funcionalidades Implementadas

### ✅ CSS Completo e Responsivo
- **Arquivo**: `styles.css`
- Estilos modernos com design system consistente
- Totalmente responsivo para mobile, tablet e desktop
- Animações suaves e transições
- Suporte a dark mode (preparado)
- Grid system flexível

### ✅ Backend para Formulários
- **Arquivo PHP**: `api/contact.php`
- **Arquivo JS**: `js/form-handler.js`
- Processamento de formulários de contato e afiliados
- Validação de dados
- Salvamento em CSV
- Integração com Formspree (alternativa)
- Suporte a webhooks

### ✅ Screenshots Realistas
- **Dashboard**: `screenshots/dashboard.html`
- **Assistente AI**: `screenshots/ai-assistant.html`
- **Lista de Compras**: `screenshots/shopping-list.html`
- Mockups interativos da aplicação
- Design consistente com a landing page

### ✅ PWA (Progressive Web App)
- **Manifest**: `manifest.json`
- **Service Worker**: `sw.js`
- Instalação como app nativo
- Funcionamento offline
- Cache inteligente
- Notificações push (preparado)
- Shortcuts e atalhos

### ✅ JavaScript Avançado
- **Animações**: `js/animations.js`
- **Chat Support**: `js/chat-support.js`
- **A/B Testing**: `js/ab-testing.js`
- **Form Handler**: `js/form-handler.js`
- Animações de scroll e hover
- Chat widget interativo
- Sistema de testes A/B
- Tracking de eventos

### ✅ Responsividade Testada
- **Arquivo de Teste**: `responsive-test.html`
- Testes em múltiplos dispositivos
- Breakpoints otimizados
- Menu mobile funcional
- Touch-friendly

## 📁 Estrutura de Arquivos

```
MinhaGrana-Pagina/
├── landing_page_html.html          # Landing page principal
├── styles.css                      # Estilos CSS completos
├── manifest.json                   # PWA manifest
├── sw.js                          # Service Worker
├── responsive-test.html           # Teste de responsividade
├── README.md                      # Este arquivo
├── api/
│   └── contact.php               # Backend PHP para formulários
├── js/
│   ├── form-handler.js           # Handler de formulários
│   ├── animations.js             # Animações avançadas
│   ├── chat-support.js           # Chat widget
│   └── ab-testing.js             # Sistema A/B testing
├── screenshots/
│   ├── dashboard.html            # Mockup do dashboard
│   ├── ai-assistant.html         # Mockup do assistente AI
│   └── shopping-list.html        # Mockup da lista de compras
└── favicon-*.png                 # Ícones para PWA
```

## 🛠️ Como Usar

### 1. Servidor Local
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx serve .

# Usando PHP
php -S localhost:8000
```

### 2. Configuração do Backend

#### Opção A: PHP (Recomendado)
1. Configure um servidor web (Apache/Nginx)
2. Ajuste o email em `api/contact.php` (linha 67)
3. Configure permissões de escrita para o arquivo `leads.csv`

#### Opção B: Formspree (Mais Simples)
1. Crie uma conta no [Formspree](https://formspree.io)
2. Obtenha seu Form ID
3. Atualize `js/form-handler.js` (linha 8)

### 3. Teste de Responsividade
Abra `responsive-test.html` no navegador para testar em diferentes dispositivos.

### 4. PWA
- Acesse a landing page
- Clique em "Instalar" quando aparecer o prompt
- Ou use o menu do navegador para "Adicionar à tela inicial"

## 🎨 Personalização

### Cores
As cores principais estão definidas no CSS:
- **Primária**: `#10b981` (Verde)
- **Secundária**: `#059669` (Verde escuro)
- **Accent**: `#8b5cf6` (Roxo)

### A/B Testing
Configure testes em `js/ab-testing.js`:
```javascript
this.tests.set('hero_title', {
    name: 'Hero Title Test',
    variants: [
        {
            id: 'control',
            name: 'Control',
            weight: 50,
            content: 'Seu título aqui'
        }
    ]
});
```

### Chat Support
Personalize o chat em `js/chat-support.js`:
```javascript
getBotResponses() {
    return {
        'demo': 'Sua resposta personalizada aqui',
        // ...
    };
}
```

## 📊 Analytics e Tracking

### Google Analytics
Configure seu GA4 ID no HTML:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=SEU_GA_ID"></script>
```

### Eventos Rastreados
- Page views
- Form submissions
- Button clicks
- Video plays
- Scroll depth
- A/B test assignments

## 🔧 Configurações Avançadas

### Service Worker
Configure cache em `sw.js`:
```javascript
const STATIC_ASSETS = [
    '/',
    '/landing_page_html.html',
    // Adicione seus assets aqui
];
```

### Manifest PWA
Personalize em `manifest.json`:
```json
{
    "name": "Seu App",
    "short_name": "SeuApp",
    "theme_color": "#10B981"
}
```

## 🚀 Deploy

### Netlify
1. Conecte seu repositório
2. Configure build settings
3. Deploy automático

### Vercel
1. Instale Vercel CLI
2. Execute `vercel`
3. Siga as instruções

### GitHub Pages
1. Ative GitHub Pages no repositório
2. Selecione branch main
3. Acesse via `username.github.io/repository-name`

## 📱 Testes

### Dispositivos Testados
- ✅ iPhone SE (375px)
- ✅ iPhone 12 (390px)
- ✅ iPad (768px)
- ✅ Desktop (1024px+)
- ✅ Ultra-wide (1920px+)

### Navegadores
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🐛 Solução de Problemas

### Formulários não funcionam
1. Verifique se o servidor suporta PHP
2. Confirme permissões de escrita
3. Teste com Formspree como alternativa

### PWA não instala
1. Verifique se está servindo via HTTPS
2. Confirme se o manifest.json está acessível
3. Teste o service worker no DevTools

### Animações não funcionam
1. Verifique se o JavaScript está habilitado
2. Confirme se os arquivos JS estão carregando
3. Teste no console do navegador

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este README
2. Teste com `responsive-test.html`
3. Abra o chat widget na landing page
4. Consulte os logs do navegador

## 📄 Licença

Este projeto é parte do MinhaGrana e está sujeito aos termos de uso da aplicação.

---

**MinhaGrana** - Organize as finanças da sua família de forma colaborativa e inteligente.
