// ==============================================
// FEC 2026 | Rotas administrativas (protegidas)
// ==============================================
const express = require('express');
const rateLimit = require('express-rate-limit');
const { requireAdmin } = require('../middleware/auth');
const {
  login,
  logout,
  me,
  approvePhoto,
  rejectPhoto,
} = require('../controllers/adminController');
const { getAllPhotos, getPendingPhotos } = require('../controllers/photoController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'RATE_LIMITED', message: 'Muitas tentativas de login. Tente novamente em instantes.' },
});

router.post('/login', loginLimiter, login);
router.post('/logout', requireAdmin, logout);
router.get('/me', requireAdmin, me);

router.get('/photos', requireAdmin, getAllPhotos);
router.get('/photos/pending', requireAdmin, getPendingPhotos);
router.post('/photos/:id/approve', requireAdmin, approvePhoto);
router.post('/photos/:id/reject', requireAdmin, rejectPhoto);

module.exports = router;
