import { renderMatches , getUserName } from './profile.js';
import { api } from './api.js';

function showMessage(text, type) {
    const existingMessage = document.querySelector('.message-overlay');
    if (existingMessage) {
        document.body.removeChild(existingMessage);
    }

    const message = document.createElement('div');
    message.className = 'message-overlay';
    message.textContent = text;
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.padding = '20px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '1000';
    message.style.maxWidth = '300px';
    message.style.wordWrap = 'break-word';
    
    if (type === 'error') {
        message.style.backgroundColor = 'lightcoral';
        message.style.color = 'darkred';
    } else {
        message.style.backgroundColor = 'lightgreen';
        message.style.color = 'darkgreen';
    }
    
    document.body.appendChild(message);
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 3000);
}

export function Home() {
    setTimeout(() => {
        const loginIntraButton = document.getElementById('login-intra-button');
        if (loginIntraButton) {
            loginIntraButton.addEventListener('click', async (e) => {
                e.preventDefault(); // Prevent any default action
                try {
                    await api.initiateIntraLogin();
                } catch (error) {
                    console.error('Failed to initiate 42 login:', error);
                }
            });
        }
    }, 0);

    return `
    <div class="landing-container">
        <div class="pixel-art-container">
            <h1 class="name_ft">FT-PING-PONG()</h1>
            <div class="button-container">
                <button id="register-button">Register</button>
                <button id="login-button">Login</button>
                <button id="login-intra-button">Login with <img src="../images/42_Logoo.png" id="logo_intra"></button>
            </div>
        </div>
    </div>
    `;
}

export function Login() {
    const setupLoginHandlers = () => {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                
                try {
                    const credentials = {
                        username: formData.get('username'),
                        password: formData.get('password')
                    };

                    const response = await api.login(credentials);
                    showMessage('Login successful!', 'success');
                    setTimeout(() => {
                        window.location.hash = '#/dashboard';
                    }, 0);
                } catch (error) {
                    showMessage(error.message, 'error');
                    // Clear password field on error
                    const passwordInput = form.querySelector('input[name="password"]');
                    if (passwordInput) {
                        passwordInput.value = '';
                        passwordInput.focus();
                    }
                }
            });
        }

        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.focus();
        }
    };

    setTimeout(setupLoginHandlers, 0);

    return `
    <div class="landing-container">
         <div class="login-container">
            <button class="back-button" onclick="window.location.hash = '#/'">×</button>
            <h2>Login</h2>
            <form id="login-form">
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" placeholder="Enter your username" required>
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password" required>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
    `;
}

export function Register() {
    const setupFormHandlers = () => {
        const form = document.getElementById('register-form');
        
        const formHandler = async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                password_confirm: formData.get('password-confirm')
            };

            // Basic validation
            if (data.password.length < 8) {
                showMessage('Password must be at least 8 characters long', 'error');
                return;
            }

            if (data.password !== data.password_confirm) {
                showMessage('Passwords do not match', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }

            try {
                const response = await api.register(data);
                showMessage(response.message, 'success');
                setTimeout(() => {
                    window.location.hash = '#/';
                }, 2000); // Redirect after 2 seconds so user can see the success message
            } catch (error) {
                showMessage(error.message, 'error');
            }
        };

        if (form) {
            form.removeEventListener('submit', formHandler);
            form.addEventListener('submit', formHandler);
        }

        const usernameInput = document.getElementById('reg-username');
        if (usernameInput) {
            usernameInput.focus();
        }
    };
    

    // Helper function to validate email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    setTimeout(setupFormHandlers, 0);

    // Return the component HTML
    return `
    <div class="landing-container">
        <div class="register-container">
            <button class="back-button" onclick="window.location.hash = '#/'">×</button>
            <h2>Register</h2>
            <form id="register-form">
                <div class="form-group">
                    <label for="reg-username">Username:</label>
                    <input 
                        type="text" 
                        id="reg-username" 
                        name="username" 
                        placeholder="Enter your username" 
                        required
                        minlength="3"
                        maxlength="20"
                        pattern="[a-zA-Z0-9_-]+"
                        title="Username can only contain letters, numbers, underscores, and hyphens"
                    >
                </div>
                <div class="form-group">
                    <label for="reg-email">Email:</label>
                    <input 
                        type="email" 
                        id="reg-email" 
                        name="email" 
                        placeholder="your.email@example.com" 
                        required
                    >
                </div>
                <div class="form-group">
                    <label for="reg-password">Password:</label>
                    <input 
                        type="password" 
                        id="reg-password" 
                        name="password" 
                        placeholder="Choose a strong password" 
                        required
                        minlength="8"
                        title="Password must be at least 8 characters long"
                    >
                </div>
                <div class="form-group">
                    <label for="reg-password-confirm">Confirm Password:</label>
                    <input 
                        type="password" 
                        id="reg-password-confirm" 
                        name="password-confirm" 
                        placeholder="Retype your password" 
                        required
                        minlength="8"
                    >
                </div>
                <button id="register-button" type="submit" class="submit-button">
                    Register
                </button>
            </form>
        </div>
    </div>
    `;
}

