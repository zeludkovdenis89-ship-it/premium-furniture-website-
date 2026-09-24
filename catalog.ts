// =========================================================
// КАТАЛОГ — ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ ВЕРСИЯ
// =========================================================

import FavoritesService, { FavoriteItem } from './auth/FavoritesService.js';

// =========================================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// =========================================================

interface Master {
    name: string;
    role: string;
    experience: string;
    avatar: string;
    quote: string;
    link: string;
}

interface CatalogItem {
    id: number;
    title: string;
    category: string;
    price: string;
    material: string;
    image: string;
    description: string;
    dimensions: string;
    weight: string;
    guarantee: string;
    master: Master;
}

// =========================================================
// ДАННЫЕ КАТАЛОГА (8 ТОВАРОВ)
// =========================================================

const catalogItems: CatalogItem[] = [
    {
        id: 1,
        title: 'Стол «Элеганс»',
        category: 'Столы',
        price: '145 000 ₽',
        material: 'Дуб, металл',
        image: 'kabinet-rukovoditelya-woodstone.png',
        description: 'Элегантный обеденный стол с изящными ножками и столешницей из массива дуба.',
        dimensions: '180 × 90 × 75 см',
        weight: '85 кг',
        guarantee: '5 лет',
        master: {
            name: 'Александр К.',
            role: 'Мастер-столяр',
            experience: '12 лет',
            avatar: 'avatars/master1.jpg',
            quote: 'Древесина — живой материал.',
            link: '#master-alexandr'
        }
    },
    {
        id: 2,
        title: 'Диван «Гармония»',
        category: 'Диваны',
        price: '89 000 ₽',
        material: 'Орех, велюр',
        image: 'Мебель из массива дуба_ Процессы создания.png',
        description: 'Уютный диван с плавными линиями и мягкой велюровой обивкой.',
        dimensions: '80 × 85 × 70 см',
        weight: '32 кг',
        guarantee: '3 года',
        master: {
            name: 'Елена М.',
            role: 'Мастер-резчик',
            experience: '8 лет',
            avatar: 'avatars/master2.jpg',
            quote: 'В каждом изгибе — душа дерева.',
            link: '#master-elena'
        }
    },
    {
        id: 3,
        title: 'Шкаф «Флора»',
        category: 'Шкафы',
        price: '210 000 ₽',
        material: 'Массив ясеня, стекло',
        image: 'shkaf-raspashnoj-v-zal-v-sovremennom-stile.png',
        description: 'Вместительный шкаф с резными фасадами и стеклянными вставками.',
        dimensions: '200 × 60 × 220 см',
        weight: '120 кг',
        guarantee: '7 лет',
        master: {
            name: 'Дмитрий С.',
            role: 'Мастер-столяр',
            experience: '15 лет',
            avatar: 'avatars/master3.jpg',
            quote: 'Шкаф — это хранение историй.',
            link: '#master-dmitry'
        }
    },
    {
        id: 4,
        title: 'Комод «Ренессанс»',
        category: 'Комоды',
        price: '98 000 ₽',
        material: 'Махагон, латунь',
        image: '908045.png',
        description: 'Изысканный комод с ручной фрезеровкой и латунными ручками.',
        dimensions: '120 × 45 × 90 см',
        weight: '55 кг',
        guarantee: '5 лет',
        master: {
            name: 'Андрей В.',
            role: 'Мастер-фрезеровщик',
            experience: '10 лет',
            avatar: 'avatars/master4.jpg',
            quote: 'Каждая линия — диалог с деревом.',
            link: '#master-andrey'
        }
    },
    {
        id: 5,
        title: 'Кровать «Люкс»',
        category: 'Кровати',
        price: '320 000 ₽',
        material: 'Орех, натуральная кожа',
        image: 'NK263.24_interior_2.png',
        description: 'Роскошная кровать с высоким изголовьем и резными ножками.',
        dimensions: '200 × 180 × 120 см',
        weight: '150 кг',
        guarantee: '10 лет',
        master: {
            name: 'Сергей П.',
            role: 'Мастер-столяр',
            experience: '20 лет',
            avatar: 'avatars/master5.jpg',
            quote: 'Кровать должна быть особенной.',
            link: '#master-sergey'
        }
    },
    {
        id: 6,
        title: 'Стеллаж «Арт»',
        category: 'Стеллажи',
        price: '75 000 ₽',
        material: 'Береза, металл',
        image: 'i0000167720-detail.png',
        description: 'Современный стеллаж с открытыми полками и металлическим каркасом.',
        dimensions: '150 × 40 × 200 см',
        weight: '45 кг',
        guarantee: '3 года',
        master: {
            name: 'Михаил К.',
            role: 'Мастер-металлист',
            experience: '7 лет',
            avatar: 'avatars/master6.jpg',
            quote: 'Металл и дерево — идеальный союз.',
            link: '#master-mikhail'
        }
    },
    {
        id: 7,
        title: 'Консоль «Милан»',
        category: 'Консоли',
        price: '67 000 ₽',
        material: 'Орех, мрамор',
        image: 'bybse499cwkxvcdkym1v4538zluz5mab.png',
        description: 'Изящная консоль с мраморной столешницей и резными ножками.',
        dimensions: '100 × 35 × 85 см',
        weight: '38 кг',
        guarantee: '4 года',
        master: {
            name: 'Ольга Г.',
            role: 'Мастер-резчик',
            experience: '9 лет',
            avatar: 'avatars/master7.jpg',
            quote: 'Камень и дерево — единое целое.',
            link: '#master-olga'
        }
    },
    {
        id: 8,
        title: 'Тумба «София»',
        category: 'Тумбы',
        price: '54 000 ₽',
        material: 'Дуб, ротанг',
        image: 'tumba.png',
        description: 'Стильная прикроватная тумба с плетёными вставками из ротанга.',
        dimensions: '50 × 40 × 60 см',
        weight: '18 кг',
        guarantee: '3 года',
        master: {
            name: 'Ирина Л.',
            role: 'Мастер-плетельщик',
            experience: '6 лет',
            avatar: 'avatars/master8.jpg',
            quote: 'Ротанг — материал живых линий.',
            link: '#master-irina'
        }
    }
];

