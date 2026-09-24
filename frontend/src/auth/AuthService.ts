// =========================================================
// AUTH SERVICE — УПРАВЛЕНИЕ АВТОРИЗАЦИЕЙ (С БД)
// =========================================================

const API_URL = 'http://localhost:3001/api';

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    isAdmin?: boolean;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

class AuthService {
    private static TOKEN_KEY = 'manomaestro_token';
    private static REFRESH_TOKEN_KEY = 'manomaestro_refresh_token';
    private static USER_KEY = 'manomaestro_user';

    // =========================================================
    // 1. РЕГИСТРАЦИЯ
    // =========================================================

    static async register(
        name: string,
        phone: string,
        password: string,
        code: string
    ): Promise<AuthResponse> {
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

        // 🔥 СОХРАНЯЕМ ОБА ТОКЕНА
        this.saveSession(data.user, data.accessToken, data.refreshToken);
        return data;
    }

    // =========================================================
    // 2. ВХОД
    // =========================================================

    static async login(
        login: string,
        password: string,
        remember: boolean = false
    ): Promise<AuthResponse> {
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

        // 🔥 СОХРАНЯЕМ ОБА ТОКЕНА
        this.saveSession(data.user, data.accessToken, data.refreshToken, remember);
        return data;
    }

    // =========================================================
    // 3. ОТПРАВКА КОДА (ДЛЯ ТЕСТА)
    // =========================================================

    static async sendVerificationCode(phone: string): Promise<void> {
        console.log('📱 Отправка кода на', phone);

        await new Promise((resolve) => setTimeout(resolve, 800));

        const code = '123456';
        alert(`📱 Код подтверждения для ${phone}: ${code}`);
        console.log('📱 Код:', code);
    }

    // =========================================================
    // 4. СЕССИЯ
    // =========================================================

    static async logout(): Promise<void> {
        const token = this.getToken();
        if (token) {
            try {
                await fetch(`${API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (e) {
                console.log('⚠️ Ошибка при выходе:', e);
            }
        }

        // 🔥 ОЧИЩАЕМ ВСЕ ДАННЫЕ
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);

        console.log('🚪 AuthService: выход выполнен');
        window.dispatchEvent(new CustomEvent('logout'));
    }

    static saveSession(
        user: User,
        accessToken: string,
        refreshToken: string,
        remember: boolean = false
    ): void {
        const storage = remember ? localStorage : sessionStorage;

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email || '',
            phone: user.phone || '',
            avatar: user.avatar || null
        };

        storage.setItem(this.TOKEN_KEY, accessToken);
        storage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        storage.setItem(this.USER_KEY, JSON.stringify(userData));
        console.log('💾 Сессия сохранена');
    }

    static isAuthenticated(): boolean {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user);
    }

    static getToken(): string | null {
        let token = sessionStorage.getItem(this.TOKEN_KEY);
        if (token) return token;
        token = localStorage.getItem(this.TOKEN_KEY);
        return token || null;
    }

    static getRefreshToken(): string | null {
        let token = sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
        if (token) return token;
        token = localStorage.getItem(this.REFRESH_TOKEN_KEY);
        return token || null;
    }

    static getUser(): User | null {
        let userStr = sessionStorage.getItem(this.USER_KEY);
        if (!userStr) {
            userStr = localStorage.getItem(this.USER_KEY);
        }
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }

    static updateUser(user: User): void {
        const storage = localStorage.getItem(this.TOKEN_KEY) ? localStorage : sessionStorage;
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

    static getUserName(): string {
        const user = this.getUser();
        return user?.name || 'Гость';
    }

    static getUserAvatar(): string | null {
        const user = this.getUser();
        return user?.avatar || null;
    }

    // =========================================================
    // 5. 🔥 ОБНОВЛЕНИЕ ТОКЕНА (REFRESH)
    // =========================================================

    static async refreshToken(): Promise<string | null> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return null;

        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Ошибка обновления токена');

            const storage = localStorage.getItem(this.TOKEN_KEY) ? localStorage : sessionStorage;
            storage.setItem(this.TOKEN_KEY, data.accessToken);
            storage.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);

            return data.accessToken;
        } catch (error) {
            console.error('❌ Ошибка обновления токена:', error);
            // Если refresh не удался — разлогиниваем
            this.logout();
            return null;
        }
    }

    // =========================================================
    // 6. ПОЛУЧЕНИЕ ПРОФИЛЯ С СЕРВЕРА
    // =========================================================

    static async fetchProfile(): Promise<User> {
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
    // 7. ОБНОВЛЕНИЕ ПРОФИЛЯ
    // =========================================================

    static async updateProfile(name: string, email: string, phone: string): Promise<User> {
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

        this.updateUser(data.user);
        console.log('✅ Профиль обновлён на сервере');

        return data.user;
    }
}

export default AuthService;