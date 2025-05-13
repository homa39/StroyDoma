// Функция для загрузки домов из API
async function loadHouses() {
    try {
        const response = await fetch('/api/houses');
        const houses = await response.json();
        displayHouses(houses);
        populateHouseSelect(houses);
    } catch (error) {
        console.error('Error loading houses:', error);
        showError('Не удалось загрузить каталог домов');
    }
}
const message = encodeURIComponent(
    `Здравствуйте! Меня заинтересовал проект дома:\n\n` +
    `🏠 Название: ${house.name}\n` +
    `📐 Площадь: ${house.area} м²\n` +
    `🏢 Этажей: ${house.floors}\n` +
    `🧱 Материалы: ${house.materials}\n` +
    `💰 Цена: ${formatPrice(house.price)}`
  );
  

  
// Функция для отображения домов в каталоге
function displayHouses(houses) {
    const container = document.getElementById('houses-container');
    container.innerHTML = '';

    houses.forEach(house => {
        const card = createHouseCard(house);
        container.appendChild(card);
    });
}

// Функция для создания карточки дома
function createHouseCard(house) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4 fade-in';
  
    const message = encodeURIComponent(
      `Здравствуйте! Меня заинтересовал проект дома:\n\n` +
      `🏠 Название: ${house.name}\n` +
      `📐 Площадь: ${house.area} м²\n` +
      `🏢 Этажей: ${house.floors}\n` +
      `🧱 Материалы: ${house.materials}\n` +
      `💰 Цена: ${formatPrice(house.price)}`
    );
  
    const telegramLink = `https://t.me/StroyDomaBot?text=${message}`;

  
    col.innerHTML = `
      <div class="card house-card">
        <img src="${house.imageUrl}" class="card-img-top" alt="${house.name}">
        <div class="card-body">
          <h5 class="card-title">${house.name}</h5>
          <p class="card-text">
            <strong>Площадь:</strong> ${house.area} м²<br>
            <strong>Этажность:</strong> ${house.floors}<br>
            <strong>Материалы:</strong> ${house.materials}<br>
            <strong>Цена:</strong> ${formatPrice(house.price)}
          </p>
          <a href="${telegramLink}" class="btn btn-primary" target="_blank">
            Хочу этот дом
          </a>
        </div>
      </div>
    `;
  
    return col;
  }
  

// Функция для заполнения select в форме заявки
function populateHouseSelect(houses) {
    const select = document.getElementById('house');
    houses.forEach(house => {
        const option = document.createElement('option');
        option.value = house.uuid;
        option.textContent = house.name;
        select.appendChild(option);
    });
}

// Функция для форматирования цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
    }).format(price);
}

// Обработчик отправки формы
document.getElementById('requestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        houseId: document.getElementById('house').value
    };

    try {
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showSuccess('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
            document.getElementById('requestForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('requestModal')).hide();
        } else {
            throw new Error('Ошибка при отправке заявки');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showError('Не удалось отправить заявку. Пожалуйста, попробуйте позже.');
    }
});

// Функция для отображения уведомлений
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'danger');
}



// Загрузка домов при загрузке страницы
document.addEventListener('DOMContentLoaded', loadHouses); 