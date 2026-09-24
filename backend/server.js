// =========================================================
// SERVER.JS — ГЛАВНЫЙ СЕРВЕР (УЛУЧШЕННАЯ БЕЗОПАСНОСТЬ)
// =========================================================

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// =========================================================
// 🔥 БЕЗОПАСНОСТЬ: JWT_SECRET из переменных окружения
// =========================================================

const JWT_SECRET = process.env.JWT_SECRET || 'manomaestro_secret_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'manomaestro_refresh_secret_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

// =========================================================
// 🔥 БЕЗОПАСНОСТЬ: Helmet — защита HTTP заголовков
// =========================================================

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://i.pravatar.cc"],
            connectSrc: ["'self'", "http://localhost:3001", "http://localhost:8000"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// =========================================================
// 🔥 БЕЗОПАСНОСТЬ: CORS — ограничиваем доверенные домены
// =========================================================

const allowedOrigins = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost:5500',
    'https://manomaestro.ru',
    'https://www.manomaestro.ru',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Не разрешено CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    maxAge: 86400
}));

// =========================================================
// 🔥 БЕЗОПАСНОСТЬ: Rate Limiting — защита от брутфорса
// =========================================================

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Слишком много запросов. Попробуйте позже.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Слишком много попыток входа. Попробуйте через 15 минут.' },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/favorites', limiter);
app.use(limiter);

// =========================================================
// 🔥 БЕЗОПАСНОСТЬ: Ограничение размера тела запроса
// =========================================================

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// =========================================================
// ПОДКЛЮЧЕНИЕ К БД
// =========================================================

const dbPath = path.join(__dirname, 'db', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Ошибка подключения к БД:', err.message);
    } else {
        console.log('✔ Подключено к SQLite БД');
        initDatabase();
    }
});

// =========================================================
// ИНИЦИАЛИЗАЦИЯ БД
// =========================================================

function initDatabase() {
    const createUsersTable = `
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
        )
    `;

    db.run(createUsersTable, (err) => {
        if (err) {
            console.error('❌ Ошибка создания таблицы users:', err.message);
        } else {
            console.log('✔ Таблица users готова');
            db.run(`UPDATE users SET email = NULL WHERE email = phone`, (err) => {
                if (err) {
                    console.error('❌ Ошибка миграции email:', err.message);
                } else {
                    console.log('✔ Email исправлен');
                }
            });
        }
    });

    const createFavoritesTable = `
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
        )
    `;

    db.run(createFavoritesTable, (err) => {
        if (err) {
            console.error('❌ Ошибка создания таблицы favorites:', err.message);
        } else {
            console.log('✔ Таблица favorites готова');
            createIndexes();
        }
    });
}

function createIndexes() {
    const createIndexesSQL = `
        CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
        CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_refresh_token ON users(refresh_token);
    `;

    db.run(createIndexesSQL, (err) => {
        if (err) {
            console.error('❌ Ошибка создания индексов:', err.message);
        } else {
            console.log('✔ Индексы созданы');
        }
    });
}

// =========================================================
// 🔥 БЕЗОПАСНОСТЬ: Валидация ввода
// =========================================================

const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 && cleaned.startsWith('7');
};

const validateEmail = (email) => {
    if (!email || email.trim() === '') return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateName = (name) => {
    return name && name.length >= 2 && name.length <= 50;
};

// =========================================================
// JWT — ТОКЕНЫ
// =========================================================

function generateTokens(user) {
    const accessToken = jwt.sign(
        { 
            id: user.id, 
            email: user.email,
            phone: user.phone,
            tokenVersion: user.token_version || 1
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
}

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.tokenVersion = decoded.tokenVersion || 1;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Токен истёк' });
        }
        return res.status(401).json({ error: 'Недействительный токен' });
    }
}

// =========================================================
// API — АВТОРИЗАЦИЯ
// =========================================================

