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
    initCategoryProductsLoader();
    initHomeTabsLoader();
});

function initCategoryProductsLoader() {
    const grid = document.querySelector('.category-products .products-grid');
    if (!grid) return;

    const categoryLabelEl = document.querySelector('.breadcrumb span');
    let label = categoryLabelEl ? categoryLabelEl.textContent.trim() : '';
    if (!label) {
        const headerH1 = document.querySelector('.category-header h1');
        label = headerH1 ? headerH1.textContent.trim() : '';
    }

    if (!label) return;

    const normalized = normalizeCategory(label);
    const apiBase = `${location.origin}/api`;

    fetch(`${apiBase}/products?category=${encodeURIComponent(normalized)}`)
        .then(r => r.json())
        .then(products => {
            if (!Array.isArray(products) || products.length === 0) return;
            grid.innerHTML = products.map(p => renderProductCard(p)).join('');
            bindWishlist(grid);
        })
        .catch(err => console.error('Erro ao carregar produtos da categoria', normalized, err));
}

function initHomeTabsLoader() {
    const tabs = ['moda','eletronicos','casa','games','esportes','infantil'];
    const apiBase = `${location.origin}/api`;
    tabs.forEach(cat => {
        const grid = document.querySelector(`#${cat}-content .products-grid`);
        if (!grid) return;
        fetch(`${apiBase}/products?category=${cat}`)
            .then(r => r.json())
            .then(products => {
                if (!Array.isArray(products) || products.length === 0) return;
                grid.innerHTML = products.slice(0, 6).map(p => renderProductCard(p)).join('');
                bindWishlist(grid);
            })
            .catch(err => console.error('Erro ao carregar produtos da aba', cat, err));
    });
}

function normalizeCategory(s) {
    const map = {
        'moda': 'moda',
        'eletrônicos': 'eletronicos',
        'eletronicos': 'eletronicos',
        'casa': 'casa',
        'games': 'games',
        'esportes': 'esportes',
        'infantil': 'infantil',
        'beleza': 'beleza',
        'brinquedos': 'brinquedos',
        'livros': 'livros',
        'ferramentas': 'ferramentas',
        'automotivo': 'automotivo',
        'alimentos': 'alimentos',
        'música': 'musica',
        'musica': 'musica',
        'papelaria': 'papelaria',
        'saúde': 'saude',
        'saude': 'saude',
        'pet shop': 'pet-shop',
        'pet-shop': 'pet-shop'
    };
    const key = s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    return map[key] || key;
}

function renderProductCard(p) {
    const priceBRL = `R$ ${Number(p.price).toFixed(2).replace('.', ',')}`;
    return `
    <div class="product-card flash-product">
        <div class="product-image">
            <img src="https://source.unsplash.com/500x500/?product,${encodeURIComponent(p.category)}" alt="${p.name}" class="product-img">
            <button class="wishlist-btn"><i class="far fa-heart"></i></button>
        </div>
        <div class="product-info">
            <div class="product-category">${capitalize(p.category)}</div>
            <h3>${p.name}</h3>
            <div class="product-rating">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i>
                <span>(42)</span>
            </div>
            <div class="product-price">
                <span class="new-price">${priceBRL}</span>
            </div>
            <button class="add-to-cart-btn flash-btn" onclick="addToCart('${escapeHtml(p.name)}', ${Number(p.price)})">
                <i class="fas fa-shopping-cart"></i> Comprar Agora
            </button>
        </div>
    </div>`;
}

function bindWishlist(container) {
    container.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function() {
            const heartIcon = this.querySelector('i');
            if (heartIcon.classList.contains('far')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                heartIcon.style.color = '#ff4444';
                showNotification('Produto adicionado aos favoritos!');
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                heartIcon.style.color = '';
                showNotification('Produto removido dos favoritos.');
            }
        });
    });
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function escapeHtml(str) {
    return str.replace(/[&<>"]'/g, function(c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}
