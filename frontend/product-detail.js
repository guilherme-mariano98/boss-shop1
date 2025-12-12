// Product Detail JavaScript

// Change main image when clicking thumbnail
function changeImage(thumbnail) {
    const mainImage = document.getElementById('main-image');
    mainImage.src = thumbnail.src.replace('w=200', 'w=800');
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Quantity controls
function increaseQuantity() {
    const input = document.getElementById('quantity');
    const max = parseInt(input.max);
    if (parseInt(input.value) < max) {
        input.value = parseInt(input.value) + 1;
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    const min = parseInt(input.min);
    if (parseInt(input.value) > min) {
        input.value = parseInt(input.value) - 1;
    }
}

// Toggle wishlist
function toggleWishlist() {
    const btn = document.querySelector('.wishlist-btn-large');
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    
    if (btn.classList.contains('active')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('Produto adicionado aos favoritos!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('Produto removido dos favoritos!', 'info');
    }
}

// Add to cart
function addToCart() {
    const productName = document.getElementById('product-title').textContent;
    const quantity = document.getElementById('quantity').value;
    const price = document.querySelector('.new-price-detail').textContent;
    
    showNotification(`${quantity}x ${productName} adicionado ao carrinho!`, 'success');
    
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = parseInt(cartCount.textContent) + parseInt(quantity);
    }
}

// Buy now
function buyNow() {
    addToCart();
    setTimeout(() => {
        window.location.href = 'purchase.html';
    }, 500);
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active to clicked button
    event.target.classList.add('active');
}

// Image zoom
function openImageZoom() {
    const modal = document.getElementById('zoom-modal');
    const mainImage = document.getElementById('main-image');
    const zoomedImage = document.getElementById('zoomed-image');
    
    modal.style.display = 'block';
    zoomedImage.src = mainImage.src;
}

function closeImageZoom() {
    document.getElementById('zoom-modal').style.display = 'none';
}

// Close zoom on click outside
window.onclick = function(event) {
    const modal = document.getElementById('zoom-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Color option selection
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
        this.classList.add('active');
    });
});

// Size option selection
document.querySelectorAll('.size-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
        this.classList.add('active');
    });
});

// Share buttons
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        const productUrl = window.location.href;
        const productName = document.getElementById('product-title').textContent;
        
        if (icon.classList.contains('fa-whatsapp')) {
            window.open(`https://wa.me/?text=${encodeURIComponent(productName + ' - ' + productUrl)}`, '_blank');
        } else if (icon.classList.contains('fa-facebook')) {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
        } else if (icon.classList.contains('fa-twitter')) {
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productName)}`, '_blank');
        } else if (icon.classList.contains('fa-link')) {
            navigator.clipboard.writeText(productUrl);
            showNotification('Link copiado para a área de transferência!', 'success');
        }
    });
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #4caf50;
    }
    
    .notification-success i {
        color: #4caf50;
    }
    
    .notification-info {
        border-left: 4px solid #2196f3;
    }
    
    .notification-info i {
        color: #2196f3;
    }
`;
document.head.appendChild(style);
