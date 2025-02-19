import { api } from './api.js';
import { getUserName } from './profile.js';

const API_BASE_URL = 'http://localhost:8000';

export function ChatApp() {
    // Create main container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-app-container';
    
    // Create and append navbar
    chatContainer.appendChild(createNavbar());

    // Create main content container
    const mainContent = document.createElement('div');
    mainContent.className = 'chat-content-container';

    // Create sidebar (left part)
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar-container';

    // Create search section
    const searchSection = document.createElement('div');
    searchSection.className = 'search-section';
    searchSection.innerHTML = `
        <div class="search-container">
            <input type="text" class="search-input" placeholder="Search friends...">
            <i class="fas fa-search search-icon"></i>
        </div>
    `;

    // Create friends list section
    const friendsSection = document.createElement('div');
    friendsSection.className = 'friends-section';
    friendsSection.innerHTML = `
        <div class="friends-header">
            <h3>Friends</h3>
            <span class="online-count">0 online</span>
        </div>
        <div class="friends-list">
            <!-- Friends will be dynamically added here -->
        </div>
    `;

    // Create chat section (right part)
    const chatSection = document.createElement('div');
    chatSection.className = 'chat-section';
    chatSection.innerHTML = `
        <div class="chat-header">
            <div class="chat-user-info">
                <div class="user-avatar">
                    <img src="../../images/cat2.jpg" alt="User">
                    <span class="status-indicator"></span>
                </div>
                <div class="user-details">
                    <h4 class="username">Select a friend</h4>
                    <span class="user-status">to start chatting</span>
                </div>
            </div>
        </div>
        <div class="messages-container">
            <!-- Messages will be dynamically added here -->
        </div>
        <div class="input-container">
            <input type="text" class="message-input" placeholder="Type a message...">
            <button class="send-button">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `;

    // Append all sections
    sidebar.appendChild(searchSection);
    sidebar.appendChild(friendsSection);
    mainContent.appendChild(sidebar);
    mainContent.appendChild(chatSection);
    chatContainer.appendChild(mainContent);

    // Add styles
    const styles = `
        .chat-app-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            background: #212529;
        }

        .chat-content-container {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .sidebar-container {
            width: 300px;
            background: #2c3338;
            border-right: 1px solid #464646;
            display: flex;
            flex-direction: column;
        }

        .search-section {
            padding: 1rem;
            border-bottom: 1px solid #464646;
        }

        .search-container {
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 0.8rem;
            padding-left: 2.5rem;
            border: none;
            border-radius: 4px;
            background: #212529;
            color: #cacaca;
            font-family: monospace;
        }

        .search-icon {
            position: absolute;
            left: 0.8rem;
            top: 50%;
            transform: translateY(-50%);
            color: #888;
        }

        .friends-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .friends-header {
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #cacaca;
            border-bottom: 1px solid #464646;
        }

        .friends-header h3 {
            margin: 0;
            font-size: 1rem;
            color: #9EEB20;
        }

        .online-count {
            font-size: 0.8rem;
            color: #888;
        }

        .friends-list {
            flex: 1;
            overflow-y: auto;
            padding: 0.5rem;
        }

        .friend-item {
            display: flex;
            align-items: center;
            padding: 0.75rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-bottom: 0.5rem;
        }

        .friend-item:hover {
            background: #464646;
        }

        .friend-item.active {
            background: #464646;
            border-left: 3px solid #9EEB20;
        }

        .chat-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #212529;
        }

        .chat-header {
            padding: 1rem;
            background: #2c3338;
            border-bottom: 1px solid #464646;
        }

        .chat-user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .user-avatar {
            position: relative;
            width: 40px;
            height: 40px;
        }

        .user-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }

        .status-indicator {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #9EEB20;
            border: 2px solid #2c3338;
        }

        .user-details {
            display: flex;
            flex-direction: column;
        }

        .username {
            margin: 0;
            color: #cacaca;
            font-size: 1rem;
        }

        .user-status {
            font-size: 0.8rem;
            color: #888;
        }

        .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .input-container {
            padding: 1rem;
            background: #2c3338;
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .message-input {
            flex: 1;
            padding: 0.8rem;
            border: none;
            border-radius: 4px;
            background: #212529;
            color: #cacaca;
            font-family: monospace;
        }

        .send-button {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 4px;
            background: #9EEB20;
            color: #212529;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .send-button:hover {
            background: #ADFF2F;
            transform: scale(1.05);
        }

        @media (max-width: 768px) {
            .sidebar-container {
                width: 100%;
                position: fixed;
                left: -100%;
                top: 0;
                bottom: 0;
                transition: left 0.3s ease;
                z-index: 1000;
            }

            .sidebar-container.active {
                left: 0;
            }

            .chat-section {
                width: 100%;
            }
        }
    .friend-item{
        display : flex;
        gap : 8px;
    }
    .friend-name {
        color : white;
    }
    .friend-avatar {
        position: relative;
        width: 40px;
        height: 40px;
    }

    .friend-avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #464646;
    }

    .friend-avatar-img:hover {
        border-color: #9EEB20;
    }
    .message {
        margin: 10px;
        max-width: 70%;
        padding: 10px;
        border-radius: 10px;
    }

    .message.sent {
        margin-left: auto;
        background-color: var(--primary-color);
        color: white;
    }

    .message.received {
        margin-right: auto;
        background-color: var(--secondary-background);
    }

    .message-content {
        display: flex;
        flex-direction: column;
    }

    .message-header {
        display: flex;
        justify-content: space-between;
        font-size: 0.8em;
        margin-bottom: 5px;
    }

    .message-text {
        word-break: break-word;
    }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // State variables
    let socket = null;
    let currentUser = null;
    let friends = []; // Store friends list
    let userListContainer = null;
    let users = [];
    let activeRoom = null;
    let isChatFocused = false;
    let messageInput = null;
    let messagesContainer = null;

    function initialize() {
        // Initialize DOM elements after they're created
        messageInput = chatSection.querySelector('.message-input');
        messagesContainer = chatSection.querySelector('.messages-container');

        // Setup event listeners
        setupEventListeners();

        // Load initial friends list
        loadFriends();

        return chatContainer;
    }

    function setupWebSocket(roomId) {
        if (socket) {
            socket.close();
        }

        const token = localStorage.getItem('access_token');
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Use window.location.hostname if available, otherwise fallback to localhost
        const wsHost = window.location.hostname || 'localhost';
        const wsPort = '8000';
        const wsUrl = `${wsProtocol}//${wsHost}:${wsPort}/ws/chat/${roomId}/?token=${token}`;
        
        console.log('Connecting to WebSocket:', wsUrl);
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log('WebSocket connected for room:', roomId);
            if (messageInput) {
                messageInput.disabled = false;
            }
        };

        socket.onmessage = (event) => {
            try {
                console.log('Received WebSocket message:', event.data);
                const data = JSON.parse(event.data);
                
                if (data.type === 'chat_message') {
                    console.log('Processing chat message:', data); // Debug log
                    displayMessage({
                        sender: {
                            id: data.user_id,
                            username: data.username
                        },
                        content: data.message,
                        timestamp: data.timestamp
                    });
                }
            } catch (error) {
                console.error('Error processing message:', error);
                console.error('Raw message data:', event.data);
            }
        };

        socket.onclose = (event) => {
            console.log('WebSocket disconnected:', event.code, event.reason);
            if (messageInput) {
                messageInput.disabled = true;
            }
            // Only attempt to reconnect if we still have an active room
            if (activeRoom && activeRoom.id === roomId) {
                console.log('Attempting to reconnect...');
                setTimeout(() => setupWebSocket(roomId), 3000);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    async function loadFriends() {
        try {
            // Replace with your actual API call
            const response = await fetch(`${API_BASE_URL}/api/chat/users/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            friends = await response.json();
            renderFriendsList();
        } catch (error) {
            console.error('Failed to load friends:', error);
        }
    }

    function renderFriendsList(searchTerm = '') {
        friendsSection.querySelector('.friends-list').innerHTML = '';
        const filteredFriends = friends.filter(friend => 
            friend.username.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredFriends.forEach(friend => {
            const friendElement = document.createElement('div');
            friendElement.className = 'friend-item';
            friendElement.innerHTML = `
                <div class="friend-avatar">
                    <img src="${friend.profile_pic || '../../images/cat2.jpg'}" 
                     alt="${friend.username}"
                     class="friend-avatar-img">
                 </div>
                <div class="friend-info">
                    <div class="friend-name">${friend.username}</div>
                </div>
            `;
            friendElement.addEventListener('click', () => selectFriend(friend));
            friendsSection.querySelector('.friends-list').appendChild(friendElement);
        });
    }

    function selectFriend(friend) {
        // Update UI to show selected friend
        document.querySelectorAll('.friend-item').forEach(item => 
            item.classList.remove('active')
        );
        event.currentTarget.classList.add('active');
        
        // Start chat with the selected friend
        startChat(friend.id);
    }

    async function loadChatHistory(roomId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/rooms/${roomId}/messages/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const messages = await response.json();
            console.log('Loaded chat history:', messages); // Debug log

            if (messagesContainer) {
                messagesContainer.innerHTML = '';
                
                messages.forEach(message => {
                    console.log('Processing history message:', message); // Debug log
                    displayMessage({
                        sender: {
                            id: message.sender,
                            username: message.username
                        },
                        content: message.content,
                        timestamp: message.timestamp
                    });
                });
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }

    function setupEventListeners() {
        if (!messageInput) {
            console.error('Message input not initialized');
            return;
        }

        // Message sending handlers
        const sendButton = document.querySelector('.send-button');
        if (sendButton) {
            sendButton.addEventListener('click', sendMessage);
        }

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                renderFriendsList(e.target.value);
            });
        }
    }

    function sendMessage() {
        if (!messageInput) {
            console.error('Message input not initialized');
            return;
        }

        const messageText = messageInput.value.trim();
        if (!messageText || !socket || !activeRoom) {
            console.log('Cannot send message:', {
                hasText: !!messageText,
                hasSocket: !!socket,
                hasActiveRoom: !!activeRoom,
                socketState: socket?.readyState
            });
            return;
        }

        try {
            const message = {
                message: messageText,
                room_id: activeRoom.id
            };

            console.log('Sending message:', message);
            socket.send(JSON.stringify(message));
            
            // Also display the message locally
            displayMessage({
                sender: {
                    id: parseInt(localStorage.getItem('user_id')),
                    username: localStorage.getItem('username')
                },
                content: messageText,
                timestamp: new Date().toISOString()
            });

            messageInput.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    function displayMessage(message) {
        if (!messagesContainer) {
            console.error('Messages container not initialized');
            return;
        }

        try {
            console.log('Displaying message:', message); // Debug log

            const messageElement = document.createElement('div');
            const currentUserId = parseInt(localStorage.getItem('user_id'));
            const senderId = message.sender?.id || message.user_id;
            const isSentByMe = senderId === currentUserId;
            
            messageElement.className = `message ${isSentByMe ? 'sent' : 'received'}`;
            
            // Handle different message formats
            const messageContent = message.content || message.message;
            const senderName = message.sender?.username || message.username;
            const timestamp = message.timestamp || new Date().toISOString();

            console.log('Message details:', { // Debug log
                senderId,
                currentUserId,
                isSentByMe,
                messageContent,
                senderName,
                timestamp
            });

            messageElement.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">${senderName}</span>
                        <span class="message-time">${new Date(timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div class="message-text">${messageContent}</div>
                </div>
            `;

            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error displaying message:', error);
            console.error('Message data:', message);
        }
    }

    function setCurrentUser(username) {
        currentUser = username;
    }

    async function loadUsers() {
        try {
            const response = await fetch('http://localhost:8000/api/chat/users/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch users');
            
            users = await response.json();
            renderUserList();
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    function renderUserList() {
        userListContainer.innerHTML = `
            <div class="user-list-header">
                <h3>Available Users</h3>
            </div>
            <div class="user-list">
                ${users.map(user => `
                    <div class="user-item" data-user-id="${user.id}">
                        <img src="${user.profile_pic || 'default-avatar.png'}" alt="${user.username}" class="user-avatar">
                        <div class="user-info">
                            <span class="username">${user.username}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click listeners to user items
        userListContainer.querySelectorAll('.user-item').forEach(item => {
            item.addEventListener('click', () => startChat(item.dataset.userId));
        });
    }

    async function startChat(userId) {
        try {
            // First, try to find an existing direct message room
            const response = await fetch(`${API_BASE_URL}/api/chat/rooms/direct/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            let room;
            if (response.ok) {
                room = await response.json();
            } else if (response.status === 404) {
                // If no room exists, create a new one
                const createResponse = await fetch(`${API_BASE_URL}/api/chat/rooms/create/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        participants: [userId],
                        is_direct_message: true
                    })
                });
                
                if (!createResponse.ok) {
                    throw new Error('Failed to create chat room');
                }
                room = await createResponse.json();
            }

            activeRoom = room; // Set the active room
            
            // Update chat header with friend info
            updateChatHeader(room);
            
            // Clear previous messages
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }

            // Setup WebSocket connection
            setupWebSocket(room.id);
            
            // Load chat history
            await loadChatHistory(room.id);
            
            // Enable input after chat starts
            if (messageInput) {
                messageInput.disabled = false;
                messageInput.placeholder = "Type a message...";
            }
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    }

    function updateChatHeader(room) {
        const chatHeader = document.querySelector('.chat-header');
        if (!chatHeader) return;

        const otherParticipant = room.participants.find(p => p.id !== parseInt(localStorage.getItem('user_id')));
        if (!otherParticipant) return;

        chatHeader.innerHTML = `
            <div class="chat-user-info">
                <div class="user-avatar">
                    <img src="${otherParticipant.profile_pic || '../../images/cat2.jpg'}" alt="${otherParticipant.username}">
                    <span class="status-indicator"></span>
                </div>
                <div class="user-details">
                    <h4 class="username">${otherParticipant.username}</h4>
                    <span class="user-status">Online</span>
                </div>
            </div>
        `;
    }

    return {
        initialize,
        setCurrentUser
    };
}

