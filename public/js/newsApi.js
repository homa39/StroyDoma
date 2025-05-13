export async function loadNews() {
    try {
        const response = await fetch('/api/news');
        const news = await response.json();
        
        const container = document.getElementById('newsContainer');
        if (!container) return;

        if (news.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><p>Новостей пока нет</p></div>';
            return;
        }

        container.innerHTML = news.map(item => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card news-card h-100">
                    <div class="card-img-wrapper">
                        <img src="${item.imageUrl}" 
                             class="card-img-top" 
                             alt="${item.title}"
                             onerror="this.onerror=null; this.src='/images/news-placeholder.jpg';">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.content.substring(0, 150)}${item.content.length > 150 ? '...' : ''}</p>
                    </div>
                </div>
            </div>
        `).join('');

        // Предзагрузка изображений
        news.forEach(item => {
            if (item.imageUrl) {
                const img = new Image();
                img.src = item.imageUrl;
            }
        });
    } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        const container = document.getElementById('newsContainer');
        if (container) {
            container.innerHTML = '<div class="col-12 text-center"><p>Не удалось загрузить новости. Пожалуйста, попробуйте позже.</p></div>';
        }
    }
}
