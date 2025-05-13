
const axios = require('axios');

const SHEET_ID = '156uCCvbVBXqIJNnmgCTA5s0B-jnYaR9VOmHGFteeywc';
const API_KEY = 'AIzaSyClNz_9vW5XH1rzjOHNGebVy5d_XQ6y48o';
const SHEET_NAME = 'Новости';

let cachedNews = [];

async function syncNewsFromSheets() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    const response = await axios.get(url);
    const rows = response.data.values;

    if (!rows || rows.length <= 1) {
      console.log('🟡 Нет новостей для загрузки');
      cachedNews = [];
      return;
    }

    const headers = rows[0];
    const getIndex = (name) => headers.indexOf(name);

    cachedNews = rows.slice(1).map((row, i) => ({
      id: i + 1,
      title: row[getIndex("Заголовок")] || '',
      content: row[getIndex("Текст")] || '',
      created_at: row[getIndex("Дата")] || ''
    })).filter(n => n.title && n.content);
    
    console.log(`✅ Загружено новостей: ${cachedNews.length}`);
  } catch (err) {
    console.error("❌ Ошибка при загрузке новостей из Google Sheets:", err.message);
    cachedNews = [];
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
