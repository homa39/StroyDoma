require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cron = require('node-cron');


// Импорт серверных функций из backend-части
const {
  getHouses,
  addHouse,
  updateHouse,
  deleteHouse,
  syncGoogleSheets
} = require('./src/services/adminApi');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // обслуживаем HTML, CSS, JS

// ==== API endpoints ====
// Дома
app.get('/api/houses', getHouses);
app.post('/api/houses', addHouse);
app.put('/api/houses/:id', updateHouse);
app.delete('/api/houses/:id', deleteHouse);

// Новости
const {
  getNews,
  addNews,
  updateNews,
  deleteNews,
  syncNewsFromSheets
} = require('./src/services/newsApi');

app.get('/api/news', getNews);
app.post('/api/news', addNews);
app.put('/api/news/:id', updateNews);
app.delete('/api/news/:id', deleteNews);

// Периодическая синхронизация с Google Sheets (раз в час)
cron.schedule('0 * * * *', async () => {
  try {
    await syncGoogleSheets();
    console.log('✅ Google Sheets синхронизация завершена (cron)');
  } catch (err) {
    console.error('❌ Ошибка при синхронизации:', err);
  }
});

// ⏱ Синхронизация при запуске
(async () => {
  try {
    await syncGoogleSheets();
    await syncNewsFromSheets();
    
    console.log('✅ Google Sheets синхронизация при запуске завершена');
    // Обработка маршрута для просмотра отдельной новости
    app.get('/news/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'news.html'));
    });

    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Ошибка при старте и синхронизации:', err);
  }
})();