// =========================================================
// ОСНОВНОЙ КОД
// =========================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ Каталог: скрипт загружен');

    // 1. ПРЕЛОАДЕР
    const preloader = document.getElementById('catalogPreloader') as HTMLElement | null;
    const siteWrapper = document.getElementById('siteWrapper') as HTMLElement | null;

    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('catalog-preloader--hidden');
            setTimeout(() => {
                if (preloader) preloader.style.display = 'none';
                if (siteWrapper) siteWrapper.classList.add('site-wrapper--visible');
                animateHeader();
                animateHero();
                loadCatalogItems();
            }, 500);
        }, 1200);
    } else {
        if (siteWrapper) siteWrapper.classList.add('site-wrapper--visible');
        animateHeader();
        animateHero();
        loadCatalogItems();
    }

    // 2. FOOTER
    forceShowFooter();
    setTimeout(forceShowFooter, 200);

    // 3. ИНИЦИАЛИЗАЦИЯ UI
    initBurger();
    initModal();
    initHeaderScroll();
    initServicesDropdown();
});

// =========================================================
// УВЕДОМЛЕНИЯ
// =========================================================

function showNotification(message: string): void {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.custom-notification');
    oldNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = 'custom-notification';
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
        z-index: 99999;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        max-width: 400px;
        pointer-events: none;
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
            if (notification.parentNode) notification.remove();
        }, 500);
    }, 2500);
}

// =========================================================
// РАБОТА С ИЗБРАННЫМ (ИСПРАВЛЕННАЯ)
// =========================================================

let isProcessingFavorite = false;

async function initFavoriteButtons(): Promise<void> {
    const buttons = document.querySelectorAll<HTMLElement>('.favorite-btn');
    
    buttons.forEach((btn) => {
        // 🔥 Убеждаемся, что кнопка НЕ submit
        btn.setAttribute('type', 'button');
        
        // 🔥 Удаляем все старые обработчики
        const newBtn = btn.cloneNode(true) as HTMLElement;
        if (btn.parentNode) {
            btn.parentNode.replaceChild(newBtn, btn);
        }
        
        // 🔥 Добавляем новый обработчик
        newBtn.addEventListener('click', handleFavoriteClick);
    });
}

