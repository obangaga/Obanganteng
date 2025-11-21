// Secure Single Password Authentication for Obanganteng
class AuthSystem {
    constructor() {
        // ⚠️ GANTI PASSWORD INI DENGAN YANG LEBIH KUAT!
        this.appPassword = 'obanganteng2024'; 
        this.init();
    }

    init() {
        // Check if already authenticated
        if (localStorage.getItem('obang_authenticated') === 'true') {
            this.showMainApp();
        } else {
            this.showPasswordPrompt();
        }
    }

    showPasswordPrompt() {
        document.body.innerHTML = `
            <div class="login-container">
                <div class="login-box">
                    <div class="login-header">
                        <h1>🔐 OBANGANTENG</h1>
                        <p>Data Formatter System</p>
                    </div>
                    
                    <div class="input-group">
                        <label for="appPassword">Password Aplikasi:</label>
                        <input 
                            type="password" 
                            id="appPassword" 
                            placeholder="Masukkan password aplikasi" 
                            required
                            autocomplete="off"
                        >
                    </div>

                    <button onclick="auth.checkAppPassword()" class="login-btn">
                        🚀 Masuk ke Sistem
                    </button>

                    <div class="login-message" id="loginMessage"></div>

                    <div class="demo-info">
                        <p><small>Hubungi administrator untuk mendapatkan password</small></p>
                    </div>
                </div>
            </div>
        `;

        // Enter key support
        document.getElementById('appPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAppPassword();
            }
        });
    }

    checkAppPassword() {
        const input = document.getElementById('appPassword').value;
        const messageDiv = document.getElementById('loginMessage');

        if (!input) {
            this.showMessage('Password harus diisi!', 'error');
            return;
        }

        if (input === this.appPassword) {
            localStorage.setItem('obang_authenticated', 'true');
            this.showMessage('✅ Login berhasil! Mengalihkan...', 'success');
            setTimeout(() => this.showMainApp(), 1000);
        } else {
            this.showMessage('❌ Password salah!', 'error');
            // Clear password field
            document.getElementById('appPassword').value = '';
            document.getElementById('appPassword').focus();
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
                        <p>Selamat datang di <strong>Obanganteng System</strong></p>
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
            // Your existing functions will work here
        }, 100);
    }

    logout() {
        localStorage.removeItem('obang_authenticated');
        this.showPasswordPrompt();
    }
}

// Initialize auth system
const auth = new AuthSystem();