export function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        api.handleAuthCallback(code)
            .then(data => {
                showMessage('Login successful!', 'success');
                window.location.hash = '#/profile';
            })
            .catch(error => {
                showMessage(error.message, 'error');
                window.location.hash = '#/';
            });
    }
}

function Notifications() {
    return new Promise(async (resolve) => {
        try {
            const { pending_requests } = await api.listFriendRequests();
            
            const notificationsHtml = `
            <div class="notification-header">
                <span class="notification-header-title">FRIEND REQUESTS</span>
            </div>
            <div class="notification-list">
                ${pending_requests.length === 0 
                    ? `<div class="no-notifications">No new friend requests</div>`
                    : pending_requests.map(request => `
                        <div class="notification-item" data-request-id="${request.id}">
                            <div class="notification-meta">
                                <span class="notification-type">Friend Request</span>
                                <span class="notification-date">${new Date(request.created_at).toLocaleString()}</span>
                            </div>
                            <p class="notification-message">
                                ${request.sender} sent you a friend request
                            </p>
                            <div class="notification-actions">
                                <button class="approve-btn" data-action="ACCEPT">Accept</button>
                                <button class="refuse-btn" data-action="REJECT">Reject</button>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
            `;
            
            resolve(notificationsHtml);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            resolve(`
                <div class="notification-header">
                    <span class="notification-header-title">FRIEND REQUESTS</span>
                </div>
                <div class="no-notifications">Unable to load friend requests</div>
            `);
        }
    });
}

window.handleNotifications = async function() {
    const existingNotifications = document.querySelector('.notifications-overlay');
    if (existingNotifications) {
        existingNotifications.remove();
        return;
    }

    const content = document.createElement('div');

    content.className = 'notifications-overlay';

    content.innerHTML = await Notifications();

    document.body.appendChild(content);

    const actionButtons = content.querySelectorAll('.approve-btn, .refuse-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const notificationItem = button.closest('.notification-item');
            const requestId = notificationItem.getAttribute('data-request-id');
            const action = button.getAttribute('data-action');

            try {
                await api.handleFriendRequest(requestId, action);
                notificationItem.remove();

                const remainingItems = content.querySelectorAll('.notification-item');
                if (remainingItems.length === 0) {
                    content.innerHTML = `
                        <div class="notification-header">
                            <span class="notification-header-title">FRIEND REQUESTS</span>
                        </div>
                        <div class="no-notifications">No new friend requests</div>
                    `;
                }
            } catch (error) {
                console.error('Failed to process friend request:', error);
                alert('Failed to process friend request. Please try again.');
            }
        });
    });

    const handleClickOutside = (event) => {
        if (!content.contains(event.target) && 
            !event.target.closest('.nav-icon-btn')) {
            content.remove();
            document.removeEventListener('click', handleClickOutside);
        }
    };

    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 100);
};

window.handleSettings = function()
{
    const existingSettings = document.querySelector('.settings-overlay');
    if (existingSettings) {
        existingSettings.remove();
        return;
    }

    const content = document.createElement('div');
    content.className = 'settings-overlay';
    content.innerHTML = Settings();
    document.body.appendChild(content);

    const profileLink = content.querySelector('.settings-section a[href="#/profile"]');
    profileLink.addEventListener('click', () => {
        content.remove();
    });


    content.addEventListener('click', (event) => {
        if (event.target === content) {
            content.remove();
        }
    });

    const settingsContainer = content.querySelector('.settings-container');
    settingsContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}

export function uploadAvatar()
{
    let avatarFile = null;
    const avatarInput = document.getElementById('avatar-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            avatarFile = e.target.files[0];
            if (avatarFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('avatar-preview').src = e.target.result;
                };
                reader.readAsDataURL(avatarFile);
            }
        });
    }

    const saveButton = document.getElementById('save-settings-btn');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            if (avatarFile) {
                const formData = new FormData();
                formData.append('avatar', avatarFile);

                try {
                    const response = await fetch('http://localhost:8000/api/update_profile/', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to upload avatar');
                    }

                    const result = await response.json();
                    showMessage('Avatar updated successfully!', 'success');
                    document.getElementById('avatar-preview').src = result.avatarUrl;
                } catch (error) {
                    showMessage(error.message, 'error');
                }
            }
        });
    }
}

export function Settings() {

    setTimeout(() => {
        const avatarInput = document.getElementById('avatar-input');
        const avatarPreview = document.getElementById('avatar-preview');
        const saveButton = document.getElementById('save-settings-btn');
        const logoutButton = document.getElementById('logout-btn');
        
        if (avatarInput && avatarPreview) {
            // Remove existing listener if any
            const newListener = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        avatarPreview.src = e.target.result;
                    }
                    reader.readAsDataURL(file);
                }
            };
            
            avatarInput.removeEventListener('change', newListener);
            avatarInput.addEventListener('change', newListener);
        }

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                showMessage('Settings saved successfully!', 'success');
                setTimeout(() => {
                    document.querySelector('.settings-overlay').remove();
                }, 1000);
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refreshToken');
                window.location.hash = '#/';
                document.querySelector('.settings-overlay').remove();
            });
        }

        getUserName();
        uploadAvatar();
    }, 0);

    return `
        <div class="settings-container">
            <button class="back-button" onclick="document.querySelector('.settings-overlay').remove()">×</button>
            <h2>Settings</h2>
            <div class="settings-section">
                <h3>Profile</h3>
                <a href="#/profile">Go to Profile</a>
            </div>
            <div class="settings-section">
                <h3>Avatar</h3>
                <div class="profile-avatar-section-settings">
                    <div class="avatar-upload-settings">
                        <img src="" alt="Profile Avatar" class="avatar-preview" id="avatar-preview">
                        <label for="avatar-input" class="avatar-upload-btn-settings">
                            <i class="fas fa-camera"></i>
                        </label>
                        <input type="file" id="avatar-input" class="file-input-settings" accept="image/*">
                    </div>
                </div>
            </div>
            <div class="settings-section">
                <h3>Two-Factor Authentication</h3>
                <label>
                    <input type="checkbox" id="two-fa-toggle">
                    Enable Two-Factor Authentication
                </label>
            </div>
            <div class="settings-section">
                <h3>Account</h3>
                <button id="logout-btn" class="logout-button">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
            <div class="save-button-container">
                <button id="save-settings-btn" class="save-button">Save</button>
            </div>
        </div>
    `;
}

export function initializeSearch() {
    const searchButton = document.getElementById('search-button');
    const searchDropdown = document.getElementById('search-dropdown');
    const searchInput = document.getElementById('search-input');
    const clearSearch = document.getElementById('clear-search');
    const searchResults = document.getElementById('search-results');

    if (!searchButton || !searchDropdown || !searchInput || !clearSearch || !searchResults) {
        return; // Exit if elements don't exist
    }

    // Toggle search dropdown
    searchButton.addEventListener('click', (e) => {
        e.stopPropagation();
        searchDropdown.classList.toggle('active');
        if (searchDropdown.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#search-dropdown') && e.target !== searchButton) {
            searchDropdown.classList.remove('active');
        }
    });

    let searchTimeout;

    // Handle search input
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.toLowerCase();
        clearSearch.style.display = query ? 'block' : 'none';
        
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Add loading state
        searchResults.innerHTML = '<div class="loading">Searching...</div>';

        // Debounce the search to avoid too many API calls
        searchTimeout = setTimeout(async () => {
            try {
                const users = await api.searchUsers(query);

                if (users.length === 0) {
                    console.log('No users found 1111');
                    searchResults.innerHTML = `
                        <div class="no-results">
                            No users found
                        </div>
                    `;
                    return;
                }

                console.log('Users found:', users);
                searchResults.innerHTML = users.map(user => `
                    <div class="search-result-item" data-user-id="${user.id}" data-username="${user.username}">
                        <img src="${user.avatar || '../../images/cat2.jpg'}" alt="${user.username}" class="result-avatar">
                        <span class="result-username">${user.username}</span>
                        <button class="add-friend-btn" title="Add Friend" onclick="handleFriendRequest(event, '${user.username}')">+</button>
                        <button class="play-match-btn" title="Play Match">▶</button>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Search failed:', error);
                searchResults.innerHTML = `
                    <div class="error">
                        Failed to search users. Please try again.
                    </div>
                `;
            }
        }, 300); // Wait 300ms after user stops typing before making API call
    });

    // Clear search
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        searchResults.innerHTML = '';
        clearSearch.style.display = 'none';
        searchInput.focus();
    });

    // Handle result click
    searchResults.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
            const userId = resultItem.dataset.userId;
            console.log('Selected user:', userId);
            searchDropdown.classList.remove('active');
        }
    });
}

