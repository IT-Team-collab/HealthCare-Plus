class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is logged in
        const token = localStorage.getItem('authToken');
        if (token) {
            this.validateToken(token);
        }
        this.setupEventListeners();
        this.updateUIState();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const logoutBtn = document.querySelector('.logout-btn');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegistration(e));
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Add profile dropdown toggle
        const profileToggle = document.querySelector('.profile-toggle');
        if (profileToggle) {
            profileToggle.addEventListener('click', () => {
                profileToggle.classList.toggle('active');
                document.querySelector('.profile-dropdown').classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.user-profile')) {
                    profileToggle.classList.remove('active');
                    document.querySelector('.profile-dropdown').classList.remove('active');
                }
            });
        }
    }

    updateUIState() {
        const authButtons = document.querySelector('.auth-buttons');
        const userProfile = document.querySelector('.user-profile');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');

        if (this.currentUser) {
            // User is logged in
            authButtons.style.display = 'none';
            userProfile.style.display = 'block';
            userName.textContent = this.currentUser.name;
            if (this.currentUser.avatar) {
                userAvatar.src = this.currentUser.avatar;
            }
        } else {
            // User is logged out
            authButtons.style.display = 'flex';
            userProfile.style.display = 'none';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await this.loginUser(email, password);
            if (response.success) {
                localStorage.setItem('authToken', response.token);
                this.currentUser = response.user;
                this.updateUIState();
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            const notifications = new NotificationSystem();
            notifications.push('Invalid email or password', 'error');
        }
    }

    async handleRegistration(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());

        try {
            const response = await this.registerUser(userData);
            if (response.success) {
                const notifications = new NotificationSystem();
                notifications.push('Registration successful! Please log in.', 'success');
                window.location.href = 'login.html';
            }
        } catch (error) {
            const notifications = new NotificationSystem();
            notifications.push(error.message, 'error');
        }
    }

    handleLogout() {
        localStorage.removeItem('authToken');
        this.currentUser = null;
        this.updateUIState();
        window.location.href = 'index.html';
    }

    // Mock API calls (replace with actual API endpoints)
    async loginUser(email, password) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    token: 'mock-jwt-token',
                    user: { email, name: 'Test User' }
                });
            }, 1000);
        });
    }

    async registerUser(userData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Registration successful'
                });
            }, 1000);
        });
    }

    validateToken(token) {
        // Implement token validation logic
    }
} 