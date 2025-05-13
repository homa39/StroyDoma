// public/js/adminApi.js

let allHouses = [];

export async function loadHousesToCatalog() {
  try {
    const res = await fetch("/api/houses");
    allHouses = await res.json();
    populateFilters();
    renderHouses(allHouses);
  } catch (err) {
    console.error("Ошибка загрузки домов:", err);
  }
}

function populateFilters() {
  const materials = [...new Set(allHouses.map(h => h.materials))];
  const floors = [...new Set(allHouses.map(h => h.floors))];

  const materialSelect = document.getElementById("filterMaterial");
  const floorsSelect = document.getElementById("filterFloors");

  materials.forEach(mat => {
    const opt = document.createElement("option");
    opt.value = mat;
    opt.textContent = mat;
    materialSelect.appendChild(opt);
  });

  floors.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = `${f} этаж(а)`;
    floorsSelect.appendChild(opt);
  });

  materialSelect.addEventListener("change", applyFilters);
  floorsSelect.addEventListener("change", applyFilters);
  document.getElementById("filterArea").addEventListener("input", applyFilters);
}

async function applyFilters() {
  const material = document.getElementById("filterMaterial").value;
  const floors = document.getElementById("filterFloors").value;
  const minArea = document.getElementById("filterArea").value;

  try {
    const queryParams = new URLSearchParams();
    if (material) queryParams.append('material', material);
    if (floors) queryParams.append('floors', floors);
    if (minArea) queryParams.append('minArea', minArea);

    const res = await fetch(`/api/houses?${queryParams.toString()}`);
    const filteredHouses = await res.json();
    renderHouses(filteredHouses);
  } catch (err) {
    console.error("Ошибка при фильтрации:", err);
  }
}

