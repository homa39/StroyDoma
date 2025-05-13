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

function applyFilters() {
  const mat = document.getElementById("filterMaterial").value;
  const fl = document.getElementById("filterFloors").value;
  const ar = parseInt(document.getElementById("filterArea").value);

  const filtered = allHouses.filter(h => {
    return (!mat || h.materials === mat) &&
           (!fl || h.floors == fl) &&
           (!ar || h.area >= ar);
  });

  renderHouses(filtered);
}

function renderHouses(houses) {
  const container = document.getElementById("houses-container");
  container.innerHTML = '';

  if (houses.length === 0) {
    container.innerHTML = `<p class="text-muted text-center">Нет подходящих домов</p>`;
    return;
  }

  houses.forEach(house => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 mb-4";

    col.innerHTML = `
      <div class="card house-card h-100 shadow-sm border-0" data-id="${house.id}" style="cursor:pointer;">
        <img src="${house.imageUrl}" class="card-img-top" alt="${house.name}">
        <div class="card-body">
          <h5 class="card-title">${house.name}</h5>
          <p class="card-text small text-muted">${house.materials}, ${house.area} м², ${house.floors} этаж(а)</p>
          <strong class="text-primary">от ${house.price} ₽</strong>
        </div>
      </div>
    `;

    col.querySelector('.card').addEventListener('click', () => openModal(house));
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
  document.getElementById("modalHousePrice").textContent = house.price;

  const telegramText = encodeURIComponent(`Здравствуйте! Меня заинтересовал проект дома: ${house.name}, ID: ${house.id}`);
  document.getElementById("modalTelegramBtn").href = `https://t.me/your_bot_username?text=${telegramText}`;

  const modal = new bootstrap.Modal(document.getElementById('houseModal'));
  modal.show();
}
