const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: 'Muitas tentativas. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/contact', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuração do Nodemailer
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Validação de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de telefone
function isValidPhone(phone) {
  const phoneRegex = /^[0-9()\-\s+]{8,}$/;
  return phoneRegex.test(phone);
}

// Rota para receber dados do formulário
app.post('/api/contact', async (req, res) => {
  try {
    const { nome, telefone, email, tipo } = req.body;

    // Validações
    if (!nome || !telefone || !email || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido.'
      });
    }

    if (!isValidPhone(telefone)) {
      return res.status(400).json({
        success: false,
        message: 'Telefone inválido.'
      });
    }

    // Dados do lead
    const leadData = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim().toLowerCase(),
      tipo: tipo,
      data: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Salvar no banco de dados (implementar conforme necessário)
    console.log('Novo lead capturado:', leadData);

    // Enviar email de notificação
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `Novo Lead MinhaGrana - ${tipo}`,
      html: `
        <h2>Novo Lead Capturado</h2>
        <p><strong>Nome:</strong> ${leadData.nome}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Telefone:</strong> ${leadData.telefone}</p>
        <p><strong>Tipo de Interesse:</strong> ${leadData.tipo}</p>
        <p><strong>Data:</strong> ${new Date(leadData.data).toLocaleString('pt-BR')}</p>
        <p><strong>IP:</strong> ${leadData.ip}</p>
      `
    };

    // Enviar email de confirmação para o usuário
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: leadData.email,
      subject: 'Obrigado pelo seu interesse no MinhaGrana!',
      html: `
        <h2>Olá ${leadData.nome}!</h2>
        <p>Obrigado por demonstrar interesse no MinhaGrana.</p>
        <p>Recebemos sua solicitação e entraremos em contato em breve com:</p>
        <ul>
          <li>Material de educação financeira</li>
          <li>Templates de categorias e metas</li>
          <li>Suporte personalizado</li>
        </ul>
        <p>Atenciosamente,<br>Equipe MinhaGrana</p>
      `
    };

    // Enviar emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({
      success: true,
      message: 'Obrigado! Recebemos seu interesse e entraremos em contato.'
    });

  } catch (error) {
    console.error('Erro ao processar formulário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente.'
    });
  }
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rota para servir arquivos estáticos
app.use(express.static('.'));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/landing_page_html.html');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📧 Email configurado: ${process.env.EMAIL_USER ? 'Sim' : 'Não'}`);
});
