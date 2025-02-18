// api.js
const API_BASE_URL = 'http://localhost:8000';  // Make sure this matches your Django server port

export const api = {

    getAuthHeaders() {
        const token = localStorage.getItem('access_token');
        console.log('Access Token heeeeeeeeeeeeeere :', token);
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    },

    async getUserInfo() {
        const response = await fetch(`${API_BASE_URL}/api/user/info`, {
            headers: this.getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        
        return await response.json();
    },

    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/api/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        return data;
    },

    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/api/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        if (data.access) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            console.log('Logged in!');
            console.log('Access Token:', data.access);
            console.log('Refresh Token:', data.refresh);
        }
        return data;
    },

    async initiateIntraLogin() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login/`);
            const data = await response.json();
            if (data.auth_url) {
                window.location.href = data.auth_url;
            }
        } catch (error) {
            console.error('Failed to initiate 42 login:', error);
            throw error;
        }
    },

    async handleAuthCallback(code) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/callback/?code=${code}`);
            const data = await response.json();
            
            if (data.access) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                
                // Force a clean state by reloading after setting tokens
                window.location.href = '/#/dashboard';
                window.location.reload();
            }
            return data;
        } catch (error) {
            console.error('OAuth callback error:', error);
            window.location.href = '/#/';
            throw error;
        }
    },

    async testToken() {
        const response = await fetch(`${API_BASE_URL}/api/getToken/`, {
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to test token');
        }
        return await response.json();
    },

    async searchUsers(query) {
        const response = await fetch(`${API_BASE_URL}/search/?query=${encodeURIComponent(query)}`, {
            headers: this.getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to search users');
        }
        
        return await response.json();
    },

    async sendFriendRequest(username) {
        const response = await fetch(`${API_BASE_URL}/api/friend/request/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
                receiver: username
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Failed to send friend request');
        }
        return data;
    },

    async listFriendRequests() {
        const response = await fetch(`${API_BASE_URL}/api/friend/requests/`, {
            headers: this.getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch friend requests');
        }
        
        return await response.json();
    },

    async handleFriendRequest(requestId, action) {
        const response = await fetch(`${API_BASE_URL}/api/friend/request/${requestId}/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ action: action })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Failed to process friend request');
        }
        return data;
    },

    


};

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};