async function handleFavoriteClick(e: Event): Promise<void> {
    // 🔥🔥🔥 КРИТИЧЕСКИ ВАЖНО: блокируем перезагрузку
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (isProcessingFavorite) {
        console.log('⏳ Уже обрабатывается');
        return;
    }
    
    const target = e.currentTarget as HTMLElement;
    const id = parseInt(target.dataset.id || '0');
    const type = (target.dataset.type || 'catalog') as 'catalog' | 'project';
    
    if (!id) {
        console.warn('⚠️ Нет ID товара');
        return;
    }
    
    console.log(`🔄 Клик по избранному: id=${id}, type=${type}`);
    isProcessingFavorite = true;
    
    // Сохраняем оригинальный текст
    const originalText = target.textContent || '☆ Добавить в избранное';
    target.textContent = '⏳ ...';
    target.style.opacity = '0.6';
    target.style.pointerEvents = 'none';
    
    try {
        // Проверяем токен
        const token = localStorage.getItem('manomaestro_token') || sessionStorage.getItem('manomaestro_token');
        if (!token) {
            showNotification('⚠️ Войдите в аккаунт, чтобы добавить в избранное');
            target.textContent = originalText;
            target.style.opacity = '1';
            target.style.pointerEvents = 'auto';
            isProcessingFavorite = false;
            return;
        }
        
        const isFav = await FavoritesService.isFavorite(id, type);
        console.log(`🔍 Товар ${id} в избранном: ${isFav}`);
        
        if (isFav) {
            // УДАЛЕНИЕ
            const success = await FavoritesService.removeFavorite(id, type);
            if (success) {
                updateButtonState(target, false);
                updateAllRelatedButtons(id, false);
                showNotification('🗑️ Удалено из избранного');
                console.log(`🗑️ Удален из избранного: ${id}`);
            } else {
                showNotification('⚠️ Ошибка при удалении');
                target.textContent = originalText;
                target.style.opacity = '1';
                target.style.pointerEvents = 'auto';
            }
        } else {
            // ДОБАВЛЕНИЕ
            const card = target.closest('.catalog-item') || target.closest('.project-card') || target.closest('.product-modal');
            
            if (card) {
                let title = 'Товар';
                let price = '0 ₽';
                let image = '';
                let category = '';
                let description = '';

                if (card.classList.contains('catalog-item')) {
                    title = card.querySelector('.catalog-item__title')?.textContent?.trim() || 'Товар';
                    price = card.querySelector('.catalog-item__price')?.textContent?.trim() || '0 ₽';
                    image = card.querySelector('img')?.getAttribute('src') || '';
                    category = card.querySelector('.catalog-item__category')?.textContent?.trim() || '';
                    description = card.querySelector('.catalog-item__description')?.textContent?.trim() || '';
                } else if (card.classList.contains('product-modal')) {
                    title = card.querySelector('.product-modal__title')?.textContent?.trim() || 'Товар';
                    price = card.querySelector('.product-modal__price')?.textContent?.trim() || '0 ₽';
                    image = card.querySelector('.product-modal__image')?.getAttribute('src') || '';
                    category = card.querySelector('.product-modal__badge')?.textContent?.trim() || '';
                    description = card.querySelector('.product-modal__desc')?.textContent?.trim() || '';
                }
                
                const success = await FavoritesService.addFavorite({
                    productId: id,
                    productType: type,
                    title: title,
                    price: price,
                    image: image,
                    category: category,
                    description: description
                });
                
                if (success) {
                    updateButtonState(target, true);
                    updateAllRelatedButtons(id, true);
                    showNotification('❤️ Добавлено в избранное');
                    console.log(`❤️ Добавлен в избранное: ${title}`);
                } else {
                    showNotification('⚠️ Ошибка при добавлении');
                    target.textContent = originalText;
                    target.style.opacity = '1';
                    target.style.pointerEvents = 'auto';
                }
            } else {
                console.warn('⚠️ Не найдена карточка товара');
                target.textContent = originalText;
                target.style.opacity = '1';
                target.style.pointerEvents = 'auto';
            }
        }
    } catch (error) {
        console.error('❌ Ошибка при работе с избранным:', error);
        showNotification('⚠️ Ошибка соединения с сервером');
        target.textContent = originalText;
        target.style.opacity = '1';
        target.style.pointerEvents = 'auto';
    } finally {
        isProcessingFavorite = false;
    }
}

