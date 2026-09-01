// ==============================================
// FEC 2026 | Conexão com o banco SQLite
// ==============================================
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DATABASE_PATH = process.env.DATABASE_PATH || './database/fec2026.db';
const resolvedPath = path.resolve(__dirname, '..', DATABASE_PATH.replace('./', ''));

// Garante que a pasta do banco existe
fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

const db = new Database(resolvedPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Executa o schema sempre que o servidor sobe (CREATE TABLE IF NOT EXISTS é idempotente)
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

module.exports = db;
