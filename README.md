# Manomaestro — Премиальный сайт мебели

Сайт для компании, занимающейся изготовлением мебели ручной работы.  
Включает каталог товаров, избранное, личный кабинет, портфолио проектов и систему авторизации.

---

## Технологии

### Фронтенд
- **Vite** — сборка, dev-сервер с HMR, проксирование API
- TypeScript
- HTML5 / CSS3
- ES-модули (Vite компилирует TS автоматически)
- Fetch API
- Модульная архитектура

### Бэкенд
- Node.js
- Express
- SQLite3
- JSON Web Tokens (access + refresh)
- bcryptjs — хеширование паролей
- Helmet — защита HTTP-заголовков
- express-rate-limit — защита от брутфорса
- express-validator — валидация данных
- dotenv — хранение секретов

---

## Структура проекта

```text
premium-furniture-website-/
├── backend/                          # Бэкенд сервер
│   ├── server.js                     # Главный файл сервера
│   ├── package.json                  # Зависимости бэкенда
│   ├── .env                          # Секреты (не в git!)
│   └── db/
│       └── database.sqlite           # SQLite база (создаётся автоматически)
│
├── frontend/                         # Фронтенд на Vite
│   ├── index.html                    # Главная страница
│   ├── catalog.html                  # Каталог товаров
│   ├── cabinet.html                  # Личный кабинет
│   ├── projects.html                 # Портфолио проектов
│   ├── vite.config.ts                # Конфиг Vite
│   ├── tsconfig.json                 # Конфиг TypeScript
│   ├── package.json                  # Зависимости фронтенда (Vite, TypeScript)
│   ├── package-lock.json             # Фиксация версий (коммитится!)
│   │
│   ├── public/                       # Статика (отдаётся с корня /)
│   │   ├── images/                   # Картинки (логотип, товары, проекты)
│   │   │   ├── logo.png
│   │   │   ├── hero-bg.jpg
│   │   │   └── ...
│   │   └── videos/                   # Видео
│   │       └── 4935202_House_Furniture_1280x720.mp4
│   │
│   └── src/                          # Исходники
│       ├── main.ts                   # Общий скрипт / логика кабинета
│       ├── catalog.ts                # Логика каталога
│       ├── cabinet.ts                # Логика кабинета
│       ├── projects.ts               # Логика страницы проектов
│       ├── burger.ts                 # Мобильное меню (главная)
│       ├── auth/
│       │   ├── AuthService.ts        # Сервис авторизации
│       │   ├── AuthModal.ts          # Модальное окно входа/регистрации
│       │   ├── FavoritesService.ts   # Сервис избранного
│       │   └── authh.css             # Стили авторизации
│       └── styles/
│           ├── style.css             # Основные стили
│           ├── cataloge.css          # Стили каталога
│           ├── cabinet.css           # Стили кабинета
│           └── project.css           # Стили проектов
│
├── .gitignore
└── README.md
```

> **Важно:** папка `public/` лежит **в корне `frontend/`**, а не внутри `src/`.  
> Vite раздаёт её содержимое по адресу `/`, поэтому в HTML путь к логотипу — `/images/logo.png` (**без** `public/`).

---

## Требования

- Node.js версии 16 или выше
- npm (устанавливается вместе с Node.js)
- Современный браузер (Chrome, Firefox, Edge, Safari)

---

## Установка

### 1. Клонирование репозитория

```bash
git clone https://github.com/zeludkovdenis89-ship-it/premium-furniture-website-.git
cd premium-furniture-website-
```

### 2. Установка зависимостей бэкенда

```bash
cd backend
npm install
```

### 3. Установка зависимостей фронтенда (Vite)

```bash
cd ../frontend
npm install
```

Это установит `vite` и `typescript` в `frontend/node_modules/`. Отдельно `serve` больше не нужен — его роль выполняет Vite.

---

## Настройка окружения

Создай файл `.env` в папке `backend` со следующим содержимым:

```env
JWT_SECRET=ваш_секретный_ключ_для_access_токена
JWT_REFRESH_SECRET=ваш_секретный_ключ_для_refresh_токена
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
PORT=3001
```

