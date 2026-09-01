// ==============================================
// FEC 2026 | Rota pública de estatísticas do sistema
// ==============================================
const express = require('express');
const { getStats } = require('../controllers/adminController');

const router = express.Router();
router.get('/', getStats);

module.exports = router;
