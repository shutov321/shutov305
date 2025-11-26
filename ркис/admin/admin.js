// Admin functionality
document.addEventListener('DOMContentLoaded', function() {
    // Admin login form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
});

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation - in production, this would be a secure server-side check
    if (username === 'admin' && password === 'admin123') {
        // Store login state (in production, use secure session management)
        localStorage.setItem('adminLoggedIn', 'true');
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('Неверный логин или пароль');
    }
}

// Check if admin is logged in (for dashboard pages)
function checkAdminAuth() {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
}

// Admin logout
function adminLogout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}