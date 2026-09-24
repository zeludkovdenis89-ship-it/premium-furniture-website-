# Manomaestro — Премиальный сайт мебели

Сайт для компании, занимающейся изготовлением мебели ручной работы.  
Включает каталог товаров, избранное, личный кабинет и систему авторизации.

## Технологии

### Фронтенд
- TypeScript
- HTML5 / CSS3
- Fetch API
- Модульная архитектура

### Бэкенд
- Node.js
- Express
- SQLite3
- JSON Web Tokens (access + refresh)
- bcryptjs для хеширования паролей
- Helmet для защиты HTTP-заголовков
- express-rate-limit для защиты от брутфорса
- express-validator для валидации данных
- dotenv для хранения секретов

## Структура проекта

```text
premium-furniture-website-/
├── backend/                     # Бэкенд сервер
│   ├── server.js                # Главный файл сервера
│   ├── package.json             # Зависимости бэкенда
│   └── db/                      # Папка с базой данных
│       └── database.sqlite      # SQLite база (создается автоматически)
├── auth/                        # Модули авторизации
│   ├── AuthService.ts           # Сервис авторизации
│   ├── AuthModal.ts             # Модальное окно входа/регистрации
│   ├── FavoritesService.ts      # Сервис избранного
│   └── authh.css                # Стили авторизации
├── catalog.html                 # Страница каталога
├── catalog.ts                   # Логика каталога
├── cabinet.html                 # Личный кабинет
├── cabinet.ts                   # Логика кабинета
├── main.ts                      # Общий скрипт сайта
├── style.css                    # Основные стили
├── cataloge.css                 # Стили каталога
├── cabinet.css                  # Стили кабинета
└── README.md                    # Документация
```

## Требования

- Node.js версии 16 или выше
- npm (устанавливается вместе с Node.js)
- Современный браузер (Chrome, Firefox, Edge, Safari)

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

### 3. Установка глобальных зависимостей

Для запуска фронтенда потребуется `serve`:

```bash
npm install -g serve
```

## Настройка окружения

Создайте файл `.env` в папке `backend` со следующим содержимым:

```env
JWT_SECRET=ваш_секретный_ключ_для_access_токена
JWT_REFRESH_SECRET=ваш_секретный_ключ_для_refresh_токена
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
PORT=3001
```

### Генерация секретных ключей

Выполните команду в терминале для генерации безопасных ключей:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Скопируйте полученный ключ и вставьте в `.env`. Повторите для второго ключа.

## Запуск

Для работы сайта необходимо запустить два сервера: бэкенд и фронтенд.

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

Откройте браузер и перейдите по адресу:

```text
http://localhost:8000
```

## Функционал

### Каталог товаров
- Просмотр всех товаров
- Детальная информация о каждом товаре
- Добавление товаров в избранное
- Информация о мастерах

### Избранное
- Добавление и удаление товаров
- Просмотр списка избранного в личном кабинете
- Сохранение между сессиями

### Авторизация
- Регистрация по номеру телефона
- Вход по email или телефону
- JWT-токены с автоматическим обновлением
- Блокировка после 5 неудачных попыток входа

### Личный кабинет
- Редактирование профиля (имя, email, телефон)
- Загрузка аватарки
- Просмотр избранного
- Смена пароля
- История заказов

## Безопасность

В проекте реализованы следующие меры защиты:

- Хеширование паролей через bcryptjs
- JWT-токены с коротким сроком жизни и refresh-токенами
- Helmet для установки безопасных HTTP-заголовков
- CORS с ограничением доверенных доменов
- Rate Limiting для защиты от брутфорса и DDoS
- Валидация всех входных данных через express-validator
- Автоматическая блокировка аккаунта после неудачных попыток входа
- Параметризованные SQL-запросы для защиты от инъекций
- Ограничение размера загружаемых файлов

## API Endpoints

### Авторизация

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/auth/register` | Регистрация нового пользователя |
| POST | `/api/auth/login` | Вход в систему |
| POST | `/api/auth/refresh` | Обновление access-токена |
| POST | `/api/auth/logout` | Выход из системы |
| GET | `/api/auth/me` | Получение данных текущего пользователя |
| PUT | `/api/auth/profile` | Обновление профиля |
| PUT | `/api/auth/avatar` | Обновление аватарки |

### Избранное

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/favorites` | Получение списка избранного |
| POST | `/api/favorites` | Добавление товара в избранное |
| DELETE | `/api/favorites/:productId` | Удаление товара из избранного |

## Разработка

### Компиляция TypeScript

Если вы вносите изменения в `.ts` файлы, их нужно скомпилировать в `.js`:

```bash
npx tsc
```

Или используйте режим наблюдения:

```bash
npx tsc --watch
```

### Структура базы данных

**Таблица users:**

- `id` — INTEGER, PRIMARY KEY
- `name` — TEXT
- `email` — TEXT, UNIQUE, может быть NULL
- `phone` — TEXT, UNIQUE, NOT NULL
- `password` — TEXT, хешированный
- `avatar` — TEXT, base64 изображение
- `refresh_token` — TEXT
- `token_version` — INTEGER
- `login_attempts` — INTEGER
- `locked_until` — DATETIME
- `created_at` — DATETIME
- `updated_at` — DATETIME

**Таблица favorites:**

- `id` — INTEGER, PRIMARY KEY
- `user_id` — INTEGER, FOREIGN KEY
- `product_id` — INTEGER
- `product_type` — TEXT
- `product_title` — TEXT
- `product_price` — TEXT
- `product_image` — TEXT
- `product_category` — TEXT
- `product_description` — TEXT
- `created_at` — DATETIME

## Решение проблем

### Порт уже используется

Если при запуске появляется ошибка `address already in use`:

```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### CORS ошибка

Убедитесь, что фронтенд запущен на порту 8000.  
Если используете другой порт, добавьте его в массив `allowedOrigins` в `server.js`.

### База данных не создается

Проверьте, что папка `backend/db` существует. Если нет, создайте ее вручную.

### Токен не работает после перезапуска сервера

Убедитесь, что файл `.env` находится в папке `backend` рядом с `server.js`.

## Лицензия

Проект создан в образовательных целях.

## Автор

Денис Желудков

GitHub: [https://github.com/zeludkovdenis89-ship-it](https://github.com/zeludkovdenis89-ship-it)