function updateButtonState(btn: HTMLElement, isFavorite: boolean): void {
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    
    if (isFavorite) {
        btn.textContent = '★ В избранном';
        btn.classList.add('favorite-btn--active');
    } else {
        btn.textContent = '☆ Добавить в избранное';
        btn.classList.remove('favorite-btn--active');
    }
}

function updateAllRelatedButtons(productId: number, isFavorite: boolean): void {
    const allBtns = document.querySelectorAll<HTMLElement>(`.favorite-btn[data-id="${productId}"]`);
    allBtns.forEach(btn => {
        updateButtonState(btn, isFavorite);
    });
}

// =========================================================
// ЗАГРУЗКА КАРТОЧЕК
// =========================================================

async function loadCatalogItems(): Promise<void> {
    const grid = document.getElementById('catalogGrid') as HTMLElement | null;
    
    if (!grid) {
        console.error('❌ Сетка каталога (catalogGrid) не найдена!');
        return;
    }

    // Загружаем избранное
    let favorites: FavoriteItem[] = [];
    try {
        favorites = await FavoritesService.getFavorites();
        console.log(`📥 Загружено избранное: ${favorites.length} товаров`);
    } catch (error) {
        console.warn('⚠️ Не удалось загрузить избранное:', error);
    }

    let html = '';
    catalogItems.forEach((item) => {
        const isFavorite = favorites.some(f => f.product_id === item.id && f.product_type === 'catalog');
        const btnText = isFavorite ? '★ В избранном' : '☆ Добавить в избранное';
        const btnClass = isFavorite ? 'favorite-btn--active' : '';
        
        html += `
            <div class="catalog-item" data-id="${item.id}" data-product='${JSON.stringify(item).replace(/'/g, "&#39;")}'>
                <div class="catalog-item__image-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="catalog-item__image" loading="lazy" />
                    <span class="catalog-item__category">${item.category}</span>
                    
                    <!-- 🔥 type="button" ОБЯЗАТЕЛЬНО -->
                    <button type="button" class="favorite-btn catalog-item__favorite-btn ${btnClass}" data-id="${item.id}" data-type="catalog">
                        ${btnText}
                    </button>
                </div>
                
                <div class="catalog-item__content">
                    <h3 class="catalog-item__title">${item.title}</h3>
                    <p class="catalog-item__material">${item.material}</p>
                    <p class="catalog-item__description">${item.description}</p>
                    <div class="catalog-item__footer">
                        <span class="catalog-item__price">${item.price}</span>
                        <!-- 🔥 type="button" ОБЯЗАТЕЛЬНО -->
                        <button type="button" class="catalog-item__btn">Изучить мебель →</button>
                    </div>
                </div>
                
                <div class="catalog-item__master">
                    <img src="${item.master.avatar}" alt="${item.master.name}" class="catalog-item__master-avatar" />
                    <div class="catalog-item__master-info">
                        <a href="${item.master.link}" class="catalog-item__master-name">${item.master.name}</a>
                        <span class="catalog-item__master-role">${item.master.role}, ${item.master.experience}</span>
                    </div>
                    <a href="${item.master.link}" class="catalog-item__master-link">→</a>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;

    // Анимация
    animateCatalogItems();

    // Инициализация кнопок избранного
    await initFavoriteButtons();

    // 🔥 Делегирование событий для кликов по карточкам
    grid.addEventListener('click', function(e: MouseEvent) {
        const target = e.target as HTMLElement;
        
        // Если кликнули на кнопку избранного - ничего не делаем
        if (target.closest('.favorite-btn')) {
            return;
        }

        // Если кликнули на кнопку "Изучить мебель"
        const studyBtn = target.closest('.catalog-item__btn');
        if (studyBtn) {
            e.preventDefault();
            const card = studyBtn.closest('.catalog-item');
            if (card) openProductFromCard(card);
            return;
        }

        // Если кликнули на ссылку мастера - пусть переходит
        if (target.closest('a')) {
            return;
        }

        // Иначе открываем модалку товара
        const card = target.closest('.catalog-item');
        if (card) {
            openProductFromCard(card);
        }
    });
}

function openProductFromCard(card: Element): void {
    const productData = card.getAttribute('data-product');
    if (productData) {
        try {
            const product: CatalogItem = JSON.parse(productData);
            openProductModal(product);
        } catch (error) {
            console.error('Ошибка парсинга данных товара:', error);
        }
    }
}

// =========================================================
// МОДАЛЬНОЕ ОКНО ТОВАРА
// =========================================================

async function openProductModal(product: CatalogItem): Promise<void> {
    if (document.getElementById('productModal')) return;

    let isFavorite = false;
    try {
        isFavorite = await FavoritesService.isFavorite(product.id, 'catalog');
    } catch (error) {
        console.warn('⚠️ Не удалось проверить избранное:', error);
    }

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'product-modal-overlay';
    modalOverlay.id = 'productModal';

    const btnText = isFavorite ? '★ В избранном' : '☆ Добавить в избранное';
    const btnClass = isFavorite ? 'favorite-btn--active' : '';

    modalOverlay.innerHTML = `
        <div class="product-modal">
            <button type="button" class="product-modal__close" id="productModalClose">
                <span></span><span></span>
            </button>
            
            <div class="product-modal__image-wrapper">
                <img src="${product.image}" alt="${product.title}" class="product-modal__image" />
                <span class="product-modal__badge">${product.category}</span>
            </div>
            
            <div class="product-modal__body">
                <span class="product-modal__material">${product.material}</span>
                <h2 class="product-modal__title">${product.title}</h2>
                <p class="product-modal__desc">${product.description}</p>
                
                <div class="product-modal__specs">
                    <div class="product-modal__spec-item">
                        <span class="product-modal__spec-label">📐 Размеры</span>
                        <span class="product-modal__spec-value">${product.dimensions}</span>
                    </div>
                    <div class="product-modal__spec-item">
                        <span class="product-modal__spec-label">⚖️ Вес</span>
                        <span class="product-modal__spec-value">${product.weight}</span>
                    </div>
                    <div class="product-modal__spec-item">
                        <span class="product-modal__spec-label">🛡️ Гарантия</span>
                        <span class="product-modal__spec-value">${product.guarantee}</span>
                    </div>
                </div>
                
                <div class="product-modal__master">
                    <div class="product-modal__master-avatar">
                        <img src="${product.master.avatar}" alt="${product.master.name}" />
                    </div>
                    <div class="product-modal__master-info">
                        <h4 class="product-modal__master-name">${product.master.name}</h4>
                        <p class="product-modal__master-role">${product.master.role}, ${product.master.experience}</p>
                        <p class="product-modal__master-quote">«${product.master.quote}»</p>
                        <a href="${product.master.link}" class="product-modal__master-link">Страница мастера →</a>
                    </div>
                </div>
                
                <div class="product-modal__footer">
                    <span class="product-modal__price">${product.price}</span>
                    <div class="product-modal__actions">
                        <button type="button" class="product-modal__btn" id="productModalConsult">📞 Консультация</button>
                        <!-- 🔥 type="button" ОБЯЗАТЕЛЬНО -->
                        <button type="button" class="product-modal__favorite-btn ${btnClass}" data-id="${product.id}" data-type="catalog">
                            ${btnText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);
    document.body.classList.add('no-scroll');

    requestAnimationFrame(() => {
        modalOverlay.classList.add('product-modal-overlay--active');
    });

    // Закрытие
    const closeBtn = document.getElementById('productModalClose');
    closeBtn?.addEventListener('click', () => closeProductModal(modalOverlay));

    modalOverlay.addEventListener('click', (e: MouseEvent) => {
        if (e.target === modalOverlay) closeProductModal(modalOverlay);
    });

    const escHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeProductModal(modalOverlay);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Консультация
    document.getElementById('productModalConsult')?.addEventListener('click', () => {
        alert(`📞 Заявка на консультацию по "${product.title}"`);
        closeProductModal(modalOverlay);
    });

    // Избранное в модалке
    const favBtn = modalOverlay.querySelector('.product-modal__favorite-btn');
    if (favBtn) {
        favBtn.addEventListener('click', handleFavoriteClick);
    }
}

function closeProductModal(modalOverlay: HTMLElement): void {
    modalOverlay.classList.remove('product-modal-overlay--active');
    document.body.classList.remove('no-scroll');
    setTimeout(() => modalOverlay.remove(), 400);
}

// =========================================================
// АНИМАЦИИ И UI ФУНКЦИИ
// =========================================================

function forceShowFooter(): void {
    const footer = document.querySelector('.footer') as HTMLElement | null;
    if (footer) {
        Object.assign(footer.style, {
            display: 'block',
            opacity: '1',
            visibility: 'visible',
            transform: 'none',
            pointerEvents: 'auto',
            position: 'relative'
        });
        footer.classList.add('footer--visible');
    }
}

function animateHeader(): void {
    const logo = document.querySelector('.logo') as HTMLElement | null;
    if (logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'translateX(-30px) scale(0.9)';
        setTimeout(() => {
            logo.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            logo.style.opacity = '1';
            logo.style.transform = 'translateX(0) scale(1)';
        }, 100);
    }
    // ... остальная анимация ...
}

function animateHero(): void {
    const hero = document.querySelector('.catalog-hero') as HTMLElement | null;
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px) scale(0.98)';
        setTimeout(() => {
            hero.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0) scale(1)';
        }, 300);
    }
}

