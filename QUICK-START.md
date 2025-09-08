# 🚀 Quick Start - MinhaGrana Landing Page

## ⚡ Deploy Rápido

### 1. Netlify (Mais Fácil)
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto para a área de deploy
3. Pronto! Sua landing page estará online

### 2. Vercel
```bash
npx vercel
```

### 3. GitHub Pages
1. Faça push para o GitHub
2. Ative Pages em Settings > Pages
3. Selecione branch `main`

## 🧪 Teste Local

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

## ⚙️ Configurações Essenciais

### Formulários
- **Formspree**: Atualize `js/form-handler.js` linha 8
- **PHP**: Configure email em `api/contact.php` linha 67

### Analytics
- **Google Analytics**: Atualize ID no `index.html`
- **Facebook Pixel**: Adicione código no `index.html`

## 📱 Teste Responsivo
Abra `responsive-test.html` no navegador

## 🎯 Estrutura do Projeto
```
MinhaGrana-Pagina/
├── index.html          # ← Página principal
├── styles.css          # ← Estilos
├── manifest.json       # ← PWA
├── sw.js              # ← Service Worker
├── netlify.toml       # ← Config Netlify
├── vercel.json        # ← Config Vercel
└── js/                # ← JavaScript
```

## ✅ Checklist de Deploy

- [ ] Arquivo `index.html` na raiz
- [ ] Publish directory: `.` (raiz)
- [ ] Build command: (vazio)
- [ ] HTTPS habilitado
- [ ] Formulários configurados
- [ ] Analytics configurado
- [ ] Teste responsivo OK

## 🆘 Problemas Comuns

**Formulários não funcionam?**
- Use Formspree como alternativa
- Verifique se o servidor suporta PHP

**PWA não instala?**
- Confirme HTTPS
- Verifique `manifest.json`

**CSS não carrega?**
- Limpe cache do navegador
- Verifique caminhos dos arquivos

---

**Pronto para o deploy!** 🎉

Sua landing page está otimizada e pronta para converter visitantes em clientes.