window.handleFriendRequest = async (event, username) => {
    event.stopPropagation();
    const button = event.target;
    
    try {
        await api.sendFriendRequest(username);
        showMessage('Friend request sent successfully!');
        button.disabled = true;
        button.textContent = '✓';
        button.style.backgroundColor = '#4CAF50';
    } catch (error) {
        showMessage(error.message, 'error');
    }
};

export function Dashboard() {

    const checkAuth = () => {
        if (!localStorage.getItem('access_token')) {
            window.location.hash = '#/';
            return;
        }
    };

    console.log('Checking auth...');
    api.testToken();

    setTimeout(checkAuth, 0);
    
    setTimeout(() => {
        initializeSearch();
        renderMatches();
        getUserName();
    }, 0);

    return `
    <div class="dashboard-container">
        <nav class="navbar navbar-expand-lg custom-nav w-100">
            <div class="container-fluid px-4">
                <a class="navbar-brand fw-bold" href="#/dashboard">ft_ping_pong()</a>
                
                <!-- Desktop Navigation -->
                <div class="d-none d-lg-flex align-items-center">
                    <div class="search-container">
                        <button class="btn nav-icon-btn" id="search-button">
                            <i class="fas fa-search"></i>
                        </button>
        
                        <div class="search-dropdown" id="search-dropdown">
                            <div class="search-input-container">
                                <input type="text" class="search-input" placeholder="Search users..." id="search-input">
                                <button class="clear-search" id="clear-search">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="search-results" id="search-results">
                                <!-- Results will be dynamically inserted here -->
                            </div>
                        </div>
                    </div>
                    <button class="btn nav-icon-btn" id="chat-button">
                        <i class="fas fa-comment"></i>
                    </button>
                    <button class="btn nav-icon-btn" onclick="handleNotifications()">
                        <i class="fas fa-bell"></i>
                    </button>
                    <button class="btn nav-icon-btn" onclick="handleSettings()">
                        <i class="fas fa-cog"></i>
                    </button>
                    <div class="ms-3">
                        <button class="avatar-btn" id="this-is-avatar-id">
                            <img src="" alt="" class="avatar">
                        </button>
                    </div>
                </div>

                <!-- Mobile Navigation -->
                <div class="d-lg-none">
                    <div class="dropdown">
                        <img src="" 
                             class="avatar dropdown-toggle"
                             data-bs-toggle="dropdown"
                             aria-expanded="false">
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <button class="dropdown-item" id="search-button-mobile">
                                    <i class="fas fa-search me-2"></i>Search
                                </button>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#/profile">
                                    <i class="fas fa-user me-2"></i>Profile
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#/chat">
                                    <i class="fas fa-comment me-2"></i>Chat
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" onclick="handleNotifications()">
                                    <i class="fas fa-bell me-2"></i>Notifications
                                </a>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <a class="dropdown-item" onclick="handleSettings()">
                                    <i class="fas fa-cog me-2"></i>Settings
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="main-content">
            <div class="container-fluid px-4 py-4">
                <!-- Game Grid -->
                <div class="row g-4 mb-4">


                    <!-- Ping Pong Card -->
                    <div class="col-12 col-md-6">
                        <div class="game-card">
                            <div class="game-icon-container">
                                <div class="ping-pong-icon">
                                    <div class="paddle"></div>
                                    <div class="ball"></div>
                                    <div class="paddle"></div>
                                </div>
                            </div>
                            <h2 class="game-title">Ping Pong</h2>
                            <button class="play-btn">Play Now</button>
                        </div>
                    </div>
                    
                    <!-- Tic Tac Toe Card -->
                    <div class="col-12 col-md-6">
                        <div class="game-card">
                            <div class="game-icon-container">
                                <div class="tictactoe-grid">
                                    <div class="grid-line-v"></div>
                                    <div class="grid-line-v"></div>
                                    <div class="grid-line-h"></div>
                                    <div class="grid-line-h"></div>
                                </div>
                            </div>
                            <h2 class="game-title">Tic Tac Toe</h2>
                            <button class="play-btn">Play Now</button>
                        </div>
                    </div>
                </div>

                <!-- Tournament Section -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="game-card tournament-card">
                            <div class="game-icon-container">
                                <div class="tournament-icon">
                                    <i class="fas fa-trophy"></i>
                                </div>
                            </div>
                            <h2 class="game-title">Tournament</h2>
                            <button class="play-btn">Join Tournament</button>
                        </div>
                    </div>
                </div>

                <!-- Match History -->
                <div class="match-history-container">
                    <h2 class="history-title">Recent Matches</h2>
                    <div class="match-list">

                        <!-- Match items will be dynamically added here -->

                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Add this to your existing click event listener
document.addEventListener('click', (e) => {
    const targetId = e.target.id;
    const closestElement = e.target.closest('button');
    const isPlayPongButton = e.target.classList.contains('play-btn') && 
                            e.target.closest('.game-card').querySelector('.game-title').textContent === 'Ping Pong';

    switch (targetId) {
        case 'register-button':
            window.location.hash = '#/register';
            break;
        case 'login-button':
            window.location.hash = '#/login';
            break;
        case 'login-intra-button':
            window.location.hash = '#/dashboard';
            break;
        default:
            if (isPlayPongButton) {
                window.location.hash = '#/gameai';
                return;
            }
            switch (closestElement && closestElement.id)
            {
                case 'chat-button':
                    window.location.hash = '#/chat';
                    break;
                case 'this-is-avatar-id':
                    window.location.hash = '#/profile';
                    break;
            }
            break;
    }
});