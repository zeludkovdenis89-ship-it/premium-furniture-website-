"use strict";
// =========================================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// =========================================================
// =========================================================
// ОСНОВНОЙ МОДУЛЬ
// =========================================================
class ProjectsModule {
    constructor() {
        this.preloader = null;
        this.siteWrapper = null;
        this.grid = null;
        this.isModalOpening = false;
        this.isReviewsOpening = false;
        this.closeReviewsModal = () => {
            const modalOverlay = document.getElementById('reviewsModal');
            if (!modalOverlay)
                return;
            modalOverlay.classList.remove('reviews-modal-overlay--active');
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                modalOverlay.remove();
            }, 400);
        };
        this.closeProjectModal = (modalOverlay) => {
            modalOverlay.classList.remove('project-modal-overlay--active');
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                modalOverlay.remove();
            }, 400);
        };
        console.log('✨ Проекты: конструктор вызван');
        this.init();
    }
    init() {
        console.log('✨ Проекты: скрипт загружен');
        this.preloader = document.getElementById('projectsPreloader');
        this.siteWrapper = document.getElementById('siteWrapper');
        this.grid = document.getElementById('projectsGrid');
        console.log('🔍 Прелоадер найден:', !!this.preloader);
        console.log('🔍 Обёртка найдена:', !!this.siteWrapper);
        console.log('🔍 Сетка найдена:', !!this.grid);
        // Если DOM ещё не загружен — ждём
        if (document.readyState === 'loading') {
            console.log('⏳ DOM загружается, ждём...');
            document.addEventListener('DOMContentLoaded', () => {
                this.handleDOMContentLoaded();
            });
        }
        else {
            // DOM уже загружен — запускаем сразу
            console.log('✅ DOM уже загружен, запускаем...');
            this.handleDOMContentLoaded();
        }
    }
    // =========================================================
    // DOM CONTENT LOADED
    // =========================================================
    handleDOMContentLoaded() {
        console.log('📄 DOMContentLoaded сработал!');
        // 1. ПРЕЛОАДЕР
        if (this.preloader) {
            console.log('🔄 Прелоадер проектов: запущен');
            setTimeout(() => {
                console.log('✅ Прелоадер проектов: скрываем');
                this.preloader.classList.add('projects-preloader--hidden');
                setTimeout(() => {
                    if (this.preloader) {
                        this.preloader.style.display = 'none';
                        console.log('💀 Прелоадер полностью скрыт');
                    }
                    // Активация анимаций
                    if (this.siteWrapper) {
                        this.siteWrapper.classList.add('site-wrapper--visible');
                    }
                    this.animateHeader();
                    this.animateProjectsHero();
                    this.animateStats();
                    this.animateGridHeader();
                    this.animateCarouselControls();
                    this.animateProjectCards();
                }, 500);
            }, 1200);
        }
        else {
            console.warn('⚠️ Прелоадер НЕ НАЙДЕН! Проверь id="projectsPreloader"');
        }
        // 2. ПРИНУДИТЕЛЬНО ПОКАЗЫВАЕМ FOOTER
        this.forceShowFooter();
        setTimeout(() => this.forceShowFooter(), 200);
        // 3. ПОДГРУЖАЕМ ПРОЕКТЫ
        this.loadProjects();
        // 4. ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ
        this.initBurger();
        this.initServicesDropdown();
        this.initCarousel();
        this.initHeaderScroll();
    }
    // =========================================================
    // FOOTER
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
    // АНИМАЦИИ
    // =========================================================
    animateHeader() {
        console.log('🎯 Анимация header проектов: запущена');
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
            const delay = 150 + (index * 80);
            setTimeout(() => {
                link.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, delay);
        });
        const phone = document.querySelector('.header__phone');
        if (phone) {
            phone.style.opacity = '0';
            phone.style.transform = 'translateX(30px) scale(0.9)';
            const delay = 150 + (navLinks.length * 80);
            setTimeout(() => {
                phone.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                phone.style.opacity = '1';
                phone.style.transform = 'translateX(0) scale(1)';
            }, delay);
        }
        const burger = document.querySelector('.burger');
        if (burger) {
            burger.style.opacity = '0';
            burger.style.transform = 'scale(0.5) rotate(-90deg)';
            const delay = 200 + (navLinks.length * 80);
            setTimeout(() => {
                burger.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                burger.style.opacity = '1';
                burger.style.transform = 'scale(1) rotate(0deg)';
            }, delay);
        }
        const dropdownArrow = document.querySelector('.dropdown-arrow');
        if (dropdownArrow) {
            dropdownArrow.style.opacity = '0';
            dropdownArrow.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                dropdownArrow.style.transition = 'all 0.5s ease';
                dropdownArrow.style.opacity = '1';
                dropdownArrow.style.transform = 'translateY(0)';
            }, 300 + (navLinks.length * 80));
        }
        console.log(`✅ Header проектов: анимировано ${navLinks.length + 3} элементов`);
    }
    animateProjectsHero() {
        const hero = document.querySelector('.projects-hero');
        if (hero) {
            hero.style.transition = 'none';
            hero.style.opacity = '0';
            hero.style.transform = 'translateY(30px) scale(0.98)';
            void hero.offsetHeight;
            hero.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0) scale(1)';
        }
    }
    animateStats() {
        const stats = document.querySelector('.projects-stats');
        if (stats) {
            stats.style.transition = 'none';
            stats.style.opacity = '0';
            stats.style.transform = 'translateY(30px)';
            void stats.offsetHeight;
            stats.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            stats.style.opacity = '1';
            stats.style.transform = 'translateY(0)';
        }
        // Счётчики
        const counters = document.querySelectorAll('.projects-stats__number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target || '0', 10);
            if (!target)
                return;
            let current = 0;
            const duration = 2000;
            const step = Math.ceil(target / 40);
            const interval = Math.floor(duration / (target / step));
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current + (target > 100 ? '+' : '');
            }, interval);
        });
    }
    animateGridHeader() {
        const header = document.querySelector('.projects-grid__header');
        if (header) {
            header.style.transition = 'none';
            header.style.opacity = '0';
            header.style.transform = 'translateY(20px)';
            void header.offsetHeight;
            header.style.transition = 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }
    }
    animateCarouselControls() {
        const controls = document.querySelector('.carousel-controls-wrapper');
        if (controls) {
            controls.style.transition = 'none';
            controls.style.opacity = '0';
            controls.style.transform = 'translateY(15px)';
            void controls.offsetHeight;
            controls.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            controls.style.opacity = '1';
            controls.style.transform = 'translateY(0)';
        }
    }
    animateProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            const delay = 0.08 * (index + 1);
            card.style.transition = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) scale(0.95)';
            void card.offsetHeight;
            setTimeout(() => {
                card.style.transition = 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, delay * 1000);
        });
        console.log(`✨ ${cards.length} карточек анимировано`);
    }
    // =========================================================
    // ГЕНЕРАЦИЯ ЗВЁЗД
    // =========================================================
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        let html = '';
        for (let i = 0; i < fullStars; i++) {
            html += '<span class="star star--filled">★</span>';
        }
        if (hasHalf) {
            html += '<span class="star star--half">★</span>';
        }
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            html += '<span class="star star--empty">★</span>';
        }
        return html;
    }
    // =========================================================
    // ЗАГРУЗКА ПРОЕКТОВ
    // =========================================================
    loadProjects() {
        if (!this.grid) {
            console.error('❌ Сетка проектов не найдена!');
            return;
        }
        const existingCards = this.grid.querySelectorAll('.project-card');
        if (existingCards.length > 0) {
            console.log(`✅ В HTML уже есть ${existingCards.length} карточек`);
            setTimeout(() => {
                this.initGalleries();
                this.initCarousel();
                this.initProjectClicks();
                this.animateProjectCards();
            }, 500);
            return;
        }
        console.log('📦 Загружаем проекты из JS');
        const projects = [
            {
                id: 1,
                title: 'Классический особняк в Барвихе',
                location: '📍 Барвиха, Московская область',
                category: 'Интерьер',
                images: [
                    './public/images/dizayn-i-remont-doma-v-kp-lesnaya-polyana-v-stile-sovremennyy-1-etazh-kukhnya-gostinaya-foto-20.png',
                    './public/images/zagorodniy.dom_03.png',
                    './public/images/images.png'
                ],
                description: 'Полная реконструкция интерьера с использованием мебели из массива дуба. Проект в стиле английской классики с элементами ар-деко.',
                advantages: [
                    '🪑 Мебель из массива дуба',
                    '✨ Ручная резьба по дереву',
                    '🏛️ Английская классика',
                    '🎨 Ар-деко элементы'
                ],
                year: '2025',
                area: '320 м²',
                style: 'Классический',
                rating: 4.9,
                reviewsCount: 14,
                reviews: [
                    {
                        name: 'Екатерина В.',
                        date: '12 марта 2025',
                        rating: 5,
                        text: 'Потрясающая работа! Мебель выглядит ещё лучше, чем на эскизах. Мастера — настоящие художники.'
                    },
                    {
                        name: 'Михаил С.',
                        date: '28 февраля 2025',
                        rating: 5,
                        text: 'Долго выбирали исполнителя. Не ошиблись! Качество на высшем уровне, все сроки соблюдены.'
                    },
                    {
                        name: 'Анна К.',
                        date: '15 января 2025',
                        rating: 4,
                        text: 'Очень красиво, но немного затянули с доставкой. В остальном — идеально.'
                    }
                ]
            },
            {
                id: 2,
                title: 'Современный лофт в центре Москвы',
                location: '📍 Москва, Патриаршие пруды',
                category: 'Интерьер',
                images: [
                    './public/images/5290518.png',
                    './public/images/stil-loft.png',
                    './public/images/5000_5000_s174.png'
                ],
                description: 'Минималистичный интерьер с акцентными элементами из ореха и натуральной кожи. Сочетание современных технологий и ручной работы.',
                advantages: [
                    '🛋️ Мебель из ореха',
                    '🧵 Натуральная кожа',
                    '💡 Современные технологии',
                    '✨ Ручная работа'
                ],
                year: '2024',
                area: '180 м²',
                style: 'Лофт',
                rating: 4.8,
                reviewsCount: 9,
                reviews: [
                    {
                        name: 'Дмитрий П.',
                        date: '20 февраля 2024',
                        rating: 5,
                        text: 'Идеальный проект для современного человека. Мебель смотрится дорого и стильно.'
                    },
                    {
                        name: 'Ольга Н.',
                        date: '5 января 2024',
                        rating: 5,
                        text: 'Спасибо команде Manomaestro за этот шедевр. Интерьер теперь дышит по-новому!'
                    }
                ]
            },
            {
                id: 3,
                title: 'Скандинавский дом в Серебряном Бору',
                location: '📍 Серебряный Бор, Москва',
                category: 'Архитектура + Интерьер',
                images: [
                    './public/images/images1.png',
                    './public/images/6777884416.png',
                    './public/images/image2.png'
                ],
                description: 'Проект дома в скандинавском стиле с панорамными окнами и мебелью из светлого ясеня. Единство с природой в каждой детали.',
                advantages: [
                    '🌿 Мебель из ясеня',
                    '🪟 Панорамные окна',
                    '❄️ Скандинавский стиль',
                    '🌳 Единство с природой'
                ],
                year: '2024',
                area: '250 м²',
                style: 'Скандинавский',
                rating: 4.7,
                reviewsCount: 7,
                reviews: [
                    {
                        name: 'Алексей И.',
                        date: '10 октября 2024',
                        rating: 5,
                        text: 'Дом мечты! Мебель из ясеня создаёт невероятную атмосферу уюта.'
                    },
                    {
                        name: 'Наталья С.',
                        date: '25 августа 2024',
                        rating: 4,
                        text: 'Очень красиво, экологично. Единственное — хотелось бы больше вариантов отделки.'
                    }
                ]
            },
            {
                id: 4,
                title: 'Неоклассика в Жуковке',
                location: '📍 Жуковка, Московская область',
                category: 'Интерьер',
                images: [
                    './public/images/NK263.24_interior_2.png',
                    './public/images/shkaf-raspas.png',
                    './public/images/kabinet-ruko.png'
                ],
                description: 'Элегантный интерьер в стиле неоклассика с мебелью из махагона и элементами из латуни. Изысканность и комфорт в каждой комнате.',
                advantages: [
                    '🪑 Мебель из махагона',
                    '✨ Латунные элементы',
                    '🏛️ Неоклассический стиль',
                    '🎨 Ручная фрезеровка'
                ],
                year: '2023',
                area: '280 м²',
                style: 'Неоклассика',
                rating: 4.9,
                reviewsCount: 11,
                reviews: [
                    {
                        name: 'Татьяна Р.',
                        date: '15 декабря 2023',
                        rating: 5,
                        text: 'Настоящее произведение искусства! Мебель из махагона с латунью — это просто сказка.'
                    },
                    {
                        name: 'Владимир К.',
                        date: '1 ноября 2023',
                        rating: 5,
                        text: 'Работа выполнена на высшем уровне. Особенно впечатлила ручная резьба.'
                    },
                    {
                        name: 'Елена М.',
                        date: '20 октября 2023',
                        rating: 4,
                        text: 'Очень красиво и благородно. Единственное — долго ждали завершения проекта.'
                    }
                ]
            },
            {
                id: 5,
                title: 'Минимализм в башне "Федерация"',
                location: '📍 Москва, Башня Федерация',
                category: 'Интерьер',
                images: [
                    './public/images/midcentury.png',
                    './public/images/i0000167720.png',
                    './public/images/none-36330.png'
                ],
                description: 'Минималистичный интерьер с панорамным видом на город. Мебель из светлого дуба и матового стекла.',
                advantages: [
                    '🪑 Мебель из дуба',
                    '🏙️ Панорамный вид',
                    '✨ Матовое стекло',
                    '🌿 Минимализм'
                ],
                year: '2024',
                area: '150 м²',
                style: 'Минимализм',
                rating: 4.6,
                reviewsCount: 6,
                reviews: [
                    {
                        name: 'Сергей М.',
                        date: '15 мая 2024',
                        rating: 5,
                        text: 'Идеальный интерьер для современного человека. Каждая деталь продумана.'
                    }
                ]
            },
            {
                id: 6,
                title: 'Арт-деко в историческом особняке',
                location: '📍 Москва, Арбат',
                category: 'Реставрация',
                images: [
                    './public/images/dizayn-i-rem.jpg',
                    './public/images/pngtree-des.png',
                    './public/images/stil-loft.png'
                ],
                description: 'Реставрация и переосмысление интерьера исторического особняка в стиле арт-деко. Сочетание винтажа и современности.',
                advantages: [
                    '🏛️ Исторический особняк',
                    '🎨 Стиль арт-деко',
                    '🔄 Сочетание эпох',
                    '✨ Винтажные элементы'
                ],
                year: '2023',
                area: '340 м²',
                style: 'Арт-деко',
                rating: 4.8,
                reviewsCount: 8,
                reviews: [
                    {
                        name: 'Ирина К.',
                        date: '20 августа 2023',
                        rating: 5,
                        text: 'Невероятная работа! Сохранили дух истории и добавили современный комфорт.'
                    },
                    {
                        name: 'Андрей Л.',
                        date: '5 июля 2023',
                        rating: 4,
                        text: 'Очень красиво, но было несколько сложных моментов по срокам.'
                    }
                ]
            }
        ];
        let html = '';
        projects.forEach((project) => {
            let gallerySlides = '';
            project.images.forEach((img, idx) => {
                gallerySlides += `
          <div class="project-card__gallery-slide" data-index="${idx}">
            <img src="${img}" alt="${project.title} — фото ${idx + 1}" loading="lazy" />
          </div>
        `;
            });
            let dots = '';
            project.images.forEach((_, idx) => {
                dots += `
          <button class="project-card__gallery-dot ${idx === 0 ? 'project-card__gallery-dot--active' : ''}" data-index="${idx}"></button>
        `;
            });
            let reviewsHtml = '';
            const reviewsToShow = project.reviews.slice(0, 1);
            reviewsToShow.forEach(review => {
                reviewsHtml += `
          <div class="project-card__review">
            <div class="project-card__review-header">
              <span class="project-card__review-name">${review.name}</span>
              <div class="project-card__review-stars">
                ${this.generateStars(review.rating)}
              </div>
            </div>
            <p class="project-card__review-text">«${review.text}»</p>
            <span class="project-card__review-date">${review.date}</span>
          </div>
        `;
            });
            let advantagesHtml = '';
            project.advantages.forEach(adv => {
                advantagesHtml += `
          <div class="project-card__advantage">
            <span class="project-card__advantage-icon">✦</span>
            ${adv}
          </div>
        `;
            });
            html += `
        <div class="project-card" data-id="${project.id}" data-project='${JSON.stringify(project).replace(/'/g, "&#39;")}'>
          
          <!-- ===== ЗОЛОТЫЕ УГОЛКИ С РОМБАМИ ===== -->
          <div class="project-card__corner project-card__corner--tl project-card__corner--premium">
            <span class="corner-diamond"></span>
          </div>
          <div class="project-card__corner project-card__corner--tr project-card__corner--premium">
            <span class="corner-diamond"></span>
          </div>
          <div class="project-card__corner project-card__corner--bl project-card__corner--premium">
            <span class="corner-diamond"></span>
          </div>
          <div class="project-card__corner project-card__corner--br project-card__corner--premium">
            <span class="corner-diamond"></span>
          </div>
          
          <div class="project-card__gallery">
            <div class="project-card__gallery-track">
              ${gallerySlides}
            </div>
            <button class="project-card__gallery-btn project-card__gallery-btn--prev">‹</button>
            <button class="project-card__gallery-btn project-card__gallery-btn--next">›</button>
            <div class="project-card__gallery-dots">
              ${dots}
            </div>
            <span class="project-card__badge">${project.category}</span>
          </div>
          
          <div class="project-card__content">
            <h3 class="project-card__title">${project.title}</h3>
            <p class="project-card__location">${project.location}</p>
            <p class="project-card__desc">${project.description}</p>
            
            <div class="project-card__advantages">
              ${advantagesHtml}
            </div>
            
            <div class="project-card__reviews" data-reviews='${JSON.stringify(project.reviews).replace(/'/g, "&#39;")}' data-project-title="${project.title}">
              <div class="project-card__reviews-header">
                <span class="project-card__reviews-title">✦ Отзывы</span>
                <span class="project-card__reviews-count">${project.reviews.length}</span>
              </div>
              <div class="project-card__reviews-rating">
                <div class="project-card__stars">
                  ${this.generateStars(project.rating)}
                </div>
                <span class="project-card__rating-count">${project.rating} · ${project.reviewsCount} отзывов</span>
              </div>
              ${reviewsHtml}
              <div class="project-card__reviews-more">Все отзывы →</div>
            </div>
            
            <div class="project-card__footer">
              <button class="project-card__btn" data-id="${project.id}">Подробнее о проекте →</button>
            </div>
          </div>
        </div>
      `;
        });
        this.grid.innerHTML = html;
        console.log(`✅ ${projects.length} проектов загружено из JS`);
        // Анимация карточек через 300мс
        setTimeout(() => {
            this.animateProjectCards();
        }, 300);
        setTimeout(() => {
            this.initGalleries();
            this.initCarousel();
            this.initProjectClicks();
        }, 800);
    }
    // =========================================================
    // ИНИЦИАЛИЗАЦИЯ КЛИКОВ
    // =========================================================
    initProjectClicks() {
        console.log('🖱️ Инициализация кликов по проектам');
        const container = document.querySelector('.projects-grid__items');
        if (!container) {
            console.warn('⚠️ Контейнер проектов не найден');
            return;
        }
        container.addEventListener('click', (e) => {
            const target = e.target;
            const card = target.closest('.project-card');
            if (!card)
                return;
            const reviewsBlock = target.closest('.project-card__reviews');
            if (reviewsBlock) {
                e.stopPropagation();
                if (this.isReviewsOpening)
                    return;
                const reviewsData = reviewsBlock.dataset.reviews;
                const projectTitle = reviewsBlock.dataset.projectTitle || 'Проект';
                if (reviewsData) {
                    try {
                        const reviews = JSON.parse(reviewsData);
                        this.isReviewsOpening = true;
                        this.openReviewsModal(reviews, projectTitle);
                        setTimeout(() => {
                            this.isReviewsOpening = false;
                        }, 500);
                    }
                    catch (error) {
                        console.error('Ошибка парсинга отзывов:', error);
                        this.isReviewsOpening = false;
                    }
                }
                return;
            }
            if (target.closest('.project-card__gallery-btn') ||
                target.closest('.project-card__gallery-dot')) {
                return;
            }
            if (this.isModalOpening)
                return;
            const projectData = card.dataset.project;
            if (!projectData)
                return;
            try {
                const project = JSON.parse(projectData);
                this.isModalOpening = true;
                this.openProjectModal(project);
                setTimeout(() => {
                    this.isModalOpening = false;
                }, 500);
            }
            catch (error) {
                console.error('Ошибка парсинга данных проекта:', error);
                this.isModalOpening = false;
            }
        });
        console.log(`✅ Клики инициализированы на всех карточках проектов`);
    }
    // =========================================================
    // МОДАЛЬНОЕ ОКНО С ОТЗЫВАМИ
    // =========================================================
    openReviewsModal(reviews, projectTitle) {
        if (document.getElementById('reviewsModal')) {
            return;
        }
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'reviews-modal-overlay';
        modalOverlay.id = 'reviewsModal';
        let reviewsHtml = '';
        reviews.forEach(review => {
            reviewsHtml += `
        <div class="reviews-modal__review">
          <div class="reviews-modal__review-header">
            <span class="reviews-modal__review-name">${review.name}</span>
            <div class="reviews-modal__review-stars">
              ${this.generateStars(review.rating)}
            </div>
          </div>
          <p class="reviews-modal__review-text">«${review.text}»</p>
          <span class="reviews-modal__review-date">${review.date}</span>
        </div>
      `;
        });
        modalOverlay.innerHTML = `
      <div class="reviews-modal">
        <button class="reviews-modal__close" id="reviewsModalClose">
          <span></span>
          <span></span>
        </button>
        <div class="reviews-modal__header">
          <h3 class="reviews-modal__title">✦ Отзывы</h3>
          <p class="reviews-modal__subtitle">${projectTitle}</p>
        </div>
        <div class="reviews-modal__body">
          ${reviewsHtml}
        </div>
      </div>
    `;
        document.body.appendChild(modalOverlay);
        document.body.classList.add('no-scroll');
        setTimeout(() => {
            modalOverlay.classList.add('reviews-modal-overlay--active');
        }, 10);
        const closeBtn = document.getElementById('reviewsModalClose');
        closeBtn?.addEventListener('click', this.closeReviewsModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay)
                this.closeReviewsModal();
        });
        const handleEsc = (e) => {
            if (e.key === 'Escape')
                this.closeReviewsModal();
        };
        document.addEventListener('keydown', handleEsc);
    }
    // =========================================================
    // МОДАЛЬНОЕ ОКНО ПРОЕКТА
    // =========================================================
    openProjectModal(project) {
        if (document.getElementById('projectModal')) {
            return;
        }
        console.log('📱 Открываем модалку проекта:', project.title);
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'project-modal-overlay';
        modalOverlay.id = 'projectModal';
        let modalSlides = '';
        project.images.forEach((img, idx) => {
            modalSlides += `
        <div class="project-modal__gallery-slide" data-index="${idx}">
          <img src="${img}" alt="${project.title} — фото ${idx + 1}" />
        </div>
      `;
        });
        let modalDots = '';
        project.images.forEach((_, idx) => {
            modalDots += `
        <button class="project-modal__gallery-dot ${idx === 0 ? 'project-modal__gallery-dot--active' : ''}" data-index="${idx}"></button>
      `;
        });
        let modalReviewsHtml = '';
        project.reviews.forEach(review => {
            modalReviewsHtml += `
        <div class="project-modal__review">
          <div class="project-modal__review-header">
            <span class="project-modal__review-name">${review.name}</span>
            <div class="project-modal__review-stars">
              ${this.generateStars(review.rating)}
            </div>
          </div>
          <p class="project-modal__review-text">«${review.text}»</p>
          <span class="project-modal__review-date">${review.date}</span>
        </div>
      `;
        });
        let modalAdvHtml = '';
        project.advantages.forEach(adv => {
            modalAdvHtml += `
        <div class="project-modal__advantage">
          <span class="project-modal__advantage-icon">✦</span>
          ${adv}
        </div>
      `;
        });
        modalOverlay.innerHTML = `
      <div class="project-modal">
        <button class="project-modal__close" id="projectModalClose">
          <span></span>
          <span></span>
        </button>
        
        <div class="project-modal__gallery">
          <div class="project-modal__gallery-track">
            ${modalSlides}
          </div>
          <button class="project-modal__gallery-btn project-modal__gallery-btn--prev">‹</button>
          <button class="project-modal__gallery-btn project-modal__gallery-btn--next">›</button>
          <div class="project-modal__gallery-dots">
            ${modalDots}
          </div>
        </div>
        
        <div class="project-modal__body">
          <h2 class="project-modal__title">${project.title}</h2>
          <p class="project-modal__location">📍 ${project.location}</p>
          <p class="project-modal__desc">${project.description}</p>
          
          <div class="project-modal__advantages">
            ${modalAdvHtml}
          </div>
          
          <div class="project-modal__details">
            <div class="project-modal__detail-item">
              <span class="project-modal__detail-label">📅 Год</span>
              <span class="project-modal__detail-value">${project.year || 'По запросу'}</span>
            </div>
            <div class="project-modal__detail-item">
              <span class="project-modal__detail-label">📐 Площадь</span>
              <span class="project-modal__detail-value">${project.area || 'По запросу'}</span>
            </div>
            <div class="project-modal__detail-item">
              <span class="project-modal__detail-label">🎨 Стиль</span>
              <span class="project-modal__detail-value">${project.style || 'По запросу'}</span>
            </div>
          </div>
          
          <div class="project-modal__reviews">
            <h4 class="project-modal__reviews-title">✦ Отзывы</h4>
            ${modalReviewsHtml}
          </div>
          
          <div class="project-modal__footer">
            <button class="project-modal__btn" id="projectModalConsult">📞 Обсудить проект</button>
          </div>
        </div>
      </div>
    `;
        document.body.appendChild(modalOverlay);
        document.body.classList.add('no-scroll');
        setTimeout(() => {
            modalOverlay.classList.add('project-modal-overlay--active');
        }, 10);
        this.initModalGallery(modalOverlay);
        const closeBtn = document.getElementById('projectModalClose');
        closeBtn?.addEventListener('click', () => this.closeProjectModal(modalOverlay));
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay)
                this.closeProjectModal(modalOverlay);
        });
        const handleEsc = (e) => {
            if (e.key === 'Escape')
                this.closeProjectModal(modalOverlay);
        };
        document.addEventListener('keydown', handleEsc);
        const consultBtn = document.getElementById('projectModalConsult');
        consultBtn?.addEventListener('click', () => {
            alert(`📞 Заявка на консультацию по проекту "${project.title}"\n\nСвяжемся с вами в ближайшее время!`);
            this.closeProjectModal(modalOverlay);
        });
    }
    // =========================================================
    // ИНИЦИАЛИЗАЦИЯ ГАЛЕРЕЙ
    // =========================================================
    initGalleries() {
        document.querySelectorAll('.project-card__gallery').forEach(gallery => {
            const track = gallery.querySelector('.project-card__gallery-track');
            const slides = gallery.querySelectorAll('.project-card__gallery-slide');
            const dots = gallery.querySelectorAll('.project-card__gallery-dot');
            const prevBtn = gallery.querySelector('.project-card__gallery-btn--prev');
            const nextBtn = gallery.querySelector('.project-card__gallery-btn--next');
            if (!track)
                return;
            let currentIndex = 0;
            const totalSlides = slides.length;
            if (totalSlides <= 1) {
                if (prevBtn)
                    prevBtn.style.display = 'none';
                if (nextBtn)
                    nextBtn.style.display = 'none';
                dots.forEach(d => d.style.display = 'none');
                return;
            }
            const goToSlide = (index) => {
                if (index < 0)
                    index = totalSlides - 1;
                if (index >= totalSlides)
                    index = 0;
                currentIndex = index;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach((dot, i) => {
                    dot.classList.toggle('project-card__gallery-dot--active', i === currentIndex);
                });
            };
            prevBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(currentIndex - 1);
            });
            nextBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(currentIndex + 1);
            });
            dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToSlide(index);
                });
            });
        });
    }
    // =========================================================
    // МОДАЛЬНАЯ ГАЛЕРЕЯ
    // =========================================================
    initModalGallery(modalOverlay) {
        const gallery = modalOverlay.querySelector('.project-modal__gallery');
        if (!gallery)
            return;
        const track = gallery.querySelector('.project-modal__gallery-track');
        const slides = gallery.querySelectorAll('.project-modal__gallery-slide');
        const dots = gallery.querySelectorAll('.project-modal__gallery-dot');
        const prevBtn = gallery.querySelector('.project-modal__gallery-btn--prev');
        const nextBtn = gallery.querySelector('.project-modal__gallery-btn--next');
        if (!track)
            return;
        let currentIndex = 0;
        const totalSlides = slides.length;
        if (totalSlides <= 1) {
            if (prevBtn)
                prevBtn.style.display = 'none';
            if (nextBtn)
                nextBtn.style.display = 'none';
            dots.forEach(d => d.style.display = 'none');
            return;
        }
        const goToSlide = (index) => {
            if (index < 0)
                index = totalSlides - 1;
            if (index >= totalSlides)
                index = 0;
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('project-modal__gallery-dot--active', i === currentIndex);
            });
        };
        prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(currentIndex - 1);
        });
        nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(currentIndex + 1);
        });
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(index);
            });
        });
    }
    // =========================================================
    // КАРУСЕЛЬ
    // =========================================================
    initCarousel() {
        const container = document.querySelector('.projects-grid__items');
        if (!container)
            return;
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;
        let momentum = 0;
        let lastX = 0;
        let lastTime = 0;
        let animationId = null;
        const progressBars = document.querySelectorAll('#carouselProgressTop, #carouselProgressBottom');
        const updateProgress = (el) => {
            const maxScroll = el.scrollWidth - el.clientWidth;
            const currentScroll = el.scrollLeft;
            const percentage = maxScroll > 0 ? (currentScroll / maxScroll) * 100 : 0;
            progressBars.forEach(bar => {
                bar.style.width = `${percentage}%`;
            });
        };
        const startMomentum = () => {
            if (Math.abs(momentum) < 1) {
                momentum = 0;
                return;
            }
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            const step = () => {
                if (Math.abs(momentum) < 0.5) {
                    momentum = 0;
                    animationId = null;
                    return;
                }
                container.scrollLeft += momentum * 0.02;
                momentum *= 0.97;
                const maxScroll = container.scrollWidth - container.clientWidth;
                if (container.scrollLeft <= 0) {
                    container.scrollLeft = 0;
                    momentum = 0;
                }
                else if (container.scrollLeft >= maxScroll) {
                    container.scrollLeft = maxScroll;
                    momentum = 0;
                }
                updateProgress(container);
                animationId = requestAnimationFrame(step);
            };
            animationId = requestAnimationFrame(step);
        };
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            lastX = e.pageX;
            lastTime = Date.now();
            momentum = 0;
            container.style.cursor = 'grabbing';
            container.style.scrollBehavior = 'auto';
            container.classList.add('is-dragging');
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
        container.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                container.style.cursor = 'grab';
                container.classList.remove('is-dragging');
                startMomentum();
            }
        });
        container.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                container.style.cursor = 'grab';
                container.classList.remove('is-dragging');
                startMomentum();
            }
        });
        container.addEventListener('mousemove', (e) => {
            if (!isDown)
                return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 1.5;
            container.scrollLeft = scrollLeft - walk;
            const now = Date.now();
            const dt = now - lastTime;
            if (dt > 0) {
                const dx = e.pageX - lastX;
                momentum = dx / dt * 15;
            }
            lastX = e.pageX;
            lastTime = now;
            updateProgress(container);
        });
        let touchStartX = 0;
        let touchScrollLeft = 0;
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].pageX - container.offsetLeft;
            touchScrollLeft = container.scrollLeft;
            momentum = 0;
            container.style.scrollBehavior = 'auto';
            container.classList.add('is-dragging');
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }, { passive: true });
        container.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - touchStartX) * 1.5;
            container.scrollLeft = touchScrollLeft - walk;
            const now = Date.now();
            const dt = now - lastTime;
            if (dt > 0) {
                const dx = e.touches[0].pageX - lastX;
                momentum = dx / dt * 15;
            }
            lastX = e.touches[0].pageX;
            lastTime = now;
            updateProgress(container);
        }, { passive: true });
        container.addEventListener('touchend', () => {
            container.classList.remove('is-dragging');
            startMomentum();
        }, { passive: true });
        const prevBtns = document.querySelectorAll('#carouselPrevTop, #carouselPrevBottom');
        const nextBtns = document.querySelectorAll('#carouselNextTop, #carouselNextBottom');
        const getCardWidth = () => {
            const firstCard = container.querySelector('.project-card');
            const gap = 30;
            if (firstCard) {
                return firstCard.offsetWidth + gap;
            }
            return 530;
        };
        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const scrollAmount = getCardWidth();
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        });
        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const scrollAmount = getCardWidth();
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        });
        container.addEventListener('scroll', () => {
            updateProgress(container);
        });
        setTimeout(() => {
            updateProgress(container);
        }, 300);
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
        if (!burger || !mobileMenu)
            return;
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
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('mobile-menu--active')) {
                const target = e.target;
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
    // УСЛУГИ DROPDOWN
    // =========================================================
    initServicesDropdown() {
        const servicesToggle = document.getElementById('servicesToggle');
        const servicesDropdown = document.getElementById('servicesDropdown');
        if (servicesToggle && servicesDropdown) {
            servicesToggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 1200) {
                    e.preventDefault();
                    e.stopPropagation();
                    const isOpen = servicesDropdown.style.display === 'block';
                    servicesDropdown.style.display = isOpen ? 'none' : 'block';
                }
            });
        }
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1200) {
                const target = e.target;
                const dropdowns = document.querySelectorAll('.dropdown');
                dropdowns.forEach(drop => {
                    const navItem = drop.closest('.nav__item--dropdown');
                    if (!navItem?.contains(target)) {
                        drop.style.display = 'none';
                    }
                });
            }
        });
    }
    // =========================================================
    // ХЕДЕР ПРИ СКРОЛЛЕ
    // =========================================================
    initHeaderScroll() {
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 80) {
                    header.classList.add('header--scrolled');
                }
                else {
                    header.classList.remove('header--scrolled');
                }
            });
        }
    }
}
// =========================================================
// ЗАПУСК
// =========================================================
(function () {
    'use strict';
    console.log('🔥 Запускаем ProjectsModule...');
    function startModule() {
        try {
            console.log('📦 Создаём экземпляр...');
            const module = new ProjectsModule();
            window.__projectsModule = module;
            console.log('✅ ProjectsModule создан!');
            return module;
        }
        catch (error) {
            console.error('❌ Ошибка при создании ProjectsModule:', error);
            return null;
        }
    }
    // Если DOM уже загружен — запускаем сразу
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('📄 DOM уже загружен, запускаем сразу');
        startModule();
    }
    else {
        console.log('⏳ Ждём загрузки DOM...');
        document.addEventListener('DOMContentLoaded', startModule);
    }
    // Аварийный запуск через 500мс
    setTimeout(function () {
        if (!window.__projectsModule) {
            console.warn('⚠️ Аварийный запуск через 500мс');
            startModule();
        }
    }, 500);
    // Абсолютный таймаут через 2 секунды
    setTimeout(function () {
        if (!window.__projectsModule) {
            console.warn('⚠️ КРАЙНИЙ АВАРИЙНЫЙ ЗАПУСК!');
            startModule();
        }
    }, 2000);
})();
//# sourceMappingURL=project.js.map