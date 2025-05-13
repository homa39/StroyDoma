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

// Обработка формы заявки
document.addEventListener('DOMContentLoaded', function() {
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('requestName').value,
                phone: document.getElementById('requestPhone').value,
                type: document.getElementById('requestType').value,
                message: document.getElementById('requestMessage').value
            };

            // Формируем сообщение для WhatsApp
            const whatsappMessage = `Новая заявка!\n\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nТип заявки: ${formData.type}${formData.message ? '\nСообщение: ' + formData.message : ''}`;
            const whatsappUrl = `https://wa.me/79001234567?text=${encodeURIComponent(whatsappMessage)}`;

            // Открываем WhatsApp с предзаполненным сообщением
            window.open(whatsappUrl, '_blank');

            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('requestModal'));
            modal.hide();

            // Очищаем форму
            requestForm.reset();

            // Показываем уведомление об успешной отправке
            alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
        });
    }

    // Маска для телефона
    const phoneInput = document.getElementById('requestPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+7 (' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
        });
    }
});

// Обработка формы обратной связи
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('contactName').value,
                phone: document.getElementById('contactPhone').value,
                email: document.getElementById('contactEmail').value,
                message: document.getElementById('contactMessage').value
            };

            // Формируем сообщение для WhatsApp
            const whatsappMessage = `Новое сообщение с сайта!\n\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nEmail: ${formData.email}\nСообщение: ${formData.message}`;
            const whatsappUrl = `https://wa.me/79001234567?text=${encodeURIComponent(whatsappMessage)}`;

            // Открываем WhatsApp с предзаполненным сообщением
            window.open(whatsappUrl, '_blank');

            // Очищаем форму
            contactForm.reset();

            // Показываем уведомление об успешной отправке
            alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
        });

        // Маска для телефона в форме обратной связи
        const contactPhoneInput = document.getElementById('contactPhone');
        if (contactPhoneInput) {
            contactPhoneInput.addEventListener('input', function(e) {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
                e.target.value = !x[2] ? x[1] : '+7 (' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
            });
        }
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