### Генерация секретных ключей

Выполни в терминале:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Скопируй результат в `.env`. Повтори для второго ключа.

---

## Запуск

Нужно **два терминала**: один для бэкенда, второй для фронтенда.

### Терминал 1 — Бэкенд

```bash
cd backend
node server.js
```

Ожидаемый вывод:

```text
✔ Подключено к SQLite БД
✔ Таблица users готова
✔ Таблица favorites готова
✔ Индексы созданы
✔ Сервер запущен на http://localhost:3001
🔒 Безопасность: JWT_SECRET установлен
🔒 CORS: разрешены только доверенные домены
🔒 Rate Limiting: активен
🔒 Helmet: активен
```

### Терминал 2 — Фронтенд (Vite)

```bash
cd frontend
npm run dev
```

Ожидаемый вывод:

```text
  VITE v7.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Открытие сайта

В браузере открой:

```text
http://localhost:5173/
```

Конкретные страницы:

```text
http://localhost:5173/index.html
http://localhost:5173/catalog.html
http://localhost:5173/cabinet.html
http://localhost:5173/projects.html
```

> **HMR работает автоматически:** правь `.ts` или `.css` файл — браузер обновится сам, без перезагрузки.

---

## Разработка

### Основные команды

| Задача | Команда |
|--------|---------|
| Запустить dev-сервер | `cd frontend && npm run dev` |
| Проверка типов (без сборки) | `cd frontend && npm run typecheck` |
| Production-сборка | `cd frontend && npm run build` |
| Просмотр production-сборки | `cd frontend && npm run preview` |
| Запустить бэкенд | `cd backend && node server.js` |
| Автозапуск бэкенда | `cd backend && npx nodemon server.js` |
| Сгенерировать секрет | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

### Что происходит под капотом

- `npm run dev` — Vite компилирует TS **в памяти**, не создаёт `.js` в `src/`.
- `npm run typecheck` — прогоняет `tsc --noEmit`, проверяет типы, ничего не пишет на диск.
- `npm run build` — сначала проверка типов, потом сборка в `frontend/dist/`.
- `npm run preview` — локальный просмотр `dist/`.

### Пути к ассетам — правило Vite

Всё, что лежит в `frontend/public/`, доступно с корня `/`. Префикс `public` **никогда** не пишется:

```html
<!-- Правильно -->
<img src="/images/logo.png" />
<img src="/images/hero-bg.jpg" />
<source src="/videos/4935202_House_Furniture_1280x720.mp4" type="video/mp4" />

<!-- Неправильно -->
<img src="./public/images/logo.png" />
```

В динамическом HTML внутри `.ts` — те же пути:

```ts
const html = `
  <div class="auth-modal__logo">
    <img src="/images/logo.png" alt="Manomaestro" />
  </div>
`;
```

### Импорты в TypeScript

Vite сам разрешает `.ts` и `.css`, расширения писать не нужно:

```ts
// Правильно
import './styles/style.css';
import AuthService from './auth/AuthService';
import './auth/authh.css';

// Неправильно (Vite не найдёт файл)
import AuthService from './auth/AuthService.js';
```

### Отладка

В `vite.config.ts` включён `build.sourcemap: true`. В DevTools (вкладка **Sources**) видны оригинальные `.ts`-файлы, а не скомпилированный код.

### Проксирование API (обход CORS)

В `vite.config.ts` настроен прокси `/api` → `http://localhost:3001`. Это позволяет фронтенду обращаться к бэкенду **без CORS-ошибок** при разработке:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
},
```

Если прокси не используется — обязательно добавь `http://localhost:5173` в `allowedOrigins` в `backend/server.js`.

---

## Функционал

### Главная страница (`index.html`)
- Hero-блок с фоном и CTA
- Блок «О бренде» с фактами
- Preloader с логотипом
- Навигация, мобильное меню (бургер)

### Каталог (`catalog.html`)
- Просмотр всех товаров
- Детальная информация (материал, размеры, вес, гарантия)
- Информация о мастере для каждого товара
- Добавление товаров в избранное