function renderHouses(houses) {
  const container = document.getElementById("houses-container");
  if (!container) {
    console.error("Элемент houses-container не найден");
    return;
  }
  
  container.innerHTML = '';

  if (!houses || houses.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <i class="fas fa-info-circle me-2"></i>
          Нет подходящих домов. Попробуйте изменить параметры фильтрации.
        </div>
      </div>`;
    return;
  }

  houses.forEach(house => {
    if (!house || !house.id) {
      console.error("Некорректные данные дома:", house);
      return;
    }

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 mb-4";

    const message = encodeURIComponent(
      `Здравствуйте! Меня заинтересовал проект дома:\n\n` +
      `🏠 Название: ${house.name}\n` +
      `📐 Площадь: ${house.area} м²\n` +
      `🏢 Этажей: ${house.floors}\n` +
      `🧱 Материалы: ${house.materials}\n` +
      `💰 Цена: ${formatPrice(house.price)}`
    );

    const whatsappUrl = `https://wa.me/79001234567?text=${message}`;
    const viewerUrl = house.link3d ? 
        `${window.location.protocol}//${window.location.hostname}:3001/viewer.html?model=${encodeURIComponent(house.link3d)}&name=${encodeURIComponent(house.name)}&description=${encodeURIComponent(`Площадь: ${house.area} м², ${house.floors} этажа, ${house.materials}`)}` : 
        null;

    // Разбиваем строку с фотографиями на массив
    const photos = house.imageUrl
      .split(';')
      .map(url => url.trim())
      .filter(url => url.length > 0 && url !== 'ссылка'); // Убираем пустые строки и слово "ссылка"
    
    console.log('Photos for house:', house.name, photos); // Для отладки
    
    // Создаем HTML для изображений в зависимости от количества фото
    let imageHtml = '';
    if (photos.length === 1) {
      // Если фото одно, показываем просто изображение
      imageHtml = `
        <img src="${photos[0]}" class="card-img-top" alt="${house.name}" 
          style="height: 200px; object-fit: cover;">
      `;
    } else if (photos.length > 1) {
      // Если фото несколько, показываем карусель
      const carouselId = `carousel-${house.id}`;
      const carouselIndicators = photos.map((_, index) => `
        <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${index}" 
          ${index === 0 ? 'class="active" aria-current="true"' : ''} 
          aria-label="Slide ${index + 1}"></button>
      `).join('');

      const carouselItems = photos.map((photo, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${photo}" class="d-block w-100" alt="${house.name} - фото ${index + 1}" 
            style="height: 200px; object-fit: cover;">
        </div>
      `).join('');

      imageHtml = `
        <div id="${carouselId}" class="carousel slide" data-bs-ride="false">
          <div class="carousel-indicators">
            ${carouselIndicators}
          </div>
          <div class="carousel-inner">
            ${carouselItems}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Предыдущее</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Следующее</span>
          </button>
        </div>
      `;
    } else {
      // Если фотографий нет, показываем заглушку
      imageHtml = `
        <div class="card-img-top bg-light d-flex align-items-center justify-content-center" 
          style="height: 200px;">
          <i class="fas fa-image fa-3x text-muted"></i>
        </div>
      `;
    }

    col.innerHTML = `
      <div class="card house-card h-100 shadow-sm border-0" data-id="${house.id}" style="cursor:pointer;">
        <div class="position-relative">
          ${imageHtml}
          <div class="position-absolute top-0 end-0 m-2 d-flex gap-2">
            <span class="badge bg-primary">${house.area} м²</span>
            ${house.link3d ? `
              <span class="badge bg-info">
                <i class="fas fa-cube me-1"></i>3D
              </span>
            ` : ''}
          </div>
        </div>
        <div class="card-body">
          <h5 class="card-title">${house.name}</h5>
          <p class="card-text small text-muted">
            <i class="fas fa-layer-group me-1"></i> ${house.materials}<br>
            <i class="fas fa-building me-1"></i> ${house.floors} этаж(а)
          </p>
          <div class="d-flex justify-content-between align-items-center">
            <strong class="text-primary">от ${formatPrice(house.price)}</strong>
            <div class="d-grid gap-2">
              <a href="${whatsappUrl}" class="btn btn-primary" target="_blank">
                Хочу этот дом
              </a>
              ${viewerUrl ? `
                <a href="${viewerUrl}" class="btn btn-outline-info" target="_blank">
                  <i class="fas fa-cube"></i> Смотреть 3D
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    // Добавляем обработчик события только для карточки
    const card = col.querySelector('.card');
    if (card) {
      card.addEventListener('click', (event) => {
        // Проверяем, был ли клик по карусели или её элементам
        const isCarouselClick = event.target.closest('.carousel') || 
                              event.target.closest('.carousel-control-prev') || 
                              event.target.closest('.carousel-control-next') ||
                              event.target.closest('.carousel-indicators');
        
        // Если клик был не по карусели, открываем модальное окно
        if (!isCarouselClick) {
          openModal(house);
        }
      });
    }

    container.appendChild(col);
  });
}

function openModal(house) {
  document.getElementById("modalHouseTitle").textContent = house.name;
  
  // Разбиваем строку с фотографиями на массив
  const photos = house.imageUrl
    .split(';')
    .map(url => url.trim())
    .filter(url => url.length > 0 && url !== 'ссылка');

  // Создаем карусель для модального окна
  const modalCarouselId = 'modalCarousel';
  const carouselIndicators = photos.map((_, index) => `
    <button type="button" data-bs-target="#${modalCarouselId}" data-bs-slide-to="${index}" 
      ${index === 0 ? 'class="active" aria-current="true"' : ''} 
      aria-label="Slide ${index + 1}"></button>
  `).join('');

  const carouselItems = photos.map((photo, index) => `
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
      <img src="${photo}" class="d-block w-100" alt="${house.name} - фото ${index + 1}" 
        style="height: 400px; object-fit: cover;">
    </div>
  `).join('');

  // Обновляем содержимое модального окна
  const modalImageContainer = document.getElementById("modalHouseImage");
  modalImageContainer.innerHTML = `
    <div class="position-relative">
      <div id="${modalCarouselId}" class="carousel slide" data-bs-ride="false">
        <div class="carousel-indicators">
          ${carouselIndicators}
        </div>
        <div class="carousel-inner">
          ${carouselItems}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#${modalCarouselId}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Предыдущее</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${modalCarouselId}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Следующее</span>
        </button>
      </div>
      <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-2" 
              onclick="openFullscreen('${modalCarouselId}')" 
              style="z-index: 10;">
        <i class="fas fa-expand"></i>
      </button>
    </div>
  `;

  document.getElementById("modalHouseDesc").textContent = house.description;
  document.getElementById("modalHouseArea").textContent = house.area;
  document.getElementById("modalHouseFloors").textContent = house.floors;
  document.getElementById("modalHouseMaterials").textContent = house.materials;
  document.getElementById("modalHousePrice").textContent = formatPrice(house.price);

  const message = `Здравствуйте! Меня заинтересовал проект дома: ${house.name}, ID: ${house.id}`;
  const whatsappUrl = `https://wa.me/79001234567?text=${encodeURIComponent(message)}`;
  
  document.getElementById("modalTelegramBtn").href = whatsappUrl;
  document.getElementById("modalTelegramBtn").textContent = "Связаться через WhatsApp";
  document.getElementById("modalTelegramBtn").classList.remove("btn-primary");
  document.getElementById("modalTelegramBtn").classList.add("btn-success");

  const modal = new bootstrap.Modal(document.getElementById('houseModal'));
  modal.show();
}

function formatPrice(price) {
  return price.toLocaleString() + ' ₽';
}

// Добавляем функцию для полноэкранного просмотра
window.openFullscreen = function(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  // Создаем модальное окно для полноэкранного просмотра
  const fullscreenModal = document.createElement('div');
  fullscreenModal.className = 'modal fade';
  fullscreenModal.id = 'fullscreenModal';
  fullscreenModal.setAttribute('tabindex', '-1');
  fullscreenModal.setAttribute('aria-hidden', 'true');

  // Получаем текущий активный слайд
  const activeSlide = carousel.querySelector('.carousel-item.active');
  const activeIndex = Array.from(carousel.querySelectorAll('.carousel-item')).indexOf(activeSlide);

  // Создаем содержимое модального окна
  fullscreenModal.innerHTML = `
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content bg-black">
        <div class="modal-header border-0">
          <div class="d-flex align-items-center">
            <button class="btn btn-light btn-sm me-2" id="zoomToggle">
              <i class="fas fa-search-plus"></i>
            </button>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
        </div>
        <div class="modal-body p-0 d-flex align-items-center justify-content-center">
          <div id="fullscreenCarousel" class="carousel slide fullscreen-carousel" data-bs-ride="false">
            <div class="carousel-inner">
              ${Array.from(carousel.querySelectorAll('.carousel-item')).map((item, index) => `
                <div class="carousel-item ${index === activeIndex ? 'active' : ''}">
                  <div class="zoom-container">
                    <img src="${item.querySelector('img').src}" class="d-block w-100 zoom-image" alt="Фото ${index + 1}">
                  </div>
                </div>
              `).join('')}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#fullscreenCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Предыдущее</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#fullscreenCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Следующее</span>
            </button>
            <div class="carousel-indicators">
              ${Array.from(carousel.querySelectorAll('.carousel-item')).map((_, index) => `
                <button type="button" data-bs-target="#fullscreenCarousel" data-bs-slide-to="${index}" 
                  ${index === activeIndex ? 'class="active" aria-current="true"' : ''} 
                  aria-label="Slide ${index + 1}"></button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Добавляем модальное окно на страницу
  document.body.appendChild(fullscreenModal);

  // Инициализируем и показываем модальное окно
  const modal = new bootstrap.Modal(fullscreenModal);
  modal.show();

  // Инициализируем карусель после показа модального окна
  fullscreenModal.addEventListener('shown.bs.modal', function () {
    const fullscreenCarousel = new bootstrap.Carousel(document.getElementById('fullscreenCarousel'), {
      interval: false
    });

    // Инициализация функционала лупы
    const zoomToggle = document.getElementById('zoomToggle');
    const zoomImages = document.querySelectorAll('.zoom-image');
    let isZoomEnabled = false;

    zoomToggle.addEventListener('click', function() {
      isZoomEnabled = !isZoomEnabled;
      zoomImages.forEach(img => {
        if (isZoomEnabled) {
          img.style.cursor = 'zoom-in';
          zoomToggle.innerHTML = '<i class="fas fa-search-minus"></i>';
        } else {
          img.style.cursor = 'default';
          img.style.transform = 'scale(1)';
          zoomToggle.innerHTML = '<i class="fas fa-search-plus"></i>';
        }
      });
    });

    zoomImages.forEach(img => {
      img.addEventListener('mousemove', function(e) {
        if (!isZoomEnabled) return;

        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = x / rect.width * 100;
        const yPercent = y / rect.height * 100;

        img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        img.style.transform = 'scale(2)';
      });

      img.addEventListener('mouseleave', function() {
        if (!isZoomEnabled) return;
        img.style.transform = 'scale(1)';
      });
    });
  });

  // Очищаем модальное окно после закрытия
  fullscreenModal.addEventListener('hidden.bs.modal', function () {
    document.body.removeChild(fullscreenModal);
  });
};