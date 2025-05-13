const axios = require('axios');

const SHEET_ID = '156uCCvbVBXqIJNnmgCTA5s0B-jnYaR9VOmHGFteeywc';
const API_KEY = 'AIzaSyClNz_9vW5XH1rzjOHNGebVy5d_XQ6y48o';
const SHEET_NAME = 'Лист1';

let cachedHouses = [];

async function syncGoogleSheets() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    const response = await axios.get(url);
    const rows = response.data.values;

    if (!rows || rows.length <= 1) {
      console.log('🟡 Нет данных в таблице');
      cachedHouses = [];
      return cachedHouses;
    }

    const headers = rows[0];
    const getIndex = (name) => headers.indexOf(name);

    cachedHouses = rows.slice(1).map((row, i) => {
      return {
        id: i + 1,
        name: row[getIndex("Название")] || "",
        imageUrl: row[getIndex("Фото")] || "",
        description: row[getIndex("Описание")] || "",
        area: parseInt(row[getIndex("Площадь")]) || 0,
        floors: parseInt(row[getIndex("Этажей")]) || 1,
        materials: row[getIndex("Материалы")] || "",
        price: parseInt(row[getIndex("Цена")]) || 0
      };
    }).filter(h => h.name && h.imageUrl); // фильтрация пустых

    console.log(`✅ Загружено домов из Google Sheets: ${cachedHouses.length}`);
    return cachedHouses;
  } catch (err) {
    console.error('❌ Ошибка загрузки из Google Sheets:', err.message);
    return [];
  }
}

function getHouses(req, res) {
  const { material, floors, minArea } = req.query;
  let filteredHouses = [...cachedHouses];

  // Фильтрация по материалу
  if (material) {
    filteredHouses = filteredHouses.filter(house => 
      house.materials.toLowerCase().includes(material.toLowerCase())
    );
  }

  // Фильтрация по количеству этажей
  if (floors) {
    filteredHouses = filteredHouses.filter(house => 
      house.floors === parseInt(floors)
    );
  }

  // Фильтрация по минимальной площади
  if (minArea) {
    filteredHouses = filteredHouses.filter(house => 
      house.area >= parseInt(minArea)
    );
  }

  res.json(filteredHouses);
}

function addHouse(req, res) {
  return res.status(403).json({ error: 'Добавление отключено — используется Google Sheets.' });
}

function updateHouse(req, res) {
  return res.status(403).json({ error: 'Редактирование отключено — используется Google Sheets.' });
}

function deleteHouse(req, res) {
  return res.status(403).json({ error: 'Удаление отключено — используется Google Sheets.' });
}

module.exports = {
  getHouses,
  addHouse,
  updateHouse,
  deleteHouse,
  syncGoogleSheets
};