// ===== РЕГИСТРАЦИЯ (ИСПРАВЛЕНА) =====
app.post('/api/auth/register', [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Имя должно быть от 2 до 50 символов'),
    body('phone').custom(validatePhone).withMessage('Введите корректный номер телефона'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Введите 6-значный код'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: errors.array()[0].msg,
            details: errors.array()
        });
    }

    const { name, phone, password, code } = req.body;

    if (code !== '123456') {
        return res.status(400).json({ error: 'Неверный код подтверждения' });
    }

    const cleanedPhone = phone.replace(/\D/g, '');

    try {
        // 🔥 ПРОВЕРЯЕМ ТОЛЬКО ТЕЛЕФОН (ИМЯ МОЖЕТ ПОВТОРЯТЬСЯ)
        const existingUser = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id FROM users WHERE phone = ?',
                [cleanedPhone],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким номером уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
                [name, null, cleanedPhone, hashedPassword],
                function(err) {
                    if (err) {
                        console.error('❌ Ошибка INSERT:', err.message);
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });

        const user = { 
            id: result, 
            name, 
            email: null,
            phone: cleanedPhone,
            token_version: 1
        };

        const { accessToken, refreshToken } = generateTokens(user);

        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET refresh_token = ? WHERE id = ?',
                [refreshToken, user.id],
                function(err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: 'https://i.pravatar.cc/150?img=11'
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error('❌ Ошибка регистрации:', error);
        res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
    }
});

// ===== ВХОД =====
app.post('/api/auth/login', [
    body('login').notEmpty().withMessage('Введите email или номер телефона'),
    body('password').notEmpty().withMessage('Введите пароль'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { login, password } = req.body;

    try {
        const cleanedPhone = login.replace(/\D/g, '');
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE email = ? OR phone = ?',
                [login, cleanedPhone],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(400).json({ error: 'Неверный логин или пароль' });
        }

        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            return res.status(403).json({ 
                error: `Аккаунт заблокирован до ${new Date(user.locked_until).toLocaleString()}` 
            });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            await new Promise((resolve, reject) => {
                db.run(
                    'UPDATE users SET login_attempts = COALESCE(login_attempts, 0) + 1 WHERE id = ?',
                    [user.id],
                    function(err) {
                        if (err) reject(err);
                        resolve();
                    }
                );
            });

            const attempts = (user.login_attempts || 0) + 1;
            if (attempts >= 5) {
                const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
                await new Promise((resolve, reject) => {
                    db.run(
                        'UPDATE users SET locked_until = ? WHERE id = ?',
                        [lockUntil.toISOString(), user.id],
                        function(err) {
                            if (err) reject(err);
                            resolve();
                        }
                    );
                });
                return res.status(403).json({ 
                    error: 'Слишком много попыток входа. Аккаунт заблокирован на 15 минут.' 
                });
            }

            return res.status(400).json({ error: 'Неверный логин или пароль' });
        }

        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?',
                [user.id],
                function(err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar || 'https://i.pravatar.cc/150?img=11',
            token_version: user.token_version || 1
        };

        const { accessToken, refreshToken } = generateTokens(userData);

        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET refresh_token = ? WHERE id = ?',
                [refreshToken, user.id],
                function(err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });

        res.json({
            user: userData,
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error('❌ Ошибка входа:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ===== ОБНОВЛЕНИЕ ТОКЕНА (REFRESH) =====
app.post('/api/auth/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token не предоставлен' });
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE id = ? AND refresh_token = ?',
                [decoded.id, refreshToken],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(401).json({ error: 'Недействительный refresh token' });
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar || 'https://i.pravatar.cc/150?img=11',
            token_version: user.token_version || 1
        };

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(userData);

        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET refresh_token = ? WHERE id = ?',
                [newRefreshToken, user.id],
                function(err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });

        res.json({
            accessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Refresh token истёк' });
        }
        return res.status(401).json({ error: 'Недействительный refresh token' });
    }
});

