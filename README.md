# СтройДома - Сайт строительной компании

Современный сайт для строительной компании, специализирующейся на строительстве частных домов. Включает каталог проектов с интеграцией Google Таблицы, форму заявки и возможность связи через Telegram.

## Технологии

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Bootstrap 5, Vanilla JavaScript
- **Интеграции**: Google Sheets API, Telegram Bot API
- **База данных**: SQLite (опционально)

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/stroydoma.git
cd stroydoma
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Заполните необходимые переменные окружения в файле `.env`:
- `PORT` - порт для запуска сервера (по умолчанию 3000)
- `GOOGLE_SHEET_ID` - ID вашей Google таблицы
- `GOOGLE_CREDENTIALS` - JSON с учетными данными Google API
- `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота
- `TELEGRAM_CHAT_ID` - ID чата для получения уведомлений

## Настройка Google Sheets API

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com)
2. Создайте новый проект
3. Включите Google Sheets API
4. Создайте сервисный аккаунт и скачайте JSON с учетными данными
5. Предоставьте доступ к вашей Google таблице для email сервисного аккаунта

## Настройка Telegram Bot

1. Создайте нового бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Добавьте токен в файл `.env`

## Запуск

Для разработки:
```bash
npm run dev
```

Для продакшена:
```bash
npm start
```

Сайт будет доступен по адресу: `http://localhost:3000`

## Структура проекта

```
stroydoma/
├── src/
│   ├── server.js
│   └── services/
│       └── googleSheets.js
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── .env
├── .env.example
├── package.json
└── README.md
```

## Функциональность

- Каталог проектов домов с данными из Google Таблицы
- Форма обратной связи
- Интеграция с Telegram для связи
- Адаптивный дизайн
- Административная панель (опционально)

## Лицензия

MIT 