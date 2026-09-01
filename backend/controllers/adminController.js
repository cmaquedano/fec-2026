// ==============================================
// FEC 2026 | Controller administrativo (login, moderação, estatísticas)
// ==============================================
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const isProduction = process.env.NODE_ENV === 'production';

// POST /api/admin/login
function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'MISSING_CREDENTIALS' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);

  // Resposta genérica em ambos os casos de falha (não revelar se usuário existe)
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    db.prepare('INSERT INTO logs (event_type, reference, detail) VALUES (?, ?, ?)').run(
      'admin_login_failed',
      username,
      'Tentativa de login inválida'
    );
    return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Usuário ou senha incorretos.' });
  }

  const token = jwt.sign(
    { sub: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  res.cookie('fec_admin_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  });

  db.prepare('INSERT INTO logs (event_type, reference, detail) VALUES (?, ?, ?)').run(
    'admin_login',
    admin.username,
    'Login administrativo bem-sucedido'
  );

  return res.json({ message: 'ACCESS_GRANTED', admin: { username: admin.username } });
}

// POST /api/admin/logout
function logout(req, res) {
  res.clearCookie('fec_admin_token');
  return res.json({ message: 'SESSION_TERMINATED' });
}

// GET /api/admin/me
function me(req, res) {
  return res.json({ admin: { username: req.admin.username } });
}

// POST /api/admin/photos/:id/approve
function approvePhoto(req, res) {
  const { id } = req.params;
  const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id);

  if (!photo) return res.status(404).json({ error: 'NOT_FOUND' });
  if (!photo.lgpd_authorized) {
    return res.status(400).json({
      error: 'LGPD_NOT_AUTHORIZED',
      message: 'Não é possível publicar uma imagem sem autorização LGPD registrada.',
    });
  }

  db.prepare(`UPDATE photos SET status = 'approved', approved_at = datetime('now') WHERE id = ?`).run(id);
  db.prepare('INSERT INTO logs (event_type, reference, detail) VALUES (?, ?, ?)').run(
    'approve',
    photo.packet_code,
    `Aprovado por ${req.admin.username}`
  );

  return res.json({ message: 'PHOTO_APPROVED' });
}

// POST /api/admin/photos/:id/reject
function rejectPhoto(req, res) {
  const { id } = req.params;
  const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id);

  if (!photo) return res.status(404).json({ error: 'NOT_FOUND' });

  db.prepare(`UPDATE photos SET status = 'rejected', rejected_at = datetime('now') WHERE id = ?`).run(id);
  db.prepare('INSERT INTO logs (event_type, reference, detail) VALUES (?, ?, ?)').run(
    'reject',
    photo.packet_code,
    `Rejeitado por ${req.admin.username}`
  );

  return res.json({ message: 'PHOTO_REJECTED' });
}

// GET /api/stats — usado no painel público de status do sistema
function getStats(req, res) {
  const totals = db
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM photos) AS total_packets,
         (SELECT COUNT(*) FROM photos WHERE status = 'approved') AS total_published,
         (SELECT COUNT(*) FROM photos WHERE status = 'pending') AS total_pending,
         (SELECT COUNT(*) FROM photos WHERE status = 'rejected') AS total_rejected,
         (SELECT COUNT(*) FROM photos WHERE lgpd_authorized = 1) AS total_lgpd_ok
      `
    )
    .get();

  return res.json({
    core_status: 'ONLINE',
    agents_connected: totals.total_packets,
    packets_received: totals.total_packets,
    records_published: totals.total_published,
    pending_review: totals.total_pending,
    lgpd_secured: totals.total_lgpd_ok,
    database: 'SECURE',
  });
}

module.exports = { login, logout, me, approvePhoto, rejectPhoto, getStats };