function animateCatalogItems(): void {
    const items = document.querySelectorAll<HTMLElement>('.catalog-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(40px) scale(0.95)';
        setTimeout(() => {
            item.style.transition = 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, 300 + (index * 80));
    });
}

// =========================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =========================================================

function initBurger(): void {
    const burger = document.getElementById('burger') as HTMLElement | null;
    const mobileMenu = document.getElementById('mobileMenu') as HTMLElement | null;
    const mobileMenuClose = document.getElementById('mobileMenuClose') as HTMLElement | null;
    
    if (!burger || !mobileMenu) return;

    const toggleMenu = () => {
        const isActive = mobileMenu.classList.contains('mobile-menu--active');
        burger.classList.toggle('burger--active');
        mobileMenu.classList.toggle('mobile-menu--active');
        document.body.classList.toggle('no-scroll');
    };

    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    mobileMenuClose?.addEventListener('click', toggleMenu);
    
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('mobile-menu--active') && 
            !mobileMenu.contains(e.target as Node) && 
            !burger.contains(e.target as Node)) {
            toggleMenu();
        }
    });
}

function initModal(): void {
    const toggle = document.getElementById('mobileServicesToggle') as HTMLElement | null;
    const modal = document.getElementById('servicesModal') as HTMLElement | null;
    const close = document.getElementById('modalClose') as HTMLElement | null;
    
    if (!modal) return;

    const open = () => {
        modal.classList.add('modal-overlay--active');
        document.body.classList.add('no-scroll');
    };
    const closeFn = () => {
        modal.classList.remove('modal-overlay--active');
        document.body.classList.remove('no-scroll');
    };

    toggle?.addEventListener('click', (e) => {
        e.preventDefault();
        open();
    });
    close?.addEventListener('click', closeFn);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeFn();
    });
}

function initHeaderScroll(): void {
    const header = document.getElementById('header') as HTMLElement | null;
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('header--scrolled', window.pageYOffset > 80);
        });
    }
}

function initServicesDropdown(): void {
    const toggle = document.getElementById('servicesToggle') as HTMLElement | null;
    const dropdown = document.getElementById('servicesDropdown') as HTMLElement | null;

    if (toggle && dropdown) {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 1200) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
    }
}