### Проекты (`projects.html`)
- Hero-секция с медиа
- Статистика (реализованные проекты, годы опыта и т.д.)
- Карусель избранных проектов с навигацией
- Отзывы клиентов по каждому проекту

### Избранное
- Добавление и удаление товаров
- Просмотр списка избранного в личном кабинете
- Сохранение между сессиями

### Авторизация
- Регистрация по номеру телефона с подтверждением по SMS-коду
- Вход по email или телефону
- JWT-токены с автоматическим обновлением
- Блокировка после 5 неудачных попыток входа
- Фильтр запрещённых слов в имени

### Личный кабинет (`cabinet.html`)
- Редактирование профиля (имя, email, телефон)
- Загрузка аватарки
- Просмотр избранного
- **Смена пароля** (с проверкой текущего и инвалидацией старых токенов)
- История заказов с фильтрами по статусу

---

## Безопасность

В проекте реализованы:

- Хеширование паролей через `bcryptjs`
- JWT-токены с коротким сроком жизни и refresh-токенами
- Helmet для безопасных HTTP-заголовков
- CORS с ограничением доверенных доменов
- Rate Limiting для защиты от брутфорса и DDoS
- Валидация входных данных через `express-validator`
- Автоблокировка аккаунта после неудачных попыток входа
- Параметризованные SQL-запросы (защита от инъекций)
- Ограничение размера загружаемых файлов
- Фильтр запрещённых слов в имени пользователя
- **Инвалидация access-токенов при смене пароля** (`token_version`)

---

## API Endpoints

### Авторизация

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/refresh` | Обновление access-токена |
| POST | `/api/auth/logout` | Выход |
| GET | `/api/auth/me` | Данные текущего пользователя |
| PUT | `/api/auth/profile` | Обновление профиля |
| PUT | `/api/auth/avatar` | Обновление аватарки |
| PUT | `/api/auth/password` | Смена пароля |

### Избранное

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/favorites` | Список избранного |
| POST | `/api/favorites` | Добавить товар |
| DELETE | `/api/favorites/:productId` | Удалить товар |

---

## Структура базы данных

### Таблица `users`

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER | PRIMARY KEY |
| `name` | TEXT | Имя пользователя |
| `email` | TEXT | UNIQUE, может быть NULL |
| `phone` | TEXT | UNIQUE, NOT NULL |
| `password` | TEXT | Хеш пароля |
| `avatar` | TEXT | Base64 изображение |
| `refresh_token` | TEXT | Текущий refresh-токен |
| `token_version` | INTEGER | Версия токена (инвалидация) |
| `login_attempts` | INTEGER | Число неудачных попыток |
| `locked_until` | DATETIME | Время разблокировки |
| `created_at` | DATETIME | Дата создания |
| `updated_at` | DATETIME | Дата обновления |

### Таблица `favorites`

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | INTEGER | PRIMARY KEY |
| `user_id` | INTEGER | FOREIGN KEY → users.id |
| `product_id` | INTEGER | ID товара |
| `product_type` | TEXT | Тип товара |
| `product_title` | TEXT | Название |
| `product_price` | TEXT | Цена |
| `product_image` | TEXT | Путь к картинке |
| `product_category` | TEXT | Категория |
| `product_description` | TEXT | Описание |
| `created_at` | DATETIME | Дата добавления |

---

## Решение проблем

### Порт уже используется

```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

Либо поменяй `PORT` в `backend/.env`. Для Vite порт по умолчанию — `5173`; если занят, Vite сам предложит `5174`.

### CORS-ошибка

**Вариант 1 (рекомендуется):** настроить прокси в `vite.config.ts` — тогда CORS вообще не срабатывает, потому что фронт и бэк общаются через один origin.

**Вариант 2:** убедиться, что `http://localhost:5173` есть в `allowedOrigins` в `backend/server.js`.

### База данных не создаётся

Проверь, что папка `backend/db` существует. Если нет — создай вручную.

### Токен не работает после перезапуска сервера

Проверь, что `.env` лежит в `backend/` рядом с `server.js` и что `JWT_SECRET` / `JWT_REFRESH_SECRET` заполнены.

### 404 на CSS, JS или картинки

