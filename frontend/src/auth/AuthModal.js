// =========================================================
// AUTH MODAL — МОДАЛЬНОЕ ОКНО ВХОДА/РЕГИСТРАЦИИ
// =========================================================
import AuthService from './AuthService.js';
// Список запрещённых слов
const BAD_WORDS = [
    'хуй', 'пизда', 'бля', 'ебал', 'ебать', 'ебан', 'залупа', 'мудак',
    'говно', 'дерьмо', 'срака', 'жопа', 'хер', 'нахер', 'охер',
    'fuck', 'shit', 'bitch', 'asshole', 'damn', 'crap'
];
class AuthModal {
    constructor(callbacks) {
        this.overlay = null;
        this.mode = 'login';
        this.isOpen = false;
        this.callbacks = {};
        this.codeTimer = null;
        this.codeSeconds = 0;
        this.isCodeSent = false;
        // DOM элементы
        this.formLogin = null;
        this.formRegister = null;
        this.tabLogin = null;
        this.tabRegister = null;
        this.submitBtn = null;
        this.submitRegisterBtn = null;
        this.closeBtn = null;
        this.switchToRegister = null;
        this.switchToLogin = null;
        this.title = null;
        this.subtitle = null;
        this.sendCodeBtn = null;
        this.codeField = null;
        this.codeInput = null;
        this.codeHint = null;
        this.callbacks = callbacks || {};
        console.log('🔐 AuthModal: конструктор вызван');
        this.createModal();
    }
    containsBadWords(text) {
        const lowerText = text.toLowerCase();
        return BAD_WORDS.some(word => lowerText.includes(word));
    }
    /**
     * Очистка номера телефона от всех символов, кроме цифр
     */
    cleanPhone(phone) {
        return phone.replace(/\D/g, '');
    }
    /**
     * Форматирование телефона в читаемый вид (для отображения)
     */
    formatPhoneForDisplay(phone) {
        const cleaned = this.cleanPhone(phone);
        if (cleaned.length === 11 && cleaned.startsWith('7')) {
            return `+7 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
        }
        return phone;
    }
    /**
     * Валидация номера телефона
     */
    isValidPhone(phone) {
        const cleaned = this.cleanPhone(phone);
        return cleaned.length === 11 && cleaned.startsWith('7');
    }
    /**
     * Показать/скрыть кнопку "Отправить код" в зависимости от телефона
     */
    toggleSendCodeButton(phone) {
        const sendCodeBtn = this.sendCodeBtn;
        if (!sendCodeBtn)
            return;
        if (this.isCodeSent) {
            sendCodeBtn.classList.remove('auth-modal__code-btn--visible');
            sendCodeBtn.disabled = true;
            return;
        }
        const isValid = this.isValidPhone(phone);
        if (isValid) {
            sendCodeBtn.classList.add('auth-modal__code-btn--visible');
            sendCodeBtn.disabled = false;
        }
        else {
            sendCodeBtn.classList.remove('auth-modal__code-btn--visible');
            sendCodeBtn.disabled = true;
        }
    }
    /**
     * Применение маски для телефона при вводе
     */
    applyPhoneMask(input) {
        let value = input.value.replace(/\D/g, '');
        // Ограничиваем 11 цифрами
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        let formatted = '';
        if (value.length > 0) {
            formatted = '+7';
            if (value.length > 1) {
                formatted += ' ' + value.slice(1, 4);
            }
            if (value.length > 4) {
                formatted += ' ' + value.slice(4, 7);
            }
            if (value.length > 7) {
                formatted += ' ' + value.slice(7, 9);
            }
            if (value.length > 9) {
                formatted += '-' + value.slice(9, 11);
            }
        }
        input.value = formatted;
        // Проверяем валидность и обновляем кнопку
        this.toggleSendCodeButton(input.value);
        // Убираем ошибку при вводе
        this.clearFieldError(input);
    }
    clearFieldError(input) {
        const field = input.closest('.auth-modal__field');
        if (field) {
            field.classList.remove('auth-modal__field--error');
            input.style.borderColor = '';
        }
    }
    createModal() {
        const existing = document.getElementById('authModal');
        if (existing)
            existing.remove();
        const html = `
            <div class="auth-modal-overlay" id="authModal">
                <div class="auth-modal">
                    <button class="auth-modal__close" id="authModalClose">
                        <span></span>
                        <span></span>
                    </button>
                    
                    <div class="auth-modal__body">
                        <div class="auth-modal__logo">
                          <img src="./public/images/logo.png" alt="Manomaestro" height="40" />
                        </div>
                        
                        <h2 class="auth-modal__title" id="authModalTitle">Вход в кабинет</h2>
                        <p class="auth-modal__subtitle" id="authModalSubtitle">Войдите, чтобы управлять заказами и избранным</p>
                        
                        <div class="auth-modal__tabs">
                            <button class="auth-modal__tab auth-modal__tab--active" data-tab="login">Вход</button>
                            <button class="auth-modal__tab" data-tab="register">Регистрация</button>
                        </div>
                        
                        <!-- ===== ФОРМА ВХОДА ===== -->
                        <form class="auth-modal__form auth-modal__form--active" id="authFormLogin" autocomplete="off" novalidate>
                            <div class="auth-modal__field">
                                <label for="authLogin">Email или номер телефона</label>
                                <input type="text" id="authLogin" placeholder="test@test.com или +7 999 999 99-99" />
                                <span class="auth-modal__error" id="authLoginError"></span>
                            </div>
                            
                            <div class="auth-modal__field">
                                <label for="authPassword">Пароль</label>
                                <input type="password" id="authPassword" placeholder="••••••••" />
                                <span class="auth-modal__error" id="authPasswordError"></span>
                            </div>
                            
                            <div class="auth-modal__field auth-modal__field--checkbox">
                                <input type="checkbox" id="authRemember" />
                                <label for="authRemember">Запомнить меня</label>
                            </div>
                            
                            <button type="submit" class="auth-modal__submit" id="authSubmit">Войти</button>
                            
                            <div class="auth-modal__switch">
                                Нет аккаунта? <a id="authSwitchToRegister">Зарегистрироваться</a>
                            </div>
                        </form>
                        
                        <!-- ===== ФОРМА РЕГИСТРАЦИИ ===== -->
                        <form class="auth-modal__form" id="authFormRegister" autocomplete="off" novalidate>
                            <div class="auth-modal__field">
                                <label for="authRegName">Как вас зовут?</label>
                                <input type="text" id="authRegName" placeholder="Александр" />
                                <span class="auth-modal__error" id="authRegNameError"></span>
                            </div>
                            
                            <div class="auth-modal__field">
                                <label for="authRegPhone">Номер телефона</label>
                                <input type="tel" id="authRegPhone" placeholder="+7 999 999 99-99" maxlength="18" />
                                <span class="auth-modal__error" id="authRegPhoneError"></span>
                            </div>
                            
                            <!-- ===== КНОПКА ОТПРАВКИ КОДА ===== -->
                            <div class="auth-modal__field auth-modal__field--code">
                                <button type="button" class="auth-modal__code-btn" id="authSendCode">
                                    Отправить код
                                </button>
                            </div>
                            
                            <!-- ===== ПОЛЕ ДЛЯ КОДА ===== -->
                            <div class="auth-modal__field" id="authCodeField" style="display: none;">
                                <label for="authRegCode">Код подтверждения из SMS</label>
                                <input type="text" id="authRegCode" placeholder="— — — — — —" maxlength="6" />
                                <span class="auth-modal__error" id="authRegCodeError"></span>
                            </div>
                            
                            <div class="auth-modal__field">
                                <label for="authRegPassword">Придумайте пароль</label>
                                <input type="password" id="authRegPassword" placeholder="Минимум 6 символов" />
                                <span class="auth-modal__error" id="authRegPasswordError"></span>
                            </div>
                            
                            <!-- ===== ЧЕКБОКС СО ССЫЛКОЙ ===== -->
                            <div class="auth-modal__field auth-modal__field--checkbox">
                                <input type="checkbox" id="authRegAgree" />
                                <label for="authRegAgree">
                                    Я согласен с <a href="#" target="_blank">политикой конфиденциальности</a>
                                </label>
                            </div>
                            
                            <button type="submit" class="auth-modal__submit" id="authRegSubmit">Создать аккаунт</button>
                            
                            <div class="auth-modal__switch">
                                Уже есть аккаунт? <a id="authSwitchToLogin">Войти</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        this.overlay = document.getElementById('authModal');
        this.formLogin = document.getElementById('authFormLogin');
        this.formRegister = document.getElementById('authFormRegister');
        this.tabLogin = this.overlay?.querySelector('[data-tab="login"]') || null;
        this.tabRegister = this.overlay?.querySelector('[data-tab="register"]') || null;
        this.submitBtn = document.getElementById('authSubmit');
        this.submitRegisterBtn = document.getElementById('authRegSubmit');
        this.closeBtn = document.getElementById('authModalClose');
        this.switchToRegister = document.getElementById('authSwitchToRegister');
        this.switchToLogin = document.getElementById('authSwitchToLogin');
        this.title = document.getElementById('authModalTitle');
        this.subtitle = document.getElementById('authModalSubtitle');
        this.sendCodeBtn = document.getElementById('authSendCode');
        this.codeField = document.getElementById('authCodeField');
        this.codeInput = document.getElementById('authRegCode');
        this.codeHint = document.getElementById('authCodeHint');
        this.bindEvents();
        console.log('✅ AuthModal: HTML создан');
    }
    bindEvents() {
        console.log('🔗 AuthModal: привязка событий');
        this.switchToRegister?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchMode('register');
        });
        this.switchToLogin?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchMode('login');
        });
        this.tabLogin?.addEventListener('click', () => this.switchMode('login'));
        this.tabRegister?.addEventListener('click', () => this.switchMode('register'));
        this.closeBtn?.addEventListener('click', () => this.close());
        this.overlay?.addEventListener('click', (e) => {
            if (e.target === this.overlay)
                this.close();
        });
        this.formLogin?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        this.formRegister?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });
        // ===== СЛУШАТЕЛЬ ДЛЯ ПОЛЯ ТЕЛЕФОНА С МАСКОЙ =====
        const phoneInput = document.getElementById('authRegPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                this.applyPhoneMask(phoneInput);
            });
            // Инициализация
            this.toggleSendCodeButton(phoneInput.value);
        }
        // Кнопка отправки кода
        this.sendCodeBtn?.addEventListener('click', () => {
            console.log('🖱️ Кнопка "Отправить код" нажата');
            this.sendVerificationCode();
        });
        this.codeInput?.addEventListener('input', () => {
            if (this.codeInput && this.codeInput.value.length === 6) {
                this.codeInput.style.borderColor = '#27AE60';
                // Автоматически убираем ошибку
                const field = this.codeInput.closest('.auth-modal__field');
                if (field) {
                    field.classList.remove('auth-modal__field--error');
                }
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen)
                this.close();
        });
        console.log('✅ AuthModal: события привязаны');
    }
    switchMode(mode) {
        this.mode = mode;
        this.isCodeSent = false;
        if (mode === 'login') {
            this.formLogin?.classList.add('auth-modal__form--active');
            this.formRegister?.classList.remove('auth-modal__form--active');
            this.tabLogin?.classList.add('auth-modal__tab--active');
            this.tabRegister?.classList.remove('auth-modal__tab--active');
            if (this.title)
                this.title.textContent = 'Вход в кабинет';
            if (this.subtitle)
                this.subtitle.textContent = 'Войдите, чтобы управлять заказами и избранным';
        }
        else {
            this.formRegister?.classList.add('auth-modal__form--active');
            this.formLogin?.classList.remove('auth-modal__form--active');
            this.tabRegister?.classList.add('auth-modal__tab--active');
            this.tabLogin?.classList.remove('auth-modal__tab--active');
            if (this.title)
                this.title.textContent = 'Создать аккаунт';
            if (this.subtitle)
                this.subtitle.textContent = 'Зарегистрируйтесь, чтобы получить доступ ко всем возможностям';
            this.resetCodeState();
        }
        const phoneInput = document.getElementById('authRegPhone');
        if (phoneInput) {
            this.toggleSendCodeButton(phoneInput.value);
        }
    }
    /**
     * ОТПРАВКА КОДА НА ТЕЛЕФОН
     */
    async sendVerificationCode() {
        if (this.codeTimer !== null) {
            console.log('⏳ Таймер активен, повторная отправка запрещена');
            return;
        }
        console.log('📤 sendVerificationCode вызван');
        const phoneInput = document.getElementById('authRegPhone');
        const phone = phoneInput?.value || '';
        console.log('📱 Телефон:', phone);
        this.clearErrors();
        if (!this.isValidPhone(phone)) {
            this.showError('authRegPhoneError', 'Введите корректный номер телефона (например: +7 999 999 99-99)');
            return;
        }
        try {
            if (this.sendCodeBtn) {
                this.sendCodeBtn.disabled = true;
                this.sendCodeBtn.textContent = 'Отправка...';
            }
            // Отправляем код через сервис
            await AuthService.sendVerificationCode(phone);
            // Показываем поле для кода
            if (this.codeField) {
                this.codeField.style.display = 'block';
                this.codeField.style.animation = 'authCodeAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
                console.log('✅ Поле для кода показано');
            }
            if (this.codeInput) {
                this.codeInput.value = '';
                this.codeInput.focus();
                this.codeInput.style.borderColor = '';
                console.log('✅ Фокус на поле кода');
            }
            if (this.codeHint) {
                const formattedPhone = this.formatPhoneForDisplay(phone);
                this.codeHint.textContent = 'Код отправлен на ' + formattedPhone + '. Введите его ниже';
                this.codeHint.className = 'auth-modal__hint auth-modal__hint--success';
            }
            this.isCodeSent = true;
            if (this.sendCodeBtn) {
                this.sendCodeBtn.classList.remove('auth-modal__code-btn--visible');
                this.sendCodeBtn.textContent = 'Отправить код';
            }
            this.startCodeTimer();
            console.log('📱 Код отправлен на', phone);
        }
        catch (error) {
            if (this.sendCodeBtn) {
                this.sendCodeBtn.disabled = false;
                this.sendCodeBtn.textContent = 'Отправить код';
                const phoneVal = phoneInput?.value || '';
                this.toggleSendCodeButton(phoneVal);
            }
            this.showError('authRegPhoneError', error instanceof Error ? error.message : 'Ошибка отправки');
        }
    }
    /**
     * ЗАПУСК ТАЙМЕРА ДЛЯ ПОВТОРНОЙ ОТПРАВКИ КОДА
     */
    startCodeTimer() {
        this.codeSeconds = 30;
        if (this.codeTimer)
            clearInterval(this.codeTimer);
        this.codeTimer = window.setInterval(() => {
            this.codeSeconds--;
            if (this.sendCodeBtn) {
                if (this.codeSeconds <= 0) {
                    // ✅ КОГДА ТАЙМЕР ЗАКАНЧИВАЕТСЯ — АКТИВИРУЕМ КНОПКУ
                    this.sendCodeBtn.disabled = false;
                    this.sendCodeBtn.textContent = 'Отправить код';
                    this.sendCodeBtn.classList.add('auth-modal__code-btn--visible');
                    // ✅ Сбрасываем флаг отправки для повторной отправки
                    this.isCodeSent = false;
                    // ✅ Скрываем поле для кода
                    if (this.codeField) {
                        this.codeField.style.display = 'none';
                        this.codeField.style.animation = '';
                    }
                    if (this.codeInput) {
                        this.codeInput.value = '';
                    }
                    const phoneInput = document.getElementById('authRegPhone');
                    if (phoneInput) {
                        this.toggleSendCodeButton(phoneInput.value);
                    }
                    clearInterval(this.codeTimer);
                    this.codeTimer = null;
                }
                else {
                    this.sendCodeBtn.textContent = `Отправить снова (${this.codeSeconds}с)`;
                }
            }
        }, 1000);
    }
    resetCodeState() {
        if (this.codeTimer) {
            clearInterval(this.codeTimer);
            this.codeTimer = null;
        }
        if (this.codeField) {
            this.codeField.style.display = 'none';
            this.codeField.style.animation = '';
        }
        if (this.sendCodeBtn) {
            this.sendCodeBtn.disabled = true;
            this.sendCodeBtn.textContent = 'Отправить код';
            this.sendCodeBtn.classList.remove('auth-modal__code-btn--visible');
        }
        if (this.codeInput)
            this.codeInput.value = '';
        if (this.codeHint) {
            this.codeHint.className = 'auth-modal__hint';
        }
        this.isCodeSent = false;
        const phoneInput = document.getElementById('authRegPhone');
        if (phoneInput) {
            this.toggleSendCodeButton(phoneInput.value);
        }
    }
    async handleLogin(e) {
        e.preventDefault();
        console.log('🔑 AuthModal: попытка входа');
        const login = document.getElementById('authLogin')?.value || '';
        const password = document.getElementById('authPassword')?.value || '';
        const remember = document.getElementById('authRemember')?.checked || false;
        this.clearErrors();
        let hasError = false;
        if (!login || login.length < 3) {
            this.showError('authLoginError', 'Введите email или номер телефона');
            hasError = true;
        }
        if (!password || password.length < 6) {
            this.showError('authPasswordError', 'Пароль должен содержать минимум 6 символов');
            hasError = true;
        }
        if (hasError) {
            const firstError = document.querySelector('.auth-modal__field--error');
            if (firstError) {
                const input = firstError.querySelector('input');
                if (input)
                    input.focus();
            }
            return;
        }
        try {
            this.setLoading(true);
            const response = await AuthService.login(login, password, remember);
            this.setLoading(false);
            this.close();
            this.callbacks.onLogin?.(response.user);
            AuthModal.updateHeaderButton();
            this.showNotification('Добро пожаловать, ' + response.user.name + '!');
        }
        catch (error) {
            this.setLoading(false);
            this.showError('authLoginError', error instanceof Error ? error.message : 'Ошибка входа');
        }
    }
    async handleRegister(e) {
        e.preventDefault();
        console.log('📝 AuthModal: попытка регистрации');
        const name = document.getElementById('authRegName')?.value || '';
        const phone = document.getElementById('authRegPhone')?.value || '';
        const password = document.getElementById('authRegPassword')?.value || '';
        const code = document.getElementById('authRegCode')?.value || '';
        const agree = document.getElementById('authRegAgree')?.checked || false;
        this.clearErrors();
        let hasError = false;
        // Проверка имени
        if (!name || name.length < 2) {
            this.showError('authRegNameError', 'Введите имя (минимум 2 символа)');
            hasError = true;
        }
        else if (this.containsBadWords(name)) {
            this.showError('authRegNameError', 'Имя содержит недопустимые символы');
            hasError = true;
        }
        // Проверка телефона
        if (!this.isValidPhone(phone)) {
            this.showError('authRegPhoneError', 'Введите корректный номер телефона (например: +7 999 999 99-99)');
            hasError = true;
        }
        // Проверка пароля
        if (!password || password.length < 6) {
            this.showError('authRegPasswordError', 'Пароль должен содержать минимум 6 символов');
            hasError = true;
        }
        // Проверка согласия
        if (!agree) {
            this.showError('authRegNameError', 'Необходимо согласие с политикой конфиденциальности');
            hasError = true;
        }
        // ✅ ПРОВЕРКА КОДА
        if (this.isCodeSent) {
            if (!code || code.length < 6) {
                this.showError('authRegCodeError', 'Введите 6-значный код из SMS');
                hasError = true;
            }
        }
        else {
            // Если код не отправлен, но поле видимо — ошибка
            if (this.codeField && this.codeField.style.display !== 'none') {
                this.showError('authRegCodeError', 'Сначала отправьте код на телефон');
                hasError = true;
            }
            // Если код вообще не отправлен — напоминаем
            if (!this.isCodeSent) {
                this.showError('authRegPhoneError', 'Сначала отправьте код на телефон');
                hasError = true;
            }
        }
        if (hasError) {
            const firstError = document.querySelector('.auth-modal__field--error');
            if (firstError) {
                const input = firstError.querySelector('input');
                if (input)
                    input.focus();
            }
            return;
        }
        try {
            this.setLoading(true);
            const response = await AuthService.register(name, phone, password, code);
            this.setLoading(false);
            this.close();
            this.callbacks.onRegister?.(response.user);
            AuthModal.updateHeaderButton();
            this.showNotification('Добро пожаловать, ' + response.user.name + '!');
        }
        catch (error) {
            this.setLoading(false);
            const errorMessage = error instanceof Error ? error.message : 'Ошибка регистрации';
            // ✅ ПРАВИЛЬНОЕ РАСПРЕДЕЛЕНИЕ ОШИБОК ПО ПОЛЯМ
            if (errorMessage.toLowerCase().includes('код') ||
                errorMessage.toLowerCase().includes('code') ||
                errorMessage.toLowerCase().includes('неверный') ||
                errorMessage.toLowerCase().includes('sms')) {
                this.showError('authRegCodeError', errorMessage);
            }
            else if (errorMessage.toLowerCase().includes('телефон') ||
                errorMessage.toLowerCase().includes('phone')) {
                this.showError('authRegPhoneError', errorMessage);
            }
            else if (errorMessage.toLowerCase().includes('пароль') ||
                errorMessage.toLowerCase().includes('password')) {
                this.showError('authRegPasswordError', errorMessage);
            }
            else if (errorMessage.toLowerCase().includes('имя') ||
                errorMessage.toLowerCase().includes('name')) {
                this.showError('authRegNameError', errorMessage);
            }
            else {
                // По умолчанию — в поле имени
                this.showError('authRegNameError', errorMessage);
            }
        }
    }
    showError(fieldId, message) {
        const errorEl = document.getElementById(fieldId);
        if (errorEl) {
            errorEl.textContent = message;
            const field = errorEl.closest('.auth-modal__field');
            if (field) {
                field.classList.add('auth-modal__field--error');
                // Подсвечиваем поле красным
                const input = field.querySelector('input');
                if (input) {
                    input.style.borderColor = '#E74C3C';
                }
            }
        }
    }
    clearErrors() {
        document.querySelectorAll('.auth-modal__field--error').forEach((el) => {
            el.classList.remove('auth-modal__field--error');
        });
        document.querySelectorAll('.auth-modal__error').forEach((el) => {
            el.textContent = '';
        });
        document.querySelectorAll('.auth-modal__field input').forEach((el) => {
            el.style.borderColor = '';
        });
        document.querySelectorAll('.auth-modal__field label').forEach((el) => {
            el.style.color = '';
        });
    }
    setLoading(loading) {
        const btn = this.mode === 'login' ? this.submitBtn : this.submitRegisterBtn;
        if (btn) {
            btn.disabled = loading;
            btn.textContent = loading ? 'Загрузка...' : (this.mode === 'login' ? 'Войти' : 'Создать аккаунт');
        }
    }
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 16px 24px;
            background: #C5A880;
            color: #FFFFFF;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 400px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (notification.parentNode)
                    notification.remove();
            }, 500);
        }, 3000);
    }
    // =========================================================
    // СТАТИЧЕСКИЕ МЕТОДЫ ДЛЯ МЕНЮ ПОЛЬЗОВАТЕЛЯ
    // =========================================================
    /**
     * Обновление кнопки в header
     */
    static updateHeaderButton() {
        const authBtn = document.getElementById('authBtn');
        if (!authBtn) {
            console.warn('⚠️ AuthModal: кнопка #authBtn не найдена');
            return;
        }
        const user = AuthService.getUser();
        if (user) {
            authBtn.innerHTML = `
                <img src="${user.avatar || 'https://i.pravatar.cc/150?img=11'}" alt="${user.name}" class="auth-btn__avatar" />
                <span class="auth-btn__name">${user.name}</span>
                <svg class="auth-btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <path d="M6 9l6 6 6-6"/>
                </svg>
            `;
            authBtn.onclick = (e) => {
                e.stopPropagation();
                AuthModal.toggleUserMenu();
            };
            console.log('👤 AuthModal: кнопка обновлена (пользователь)', user.name);
        }
        else {
            authBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Войти</span>
            `;
            authBtn.onclick = () => {
                const modal = new AuthModal();
                modal.open();
            };
        }
    }
    /**
     * Показать/скрыть меню пользователя
     */
    static toggleUserMenu() {
        if (AuthModal.userMenu && AuthModal.userMenu.style.display !== 'none') {
            AuthModal.closeUserMenu();
        }
        else {
            AuthModal.openUserMenu();
        }
    }
    /**
     * Открыть меню пользователя
     */
    static openUserMenu() {
        AuthModal.closeUserMenu();
        const user = AuthService.getUser();
        if (!user)
            return;
        const menu = document.createElement('div');
        menu.className = 'auth-user-menu';
        menu.id = 'authUserMenu';
        menu.innerHTML = `
            <div class="auth-user-menu__header">
                <img src="${user.avatar || 'https://i.pravatar.cc/150?img=11'}" alt="${user.name}" class="auth-user-menu__avatar" />
                <div>
                    <div class="auth-user-menu__name">${user.name}</div>
                    <div class="auth-user-menu__phone">${user.phone || 'Телефон не указан'}</div>
                </div>
            </div>
            <div class="auth-user-menu__divider"></div>
            <a href="#" class="auth-user-menu__item" id="authMenuCabinet">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Войти в кабинет</span>
            </a>
            <div class="auth-user-menu__divider"></div>
            <a href="#" class="auth-user-menu__item auth-user-menu__item--logout" id="authMenuLogout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Выйти из аккаунта</span>
            </a>
        `;
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            const rect = authBtn.getBoundingClientRect();
            menu.style.position = 'fixed';
            menu.style.top = (rect.bottom + 8) + 'px';
            menu.style.right = (window.innerWidth - rect.right) + 'px';
            menu.style.minWidth = '220px';
        }
        document.body.appendChild(menu);
        AuthModal.userMenu = menu;
        requestAnimationFrame(() => {
            menu.classList.add('auth-user-menu--visible');
        });
        setTimeout(() => {
            document.addEventListener('click', AuthModal.handleOutsideClick);
        }, 10);
        document.addEventListener('keydown', AuthModal.handleEscKey);
        const cabinetBtn = document.getElementById('authMenuCabinet');
        cabinetBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            AuthModal.closeUserMenu();
            console.log('📂 Переход в личный кабинет');
            window.location.href = 'cabinet.html';
        });
        const logoutBtn = document.getElementById('authMenuLogout');
        logoutBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            AuthModal.closeUserMenu();
            AuthService.logout();
            AuthModal.updateHeaderButton();
            window.location.reload();
        });
    }
    /**
     * Закрыть меню пользователя
     */
    static closeUserMenu() {
        if (AuthModal.userMenu) {
            AuthModal.userMenu.classList.remove('auth-user-menu--visible');
            setTimeout(() => {
                if (AuthModal.userMenu) {
                    AuthModal.userMenu.remove();
                    AuthModal.userMenu = null;
                }
            }, 300);
        }
        document.removeEventListener('click', AuthModal.handleOutsideClick);
        document.removeEventListener('keydown', AuthModal.handleEscKey);
    }
    // =========================================================
    // МЕТОДЫ ЭКЗЕМПЛЯРА
    // =========================================================
    open() {
        if (!this.overlay)
            return;
        this.isOpen = true;
        this.isCodeSent = false;
        requestAnimationFrame(() => {
            this.overlay.classList.add('auth-modal-overlay--active');
        });
        document.body.classList.add('no-scroll');
        setTimeout(() => {
            const firstInput = this.overlay?.querySelector('input');
            if (firstInput)
                firstInput.focus();
        }, 400);
    }
    close() {
        if (!this.overlay)
            return;
        this.isOpen = false;
        this.overlay.classList.remove('auth-modal-overlay--active');
        document.body.classList.remove('no-scroll');
        setTimeout(() => {
            this.clearErrors();
            this.resetCodeState();
            this.callbacks.onClose?.();
        }, 300);
    }
    destroy() {
        if (this.codeTimer) {
            clearInterval(this.codeTimer);
            this.codeTimer = null;
        }
        if (this.overlay)
            this.overlay.remove();
        this.isOpen = false;
        this.isCodeSent = false;
        AuthModal.closeUserMenu();
    }
}
// Статическое меню пользователя
AuthModal.userMenu = null;
/**
 * Обработчик клика вне меню
 */
AuthModal.handleOutsideClick = (e) => {
    const target = e.target;
    const authBtn = document.getElementById('authBtn');
    const menu = document.getElementById('authUserMenu');
    if (menu && !menu.contains(target) && authBtn && !authBtn.contains(target)) {
        AuthModal.closeUserMenu();
    }
};
/**
 * Обработчик клавиши Escape
 */
AuthModal.handleEscKey = (e) => {
    if (e.key === 'Escape') {
        AuthModal.closeUserMenu();
    }
};
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 AuthModal: DOM загружен');
    AuthModal.updateHeaderButton();
});
export default AuthModal;
//# sourceMappingURL=AuthModal.js.map