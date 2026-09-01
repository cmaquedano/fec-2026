// ==============================================
// FEC 2026 | Servidor principal (Express)
// Sistemas de Informação — UNIARA — 4º Semestre
// ==============================================
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const photoRoutes = require('./routes/photos');
const adminRoutes = require('./routes/admin');
const statsRoutes = require('./routes/stats');

// Garante que o banco seja inicializado (schema aplicado) antes de subir o servidor
require('./database/db');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const UPLOAD_DIR = path.resolve(__dirname, (process.env.UPLOAD_DIR || './uploads').replace('./', ''));

fs.mkdirSync(path.join(UPLOAD_DIR, 'originals'), { recursive: true });
fs.mkdirSync(path.join(UPLOAD_DIR, 'thumbnails'), { recursive: true });

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Arquivos de upload servidos publicamente (somente leitura)
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }));

// API
app.use('/api', photoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ONLINE', protocol: 'FEC_2026', timestamp: new Date().toISOString() });
});

// Em produção, servir o build do frontend (React/Vite) a partir da mesma origem
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

// Tratamento de erros do Multer / uploads
app.use((err, req, res, next) => {
  if (err?.message === 'FORMATO_INVALIDO') {
    return res.status(400).json({ error: 'FORMATO_INVALIDO', message: 'Envie apenas imagens JPG, PNG ou WEBP.' });
  }
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'ARQUIVO_MUITO_GRANDE', message: 'A imagem enviada excede o limite permitido.' });
  }
  console.error('[UNHANDLED_ERROR]', err);
  return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`[ SYSTEM: ONLINE ] FEC_2026 backend rodando na porta ${PORT}`);
});
