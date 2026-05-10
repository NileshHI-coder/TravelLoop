
// Authentication system using LocalStorage
class Auth {
    static USERS_KEY = 'traveloop_users';
    static CURRENT_USER_KEY = 'traveloop_current_user';

    static init() {
        // Handle form submissions
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin);
        }

        if (signupForm) {
            signupForm.addEventListener('submit', this.handleSignup);
        }
    }

    static handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const users = Storage.get(Auth.USERS_KEY, []);
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            Storage.set(Auth.CURRENT_USER_KEY, user);
            window.location.href = 'dashboard.html';
        } else {
            showError('email', 'Invalid email or password');
        }
    }

    static handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validation
        if (password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            return;
        }

        const users = Storage.get(Auth.USERS_KEY, []);
        if (users.find(u => u.email === email)) {
            showError('email', 'Email already exists');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        Storage.set(Auth.USERS_KEY, users);
        Storage.set(Auth.CURRENT_USER_KEY, newUser);

        window.location.href = 'dashboard.html';
    }

    static getCurrentUser() {
        return Storage.get(Auth.CURRENT_USER_KEY);
    }

    static logout() {
        Storage.remove(Auth.CURRENT_USER_KEY);
        window.location.href = 'index.html';
    }

    static isAuthenticated() {
        return !!Auth.getCurrentUser();
    }
}

// Helper function
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = field.parentNode.querySelector('.error-message');
    errorSpan.textContent = message;
    field.style.borderColor = '#e74c3c';
    
    setTimeout(() => {
        errorSpan.textContent = '';
        field.style.borderColor = 'rgba(102, 126, 234, 0.2)';
    }, 5000);
}

// Initialize auth
Auth.init();