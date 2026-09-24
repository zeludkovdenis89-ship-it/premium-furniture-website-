-- =========================================================
-- БАЗА ДАННЫХ MANOMAESTRO (ИСПРАВЛЕННАЯ)
-- =========================================================

-- Таблица пользователей (email теперь может быть NULL)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT, 
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    refresh_token TEXT,
    token_version INTEGER DEFAULT 1,
    is_verified BOOLEAN DEFAULT 0,
    verification_token TEXT,
    reset_password_token TEXT,
    reset_password_expires DATETIME,
    login_attempts INTEGER DEFAULT 0,
    locked_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Таблица избранного (без изменений)
CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_type TEXT DEFAULT 'catalog',
    product_title TEXT NOT NULL,
    product_price TEXT NOT NULL,
    product_image TEXT NOT NULL,
    product_category TEXT,
    product_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id, product_type)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);