-- ==============================================
-- FEC 2026 | Schema do banco de dados (SQLite)
-- ==============================================

CREATE TABLE IF NOT EXISTS admins (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS photos (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    packet_code       TEXT NOT NULL UNIQUE,
    filename          TEXT NOT NULL,
    thumbnail         TEXT,
    original_name     TEXT NOT NULL,
    path              TEXT NOT NULL,
    thumbnail_path    TEXT,
    mime_type         TEXT NOT NULL,
    size_bytes        INTEGER NOT NULL,
    nickname          TEXT,
    instagram         TEXT,
    status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    lgpd_authorized   INTEGER NOT NULL DEFAULT 0,
    views             INTEGER NOT NULL DEFAULT 0,
    ip_hash           TEXT,
    created_at        TEXT NOT NULL DEFAULT (datetime('now')),
    approved_at       TEXT,
    rejected_at       TEXT
);

CREATE TABLE IF NOT EXISTS logs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    reference  TEXT,
    detail     TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_photos_status ON photos(status);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at);
