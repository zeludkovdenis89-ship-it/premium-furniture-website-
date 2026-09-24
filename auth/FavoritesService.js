// =========================================================
// FAVORITES SERVICE — УПРАВЛЕНИЕ ИЗБРАННЫМ (С БД)
// =========================================================
const API_URL = 'http://localhost:3001/api';
class FavoritesService {
    /**
     * Получить токен авторизации
     */
    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY) ||
            sessionStorage.getItem(this.TOKEN_KEY) ||
            null;
    }
    /**
     * Выполнить запрос к API
     */
    static async request(url, options = {}) {
        const token = this.getToken();
        if (!token) {
            throw new Error('Не авторизован');
        }
        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка запроса');
        }
        return data;
    }
    /**
     * Получить все избранное
     */
    static async getFavorites() {
        try {
            const data = await this.request('/favorites');
            return data.favorites || [];
        }
        catch (error) {
            console.error('❌ Ошибка загрузки избранного:', error);
            return [];
        }
    }
    /**
     * Добавить в избранное
     */
    static async addFavorite(item) {
        try {
            await this.request('/favorites', {
                method: 'POST',
                body: JSON.stringify({
                    productId: item.productId,
                    productType: item.productType || 'catalog',
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    category: item.category || '',
                    description: item.description || ''
                })
            });
            console.log(`❤️ Добавлено в избранное: ${item.title}`);
            return true;
        }
        catch (error) {
            console.error('❌ Ошибка добавления в избранное:', error);
            return false;
        }
    }
    /**
     * Удалить из избранного
     */
    static async removeFavorite(productId, productType = 'catalog') {
        try {
            await this.request(`/favorites/${productId}?type=${productType}`, {
                method: 'DELETE'
            });
            console.log(`🗑️ Удалено из избранного: ${productId}`);
            return true;
        }
        catch (error) {
            console.error('❌ Ошибка удаления из избранного:', error);
            return false;
        }
    }
    /**
     * Проверить, в избранном ли товар
     */
    static async isFavorite(productId, productType = 'catalog') {
        try {
            const favorites = await this.getFavorites();
            return favorites.some(f => f.product_id === productId && f.product_type === productType);
        }
        catch {
            return false;
        }
    }
    /**
     * Очистить избранное (локально)
     */
    static clearFavorites() {
        console.log('🧹 Очистка избранного...');
        // Здесь можно добавить API-запрос на очистку
    }
    /**
     * Синхронизировать избранное с сервером
     */
    static async syncFavorites() {
        return await this.getFavorites();
    }
}
FavoritesService.TOKEN_KEY = 'manomaestro_token';
export default FavoritesService;
