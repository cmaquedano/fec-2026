// ==============================================
// FEC 2026 | Script de seed do administrador inicial
// Uso: npm run seed  (le ADMIN_USERNAME e ADMIN_PASSWORD do .env)
// ==============================================
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

if (!username || !password) {
  console.error('[SEED] Defina ADMIN_USERNAME e ADMIN_PASSWORD no arquivo .env antes de rodar o seed.');
  process.exit(1);
}

if (password.length < 8) {
  console.error('[SEED] A senha do administrador deve ter pelo menos 8 caracteres.');
  process.exit(1);
}

const existing = db.prepare('SELECT id FROM admins WHERE username = ?').get(username);

if (existing) {
  console.log(`[SEED] Administrador "${username}" já existe. Nenhuma ação realizada.`);
  process.exit(0);
}

const passwordHash = bcrypt.hashSync(password, 12);

db.prepare(
  'INSERT INTO admins (username, password_hash) VALUES (?, ?)'
).run(username, passwordHash);

console.log(`[SEED] Administrador "${username}" criado com sucesso.`);
console.log('[SEED] A senha NUNCA é salva em texto puro — apenas o hash bcrypt foi armazenado.');
