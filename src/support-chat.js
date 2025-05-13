class SupportChat {
    constructor() {
        console.log('SupportChat constructor called');
        this.init();
    }

    init() {
        console.log('Initializing SupportChat');
        this.addChatToPage();
        this.setupEventListeners();
        this.addWelcomeMessage();
        this.addQuickQuestions();
    }

    addChatToPage() {
        console.log('Adding chat HTML to page');
        const chatHTML = `
            <div class="support-chat">
                <button class="chat-button">
                    <span class="chat-icon">💬</span>
                    Техподдержка
                </button>
                <div class="chat-window" style="display: none;">
                    <div class="chat-header">
                        <h3>Техническая поддержка</h3>
                        <button class="close-button">&times;</button>
                    </div>
                    <div class="messages-container"></div>
                    <div class="quick-questions"></div>
                    <form class="message-form">
                        <input type="text" placeholder="Введите ваше сообщение..." required>
                        <button type="submit">Отправить</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        const chatButton = document.querySelector('.chat-button');
        const chatWindow = document.querySelector('.chat-window');
        const closeButton = document.querySelector('.close-button');
        const messageForm = document.querySelector('.message-form');
        const messageInput = document.querySelector('.message-form input');
        const messagesContainer = document.querySelector('.messages-container');

        chatButton.addEventListener('click', () => this.toggleChat());
        closeButton.addEventListener('click', () => this.toggleChat());
        messageForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    toggleChat() {
        const chatWindow = document.querySelector('.chat-window');
        const isVisible = chatWindow.style.display !== 'none';
        chatWindow.style.display = isVisible ? 'none' : 'flex';
    }

    handleSubmit(e) {
        e.preventDefault();
        const input = document.querySelector('.message-form input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            this.processUserMessage(message);
            input.value = '';
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.querySelector('.messages-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addWelcomeMessage() {
        this.addMessage('Здравствуйте! Чем я могу вам помочь?', 'support');
    }

    addQuickQuestions() {
        const quickQuestions = [
            'Как заказать дом?',
            'Какие материалы используются?',
            'Сроки строительства',
            'Способы оплаты',
            'Гарантия на строительство'
        ];

        const quickQuestionsContainer = document.querySelector('.quick-questions');
        quickQuestions.forEach(question => {
            const button = document.createElement('button');
            button.className = 'quick-question';
            button.textContent = question;
            button.addEventListener('click', () => {
                this.addMessage(question, 'user');
                this.processUserMessage(question);
            });
            quickQuestionsContainer.appendChild(button);
        });
    }

    processUserMessage(message) {
        const responses = {
            'как заказать дом': 'Для заказа дома вам нужно:\n1. Выбрать проект на нашем сайте\n2. Связаться с нами через форму заказа\n3. Обсудить детали с менеджером\n4. Подписать договор\n5. Внести предоплату',
            'какие материалы используются': 'Мы используем только качественные материалы:\n- Клееный брус\n- Профилированный брус\n- Каркасные технологии\n- СИП-панели\nВсе материалы имеют сертификаты качества.',
            'сроки строительства': 'Сроки строительства зависят от проекта:\n- Каркасный дом: 2-3 месяца\n- Дом из бруса: 3-4 месяца\n- Кирпичный дом: 4-6 месяцев\nТочные сроки обсуждаются индивидуально.',
            'способы оплаты': 'Мы предлагаем следующие способы оплаты:\n- Наличный расчет\n- Безналичный перевод\n- Рассрочка\n- Ипотека\n- Материнский капитал',
            'гарантия на строительство': 'Мы предоставляем:\n- 5 лет гарантии на конструктив\n- 2 года гарантии на отделку\n- 1 год гарантии на инженерные системы\nГарантийное обслуживание включено в стоимость.'
        };

        // Поиск ответа по ключевым словам
        const lowerMessage = message.toLowerCase();
        let response = 'Извините, я не совсем понял ваш вопрос. Пожалуйста, уточните или выберите один из предложенных вариантов.';

        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }

        // Добавляем задержку перед ответом для имитации "печатания"
        setTimeout(() => {
            this.addMessage(response, 'support');
        }, 1000);
    }
}

// Инициализация чата после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing chat');
    new SupportChat();
}); 