Открой DevTools → **Network** → обнови страницу. Найди красную строку, посмотри `Request URL`. Сравни с реальным расположением файла.

**Правило Vite:** файлы из `public/` доступны как `/images/...`, `/videos/...` — **без** `public/`.

### Preloader не исчезает

Открой DevTools → **Console**, проверь ошибки. Если JS падает при загрузке — preloader останется. Частая причина: путь к картинке с `./public/`, который Vite не находит.

### Логотип не отображается в модалке авторизации

В `AuthModal.ts` путь должен быть `/images/logo.png` (без `public`). После правки перезапусти `npm run dev`.

### Vite открывает `index.html`, а не `projects.html`

Проверь, что `projects.html` лежит **в корне `frontend/`** (рядом с `index.html`), а не в `src/` или `pages/`.

Также убедись, что в `vite.config.ts` указан `rollupOptions.input` со всеми 4 HTML-файлами — иначе при `npm run build` соберётся только `index.html`.

### `npm install` падает с `No matching version found`

В `package.json` указана несуществующая версия зависимости. Проверь:

```bash
npm view vite version
```

Замени версию на актуальную или установи через:

```bash
npm install -D vite@latest typescript@latest
```

### Сборка падает на `tsc --noEmit`

Сначала проверь типы отдельно:

```bash
cd frontend
npm run typecheck
```

Ошибка укажет файл и строку. После исправления `npm run build` пройдёт.

---

## Полезные команды

| Задача | Команда |
|--------|---------|
| Запустить фронтенд (dev) | `cd frontend && npm run dev` |
| Проверка типов | `cd frontend && npm run typecheck` |
| Production-сборка | `cd frontend && npm run build` |
| Просмотр production-сборки | `cd frontend && npm run preview` |
| Запустить бэкенд | `cd backend && node server.js` |
| Автозапуск бэкенда | `cd backend && npx nodemon server.js` |
| Сгенерировать секрет | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| Проверить версию TS | `cd frontend && npx tsc --version` |

---

## `.gitignore` (рекомендуемый)

```gitignore
# =========================================================
# ЗАВИСИМОСТИ
# =========================================================
node_modules/
backend/node_modules/
frontend/node_modules/

# =========================================================
# СБОРКА И АРТЕФАКТЫ КОМПИЛЯЦИИ
# =========================================================
dist/
build/
frontend/dist/

# Скомпилированные TS (на случай старой сборки)
frontend/src/**/*.js
frontend/src/**/*.js.map
!frontend/src/**/*.d.ts

# Кэш Vite
.vite/
frontend/.vite/

# Кэш TypeScript
*.tsbuildinfo
frontend/*.tsbuildinfo

# =========================================================
# БАЗА ДАННЫХ
# =========================================================
backend/db/*.sqlite
backend/db/*.sqlite3
backend/db/*.sqlite-journal
*.sqlite
*.sqlite3
*.db

# =========================================================
# ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (СЕКРЕТЫ!)
# =========================================================
.env
.env.*
backend/.env
backend/.env.*
!.env.example

# =========================================================
# ЛОГИ
# =========================================================
*.log
logs/

# =========================================================
# СИСТЕМНЫЕ ФАЙЛЫ И РЕДАКТОРЫ
# =========================================================
.DS_Store
Thumbs.db
desktop.ini

.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.swp
*.swo
*~

# =========================================================
# ВРЕМЕННЫЕ ФАЙЛЫ
# =========================================================
.cache/
.temp/
.tmp/
*.bak

# =========================================================
# ТЕСТЫ И ПОКРЫТИЕ
# =========================================================
coverage/
.nyc_output/
```

> **`package-lock.json` НЕ игнорируется** — его нужно коммитить, чтобы у всех вставали одинаковые версии зависимостей.

---

## Лицензия

Проект создан в образовательных целях.

---

## Автор

**Денис Желудков**

- GitHub: [https://github.com/zeludkovdenis89-ship-it](https://github.com/zeludkovdenis89-ship-it)
- Проект: [premium-furniture-website-](https://github.com/zeludkovdenis89-ship-it/premium-furniture-website-)
