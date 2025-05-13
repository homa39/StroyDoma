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
  container.innerHTML = '';

  if (houses.length === 0) {
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
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 mb-4";

    col.innerHTML = `
      <div class="card house-card h-100 shadow-sm border-0" data-id="${house.id}" style="cursor:pointer;">
        <div class="position-relative">
          <img src="${house.imageUrl}" class="card-img-top" alt="${house.name}" style="height: 200px; object-fit: cover;">
          <div class="position-absolute top-0 end-0 m-2">
            <span class="badge bg-primary">${house.area} м²</span>
          </div>
        </div>
        <div class="card-body">
          <h5 class="card-title">${house.name}</h5>
          <p class="card-text small text-muted">
            <i class="fas fa-layer-group me-1"></i> ${house.materials}<br>
            <i class="fas fa-building me-1"></i> ${house.floors} этаж(а)
          </p>
          <div class="d-flex justify-content-between align-items-center">
            <strong class="text-primary">от ${house.price.toLocaleString()} ₽</strong>
            <button class="btn btn-outline-primary btn-sm details-btn">
              <i class="fas fa-info-circle"></i> Подробнее
            </button>
          </div>
        </div>
      </div>
    `;

    // Добавляем обработчики событий
    const card = col.querySelector('.card');
    const detailsBtn = col.querySelector('.details-btn');

    card.addEventListener('click', () => openModal(house));
    detailsBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Предотвращаем всплытие события
      openModal(house);
    });

    container.appendChild(col);
  });
}

function openModal(house) {
  document.getElementById("modalHouseTitle").textContent = house.name;
  document.getElementById("modalHouseImage").src = house.imageUrl;
  document.getElementById("modalHouseDesc").textContent = house.description;
  document.getElementById("modalHouseArea").textContent = house.area;
  document.getElementById("modalHouseFloors").textContent = house.floors;
  document.getElementById("modalHouseMaterials").textContent = house.materials;
  document.getElementById("modalHousePrice").textContent = house.price.toLocaleString();

  const message = `Здравствуйте! Меня заинтересовал проект дома: ${house.name}, ID: ${house.id}`;
  const whatsappUrl = `https://wa.me/79001234567?text=${encodeURIComponent(message)}`;
  
  document.getElementById("modalTelegramBtn").href = whatsappUrl;
  document.getElementById("modalTelegramBtn").textContent = "Связаться через WhatsApp";
  document.getElementById("modalTelegramBtn").classList.remove("btn-primary");
  document.getElementById("modalTelegramBtn").classList.add("btn-success");

  const modal = new bootstrap.Modal(document.getElementById('houseModal'));
  modal.show();
}