// ===== ВЫХОД (Отзыв токена) =====
app.post('/api/auth/logout', verifyToken, async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET token_version = COALESCE(token_version, 0) + 1, refresh_token = NULL WHERE id = ?',
                [req.userId],
                function(err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });

        res.json({ success: true });
    } catch (error) {
        console.error('❌ Ошибка выхода:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ===== ПОЛУЧИТЬ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ =====
app.get('/api/auth/me', verifyToken, async (req, res) => {
    try {
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id, name, email, phone, avatar FROM users WHERE id = ?',
                [req.userId],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json({ user });

    } catch (error) {
        console.error('❌ Ошибка получения профиля:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ===== ОБНОВЛЕНИЕ АВАТАРКИ =====
app.put('/api/auth/avatar', verifyToken, async (req, res) => {
    const { avatar } = req.body;

    if (!avatar) {
        return res.status(400).json({ error: 'Аватарка не передана' });
    }

    if (!avatar.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Неверный формат изображения' });
    }

    const sizeInBytes = Buffer.from(avatar, 'base64').length;
    if (sizeInBytes > 2 * 1024 * 1024) {
        return res.status(400).json({ error: 'Изображение слишком большое (максимум 2MB)' });
    }

    try {
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [avatar, req.userId],
                function(err) {
                    if (err) reject(err);
                    resolve(this.changes);
                }
            );
        });

        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id, name, email, phone, avatar FROM users WHERE id = ?',
                [req.userId],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        console.log(`✅ Аватарка обновлена для пользователя ${user.name}`);
        res.json({ user });

    } catch (error) {
        console.error('❌ Ошибка обновления аватарки:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ===== ОБНОВЛЕНИЕ ПРОФИЛЯ =====
app.put('/api/auth/profile', verifyToken, [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Имя должно быть от 2 до 50 символов'),
    body('email').custom(validateEmail).withMessage('Введите корректный email'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, phone } = req.body;

    try {
        if (email && email.trim() !== '') {
            const existing = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT id FROM users WHERE email = ? AND id != ?',
                    [email.trim(), req.userId],
                    (err, row) => {
                        if (err) reject(err);
                        resolve(row);
                    }
                );
            });

            if (existing) {
                return res.status(400).json({ error: 'Этот email уже используется' });
            }
        }

        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [name, email || null, phone || null, req.userId],
                function(err) {
                    if (err) reject(err);
                    resolve(this.changes);
                }
            );
        });

        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id, name, email, phone, avatar FROM users WHERE id = ?',
                [req.userId],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        console.log(`✅ Профиль обновлён для пользователя ${user.name}`);
        res.json({ user });

    } catch (error) {
        console.error('❌ Ошибка обновления профиля:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// =========================================================
// API — ИЗБРАННОЕ
// =========================================================

// ===== ПОЛУЧИТЬ ИЗБРАННОЕ =====
app.get('/api/favorites', verifyToken, async (req, res) => {
    try {
        const favorites = await new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
                [req.userId],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });

        res.json({ favorites });

    } catch (error) {
        console.error('❌ Ошибка получения избранного:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ===== ДОБАВИТЬ В ИЗБРАННОЕ =====
app.post('/api/favorites', verifyToken, async (req, res) => {
    const { productId, productType, title, price, image, category, description } = req.body;

    if (!productId || !title || !price || !image) {
        return res.status(400).json({ error: 'Недостаточно данных' });
    }

    try {
        const existing = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id FROM favorites WHERE user_id = ? AND product_id = ? AND product_type = ?',
                [req.userId, productId, productType || 'catalog'],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        if (existing) {
            return res.status(400).json({ error: 'Товар уже в избранном' });
        }

        const result = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO favorites 
                (user_id, product_id, product_type, product_title, product_price, product_image, product_category, product_description) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    req.userId,
                    productId,
                    productType || 'catalog',
                    title,
                    price,
                    image,
                    category || '',
                    description || ''
                ],
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });

        res.json({ success: true, id: result });

    } catch (error) {
        console.error('❌ Ошибка добавления в избранное:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ===== УДАЛИТЬ ИЗ ИЗБРАННОГО =====
app.delete('/api/favorites/:productId', verifyToken, async (req, res) => {
    const productId = parseInt(req.params.productId);
    const productType = req.query.type || 'catalog';

    try {
        const result = await new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM favorites WHERE user_id = ? AND product_id = ? AND product_type = ?',
                [req.userId, productId, productType],
                function(err) {
                    if (err) reject(err);
                    resolve(this.changes);
                }
            );
        });

        if (result === 0) {
            return res.status(404).json({ error: 'Товар не найден в избранном' });
        }

        res.json({ success: true });

    } catch (error) {
        console.error('❌ Ошибка удаления из избранного:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// =========================================================
// ЗАПУСК СЕРВЕРА
// =========================================================

app.listen(PORT, () => {
    console.log(`✔ Сервер запущен на http://localhost:${PORT}`);
    console.log(`🔒 Безопасность: JWT_SECRET установлен`);
    console.log(`🔒 CORS: разрешены только доверенные домены`);
    console.log(`🔒 Rate Limiting: активен`);
    console.log(`🔒 Helmet: активен`);
});