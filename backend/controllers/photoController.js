// ==============================================
// FEC 2026 | Controller de fotos (upload público + galeria)
// ==============================================
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
const db = require('../database/db');
const { ORIGINALS_DIR, UPLOAD_DIR } = require('../middleware/upload');

const THUMBNAILS_DIR = path.join(UPLOAD_DIR, 'thumbnails');
fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });

function hashIp(ip) {
  return crypto.createHash('sha256').update(String(ip)).digest('hex').slice(0, 16);
}

function nextPacketCode() {
  const row = db.prepare('SELECT COUNT(*) AS total FROM photos').get();
  const seq = row.total + 1;
  return `PACKET_${String(seq).padStart(5, '0')}`;
}

// POST /api/upload
async function uploadPhoto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'FILE_REQUIRED', message: 'Nenhum arquivo de imagem foi enviado.' });
    }

    const { nickname, instagram, lgpd_authorized } = req.body;
    const lgpdBool = lgpd_authorized === 'true' || lgpd_authorized === '1' || lgpd_authorized === true;

    if (!lgpdBool) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        error: 'LGPD_REQUIRED',
        message: 'É necessário autorizar o uso da imagem conforme a LGPD para enviar o registro.',
      });
    }

    const originalPath = req.file.path;
    const filename = req.file.filename;
    const thumbFilename = `thumb_${filename.replace(/\.[^/.]+$/, '')}.webp`;
    const processedFilename = `proc_${filename.replace(/\.[^/.]+$/, '')}.webp`;
    const processedPath = path.join(ORIGINALS_DIR, processedFilename);
    const thumbPath = path.join(THUMBNAILS_DIR, thumbFilename);

    // Otimiza a imagem principal (limita dimensão máxima, converte para webp)
    await sharp(originalPath)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(processedPath);

    // Gera thumbnail para a galeria
    await sharp(originalPath)
      .rotate()
      .resize({ width: 480, height: 480, fit: 'cover' })
      .webp({ quality: 70 })
      .toFile(thumbPath);

    // Remove o arquivo original bruto (já temos a versão processada)
    fs.unlink(originalPath, () => {});

    const packetCode = nextPacketCode();
    const ipHash = hashIp(req.ip);

    const stmt = db.prepare(`
      INSERT INTO photos (
        packet_code, filename, thumbnail, original_name, path, thumbnail_path,
        mime_type, size_bytes, nickname, instagram, status, lgpd_authorized, ip_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 1, ?)
    `);

    const info = stmt.run(
      packetCode,
      processedFilename,
      thumbFilename,
      req.file.originalname,
      `/uploads/originals/${processedFilename}`,
      `/uploads/thumbnails/${thumbFilename}`,
      'image/webp',
      fs.statSync(processedPath).size,
      (nickname || '').trim().slice(0, 60) || null,
      (instagram || '').trim().slice(0, 60) || null,
      ipHash
    );

    db.prepare('INSERT INTO logs (event_type, reference, detail) VALUES (?, ?, ?)').run(
      'upload',
      packetCode,
      `Novo registro recebido (id interno ${info.lastInsertRowid})`
    );

    const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(info.lastInsertRowid);

    return res.status(201).json({
      message: 'DATA_PACKET_TRANSMITTED',
      photo: {
        packet_code: photo.packet_code,
        status: photo.status,
        created_at: photo.created_at,
      },
    });
  } catch (err) {
    console.error('[UPLOAD_ERROR]', err.message);
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    return res.status(500).json({ error: 'UPLOAD_FAILED', message: 'Falha ao processar o upload.' });
  }
}

// GET /api/photos/approved?filter=recent|verified|most_viewed&limit=&offset=
function getApprovedPhotos(req, res) {
  const { filter = 'all', limit = 60, offset = 0 } = req.query;

  let orderBy = 'created_at DESC';
  if (filter === 'most_viewed') orderBy = 'views DESC, created_at DESC';
  if (filter === 'recent') orderBy = 'created_at DESC';

  const rows = db
    .prepare(
      `SELECT id, packet_code, path, thumbnail_path, nickname, instagram, views, created_at
       FROM photos
       WHERE status = 'approved'
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`
    )
    .all(Number(limit), Number(offset));

  return res.json({ photos: rows });
}

// GET /api/photos/pending  (uso interno / pré-visualização - protegido a nível de rota se necessário)
function getPendingPhotos(req, res) {
  const rows = db
    .prepare(`SELECT * FROM photos WHERE status = 'pending' ORDER BY created_at ASC`)
    .all();
  return res.json({ photos: rows });
}

// GET /api/photos  (todas, uso administrativo)
function getAllPhotos(req, res) {
  const rows = db.prepare(`SELECT * FROM photos ORDER BY created_at DESC`).all();
  return res.json({ photos: rows });
}

// POST /api/photos/:id/view — incrementa contador de visualizações
function registerView(req, res) {
  const { id } = req.params;
  const photo = db.prepare(`SELECT id FROM photos WHERE id = ? AND status = 'approved'`).get(id);
  if (!photo) return res.status(404).json({ error: 'NOT_FOUND' });

  db.prepare('UPDATE photos SET views = views + 1 WHERE id = ?').run(id);
  return res.json({ ok: true });
}

module.exports = {
  uploadPhoto,
  getApprovedPhotos,
  getPendingPhotos,
  getAllPhotos,
  registerView,
};
