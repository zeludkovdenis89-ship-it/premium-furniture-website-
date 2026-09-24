# Manomaestro — Премиальный сайт мебели

Сайт для компании, занимающейся изготовлением мебели ручной работы.  
Включает каталог товаров, избранное, личный кабинет, портфолио проектов и систему авторизации.

---

## Технологии

### Фронтенд
- TypeScript
- HTML5 / CSS3
- ES-модули (`<script type="module">`)
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
├── frontend/                         # Фронтенд
│   ├── index.html                    # Главная страница
│   ├── catalog.html                  # Каталог товаров
│   ├── cabinet.html                  # Личный кабинет
│   ├── projects.html                 # Портфолио проектов
│   ├── tsconfig.json                 # Конфиг TypeScript
│   │
│   ├── public/                       # Статические ассеты
│   │   ├── images/                   # Картинки (логотип, товары, проекты)
│   │   │   ├── logo.png
│   │   │   ├── hero-bg.jpg
│   │   │   └── ...
│   │   └── videos/                   # Видео
│   │       └── 4935202_House_Furniture_1280x720.mp4
│   │
│   └── src/                          # Исходники
│       ├── main.ts                   # Общий скрипт сайта
│       ├── catalog.ts                # Логика каталога
│       ├── cabinet.ts                # Логика кабинета
│       ├── projects.ts               # Логика страницы проектов
│       ├── burger.ts                 # Мобильное меню
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

### 3. Установка `serve` (для фронтенда)

```bash
npm install -g serve
```

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
Подключено к SQLite БД
Таблица users готова
Таблица favorites готова
Индексы созданы
Сервер запущен на http://localhost:3001
Безопасность: JWT_SECRET установлен
CORS: разрешены только доверенные домены
Rate Limiting: активен
Helmet: активен
```

### Терминал 2 — Фронтенд

Сначала скомпилируй TypeScript:

```bash
cd frontend
npx tsc
```

Затем запусти статический сервер:

```bash
npx serve -p 8000
```

Ожидаемый вывод:

```text
Serving!

Local:   http://localhost:8000
Network: http://192.168.x.x:8000
```

### Открытие сайта

В браузере:

```text
http://localhost:8000
```

Конкретные страницы:

```text
http://localhost:8000/index.html
http://localhost:8000/catalog.html
http://localhost:8000/cabinet.html
http://localhost:8000/projects.html
```

> **Важно:** `serve` должен быть запущен **из папки `frontend/`**, где лежат HTML-файлы. Если запустить из корня проекта — `serve` покажет листинг директории вместо сайта.

---

## Разработка

### Компиляция TypeScript

После изменений в `.ts` файлах:

```bash
cd frontend
npx tsc
```

В режиме наблюдения (автосборка при сохранении):

```bash
npx tsc --watch
```

Скомпилированные `.js` и `.js.map` появятся рядом с `.ts` в `frontend/src/`. Именно их грузит браузер через `<script type="module">`.

### Пути к ассетам — важное правило

Путь в HTML и в динамически создаваемом HTML (из `.ts`) считается **от HTML-страницы**, а не от `.ts`-файла.

Так как все HTML лежат в корне `frontend/`, правильные пути:

```html
<!-- Стили -->
<link rel="stylesheet" href="./src/styles/style.css" />
<link rel="stylesheet" href="./src/auth/authh.css" />

<!-- Картинки -->
<img src="./public/images/logo.png" />
<img src="./public/images/hero-bg.jpg" />

<!-- Видео -->
<source src="./public/videos/4935202_House_Furniture_1280x720.mp4" type="video/mp4" />

<!-- Скрипты -->
<script type="module" src="./src/main.js"></script>
```

В динамическом HTML внутри `.ts` — те же пути:

```ts
const html = `
  <div class="auth-modal__logo">
    <img src="./public/images/logo.png" alt="Manomaestro" />
  </div>
`;
```

> Если позже перейдёшь на webpack с `copy-webpack-plugin`, пути поменяются на `/images/...`, `/videos/...` (без `public`). Правится в одном месте, если вынести префикс в константу:
> ```ts
> export const ASSETS = './public/images';
> // ...
> img.src = `${ASSETS}/logo.png`;
> ```

### Отладка через source maps

В `tsconfig.json` включён `"sourceMap": true`. В DevTools (вкладка **Sources**) ты увидишь оригинальные `.ts`-файлы, а не скомпилированный `.js`. Это сильно упрощает поиск ошибок.

Файлы `.js.map` генерируются автоматически. Добавь их в `.gitignore`:

```gitignore
*.js.map
```

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
- Смена пароля
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
| `token_version` | INTEGER | Версия токена |
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

Либо поменяй `PORT` в `backend/.env`.

### CORS-ошибка

Убедись, что фронтенд запущен на порту `8000`. Если другой — добавь его в массив `allowedOrigins` в `backend/server.js`.

### База данных не создаётся

Проверь, что папка `backend/db` существует. Если нет — создай вручную.

### Токен не работает после перезапуска сервера

Проверь, что `.env` лежит в `backend/` рядом с `server.js`.

### Открывается «Index of /» вместо сайта

`serve` запущен не из той папки. Запусти его из `frontend/`, где лежит `index.html`:

```bash
cd frontend
npx serve -p 8000
```

### 404 на CSS, JS или картинки

Открой DevTools → **Network** → обнови страницу. Найди красную строку, посмотри `Request URL`. Сравни с реальным расположением файла. Скорее всего, путь в HTML не совпадает с фактическим.

Помни правило: **путь считается от HTML-страницы**, а не от `.ts`-файла.

### Preloader не исчезает

Проверь в DevTools → **Console**, нет ли ошибок. Если скрипт падает, обработчик события `load` не сработает, и preloader останется на экране.

### Логотип не отображается в модалке авторизации

В `AuthModal.ts` путь должен быть `./public/images/logo.png`, а не `logo.png`. После правки — пересобрать: `npx tsc`.

### `.js.map` появляются в git

Добавь в `frontend/.gitignore`:

```gitignore
*.js.map
```

---

## Полезные команды

| Задача | Команда |
|--------|---------|
| Собрать TS | `cd frontend && npx tsc` |
| Автосборка TS | `cd frontend && npx tsc --watch` |
| Запустить фронтенд | `cd frontend && npx serve -p 8000` |
| Запустить бэкенд | `cd backend && node server.js` |
| Автозапуск бэкенда | `cd backend && npx nodemon server.js` |
| Сгенерировать секрет | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| Проверить версию TS | `npx tsc --version` |

---

## `.gitignore` (рекомендуемый)

```gitignore
# Зависимости
node_modules/

# Сборка
dist/
frontend/src/**/*.js
frontend/src/**/*.js.map

# Секреты
.env

# База данных
backend/db/*.sqlite
backend/db/*.sqlite-journal

# ОС и редакторы
.DS_Store
Thumbs.db
.vscode/
.idea/
```

> **Внимание:** если ты коммитишь скомпилированные `.js` (например, для GitHub Pages), убери строки `frontend/src/**/*.js` и `*.js.map` из `.gitignore`.

---

## Лицензия

Проект создан в образовательных целях.

---

## Автор

**Денис Желудков**

- GitHub: [https://github.com/zeludkovdenis89-ship-it](https://github.com/zeludkovdenis89-ship-it)
- Проект: [premium-furniture-website-](https://github.com/zeludkovdenis89-ship-it/premium-furniture-website-)
