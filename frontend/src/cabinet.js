// =========================================================
// CABINET — ЛИЧНЫЙ КАБИНЕТ (С API)
// =========================================================
import AuthService from './auth/AuthService.js';
import AuthModal from './auth/AuthModal.js';
import FavoritesService from './auth/FavoritesService.js';
// =========================================================
// ОСНОВНОЙ КЛАСС
// =========================================================
class CabinetModule {
    constructor() {
        this.preloader = null;
        this.siteWrapper = null;
        this.detailsModal = null;
        console.log('📂 Личный кабинет: инициализация');
        this.init();
    }
    async init() {
        // Проверка авторизации
        if (!AuthService.isAuthenticated()) {
            console.log('🔒 Пользователь не авторизован, перенаправляем на главную');
            window.location.href = 'index.html';
            return;
        }
        // Загружаем профиль с сервера
        try {
            const user = await AuthService.fetchProfile();
            if (user) {
                const currentUser = AuthService.getUser();
                if (currentUser) {
                    if (currentUser.avatar) {
                        user.avatar = currentUser.avatar;
                    }
                    AuthService.updateUser(user);
                }
                console.log('👤 Загружен профиль с сервера:', user.name);
                this.loadUserProfile(user);
            }
        }
        catch (error) {
            console.warn('⚠️ Не удалось загрузить профиль с сервера, использую локальные данные');
            const user = AuthService.getUser();
            if (user) {
                console.log('👤 Загружен локальный профиль:', user.name);
                this.loadUserProfile(user);
            }
        }
        this.preloader = document.getElementById('cabinetPreloader');
        this.siteWrapper = document.getElementById('siteWrapper');
        this.handlePreloader();
        this.initTabs();
        this.initAvatarUpload();
        this.initProfileSave();
        this.initPasswordChange();
        this.initHeader();
        this.initAnimations();
        this.initOrdersFilters();
        this.initDetailsModal();
        this.initEmptyStates();
        this.initBurger();
        this.initHeaderScroll();
        this.initServicesDropdown();
        this.forceShowFooter();
        await this.initFavorites();
    }
    // =========================================================
    // ПУСТЫЕ СОСТОЯНИЯ (ЗАКАЗЫ)
    // =========================================================
    initEmptyStates() {
        const ordersList = document.getElementById('ordersList');
        if (ordersList) {
            const hasOrders = false;
            if (hasOrders) {
                // TODO: рендер заказов
            }
            else {
                ordersList.innerHTML = `
                    <div class="cabinet-empty">
                        <div class="cabinet-empty__icon">📦</div>
                        <h3 class="cabinet-empty__title">У вас пока нет заказов</h3>
                        <p class="cabinet-empty__text">Оформите первый заказ в нашем каталоге</p>
                        <a href="catalog.html" class="cabinet-empty__btn">Перейти в каталог</a>
                    </div>
                `;
            }
        }
    }
    // =========================================================
    // ПРИНУДИТЕЛЬНОЕ ОТОБРАЖЕНИЕ ПОДВАЛА
    // =========================================================
    forceShowFooter() {
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.style.display = 'block';
            footer.style.opacity = '1';
            footer.style.visibility = 'visible';
            footer.style.transform = 'none';
            footer.style.pointerEvents = 'auto';
            footer.style.position = 'relative';
            footer.classList.add('footer--visible');
        }
    }
    // =========================================================
    // БУРГЕР-МЕНЮ
    // =========================================================
    initBurger() {
        const burger = document.getElementById('burger');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        const menuLinks = document.querySelectorAll('.mobile-menu__link:not(.mobile-menu__link--dropdown)');
        const body = document.body;
        if (!burger || !mobileMenu) {
            console.warn('⚠️ Бургер или мобильное меню не найдены');
            return;
        }
        const openMobileMenu = () => {
            burger.classList.add('burger--active');
            mobileMenu.classList.add('mobile-menu--active');
            body.classList.add('no-scroll');
        };
        const closeMobileMenu = () => {
            burger.classList.remove('burger--active');
            mobileMenu.classList.remove('mobile-menu--active');
            body.classList.remove('no-scroll');
        };
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileMenu.classList.contains('mobile-menu--active')) {
                closeMobileMenu();
            }
            else {
                openMobileMenu();
            }
        });
        mobileMenuClose?.addEventListener('click', closeMobileMenu);
        menuLinks.forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (mobileMenu.classList.contains('mobile-menu--active')) {
                if (!mobileMenu.contains(target) && !burger.contains(target)) {
                    closeMobileMenu();
                }
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--active')) {
                closeMobileMenu();
            }
        });
    }
    // =========================================================
    // ШАПКА ПРИ СКРОЛЛЕ
    // =========================================================
    initHeaderScroll() {
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', function () {
                if (window.pageYOffset > 80) {
                    header.classList.add('header--scrolled');
                }
                else {
                    header.classList.remove('header--scrolled');
                }
            });
        }
    }
    // =========================================================
    // ДРОПДАУН УСЛУГ
    // =========================================================
    initServicesDropdown() {
        const servicesToggle = document.getElementById('servicesToggle');
        const servicesDropdown = document.getElementById('servicesDropdown');
        if (servicesToggle && servicesDropdown) {
            servicesToggle.addEventListener('click', function (e) {
                if (window.innerWidth <= 1200) {
                    e.preventDefault();
                    e.stopPropagation();
                    const isOpen = servicesDropdown.style.display === 'block';
                    servicesDropdown.style.display = isOpen ? 'none' : 'block';
                }
            });
        }
        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 1200) {
                const target = e.target;
                const dropdowns = document.querySelectorAll('.dropdown');
                dropdowns.forEach((drop) => {
                    const navItem = drop.closest('.nav__item--dropdown');
                    if (navItem && !navItem.contains(target)) {
                        drop.style.display = 'none';
                    }
                });
            }
        });
    }
    // =========================================================
    // ПРЕЛОАДЕР
    // =========================================================
    handlePreloader() {
        if (this.preloader) {
            console.log('🔄 Прелоадер: запущен');
            setTimeout(() => {
                console.log('✅ Прелоадер: скрываем');
                this.preloader.classList.add('cabinet-preloader--hidden');
                setTimeout(() => {
                    if (this.preloader) {
                        this.preloader.style.display = 'none';
                    }
                    if (this.siteWrapper) {
                        this.siteWrapper.classList.add('site-wrapper--visible');
                    }
                    console.log('✨ Страница: плавное появление');
                }, 500);
            }, 1200);
        }
        else {
            if (this.siteWrapper) {
                this.siteWrapper.classList.add('site-wrapper--visible');
            }
        }
    }
    // =========================================================
    // ЗАГРУЗКА ПРОФИЛЯ (С ФОРМАТИРОВАНИЕМ ТЕЛЕФОНА)
    // =========================================================
    loadUserProfile(user) {
        const avatar = document.getElementById('avatarPreview');
        const name = document.getElementById('profileName');
        const email = document.getElementById('profileEmail');
        const phone = document.getElementById('profilePhone');
        const editName = document.getElementById('editName');
        const editEmail = document.getElementById('editEmail');
        const editPhone = document.getElementById('editPhone');
        // Проверяем localStorage, если есть аватарка — используем её
        const savedUser = AuthService.getUser();
        const avatarUrl = savedUser?.avatar || user.avatar || 'https://i.pravatar.cc/150?img=11';
        if (avatar)
            avatar.src = avatarUrl;
        if (name)
            name.textContent = user.name || 'Пользователь';
        // 🔥 ФОРМАТИРУЕМ ТЕЛЕФОН
        const displayPhone = user.phone ? this.formatPhone(user.phone) : 'Не указан';
        // 🔥 Email показываем только если он есть и не равен телефону
        const displayEmail = (user.email && user.email.trim() !== '' && user.email !== user.phone)
            ? user.email
            : 'Не указан';
        if (phone)
            phone.textContent = displayPhone;
        if (email)
            email.textContent = displayEmail;
        if (editName)
            editName.value = user.name || '';
        if (editEmail)
            editEmail.value = (user.email && user.email.trim() !== '' && user.email !== user.phone) ? user.email : '';
        if (editPhone)
            editPhone.value = user.phone || '';
    }
    /**
     * 🔥 ФОРМАТИРОВАНИЕ НОМЕРА ТЕЛЕФОНА
     * Например: 79999994444 → +7 999 999 44-44
     */
    formatPhone(phone) {
        // Убираем все не-цифры
        const cleaned = phone.replace(/\D/g, '');
        // Если номер начинается с 8, меняем на 7
        let formatted = cleaned;
        if (formatted.startsWith('8')) {
            formatted = '7' + formatted.slice(1);
        }
        // Если номер не начинается с 7, добавляем 7 (берём последние 10 цифр)
        if (!formatted.startsWith('7')) {
            if (formatted.length >= 10) {
                formatted = '7' + formatted.slice(-10);
            }
            else {
                formatted = '7' + formatted;
            }
        }
        // Форматируем: +7 (999) 999-99-99
        if (formatted.length === 11) {
            return `+7 ${formatted.slice(1, 4)} ${formatted.slice(4, 7)} ${formatted.slice(7, 9)}-${formatted.slice(9, 11)}`;
        }
        // Если длина другая, возвращаем как есть
        return phone;
    }
    // =========================================================
    // АНИМАЦИИ
    // =========================================================
    initAnimations() {
        const tabs = document.querySelectorAll('.cabinet-tabs__btn');
        tabs.forEach((tab, index) => {
            const el = tab;
            el.style.opacity = '0';
            el.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 600 + index * 80);
        });
        const content = document.querySelector('.cabinet-content');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            setTimeout(() => {
                content.style.transition = 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 400);
        }
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.style.opacity = '0';
            logo.style.transform = 'translateX(-30px) scale(0.9)';
            setTimeout(() => {
                logo.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                logo.style.opacity = '1';
                logo.style.transform = 'translateX(0) scale(1)';
            }, 100);
        }
        const navLinks = document.querySelectorAll('.nav__list .nav__link, .nav__list .nav__item--dropdown');
        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                link.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 150 + index * 80);
        });
        const phoneEl = document.querySelector('.header__phone');
        if (phoneEl) {
            phoneEl.style.opacity = '0';
            phoneEl.style.transform = 'translateX(30px) scale(0.9)';
            setTimeout(() => {
                phoneEl.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                phoneEl.style.opacity = '1';
                phoneEl.style.transform = 'translateX(0) scale(1)';
            }, 150 + navLinks.length * 80);
        }
        const burger = document.querySelector('.burger');
        if (burger) {
            burger.style.opacity = '0';
            burger.style.transform = 'scale(0.5) rotate(-90deg)';
            setTimeout(() => {
                burger.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                burger.style.opacity = '1';
                burger.style.transform = 'scale(1) rotate(0deg)';
            }, 200 + navLinks.length * 80);
        }
    }
    // =========================================================
    // ТАБЫ
    // =========================================================
    initTabs() {
        const tabs = document.querySelectorAll('.cabinet-tabs__btn');
        const contents = {
            profile: document.getElementById('tab-profile'),
            orders: document.getElementById('tab-orders'),
            favorites: document.getElementById('tab-favorites'),
            settings: document.getElementById('tab-settings'),
        };
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                tabs.forEach((t) => t.classList.remove('cabinet-tabs__btn--active'));
                tab.classList.add('cabinet-tabs__btn--active');
                Object.values(contents).forEach((content) => {
                    if (content)
                        content.classList.remove('cabinet-tab--active');
                });
                if (contents[target]) {
                    contents[target].classList.add('cabinet-tab--active');
                }
            });
        });
    }
    // =========================================================
    // ЗАГРУЗКА АВАТАРКИ (С СОХРАНЕНИЕМ НА СЕРВЕРЕ)
    // =========================================================
    initAvatarUpload() {
        const changeBtn = document.getElementById('changeAvatarBtn');
        const fileInput = document.getElementById('avatarInput');
        const avatarPreview = document.getElementById('avatarPreview');
        if (!changeBtn || !fileInput || !avatarPreview)
            return;
        changeBtn.addEventListener('click', () => {
            fileInput.click();
        });
        fileInput.addEventListener('change', async (e) => {
            const target = e.target;
            const file = target.files?.[0];
            if (!file)
                return;
            if (!file.type.startsWith('image/')) {
                alert('Пожалуйста, выберите изображение');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert('Файл слишком большой. Максимум 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = async (event) => {
                const result = event.target?.result;
                // 1. Обновляем на странице
                avatarPreview.src = result;
                // 2. Сохраняем в localStorage
                const user = AuthService.getUser();
                if (user) {
                    user.avatar = result;
                    AuthService.updateUser(user);
                    AuthModal.updateHeaderButton();
                    console.log('✅ Аватарка обновлена локально');
                }
                // 3. Отправляем на сервер
                try {
                    await this.updateAvatarOnServer(result);
                    this.showNotification('✅ Аватарка сохранена');
                }
                catch (error) {
                    console.error('❌ Ошибка сохранения на сервере:', error);
                    this.showNotification('⚠️ Аватарка сохранена только локально');
                }
            };
            reader.readAsDataURL(file);
        });
    }
    /**
     * Отправка аватарки на сервер
     */
    async updateAvatarOnServer(avatarBase64) {
        const token = AuthService.getToken();
        if (!token) {
            throw new Error('Не авторизован');
        }
        const response = await fetch('http://localhost:3001/api/auth/avatar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ avatar: avatarBase64 })
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Ошибка сохранения аватарки');
        }
        console.log('✅ Аватарка сохранена на сервере');
    }
    // =========================================================
    // СОХРАНЕНИЕ ПРОФИЛЯ
    // =========================================================
    initProfileSave() {
        const saveBtn = document.getElementById('saveProfileBtn');
        const editName = document.getElementById('editName');
        const editEmail = document.getElementById('editEmail');
        const editPhone = document.getElementById('editPhone');
        if (!saveBtn)
            return;
        // 🔥 ДОБАВЛЯЕМ МАСКУ ДЛЯ ТЕЛЕФОНА ПРИ ВВОДЕ
        if (editPhone) {
            editPhone.addEventListener('input', (e) => {
                const target = e.target;
                const value = target.value.replace(/\D/g, '');
                let formatted = '';
                if (value.length > 0) {
                    formatted = '+7';
                    if (value.length > 1) {
                        const num = value.slice(1);
                        if (num.length > 0) {
                            formatted += ' ' + num.slice(0, 3);
                        }
                        if (num.length > 3) {
                            formatted += ' ' + num.slice(3, 6);
                        }
                        if (num.length > 6) {
                            formatted += ' ' + num.slice(6, 8);
                        }
                        if (num.length > 8) {
                            formatted += '-' + num.slice(8, 10);
                        }
                    }
                }
                target.value = formatted;
            });
        }
        saveBtn.addEventListener('click', async () => {
            const user = AuthService.getUser();
            if (!user)
                return;
            const name = editName.value.trim();
            const email = editEmail.value.trim();
            const phone = editPhone.value.replace(/\D/g, '');
            if (!name || name.length < 2) {
                alert('Имя должно содержать минимум 2 символа');
                return;
            }
            // 🔥 Email — необязательное поле, но если заполнено, проверяем корректность
            if (email && !email.includes('@')) {
                alert('Введите корректный email (или оставьте пустым)');
                return;
            }
            try {
                // 🔥 ОТПРАВЛЯЕМ НА СЕРВЕР через новый метод
                const updatedUser = await AuthService.updateProfile(name, email, phone);
                // Обновляем локально
                AuthService.updateUser(updatedUser);
                AuthModal.updateHeaderButton();
                this.loadUserProfile(updatedUser);
                alert('✅ Данные успешно сохранены!');
                console.log('✅ Профиль обновлён на сервере');
            }
            catch (error) {
                alert('❌ Ошибка сохранения: ' + (error instanceof Error ? error.message : ''));
                console.error('❌ Ошибка сохранения профиля:', error);
            }
        });
    }
    // =========================================================
    // ФИЛЬТРЫ ЗАКАЗОВ
    // =========================================================
    initOrdersFilters() {
        const filters = document.querySelectorAll('.cabinet-orders__filter');
        if (filters.length === 0)
            return;
        filters.forEach((filter) => {
            filter.addEventListener('click', function () {
                filters.forEach((f) => f.classList.remove('cabinet-orders__filter--active'));
                this.classList.add('cabinet-orders__filter--active');
                const status = this.dataset.status || 'all';
                console.log('📋 Фильтр заказов:', status);
            });
        });
    }
    // =========================================================
    // ИЗБРАННОЕ (ЧЕРЕЗ API)
    // =========================================================
    async initFavorites() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        if (!favoritesGrid)
            return;
        try {
            console.log('❤️ Загрузка избранного с сервера...');
            const favorites = await FavoritesService.getFavorites();
            console.log('❤️ Избранное загружено:', favorites.length, 'товаров');
            if (favorites.length === 0) {
                favoritesGrid.innerHTML = this.getEmptyFavoritesHTML();
            }
            else {
                this.renderFavorites(favoritesGrid, favorites);
            }
        }
        catch (error) {
            console.error('❌ Ошибка загрузки избранного:', error);
            favoritesGrid.innerHTML = this.getErrorFavoritesHTML();
        }
    }
    getEmptyFavoritesHTML() {
        return `
            <div class="cabinet-empty" style="grid-column: 1 / -1;">
                <div class="cabinet-empty__icon">❤️</div>
                <h3 class="cabinet-empty__title">Избранное пусто</h3>
                <p class="cabinet-empty__text">Добавляйте понравившиеся товары в избранное</p>
                <a href="catalog.html" class="cabinet-empty__btn">Перейти в каталог</a>
            </div>
        `;
    }
    getErrorFavoritesHTML() {
        return `
            <div class="cabinet-empty" style="grid-column: 1 / -1;">
                <div class="cabinet-empty__icon">⚠️</div>
                <h3 class="cabinet-empty__title">Ошибка загрузки</h3>
                <p class="cabinet-empty__text">Не удалось загрузить избранное. Попробуйте обновить страницу.</p>
            </div>
        `;
    }
    // =========================================================
    // РЕНДЕР ИЗБРАННОГО
    // =========================================================
    renderFavorites(grid, favorites) {
        console.log('🖼️ Рендерим избранное:', favorites.length, 'товаров');
        const displayItems = favorites.map(item => ({
            id: item.product_id,
            type: item.product_type,
            title: item.product_title,
            price: item.product_price,
            image: item.product_image,
            description: item.product_description || '',
            category: item.product_category || ''
        }));
        grid.innerHTML = displayItems.map(item => `
            <div class="favorite-item" data-id="${item.id}" data-type="${item.type || 'catalog'}">
                <div class="favorite-item__image-wrap">
                    <img src="${item.image || 'placeholder.jpg'}" alt="${item.title}" class="favorite-item__image" loading="lazy" />
                    <button class="favorite-item__remove" data-id="${item.id}" data-type="${item.type || 'catalog'}" title="Удалить из избранного">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="favorite-item__content">
                    <span class="favorite-item__category">${item.category || ''}</span>
                    <h4 class="favorite-item__title">${item.title || 'Товар'}</h4>
                    ${item.description ? `<p class="favorite-item__description">${item.description}</p>` : ''}
                    <div class="favorite-item__footer">
                        <span class="favorite-item__price">${item.price || '0 ₽'}</span>
                        <button class="favorite-item__consult-btn" data-id="${item.id}" data-title="${item.title || 'Товар'}">
                            Записаться на консультацию
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        this.bindFavoritesEvents();
    }
    // =========================================================
    // ПРИВЯЗКА СОБЫТИЙ ДЛЯ ИЗБРАННОГО
    // =========================================================
    bindFavoritesEvents() {
        const self = this;
        document.querySelectorAll('.favorite-item').forEach((card) => {
            card.addEventListener('click', function (e) {
                const target = e.target;
                if (target.closest('.favorite-item__remove') || target.closest('.favorite-item__consult-btn')) {
                    return;
                }
                const id = parseInt(this.dataset.id || '0');
                const type = (this.dataset.type || 'catalog');
                const title = this.querySelector('.favorite-item__title')?.textContent || 'Товар';
                const price = this.querySelector('.favorite-item__price')?.textContent || '0 ₽';
                const image = this.querySelector('.favorite-item__image')?.getAttribute('src') || '';
                const description = this.querySelector('.favorite-item__description')?.textContent || '';
                const category = this.querySelector('.favorite-item__category')?.textContent || '';
                self.openFavoriteDetails({ id, type, title, price, image, description, category });
            });
        });
        document.querySelectorAll('.favorite-item__remove').forEach((btn) => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const id = parseInt(this.dataset.id || '0');
                const type = (this.dataset.type || 'catalog');
                if (id && confirm('Удалить из избранного?')) {
                    self.removeFromFavorites(id, type, this);
                }
            });
        });
        document.querySelectorAll('.favorite-item__consult-btn').forEach((btn) => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const title = this.dataset.title || 'товар';
                self.openConsultationModal(title);
            });
        });
    }
    // =========================================================
    // УДАЛЕНИЕ ИЗ ИЗБРАННОГО (ЧЕРЕЗ API)
    // =========================================================
    async removeFromFavorites(id, type, btn) {
        try {
            const success = await FavoritesService.removeFavorite(id, type);
            if (success) {
                const item = btn.closest('.favorite-item');
                if (item) {
                    item.remove();
                    console.log(`🗑️ Товар ${id} удалён из избранного`);
                    this.showNotification('Товар удалён из избранного');
                    const remaining = document.querySelectorAll('.favorite-item');
                    if (remaining.length === 0) {
                        const gridEl = document.getElementById('favoritesGrid');
                        if (gridEl) {
                            gridEl.innerHTML = this.getEmptyFavoritesHTML();
                        }
                    }
                }
            }
            else {
                this.showNotification('Ошибка удаления');
            }
        }
        catch (error) {
            console.error('❌ Ошибка удаления из избранного:', error);
            this.showNotification('Ошибка удаления');
        }
    }
    // =========================================================
    // МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ ТОВАРА
    // =========================================================
    initDetailsModal() {
        if (!document.getElementById('favoriteDetailsModal')) {
            const modalHTML = `
                <div class="favorite-details-modal" id="favoriteDetailsModal">
                    <div class="favorite-details-modal__overlay"></div>
                    <div class="favorite-details-modal__content">
                        <button class="favorite-details-modal__close" id="favoriteDetailsClose">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                        <div class="favorite-details-modal__body">
                            <div class="favorite-details-modal__image-wrap">
                                <img id="favoriteDetailsImage" src="" alt="" />
                            </div>
                            <div class="favorite-details-modal__info">
                                <span id="favoriteDetailsCategory" class="favorite-details-modal__category"></span>
                                <h3 id="favoriteDetailsTitle">Название товара</h3>
                                <p id="favoriteDetailsDescription">Описание товара</p>
                                <div class="favorite-details-modal__price" id="favoriteDetailsPrice">0 ₽</div>
                                <div class="favorite-details-modal__actions">
                                    <button class="favorite-details-modal__consult-btn" id="favoriteDetailsConsult">
                                        Записаться на консультацию
                                    </button>
                                    <button class="favorite-details-modal__remove-btn" id="favoriteDetailsRemove">
                                        Удалить из избранного
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        this.detailsModal = document.getElementById('favoriteDetailsModal');
        const overlay = this.detailsModal?.querySelector('.favorite-details-modal__overlay');
        overlay?.addEventListener('click', () => this.closeDetailsModal());
        const closeBtn = document.getElementById('favoriteDetailsClose');
        closeBtn?.addEventListener('click', () => this.closeDetailsModal());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.detailsModal?.classList.contains('favorite-details-modal--active')) {
                this.closeDetailsModal();
            }
        });
    }
    openFavoriteDetails(item) {
        if (!this.detailsModal)
            return;
        const img = document.getElementById('favoriteDetailsImage');
        const title = document.getElementById('favoriteDetailsTitle');
        const desc = document.getElementById('favoriteDetailsDescription');
        const price = document.getElementById('favoriteDetailsPrice');
        const category = document.getElementById('favoriteDetailsCategory');
        const consultBtn = document.getElementById('favoriteDetailsConsult');
        const removeBtn = document.getElementById('favoriteDetailsRemove');
        if (img)
            img.src = item.image || 'placeholder.jpg';
        if (title)
            title.textContent = item.title;
        if (desc)
            desc.textContent = item.description || 'Эксклюзивная мебель ручной работы';
        if (price)
            price.textContent = item.price;
        if (category)
            category.textContent = item.category || '';
        const newConsultBtn = consultBtn?.cloneNode(true);
        const newRemoveBtn = removeBtn?.cloneNode(true);
        consultBtn?.parentNode?.replaceChild(newConsultBtn, consultBtn);
        removeBtn?.parentNode?.replaceChild(newRemoveBtn, removeBtn);
        newConsultBtn?.addEventListener('click', () => {
            this.closeDetailsModal();
            this.openConsultationModal(item.title);
        });
        newRemoveBtn?.addEventListener('click', () => {
            if (confirm('Удалить из избранного?')) {
                const btn = document.querySelector(`.favorite-item[data-id="${item.id}"] .favorite-item__remove`);
                if (btn) {
                    this.removeFromFavorites(item.id, item.type, btn);
                }
                this.closeDetailsModal();
            }
        });
        this.detailsModal.classList.add('favorite-details-modal--active');
        document.body.classList.add('no-scroll');
    }
    closeDetailsModal() {
        if (!this.detailsModal)
            return;
        this.detailsModal.classList.remove('favorite-details-modal--active');
        document.body.classList.remove('no-scroll');
    }
    // =========================================================
    // МОДАЛЬНОЕ ОКНО КОНСУЛЬТАЦИИ
    // =========================================================
    openConsultationModal(productTitle) {
        const user = AuthService.getUser();
        const phone = user?.phone || 'Не указан';
        const name = user?.name || 'Клиент';
        const modalHTML = `
            <div class="consult-modal" id="consultModal">
                <div class="consult-modal__overlay"></div>
                <div class="consult-modal__content">
                    <button class="consult-modal__close" id="consultModalClose">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                    <div class="consult-modal__body">
                        <div class="consult-modal__icon">📞</div>
                        <h3 class="consult-modal__title">Запись на консультацию</h3>
                        <p class="consult-modal__subtitle">
                            Вы записываетесь на консультацию по товару<br>
                            <strong>«${productTitle}»</strong>
                        </p>
                        <div class="consult-modal__user-info">
                            <div class="consult-modal__field">
                                <label>Ваше имя</label>
                                <input type="text" id="consultName" value="${name}" />
                            </div>
                            <div class="consult-modal__field">
                                <label>Номер телефона</label>
                                <input type="tel" id="consultPhone" value="${phone}" />
                            </div>
                            <div class="consult-modal__field">
                                <label>Удобное время для звонка</label>
                                <input type="text" id="consultTime" placeholder="Например: завтра с 14:00" />
                            </div>
                            <div class="consult-modal__field">
                                <label>Комментарий</label>
                                <textarea id="consultComment" placeholder="Дополнительная информация..."></textarea>
                            </div>
                        </div>
                        <button class="consult-modal__submit" id="consultSubmit">
                            Отправить заявку
                        </button>
                        <p class="consult-modal__hint">Мы свяжемся с вами в ближайшее время</p>
                    </div>
                </div>
            </div>
        `;
        const oldModal = document.getElementById('consultModal');
        if (oldModal)
            oldModal.remove();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('consultModal');
        const closeBtn = document.getElementById('consultModalClose');
        const overlay = modal?.querySelector('.consult-modal__overlay');
        const submitBtn = document.getElementById('consultSubmit');
        const close = () => {
            modal?.remove();
            document.body.classList.remove('no-scroll');
        };
        closeBtn?.addEventListener('click', close);
        overlay?.addEventListener('click', close);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal) {
                close();
            }
        });
        submitBtn?.addEventListener('click', () => {
            const consultName = document.getElementById('consultName')?.value || '';
            const consultPhone = document.getElementById('consultPhone')?.value || '';
            const consultTime = document.getElementById('consultTime')?.value || '';
            const consultComment = document.getElementById('consultComment')?.value || '';
            if (!consultName || consultName.length < 2) {
                alert('Пожалуйста, введите ваше имя');
                return;
            }
            if (!consultPhone || consultPhone.length < 5) {
                alert('Пожалуйста, введите номер телефона');
                return;
            }
            console.log('📞 Заявка на консультацию:', {
                product: productTitle,
                name: consultName,
                phone: consultPhone,
                time: consultTime,
                comment: consultComment,
                user: AuthService.getUser()
            });
            this.showNotification('Заявка отправлена! Мы свяжемся с вами.');
            close();
        });
        document.body.classList.add('no-scroll');
    }
    // =========================================================
    // УВЕДОМЛЕНИЯ
    // =========================================================
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 14px 24px;
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
    // СМЕНА ПАРОЛЯ
    // =========================================================
    initPasswordChange() {
        const saveBtn = document.getElementById('changePasswordBtn');
        const currentInput = document.getElementById('currentPassword');
        const newInput = document.getElementById('newPassword');
        const confirmInput = document.getElementById('confirmPassword');
        if (!saveBtn)
            return;
        saveBtn.addEventListener('click', () => {
            const current = currentInput.value;
            const newPass = newInput.value;
            const confirm = confirmInput.value;
            if (!current || !newPass || !confirm) {
                alert('Заполните все поля');
                return;
            }
            if (newPass.length < 6) {
                alert('Новый пароль должен содержать минимум 6 символов');
                return;
            }
            if (newPass !== confirm) {
                alert('Пароли не совпадают');
                return;
            }
            alert('✅ Пароль успешно изменён!');
            currentInput.value = '';
            newInput.value = '';
            confirmInput.value = '';
            console.log('🔑 Пароль изменён');
        });
    }
    // =========================================================
    // ХЕДЕР
    // =========================================================
    initHeader() {
        AuthModal.updateHeaderButton();
        window.addEventListener('logout', () => {
            console.log('🚪 Выход из аккаунта');
            window.location.href = 'index.html';
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    console.log('📂 Личный кабинет: DOM загружен');
    new CabinetModule();
});
//# sourceMappingURL=cabinet.js.map