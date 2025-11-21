// Simple Frontend Authentication System
class AuthSystem {
    constructor() {
        this.users = [
            {
                username: 'admin',
                password: 'admin123',
                name: 'Administrator'
            },
            {
                username: 'obang',
                password: 'obang123', 
                name: 'Obanganteng'
            },
            {
                username: 'user',
                password: 'user123',
                name: 'Regular User'
            }
        ];
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('obanganteng_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainApp();
        } else {
            this.showLoginForm();
        }
    }

    showLoginForm() {
        document.body.innerHTML = `
            <div class="login-container">
                <div class="login-box">
                    <div class="login-header">
                        <h1>🔐 OBANGANTENG</h1>
                        <p>Data Formatter System</p>
                    </div>
                    
                    <form id="loginForm" class="login-form">
                        <div class="input-group">
                            <label for="username">Username:</label>
                            <input 
                                type="text" 
                                id="username" 
                                placeholder="Masukkan username" 
                                required
                            >
                        </div>
                        
                        <div class="input-group">
                            <label for="password">Password:</label>
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="Masukkan password" 
                                required
                            >
                        </div>

                        <button type="submit" class="login-btn">
                            🚀 Login ke Sistem
                        </button>
                    </form>

                    <div class="login-message" id="loginMessage"></div>

                    <div class="demo-accounts">
                        <h4>🔑 Akun Demo:</h4>
                        <div class="account-list">
                            <div><strong>admin</strong> / admin123</div>
                            <div><strong>obang</strong> / obang123</div>
                            <div><strong>user</strong> / user123</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('loginMessage');

        // Simple validation
        if (!username || !password) {
            this.showMessage('Username dan password harus diisi!', 'error');
            return;
        }

        // Find user
        const user = this.users.find(u => 
            u.username === username && u.password === password
        );

        if (user) {
            this.currentUser = user;
            localStorage.setItem('obanganteng_user', JSON.stringify(user));
            this.showMessage('Login berhasil! Mengalihkan...', 'success');
            
            setTimeout(() => {
                this.showMainApp();
            }, 1000);
        } else {
            this.showMessage('Username atau password salah!', 'error');
        }
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('loginMessage');
        messageDiv.innerHTML = message;
        messageDiv.className = `login-message ${type}`;
        
        if (type === 'success') {
            messageDiv.style.color = '#27ae60';
        } else {
            messageDiv.style.color = '#e74c3c';
        }
    }

    showMainApp() {
        // Load the original website content
        document.body.innerHTML = `
            <div class="container">
                <header>
                    <div class="user-info">
                        <h1>🛒 Data Formatter</h1>
                        <p>Selamat datang, <strong>${this.currentUser.name}</strong>!</p>
                    </div>
                    <button onclick="auth.logout()" class="logout-btn">🚪 Logout</button>
                </header>

                <div class="main-content">
                    <div class="input-section">
                        <h3>Masukkan Data Mentah:</h3>
                        <textarea id="rawData" placeholder="Paste data transaksi mentah di sini..."></textarea>
                        <button onclick="formatData()" class="btn-format">🚀 Rapikan Data</button>
                        <button onclick="clearData()" class="btn-clear">🗑️ Hapus</button>
                    </div>

                    <div class="output-section">
                        <h3>Hasil yang Dirafikan:</h3>
                        <div class="output-controls">
                            <button onclick="copyToClipboard()" class="btn-copy">📋 Copy</button>
                            <button onclick="downloadAsText()" class="btn-download">💾 Download</button>
                        </div>
                        <div id="formattedResult" class="formatted-result"></div>
                    </div>
                </div>

                <div class="stats-section">
                    <h3>📊 Statistik</h3>
                    <div id="statistics" class="statistics"></div>
                </div>
            </div>
        `;

        // Re-initialize your existing functions
        setTimeout(() => {
            // Your existing formatData, clearData, etc functions will work here
            // Make sure they are available in global scope
        }, 100);
    }

    logout() {
        localStorage.removeItem('obanganteng_user');
        this.currentUser = null;
        this.showLoginForm();
    }
}

// Initialize auth system
const auth = new AuthSystem();
