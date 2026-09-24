// =========================================================
// AUTH SERVICE — УПРАВЛЕНИЕ АВТОРИЗАЦИЕЙ (С БД)
// =========================================================
const API_URL = 'http://localhost:3001/api';
class AuthService {
    // =========================================================
    // 1. РЕГИСТРАЦИЯ
    // =========================================================
    static async register(name, phone, password, code) {
        console.log('📝 AuthService: регистрация', phone);
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, password, code })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка регистрации');
        }
        this.saveSession(data.user, data.token);
        return data;
    }
    // =========================================================
    // 2. ВХОД
    // =========================================================
    static async login(login, password, remember = false) {
        console.log('🔑 AuthService: вход', login);
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка входа');
        }
        this.saveSession(data.user, data.token, remember);
        return data;
    }
    // =========================================================
    // 3. ОТПРАВКА КОДА (ДЛЯ ТЕСТА)
    // =========================================================
    static async sendVerificationCode(phone) {
        console.log('📱 Отправка кода на', phone);
        // Имитация отправки
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Для теста всегда 123456
        const code = '123456';
        alert(`📱 Код подтверждения для ${phone}: ${code}`);
        console.log('📱 Код:', code);
    }
    // =========================================================
    // 4. СЕССИЯ
    // =========================================================
    static logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);
        console.log('🚪 AuthService: выход выполнен');
        window.dispatchEvent(new CustomEvent('logout'));
    }
    static saveSession(user, token, remember = false) {
        const storage = remember ? localStorage : sessionStorage;
        // 🔥 ИСПРАВЛЕНО: правильно сохраняем email и phone
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email || '', // Если email нет — пустая строка
            phone: user.phone || '', // Телефон всегда есть
            avatar: user.avatar || null
        };
        storage.setItem(this.TOKEN_KEY, token);
        storage.setItem(this.USER_KEY, JSON.stringify(userData));
        console.log('💾 Сессия сохранена');
    }
    static isAuthenticated() {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user);
    }
    static getToken() {
        let token = sessionStorage.getItem(this.TOKEN_KEY);
        if (token)
            return token;
        token = localStorage.getItem(this.TOKEN_KEY);
        return token || null;
    }
    static getUser() {
        let userStr = sessionStorage.getItem(this.USER_KEY);
        if (!userStr) {
            userStr = localStorage.getItem(this.USER_KEY);
        }
        if (userStr) {
            try {
                return JSON.parse(userStr);
            }
            catch {
                return null;
            }
        }
        return null;
    }
    static updateUser(user) {
        const storage = localStorage.getItem(this.TOKEN_KEY) ? localStorage : sessionStorage;
        // 🔥 ИСПРАВЛЕНО: сохраняем все поля правильно
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email || '',
            phone: user.phone || '',
            avatar: user.avatar || null
        };
        storage.setItem(this.USER_KEY, JSON.stringify(userData));
        console.log('🔄 Данные пользователя обновлены');
    }
    static getUserName() {
        const user = this.getUser();
        return user?.name || 'Гость';
    }
    static getUserAvatar() {
        const user = this.getUser();
        return user?.avatar || null;
    }
    // =========================================================
    // 5. ПОЛУЧЕНИЕ ПРОФИЛЯ С СЕРВЕРА
    // =========================================================
    static async fetchProfile() {
        const token = this.getToken();
        if (!token) {
            throw new Error('Не авторизован');
        }
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка загрузки профиля');
        }
        return data.user;
    }
    // =========================================================
    // 6. 🔥 ОБНОВЛЕНИЕ ПРОФИЛЯ (НОВЫЙ МЕТОД)
    // =========================================================
    static async updateProfile(name, email, phone) {
        const token = this.getToken();
        if (!token) {
            throw new Error('Не авторизован');
        }
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, email, phone })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка обновления профиля');
        }
        // Обновляем локальные данные
        this.updateUser(data.user);
        console.log('✅ Профиль обновлён на сервере');
        return data.user;
    }
}
AuthService.TOKEN_KEY = 'manomaestro_token';
AuthService.USER_KEY = 'manomaestro_user';
export default AuthService;
