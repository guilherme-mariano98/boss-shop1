// Enhanced Products Loading Script
// This script loads real products from the database and displays them beautifully

// API Base URL - using the local server
const API_BASE_URL = 'http://localhost:3000/api';

// Function to format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Function to load and display featured products
async function loadFeaturedProducts() {
    try {
        showLoadingState('.flash-sale .products-grid');
        
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        
        // Filter for featured products or take first 8 products
        const featuredProducts = products.filter(p => p.is_featured === 1).slice(0, 8);
        const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);
        
        if (displayProducts.length === 0) {
            showEmptyState('.flash-sale .products-grid');
            return;
        }
        
        const productsGrid = document.querySelector('.flash-sale .products-grid');
        productsGrid.innerHTML = displayProducts.map(product => createProductCard(product)).join('');
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.productId;
                const productName = this.dataset.productName;
                const productPrice = parseFloat(this.dataset.productPrice);
                addToCart(productName, productPrice);
            });
        });
        
    } catch (error) {
        console.error('Error loading featured products:', error);
        showErrorState('.flash-sale .products-grid', 'Erro ao carregar produtos em oferta');
    }
}

// Function to load and display popular products
async function loadPopularProducts() {
    try {
        showLoadingState('.popular-products .products-grid');
        
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        
        // Sort by price descending to show "popular" (expensive) products
        const popularProducts = [...products]
            .sort((a, b) => (b.price || 0) - (a.price || 0))
            .slice(0, 8);
        
        if (popularProducts.length === 0) {
            showEmptyState('.popular-products .products-grid');
            return;
        }
        
        const productsGrid = document.querySelector('.popular-products .products-grid');
        productsGrid.innerHTML = popularProducts.map(product => createProductCard(product)).join('');
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.productId;
                const productName = this.dataset.productName;
                const productPrice = parseFloat(this.dataset.productPrice);
                addToCart(productName, productPrice);
            });
        });
        
    } catch (error) {
        console.error('Error loading popular products:', error);
        showErrorState('.popular-products .products-grid', 'Erro ao carregar produtos populares');
    }
}

// Function to create a beautiful product card
function createProductCard(product) {
    const hasDiscount = product.old_price && product.old_price > product.price;
    const discountPercentage = hasDiscount ? 
        Math.round(((product.old_price - product.price) / product.old_price) * 100) : 0;
    
    return `
        <div class="product-card">
            <div class="product-badge ${hasDiscount ? 'discount' : 'new'}">
                ${hasDiscount ? `-${discountPercentage}%` : 'NOVO'}
            </div>
            
            <div class="product-image-container">
                <img src="${product.image_url || 'https://via.placeholder.com/300x300/eeeeee/969696?text=Produto'}" 
                     alt="${product.name}" 
                     class="product-image"
                     onerror="this.src='https://via.placeholder.com/300x300/eeeeee/969696?text=Produto'">
                <div class="product-actions">
                    <button class="action-btn wishlist-btn" title="Adicionar aos favoritos">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn quick-view-btn" title="Visualização rápida">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            
            <div class="product-info">
                <div class="product-category">${product.category || 'Categoria'}</div>
                <h3 class="product-title">${product.name || 'Produto sem nome'}</h3>
                
                <div class="product-pricing">
                    ${hasDiscount ? `
                        <div class="price-container">
                            <span class="old-price">${formatCurrency(product.old_price)}</span>
                            <span class="current-price">${formatCurrency(product.price)}</span>
                        </div>
                    ` : `
                        <div class="price-container">
                            <span class="current-price">${formatCurrency(product.price)}</span>
                        </div>
                    `}
                </div>
                
                <div class="product-meta">
                    <div class="stock-status ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}">
                        <i class="fas fa-circle"></i>
                        ${product.stock_quantity > 0 ? 
                            `Em estoque (${product.stock_quantity} unidades)` : 
                            'Fora de estoque'}
                    </div>
                </div>
                
                <button class="add-to-cart-btn" 
                        data-product-id="${product.id}" 
                        data-product-name="${product.name}" 
                        data-product-price="${product.price}"
                        ${product.stock_quantity <= 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${product.stock_quantity <= 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
                </button>
            </div>
        </div>
    `;
}

// Loading state functions
function showLoadingState(selector) {
    const container = document.querySelector(selector);
    if (container) {
        container.innerHTML = `
            <div class="loading-placeholder" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <div class="spinner"></div>
                <p>Carregando produtos...</p>
            </div>
        `;
    }
}

function showEmptyState(selector) {
    const container = document.querySelector(selector);
    if (container) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-box-open" style="font-size: 64px; color: #ccc; margin-bottom: 20px;"></i>
                <h3 style="color: #666; margin-bottom: 10px;">Nenhum produto disponível no momento</h3>
                <p style="color: #999; margin-bottom: 20px;">Adicione produtos pelo painel administrativo</p>
                <a href="admin-panel.html" class="add-products-btn" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                    <i class="fas fa-plus-circle" style="margin-right: 8px;"></i>
                    Adicionar Produtos
                </a>
            </div>
        `;
    }
}

function showErrorState(selector, message) {
    const container = document.querySelector(selector);
    if (container) {
        container.innerHTML = `
            <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 64px; color: #ff6b6b; margin-bottom: 20px;"></i>
                <h3 style="color: #666; margin-bottom: 10px;">${message}</h3>
                <p style="color: #999; margin-bottom: 20px;">Tente novamente mais tarde</p>
                <button onclick="location.reload()" style="background: #000000; color: white; padding: 12px 30px; border-radius: 25px; border: none; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-sync-alt" style="margin-right: 8px;"></i>
                    Recarregar
                </button>
            </div>
        `;
    }
}

// Enhanced cart functionality
function addToCart(productName, price) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${productName} adicionado ao carrinho!`);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function showNotification(message) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.product-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'product-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    // Add icon styles
    const icon = notification.querySelector('i');
    icon.style.cssText = 'font-size: 20px;';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load products
    loadFeaturedProducts();
    loadPopularProducts();
    
    // Update cart count
    updateCartCount();
    
    // Add hover effects to product cards
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }
    });
});