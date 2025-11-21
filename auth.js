// Secure Single Password Authentication for Obanganteng
class AuthSystem {
    constructor() {
        // ⚠️ GANTI PASSWORD INI DENGAN YANG LEBIH KUAT!
        this.appPassword = 'oban1928'; 
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
                        <h1>OBAN GANTENG MAXIMAL</h1>
                        <p>Endah adil tak gawekna aplikasi ngetung</p>
                    </div>
                    
                    <div class="input-group">
                        <label for="appPassword">Tapi Ana Passworde:</label>
                        <input 
                            type="password" 
                            id="appPassword" 
                            placeholder="masukan password Ababil42" 
                            required
                            autocomplete="off"
                        >
                    </div>

                    <button onclick="auth.checkAppPassword()" class="login-btn">
                        🚀 Yuh Manjing
                    </button>

                    <div class="login-message" id="loginMessage"></div>

                    <div class="demo-info">
                        <p><small>Coba takon oban password e apa</small></p>
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
            this.showMessage('✅ NAH IYA BENER..', 'success');
            setTimeout(() => this.showMainApp(), 1000);
        } else {
            this.showMessage('❌ SALAH, AJA NGAWAG !', 'error');
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
                        <h1>MINUS ngomong NGEPLUS meneng</h1>
                        <p>Selamat datang di <strong>Oban Ganteng Max</strong></p>
                    </div>
                    <button onclick="auth.logout()" class="logout-btn">🚪 Logout</button>
                </header>

                <div class="main-content">
                    <div class="input-section">
                        <h3>Tempel na ng kene:</h3>
                        <textarea id="rawData" placeholder="Sing mau di copy, paste ng kene ya..."></textarea>
                        <button onclick="formatData()" class="btn-format">Yuh Detung</button>
                        <button onclick="clearData()" class="btn-clear">Hapus</button>
                    </div>

                    <div class="output-section">
                        <h3>kie cuma hasil ndah rapi tok:</h3>
                        <div class="output-controls">
                            <button onclick="copyToClipboard()" class="btn-copy">mbokan pan Copy maning</button>
                            <button onclick="downloadAsText()" class="btn-download">mbokan pan download</button>
                        </div>
                        <div id="formattedResult" class="formatted-result"></div>
                    </div>
                </div>

                <div class="stats-section">
                    <h3>📊Lah kie baru hasil akhir. pimen? minus apa ngeplus?</h3>
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
