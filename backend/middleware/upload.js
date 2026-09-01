// ==============================================
// FEC 2026 | Middleware de upload (Multer)
// Validação de extensão, MIME type, tamanho e nome seguro de arquivo
// ==============================================
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const UPLOAD_DIR = path.resolve(__dirname, '..', (process.env.UPLOAD_DIR || './uploads').replace('./', ''));
const ORIGINALS_DIR = path.join(UPLOAD_DIR, 'originals');

fs.mkdirSync(ORIGINALS_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const MAX_UPLOAD_SIZE_BYTES =
  (parseInt(process.env.MAX_UPLOAD_SIZE_MB, 10) || 10) * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ORIGINALS_DIR),
  filename: (req, file, cb) => {
    // Nunca confiar no nome original: gerar identificador aleatório e seguro
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, safeName);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME_TYPES.has(file.mimetype) || !ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error('FORMATO_INVALIDO'));
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_UPLOAD_SIZE_BYTES,
    files: 1,
  },
});

module.exports = { upload, UPLOAD_DIR, ORIGINALS_DIR };
