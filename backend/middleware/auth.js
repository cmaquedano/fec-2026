// ==============================================
// FEC 2026 | Middleware de autenticação administrativa (JWT via cookie httpOnly)
// ==============================================
const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const token = req.cookies?.fec_admin_token;

  if (!token) {
    return res.status(401).json({ error: 'ACCESS_DENIED', message: 'Sessão administrativa não encontrada.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'ACCESS_DENIED', message: 'Sessão inválida ou expirada.' });
  }
}

module.exports = { requireAdmin };
