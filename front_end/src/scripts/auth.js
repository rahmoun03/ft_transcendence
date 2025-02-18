// auth.js
export const checkAuth = () => {
    // Check if intra auth is in progress
    const intraAuthInProgress = localStorage.getItem('intraAuthInProgress');
    
    // If intra auth is in progress, don't redirect
    if (intraAuthInProgress === 'true') {
        return;
    }

    const token = localStorage.getItem('token');
    const publicRoutes = ['/', '/login', '/register'];
    const currentPath = window.location.hash.slice(1) || '/';

    // Only redirect if not on public route and no token
    if (!token && !publicRoutes.includes(currentPath)) {
        window.location.hash = '#/';
        return false;
    }

    return !!token;
};

// Clear intra auth state when auth is complete
export const clearAuthState = () => {
    localStorage.removeItem('intraAuthInProgress');
};