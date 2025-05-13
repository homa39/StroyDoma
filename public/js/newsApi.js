export async function loadNews(containerId = "newsContainer") {
  try {
    const res = await fetch("/api/news");
    const newsList = await res.json();
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    newsList.forEach(news => {
      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4 mb-4";

      const date = news.created_at?.split('T')[0] || '';
      const preview = news.content.length > 100 ? news.content.slice(0, 100) + '...' : news.content;

      card.innerHTML = `
        <div class="card news-card h-100 shadow-sm border-0" onclick="location.href='/news/${news.id}'">
          <div class="card-body">
            <h5 class="card-title">${news.title}</h5>
            <p class="news-date">${date}</p>
            <p class="card-text">${preview}</p>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Ошибка загрузки новостей:", err);
  }
}
