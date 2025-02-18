import { Home, Login, Register, Dashboard , handleOAuthCallback } from './home.js';
import { Profile } from './profile.js';
// import { startGame } from './game/game.js';

class App {
    constructor() {
        this.init();
    }

    init() {
        // Check for OAuth callback
        const hash = window.location.hash;
        if (hash.startsWith('#/auth/callback')) {
            const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
            const access = urlParams.get('access');
            const refresh = urlParams.get('refresh');
            
            if (access && refresh) {
                localStorage.setItem('access_token', access);
                localStorage.setItem('refreshToken', refresh);
                window.location.href = '/#/dashboard';
                window.location.reload();
                return;
            }
        }

        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
        this.setupEventListeners();
    }

    async handleOAuthCallback(code) {
        try {
            const response = await api.handleAuthCallback(code);
            if (response.access) {
                // Clear the URL parameters
                window.history.replaceState({}, document.title, window.location.pathname);
                window.location.hash = '#/dashboard';
            }
        } catch (error) {
            console.error('OAuth callback error:', error);
            window.location.hash = '#/';
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn') {
                this.handleLogout();
            }
        });
    }

    handleLogout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refreshToken');
        window.location.hash = '#/';
    }

    async handleRoute() {
        const hash = window.location.hash || '#/';
        const content = document.getElementById('content');
        
        // Check authentication for protected routes
        if (this.isProtectedRoute(hash) && !this.isAuthenticated()) {
            window.location.hash = '#/';
            return;
        }
        // api.testToken()
        switch(hash) {
            case '#/':
                if (this.isAuthenticated()) {
                    window.location.hash = '#/dashboard';
                    return;
                }
                content.innerHTML = Home();
                break;
            case '#/login':
                if(this.isAuthenticated()) {
                    window.location.hash = '#/dashboard';
                    return;
                }
                content.innerHTML = Login();
                break;
            case '#/register':
                if (this.isAuthenticated()) {
                    window.location.hash = '#/dashboard';
                    return;
                }
                content.innerHTML = Register();
                break;
            case '#/dashboard':
                if (!this.isAuthenticated()) {
                    window.location.hash = '#/';
                    return;
                }
                content.innerHTML = Dashboard();
                const dashboardInit = new Event('dashboardInit');
                document.dispatchEvent(dashboardInit);
                break;
            case '#/profile':
                if (!this.isAuthenticated()) {
                    window.location.hash = '#/';
                    return;
                }
                content.innerHTML = Profile();
                break;
            case '#/chat':
                if (!this.isAuthenticated()) {
                    window.location.hash = '#/';
                    return;
                }
                content.innerHTML = '<h1>this is the Chat</h1>';
                break;
            case '#/gameai':
                if (!this.isAuthenticated()) {
                    window.location.hash = '#/';
                    return;
                }
                content.innerHTML = '<h1>this is the Game AI</h1>';
                // content.innerHTML = startGame();
                break;
            default:
                if (hash.startsWith('#/auth/callback')) {
                    return;
                }
                content.innerHTML = '<h1>404 - Page Not Found</h1>';
        }
    }

    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }

    isProtectedRoute(hash) {
        return ['/dashboard', '/profile', '/chat'].includes(hash.slice(1));
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await api.login(credentials);
            if (response.access) {
                window.location.hash = '#/dashboard';
            }
        } catch (error) {
            console.error('Login failed:', error);
            showMessage(error.message, 'error');
        }
    }
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});