// // Initialize the chat application
// document.addEventListener('DOMContentLoaded', () => {
//     const chat = ChatApp();
//     chat.setCurrentUser(localStorage.getItem('username'));
//     document.body.appendChild(chat.initialize());
// });

function createNavbar() {
    const navElement = document.createElement('nav');
    navElement.className = 'navbar navbar-expand-lg custom-nav w-100';
    
    navElement.innerHTML = `
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
    `;

    // Add event listeners
    const searchButton = navElement.querySelector('#search-button');
    const searchDropdown = navElement.querySelector('#search-dropdown');
    const searchInput = navElement.querySelector('#search-input');
    const clearSearch = navElement.querySelector('#clear-search');
    const searchResults = navElement.querySelector('#search-results');

    if (searchButton && searchDropdown && searchInput && clearSearch && searchResults) {
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

            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            searchResults.innerHTML = '<div class="loading">Searching...</div>';

            searchTimeout = setTimeout(async () => {
                try {
                    const users = await api.searchUsers(query);

                    if (users.length === 0) {
                        searchResults.innerHTML = `
                            <div class="no-results">
                                No users found
                            </div>
                        `;
                        return;
                    }

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
            }, 300);
        });

        // Clear search
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            searchResults.innerHTML = '';
            clearSearch.style.display = 'none';
            searchInput.focus();
        });
    }

    // Add click event listeners for navigation
    navElement.addEventListener('click', (e) => {
        const targetId = e.target.id;
        const closestElement = e.target.closest('button');

        switch (closestElement && closestElement.id) {
            case 'chat-button':
                window.location.hash = '#/chat';
                break;
            case 'this-is-avatar-id':
                window.location.hash = '#/profile';
                break;
        }
    });

    // Set up avatar after creating the navbar
    setTimeout(() => {
        getUserName().then(() => {
            // Update both desktop and mobile avatars
            const desktopAvatar = navElement.querySelector('.avatar-btn img');
            const mobileAvatar = navElement.querySelector('.dropdown-toggle');
            
            const avatarSrc = localStorage.getItem('avatar_url') || '../../images/cat2.jpg';
            if (desktopAvatar) desktopAvatar.src = avatarSrc;
            if (mobileAvatar) mobileAvatar.src = avatarSrc;
        });
    }, 0);

    return navElement;
}

// Helper functions
function handleNotifications() {
    // Implement notification handling
    console.log('Handling notifications...');
}

function handleSettings() {
    // Implement settings handling
    console.log('Handling settings...');
}