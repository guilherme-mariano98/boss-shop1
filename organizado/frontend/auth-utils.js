// Authentication utilities for all pages

// Show notification message
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#00aa00' : '#ff4444'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout function
function logout() {
    // Confirm logout
    if (confirm('Tem certeza que deseja sair?')) {
        // Clear authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Show success notification
        showNotification('Logout realizado com sucesso!', 'success');
        
        // Update user icon
        updateUserIcon();
        
        // Hide the logout button if it exists
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.style.display = 'none';
        }
        
        // Small delay to show the notification
        setTimeout(function() {
            // Redirect to login page
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Update user icon based on login status
function updateUserIcon() {
    const userIcon = document.getElementById('userIcon');
    const userText = document.getElementById('userText');
    const logoutButton = document.getElementById('logoutButton');
    
    if (!userIcon || !userText) return;
    
    const authToken = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (authToken && user) {
        try {
            const userData = JSON.parse(user);
            const name = userData.name || userData.username || 'Perfil';
            userIcon.href = 'profile.html';
            userText.textContent = name;
            
            // Show logout button
            if (logoutButton) {
                logoutButton.style.display = 'flex';
            }
        } catch (e) {
            // If there's an error parsing user data, clear auth tokens
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            userIcon.href = 'login.html';
            userText.textContent = 'Entrar';
            
            // Hide logout button
            if (logoutButton) {
                logoutButton.style.display = 'none';
            }
        }
    } else {
        userIcon.href = 'login.html';
        userText.textContent = 'Entrar';
        
        // Hide logout button
        if (logoutButton) {
            logoutButton.style.display = 'none';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Hide preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
    
    updateUserIcon();
});