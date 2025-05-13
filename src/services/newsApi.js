const axios = require('axios');
require('dotenv').config();

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SHEET_NAME = 'Новости';

let cachedNews = [];
let lastSyncTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут в миллисекундах

// Функция для обработки URL изображения
function processImageUrl(url) {
  if (!url) return 'images/news-placeholder.jpg';
  
  // Если URL начинается с http или https, оставляем как есть
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Если это ID изображения из Google Drive
  if (url.includes('drive.google.com')) {
    // Преобразуем URL для прямого доступа к изображению
    const fileId = url.match(/[-\w]{25,}/);
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId[0]}`;
    }
  }
  
  // Если это локальный путь, добавляем слеш в начало
  if (!url.startsWith('/')) {
    return '/' + url;
  }
  
  return url;
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function syncNewsFromSheets(retryCount = 0) {
  try {
    // Проверяем кэш
    if (lastSyncTime && (Date.now() - lastSyncTime) < CACHE_DURATION) {
      console.log('🔄 Используем кэшированные новости');
      return cachedNews;
    }

    if (!SHEET_ID || !API_KEY || !SHEET_NAME) {
      console.error('❌ Отсутствуют необходимые переменные окружения для Google Sheets');
      return [];
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    
    try {
      const response = await axios.get(url);
      const rows = response.data.values;

      if (!rows || rows.length <= 1) {
        console.log('🟡 Нет новостей для загрузки');
        cachedNews = [];
        return cachedNews;
      }

      const headers = rows[0];
      const getIndex = (name) => headers.indexOf(name);

      cachedNews = rows.slice(1).map((row, i) => ({
        id: i + 1,
        title: row[getIndex("Заголовок")] || '',
        content: row[getIndex("Текст")] || '',
        imageUrl: processImageUrl(row[getIndex("Изображение")] || '')
      })).filter(n => n.title && n.content);
      
      lastSyncTime = Date.now();
      console.log(`✅ Загружено новостей: ${cachedNews.length}`);
      return cachedNews;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 429 && retryCount < 3) {
          console.log(`🔄 Превышен лимит запросов. Повторная попытка ${retryCount + 1}/3...`);
          await delay(2000 * (retryCount + 1));
          return syncNewsFromSheets(retryCount + 1);
        }
        console.error(`❌ Ошибка Google Sheets API: ${error.response.status} - ${error.response.statusText}`);
      } else {
        console.error('❌ Ошибка при запросе к Google Sheets:', error.message);
      }
      return cachedNews;
    }
  } catch (err) {
    console.error('❌ Неожиданная ошибка:', err.message);
    return cachedNews;
  }
}

function getNews(req, res) {
  res.json(cachedNews);
}

function addNews(req, res) {
  res.status(403).json({ error: 'Добавление отключено — используется Google Sheets.' });
}

function updateNews(req, res) {
  res.status(403).json({ error: 'Редактирование отключено — используется Google Sheets.' });
}

function deleteNews(req, res) {
  res.status(403).json({ error: 'Удаление отключено — используется Google Sheets.' });
}

module.exports = {
  getNews,
  addNews,
  updateNews,
  deleteNews,
  syncNewsFromSheets
};
