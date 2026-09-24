// =========================================================
// MAIN — ГЛАВНЫЙ ФАЙЛ САЙТА
// =========================================================

// ✅ ПУТЬ ОТ main.ts К auth/AuthModal.ts
import AuthModal from './auth/AuthModal.js';
import AuthService from './auth/AuthService.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Manomaestro: сайт загружен');

    // =========================================================
    // 1. АВТОРИЗАЦИЯ
    // =========================================================
    initAuth();

    // =========================================================
    // 2. ДРУГИЕ ГЛОБАЛЬНЫЕ ИНИЦИАЛИЗАЦИИ
    // =========================================================
});

/**
 * Инициализация авторизации
 */
function initAuth(): void {
    console.log('🔐 Инициализация авторизации');

    // Обновляем кнопку в header
    AuthModal.updateHeaderButton();

    // Если пользователь авторизован — показываем приветствие
    if (AuthService.isAuthenticated()) {
        const user = AuthService.getUser();
        console.log(`👋 Добро пожаловать, ${user?.name}!`);
    }

    // Слушаем событие открытия кабинета (клик по аватару)
    window.addEventListener('openCabinet', function() {
        console.log('📂 Открываем личный кабинет');
        alert('🔜 Личный кабинет в разработке');
    });

    // Слушаем событие выхода из системы
    window.addEventListener('logout', function() {
        console.log('🚪 Выход из системы');
        AuthModal.updateHeaderButton();
        window.location.reload();
    });

    console.log('✅ Авторизация инициализирована');
}

// Экспортируем для использования в других файлах
export { initAuth };