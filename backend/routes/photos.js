// ==============================================
// FEC 2026 | Rotas públicas de fotos
// ==============================================
const express = require('express');
const rateLimit = require('express-rate-limit');
const { upload } = require('../middleware/upload');
const {
  uploadPhoto,
  getApprovedPhotos,
  registerView,
} = require('../controllers/photoController');

const router = express.Router();

// Limita uploads para evitar abuso (ex: 10 uploads a cada 15 min por IP)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'RATE_LIMITED', message: 'Muitos envios detectados. Tente novamente em instantes.' },
});

router.post('/upload', uploadLimiter, upload.single('photo'), uploadPhoto);
router.get('/photos/approved', getApprovedPhotos);
router.post('/photos/:id/view', registerView);

module.exports = router;
