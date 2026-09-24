"use strict";
// =========================================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// =========================================================
// =========================================================
// 0. ПРЕЛОАДЕР + ПОЯВЛЕНИЕ САЙТА
// =========================================================
document.addEventListener('DOMContentLoaded', function () {
    const preloader = document.getElementById('preloader');
    const preloaderLogo = document.getElementById('preloaderLogo');
    const preloaderLine = document.querySelector('.preloader__line');
    const siteWrapper = document.getElementById('siteWrapper');
    setTimeout(() => {
        if (preloaderLogo) {
            preloaderLogo.classList.add('preloader__logo--visible');
        }
    }, 150);
    setTimeout(() => {
        if (preloaderLine) {
            preloaderLine.classList.add('preloader__line--active');
        }
    }, 400);
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('preloader--hidden');
        }
        setTimeout(() => {
            if (preloader) {
                preloader.style.display = 'none';
            }
        }, 600);
    }, 1400);
    setTimeout(() => {
        if (siteWrapper) {
            siteWrapper.classList.add('site-wrapper--visible');
        }
        // ===== АНИМАЦИЯ ШАПКИ =====
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.style.opacity = '0';
            logo.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                logo.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
                logo.style.opacity = '1';
                logo.style.transform = 'translateX(0)';
            }, 100);
        }
        const navLinks = document.querySelectorAll('.nav__list .nav__link, .nav__list .nav__item--dropdown');
        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                link.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 150 + index * 80);
        });
        const phone = document.querySelector('.header__phone');
        if (phone) {
            phone.style.opacity = '0';
            phone.style.transform = 'translateX(20px)';
            setTimeout(() => {
                phone.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
                phone.style.opacity = '1';
                phone.style.transform = 'translateX(0)';
            }, 150 + navLinks.length * 80);
        }
        const burger = document.querySelector('.burger');
        if (burger) {
            burger.style.opacity = '0';
            burger.style.transform = 'scale(0.8)';
            setTimeout(() => {
                burger.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                burger.style.opacity = '1';
                burger.style.transform = 'scale(1)';
            }, 200 + navLinks.length * 80);
        }
        // ===== АНИМАЦИЯ ГЕРОЯ =====
        const heroTitle = document.querySelector('.hero__title');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(30px)';
            setTimeout(() => {
                heroTitle.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 100);
        }
        const heroSubtitle = document.querySelector('.hero__subtitle');
        if (heroSubtitle) {
            heroSubtitle.style.opacity = '0';
            heroSubtitle.style.transform = 'translateY(30px)';
            setTimeout(() => {
                heroSubtitle.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
                heroSubtitle.style.opacity = '1';
                heroSubtitle.style.transform = 'translateY(0)';
            }, 350);
        }
        const heroQuote = document.querySelector('.hero__quote');
        if (heroQuote) {
            heroQuote.style.opacity = '0';
            heroQuote.style.transform = 'translateY(30px)';
            setTimeout(() => {
                heroQuote.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
                heroQuote.style.opacity = '1';
                heroQuote.style.transform = 'translateY(0)';
            }, 600);
        }
        const heroButtons = document.querySelector('.hero__buttons');
        if (heroButtons) {
            heroButtons.style.opacity = '0';
            heroButtons.style.transform = 'translateY(30px)';
            setTimeout(() => {
                heroButtons.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
                heroButtons.style.opacity = '1';
                heroButtons.style.transform = 'translateY(0)';
            }, 850);
        }
        // ===== АНИМАЦИЯ БЛОКА "О БРЕНДЕ" (ПРИ СКРОЛЛЕ) =====
        const aboutContent = document.querySelector('.about__content');
        const factCards = document.querySelectorAll('.fact-card');
        const aboutElements = [];
        if (aboutContent)
            aboutElements.push(aboutContent);
        factCards.forEach((card) => aboutElements.push(card));
        aboutElements.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        });
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const delay = index === 0 ? 0 : 100;
                    setTimeout(() => {
                        target.style.opacity = '1';
                        target.style.transform = 'translateY(0)';
                    }, delay);
                    aboutObserver.unobserve(target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        aboutElements.forEach((el) => {
            aboutObserver.observe(el);
        });
        // ===== АНИМАЦИЯ ФУТЕРА (ПРИ СКРОЛЛЕ) =====
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.style.opacity = '0';
            footer.style.transform = 'translateY(30px)';
            footer.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
            const footerObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        target.style.opacity = '1';
                        target.style.transform = 'translateY(0)';
                        footerObserver.unobserve(target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            footerObserver.observe(footer);
        }
    }, 1800);
});
// =========================================================
// 1. БУРГЕР-МЕНЮ + МОБИЛЬНАЯ ШТОРКА
// =========================================================
document.addEventListener('DOMContentLoaded', function () {
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const menuLinks = document.querySelectorAll('.mobile-menu__link:not(.mobile-menu__link--dropdown)');
    const body = document.body;
    // =========================================================
    // 2. МОДАЛЬНОЕ ОКНО ДЛЯ УСЛУГ (ВНУТРИ ТОГО ЖЕ DOMContentLoaded!)
    // =========================================================
    const mobileServicesToggle = document.getElementById('mobileServicesToggle');
    const servicesModal = document.getElementById('servicesModal');
    const modalClose = document.getElementById('modalClose');
    function openModal() {
        if (!servicesModal)
            return;
        servicesModal.classList.add('modal-overlay--active');
        body.classList.add('no-scroll');
    }
    function closeModal() {
        if (!servicesModal)
            return;
        servicesModal.classList.remove('modal-overlay--active');
        body.classList.remove('no-scroll');
    }
    // === БУРГЕР (с проверками) ===
    function openMobileMenu() {
        if (!burger || !mobileMenu)
            return;
        burger.classList.add('burger--active');
        mobileMenu.classList.add('mobile-menu--active');
        body.classList.add('no-scroll');
    }
    function closeMobileMenu() {
        if (!burger || !mobileMenu)
            return;
        burger.classList.remove('burger--active');
        mobileMenu.classList.remove('mobile-menu--active');
        body.classList.remove('no-scroll');
    }
    // === СОБЫТИЯ БУРГЕРА ===
    if (burger && mobileMenu) {
        burger.addEventListener('click', function (e) {
            e.stopPropagation();
            if (mobileMenu.classList.contains('mobile-menu--active')) {
                closeMobileMenu();
            }
            else {
                openMobileMenu();
            }
        });
        document.addEventListener('click', function (e) {
            const target = e.target;
            if (mobileMenu.classList.contains('mobile-menu--active')) {
                if (!mobileMenu.contains(target) && !burger.contains(target)) {
                    closeMobileMenu();
                }
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--active')) {
                closeMobileMenu();
            }
        });
    }
    // === ЗАКРЫТИЕ ПО КНОПКЕ ===
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    // === ЗАКРЫТИЕ ПО ССЫЛКАМ ===
    menuLinks.forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });
    // === СОБЫТИЯ МОДАЛКИ ===
    if (mobileServicesToggle) {
        mobileServicesToggle.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });
    }
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (servicesModal) {
        servicesModal.addEventListener('click', function (e) {
            if (e.target === servicesModal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && servicesModal.classList.contains('modal-overlay--active')) {
                closeModal();
            }
        });
    }
    // === ПРИ ИЗМЕНЕНИИ ШИРИНЫ ОКНА (С ПРОВЕРКАМИ!) ===
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1200) {
            // ✅ Проверяем, что элементы существуют
            if (mobileMenu && mobileMenu.classList.contains('mobile-menu--active')) {
                closeMobileMenu();
            }
            if (servicesModal && servicesModal.classList.contains('modal-overlay--active')) {
                closeModal();
            }
        }
    });
});
// =========================================================
// 4. ШАПКА ПРИ СКРОЛЛЕ
// =========================================================
document.addEventListener('DOMContentLoaded', function () {
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
});
// =========================================================
// 5. СЧЁТЧИК "15 ЛЕТ" (С ЗАДЕРЖКОЙ ДЛЯ ПОЯВЛЕНИЯ)
// =========================================================
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const counters = document.querySelectorAll('.fact-card__number');
        counters.forEach((counter) => {
            const text = counter.textContent?.trim() || '';
            const match = text.match(/\d+/);
            if (match) {
                const target = parseInt(match[0]);
                counter.dataset.target = String(target);
                counter.dataset.animated = 'false';
                counter.dataset.suffix = text.replace(/\d+/, '').trim();
                counter.textContent = '0' + (counter.dataset.suffix ? ' ' + counter.dataset.suffix : '');
            }
            else {
                counter.dataset.animated = 'true';
            }
        });
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const target = entry.target;
                if (entry.isIntersecting && target.dataset.animated === 'false') {
                    target.dataset.animated = 'true';
                    animateCounter(target);
                }
            });
        }, { threshold: 0.3 });
        counters.forEach((counter) => {
            if (counter.dataset.animated !== 'true') {
                counterObserver.observe(counter);
            }
        });
    }, 100);
});
function animateCounter(element) {
    const target = parseInt(element.dataset.target || '0');
    if (!target || target === 0)
        return;
    const suffix = element.dataset.suffix || '';
    let current = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(target / 30));
    const interval = duration / (target / step);
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current + (suffix ? ' ' + suffix : '');
    }, interval);
}
// =========================================================
// 6. ДРОПДАУН УСЛУГ (КЛИК НА МОБИЛКЕ)
// =========================================================
document.addEventListener('DOMContentLoaded', function () {
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
});
//# sourceMappingURL=burger.js.map