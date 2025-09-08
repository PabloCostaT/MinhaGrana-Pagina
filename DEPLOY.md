# Guia de Deploy - MinhaGrana Landing Page

## 🚀 Opções de Deploy

### 1. Netlify (Recomendado)

#### Deploy Automático via Git
1. **Conecte o repositório**:
   - Acesse [netlify.com](https://netlify.com)
   - Clique em "New site from Git"
   - Conecte seu repositório GitHub/GitLab

2. **Configure as build settings**:
   ```
   Build command: (deixe vazio)
   Publish directory: . (raiz do projeto)
   ```

3. **Variáveis de ambiente** (opcional):
   ```
   FORMSPREE_ID=seu_form_id_aqui
   GA_MEASUREMENT_ID=seu_ga_id_aqui
   ```

4. **Deploy**: Netlify fará deploy automático a cada push

#### Deploy Manual via Drag & Drop
1. Acesse [netlify.com/drop](https://netlify.com/drop)
2. Arraste a pasta do projeto
3. Aguarde o deploy automático

### 2. Vercel

#### Via CLI
```bash
# Instale o Vercel CLI
npm i -g vercel

# No diretório do projeto
vercel

# Siga as instruções
```

#### Via Dashboard
1. Acesse [vercel.com](https://vercel.com)
2. Importe seu repositório
3. Configure:
   - Framework: Other
   - Build Command: (deixe vazio)
   - Output Directory: .

### 3. GitHub Pages

#### Configuração
1. **Ative GitHub Pages**:
   - Vá em Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

2. **Acesse**: `https://seuusername.github.io/nome-do-repo`

#### Custom Domain (opcional)
1. Adicione um arquivo `CNAME` na raiz:
   ```
   seudominio.com
   ```
2. Configure DNS no seu provedor

### 4. Firebase Hosting

```bash
# Instale Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicialize o projeto
firebase init hosting

# Deploy
firebase deploy
```

### 5. Surge.sh

```bash
# Instale Surge
npm install -g surge

# No diretório do projeto
surge

# Siga as instruções
```

## ⚙️ Configurações Pós-Deploy

### 1. Configurar Formulários

#### Opção A: Formspree (Mais Simples)
1. Crie conta em [formspree.io](https://formspree.io)
2. Crie um novo formulário
3. Copie o Form ID
4. Atualize `js/form-handler.js`:
   ```javascript
   this.formspreeEndpoint = 'https://formspree.io/f/SEU_FORM_ID';
   ```

#### Opção B: Netlify Forms
1. Adicione `netlify` ao formulário:
   ```html
   <form name="contact" method="POST" data-netlify="true">
   ```
2. Netlify processará automaticamente

#### Opção C: Backend Próprio
1. Configure servidor com PHP
2. Ajuste `api/contact.php`
3. Configure email de destino

### 2. Configurar Analytics

#### Google Analytics 4
1. Crie propriedade no [Google Analytics](https://analytics.google.com)
2. Copie o Measurement ID
3. Atualize no HTML:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=SEU_GA_ID"></script>
   ```

#### Facebook Pixel
1. Crie pixel no [Facebook Business](https://business.facebook.com)
2. Adicione o código no HTML:
   ```html
   <script>
     !function(f,b,e,v,n,t,s)
     {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
     n.callMethod.apply(n,arguments):n.queue.push(arguments)};
     if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
     n.queue=[];t=b.createElement(e);t.async=!0;
     t.src=v;s=b.getElementsByTagName(e)[0];
     s.parentNode.insertBefore(t,s)}(window, document,'script',
     'https://connect.facebook.net/en_US/fbevents.js');
     fbq('init', 'SEU_PIXEL_ID');
     fbq('track', 'PageView');
   </script>
   ```

### 3. Configurar PWA

#### Verificar Manifest
1. Acesse `https://seudominio.com/manifest.json`
2. Confirme que está acessível
3. Teste no [PWA Builder](https://www.pwabuilder.com)

#### Service Worker
1. Verifique se `sw.js` está sendo servido
2. Teste no DevTools > Application > Service Workers
3. Confirme cache funcionando

### 4. Configurar Domínio Personalizado

#### Netlify
1. Vá em Site settings > Domain management
2. Adicione custom domain
3. Configure DNS:
   ```
   CNAME www seudominio.netlify.app
   A @ 75.2.60.5
   ```

#### Vercel
1. Vá em Settings > Domains
2. Adicione domínio
3. Configure DNS conforme instruções

## 🔧 Otimizações de Performance

### 1. Compressão
Configure gzip no servidor:
```nginx
# Nginx
gzip on;
gzip_types text/css application/javascript image/svg+xml;
```

### 2. Cache Headers
```nginx
# Nginx
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN
Use Cloudflare ou similar para:
- Cache global
- Compressão automática
- SSL gratuito

## 📊 Monitoramento

### 1. Uptime
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)

### 2. Performance
- [PageSpeed Insights](https://pagespeed.web.dev)
- [GTmetrix](https://gtmetrix.com)

### 3. Analytics
- Google Analytics
- Hotjar (heatmaps)
- Google Search Console

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Formulários não funcionam
```bash
# Verifique se o endpoint está correto
curl -X POST https://seudominio.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@teste.com"}'
```

#### 2. PWA não instala
- Verifique HTTPS
- Confirme manifest.json
- Teste service worker

#### 3. Imagens não carregam
- Verifique caminhos relativos
- Confirme permissões de arquivo
- Teste em diferentes navegadores

#### 4. CSS não aplica
- Verifique cache do navegador
- Confirme ordem de carregamento
- Teste com DevTools

### Logs Úteis

#### Netlify
```bash
# Ver logs de deploy
netlify logs

# Ver logs em tempo real
netlify logs --follow
```

#### Vercel
```bash
# Ver logs
vercel logs

# Ver logs de função
vercel logs --follow
```

## 🔄 CI/CD

### GitHub Actions (Netlify)
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=.
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### GitHub Actions (Vercel)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Métricas de Sucesso

### KPIs para Acompanhar
- **Taxa de conversão**: Formulários preenchidos / Visitantes
- **Tempo na página**: Engajamento dos usuários
- **Taxa de rejeição**: Usuários que saem rapidamente
- **Instalações PWA**: Adoção do app
- **Performance**: Core Web Vitals

### Ferramentas de Acompanhamento
- Google Analytics
- Google Search Console
- Hotjar
- PageSpeed Insights

---

**Pronto para o deploy!** 🚀

Sua landing page do MinhaGrana está otimizada e pronta para converter visitantes em clientes.
