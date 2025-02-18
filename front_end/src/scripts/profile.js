/* 
** saved example **



<div class="match-item">
    <div class="match-info">
        <p class="opponent">vs Alice</p>
        <p class="game-date">Today, 14:30</p>
    </div>
    <div class="match-result-section">
        <span class="match-score">11 - 7</span>
        <span class="match-result result-win">WIN</span>
    </div>
</div>


*/

// import { initializeSearch } from "./home";

const matches = [
    {
        opponent: "Alice",
        date: "Today, 14:30",
        score: "11 - 7",
        result: "WIN"
    },
    {
        opponent: "Bob",
        date: "Yesterday, 16:00",
        score: "9 - 11",
        result: "LOSS"
    },
    {
        opponent: "Alice1",
        date: "Today, 14:30",
        score: "11 - 7",
        result: "WIN"
    },
    {
        opponent: "Bob1",
        date: "Yesterday, 16:00",
        score: "9 - 11",
        result: "LOSS"
    },
    {
        opponent: "Alice2",
        date: "Today, 14:30",
        score: "11 - 7",
        result: "WIN"
    },
    {
        opponent: "Bob2",
        date: "Yesterday, 16:00",
        score: "9 - 11",
        result: "LOSS"
    },
    {
        opponent: "Alice3",
        date: "Today, 14:30",
        score: "11 - 7",
        result: "WIN"
    },
    {
        opponent: "Bob3",
        date: "Yesterday, 16:00",
        score: "9 - 11",
        result: "LOSS"
    }
];

// Function to generate match HTML
function generateMatchHTML(match) {
    return `
        <div class="match-item">
            <div class="match-info">
                <p class="opponent">vs ${match.opponent}</p>
                <p class="game-date">${match.date}</p>
            </div>
            <div class="match-result-section">
                <span class="match-score">${match.score}</span>
                <span class="match-result result-${match.result.toLowerCase()}">${match.result}</span>
            </div>
        </div>
    `;
}

// Function to render all matches
export function renderMatches()
{
    const matchListElement = document.querySelector('.match-list');
    if (matchListElement)
    {
        const matchesHTML = matches.map(match => generateMatchHTML(match)).join('');
        matchListElement.innerHTML = matchesHTML;
    }
}



// Function to get access token
function getAccessToken() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        console.error('No access token found');
        return null;
    }
    return token;
}


function formatDate(isoString) {
    if (!isoString) return "Unknown"; // Handle missing date
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}



export function getUserName() {
    const token = getAccessToken();
    if (!token)
        return;

    // First set all avatars to loading state
    const avatarElements = [
        document.getElementById('avatar-preview'),
        document.querySelector('.avatar'),
        document.querySelector('.dropdown-toggle.avatar')
    ];

    // avatarElements.forEach(element => {
    //     if (element) {
    //         element.style.opacity = '0.5'; // Show loading state
    //     }
    // });

    fetch('http://localhost:8000/api/getToken/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return response.json();
    })
    .then(data => {
        console.log('API Response:', data);

        const profileName = document.querySelector('.profile-name');
        const bio_data = document.querySelector('.profile-bio');
        const gamesPlayed = document.getElementById('games-played');
        const victories = document.getElementById('victories');
        const winRate = document.getElementById('win-rate');
        const pointsPerGame = document.getElementById('points-per-game');

        if (profileName)
            profileName.textContent = data.username;

        if (bio_data) {
            const is_active = data.is_active;
            const member_since = formatDate(data.created_at);
            const userID = data.id || "N/A"; 
            bio_data.innerHTML = '';
            const activeStatus = document.createElement('span');
            activeStatus.textContent = is_active ? 'Online' : 'Offline';
            activeStatus.style.color = is_active ? 'green' : 'red';
            bio_data.appendChild(activeStatus);
            bio_data.innerHTML += ` | Member since: ${member_since} | User ID: ${userID}`;
        }
        if (gamesPlayed)
            gamesPlayed.textContent = data.games_played;

        if (victories)
            victories.textContent = data.victories;

        if (winRate)
            winRate.textContent = `${data.win_rate}%`;

        if (pointsPerGame)
            pointsPerGame.textContent = data.avg;
            
        if (data.profile_pic) {
            avatarElements.forEach(element => {
                if (element) {
                    element.style.opacity = '1'; // Remove loading state
                    element.src = data.profile_pic;
                    element.onerror = () => {
                        element.src = '../../images/cat1.jpg';
                        element.style.opacity = '1';
                    };

                }
            });
        }
        else if (data.uploaded_profile_pic)
        {
            avatarElements.forEach(element => {
                if (element) {
                    element.style.opacity = '1';
                    element.src = `http://localhost:8000${data.uploaded_profile_pic}`;
                }
            });
        }
        else
        {
            avatarElements.forEach(element => {
                if (element) {
                    element.style.opacity = '1';
                    element.src = '../../images/cat1.jpg';
                }
            });
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        avatarElements.forEach(element => {
            if (element) {
                element.style.opacity = '1';
                element.src = '../../images/cat1.jpg';
            }
        });
    });
}

