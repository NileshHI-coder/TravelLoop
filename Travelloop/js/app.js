// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Initialize all modules
    initThemeToggle();
    initNavigation();
    initUserDisplay();
    
    // Page-specific initialization
    if (document.querySelector('.app-container')) {
        Trips.init();
    }
}

function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        const isDark = localStorage.getItem('darkTheme') === 'true';
        if (isDark) {
            document.body.classList.add('dark-theme');
            toggle.querySelector('i').className = 'fas fa-sun';
            toggle.querySelector('span').textContent = 'Light Mode';
        }

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('dark-theme');
            
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('darkTheme', isDark);
            
            const icon = this.querySelector('i');
            const text = this.querySelector('span');
            
            if (isDark) {
                icon.className = 'fas fa-sun';
                text.textContent = 'Light Mode';
            } else {
                icon.className = 'fas fa-moon';
                text.textContent = 'Dark Mode';
            }
        });
    }
}

function initNavigation() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                Auth.logout();
            }
        });
    }

    // Check authentication
    if (window.location.pathname.includes('dashboard') || 
        window.location.pathname.includes('create-trip') ||
        window.location.pathname.includes('my-trips')) {
        if (!Auth.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }
}

function initUserDisplay() {
    const user = Auth.getCurrentUser();
    const userNameEl = document.getElementById('userName');
    if (userNameEl && user) {
        userNameEl.textContent = user.name.split(' ')[0];
    }
}

// Global utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}