export async function getStats() {
    try {
        const response = await fetch('http://localhost:8001/score/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            throw new Error('Failed to fetch user stats');
        }

        const data = await response.json();
        console.log('Stats data:', data);

        // Check if response is an object instead of an array
        if (!data || typeof data !== 'object') {
            console.error('Unexpected response format:', data);
            throw new Error('Expected an object but received something else');
        }

        console.log('Games played:', data.games_played);

        const stats = {
            games_played: data.games_played,
            victories: data.victories,
            win_rate: data.win_rate,
            avg: data.avg
        };

        await fetch('http://localhost:8000/api/update_score/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
            body: JSON.stringify(stats)
        });

        console.log('Stats successfully uploaded');
        return data;
    } catch (error) {
        console.error('Error processing user stats:', error);
        alert("Could not fetch or upload user statistics. Please try again later.");
        throw error;
    }
}

export function Profile() {
    
    setTimeout(async () => {
        renderMatches();
        getUserName();
        try {
            await getStats();
            // uploadToDatabase1();
        } catch (error) {
            console.error('Failed to get stats:', error);
        }
    }, 0);

    return `
    <nav class="navbar navbar-expand-lg custom-nav w-100">
        <div class="container-fluid px-4">
            <a class="navbar-brand fw-bold" href="#/dashboard">ft_ping_pong()</a>
            <!-- Desktop Navigation -->
            <div class="d-none d-lg-flex align-items-center">
                <button class="btn nav-icon-btn" onclick="handleNotifications()">
                    <i class="fas fa-bell"></i>
                </button>
                <div class="ms-3">
                    <button class="avatar-btn" id="this-is-avatar-id">
                        <img src=""  class="avatar">
                    </button>
                </div>
            </div>
            
            <!-- Mobile Navigation -->
            <div class="d-lg-none">
                <div class="dropdown">
                    <img src="" 
                         class="avatar dropdown-toggle"
                         data-bs-toggle="dropdown"
                         aria-expanded="false"
                         >
                    <ul class="dropdown-menu dropdown-menu-end">
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
    <div class="profile-container">
        <div class="profile-header">
            <div class="profile-avatar-section">
                <div class="avatar-upload">
                    <img src="" alt="Profile Avatar" class="avatar-preview" id="avatar-preview">
                    <label for="avatar-input" class="avatar-upload-btn">
                        <i class="fas fa-camera"></i>
                    </label>
                    <input type="file" id="avatar-input" class="file-input" accept="image/*">
                </div>
            </div>
            <div class="profile-info" id="profile-info">
                <h1 class="profile-name"></h1>
                <p class="profile-bio"></p>
            </div>
        </div>
                <div class="stats-section">
            <div class="stat-card">
                <div class="stat-value" id="games-played"></div>
                <div class="stat-label">Games Played</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="victories"></div>
                <div class="stat-label">Victories</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="win-rate"></div>
                <div class="stat-label">Win Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="points-per-game"></div>
                <div class="stat-label">Avg Points/Game</div>
            </div>
        </div>

        <div class="match-history">
            <h2 class="history-title">Recent Matches</h2>
            <div class="match-list">

                <!-- Match items will be dynamically added here -->

            </div>
        </div>
    </div>
       
    `;
}
