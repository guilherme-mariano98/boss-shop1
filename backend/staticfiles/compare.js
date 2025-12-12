// Product Comparison JavaScript

const availableProducts = [
    { id: 1, name: 'iPhone 15 Pro Max', price: 5849, oldPrice: 8999, rating: 5, discount: 35, category: 'Eletrônicos', image: 'https://images.unsplash.com/photo-1592286927505-2fd0f3a1f3b4?w=400', freeShipping: true, stock: 'available' },
    { id: 2, name: 'Tênis Nike Air Max', price: 479.90, oldPrice: 799.90, rating: 4.5, discount: 40, category: 'Esportes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', freeShipping: true, stock: 'available' },
    { id: 3, name: 'Notebook Dell Inspiron', price: 3009, oldPrice: 4299, rating: 5, discount: 30, category: 'Eletrônicos', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', freeShipping: true, stock: 'low' },
    { id: 4, name: 'Smart TV 65" 4K', price: 2199, oldPrice: 3999, rating: 4.5, discount: 45, category: 'Eletrônicos', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', freeShipping: true, stock: 'available' },
    { id: 5, name: 'AirPods Pro 2', price: 1487, oldPrice: 2399, rating: 5, discount: 38, category: 'Eletrônicos', image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400', freeShipping: true, stock: 'available' },
    { id: 6, name: 'Apple Watch Series 9', price: 2493, oldPrice: 4299, rating: 5, discount: 42, category: 'Eletrônicos', image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400', freeShipping: true, stock: 'available' },
    { id: 7, name: 'Camiseta Básica', price: 39.90, oldPrice: 49.90, rating: 4.5, discount: 20, category: 'Moda', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', freeShipping: false, stock: 'available' },
    { id: 8, name: 'Sofá Confortável', price: 1020, oldPrice: 1200, rating: 4.5, discount: 15, category: 'Casa', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400', freeShipping: true, stock: 'low' },
];

let comparedProducts = [null, null, null, null];
let currentSlot = 0;

// Initialize
window.addEventListener('DOMContentLoaded', function() {
    loadProductList();
    
    // Search functionality
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterProducts(this.value);
        });
    }
});

function openProductSelector(slot) {
    currentSlot = slot;
    const modal = document.getElementById('product-selector-modal');
    modal.classList.add('active');
    loadProductList();
}

function closeProductSelector() {
    const modal = document.getElementById('product-selector-modal');
    modal.classList.remove('active');
}

function loadProductList() {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    
    productList.innerHTML = availableProducts.map(product => `
        <div class="product-item" onclick="selectProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-item-name">${product.name}</div>
            <div class="product-item-price">R$ ${product.price.toFixed(2)}</div>
        </div>
    `).join('');
}

function filterProducts(query) {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    
    const filtered = availableProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    productList.innerHTML = filtered.map(product => `
        <div class="product-item" onclick="selectProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-item-name">${product.name}</div>
            <div class="product-item-price">R$ ${product.price.toFixed(2)}</div>
        </div>
    `).join('');
}

function selectProduct(productId) {
    const product = availableProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product is already in comparison
    if (comparedProducts.some(p => p && p.id === productId)) {
        alert('Este produto já está na comparação!');
        return;
    }
    
    comparedProducts[currentSlot] = product;
    closeProductSelector();
    updateComparison();
}

function removeProduct(slot) {
    comparedProducts[slot] = null;
    updateComparison();
}

function updateComparison() {
    const hasProducts = comparedProducts.some(p => p !== null);
    
    // Show/hide sections
    document.getElementById('add-products-section').style.display = hasProducts ? 'none' : 'grid';
    document.getElementById('comparison-table').style.display = hasProducts ? 'block' : 'none';
    
    if (!hasProducts) {
        document.getElementById('winner-section').style.display = 'none';
        return;
    }
    
    // Update each product column
    comparedProducts.forEach((product, index) => {
        updateProductColumn(product, index);
    });
    
    // Determine winner
    determineWinner();
}

function updateProductColumn(product, index) {
    const productCell = document.getElementById(`product-${index}`);
    const priceCell = document.getElementById(`price-${index}`);
    const ratingCell = document.getElementById(`rating-${index}`);
    const discountCell = document.getElementById(`discount-${index}`);
    const shippingCell = document.getElementById(`shipping-${index}`);
    const categoryCell = document.getElementById(`category-${index}`);
    const stockCell = document.getElementById(`stock-${index}`);
    const actionCell = document.getElementById(`action-${index}`);
    
    if (!product) {
        productCell.innerHTML = `
            <div class="add-product-card" onclick="openProductSelector(${index})">
                <i class="fas fa-plus-circle"></i>
                <span>Adicionar</span>
            </div>
        `;
        priceCell.innerHTML = '-';
        ratingCell.innerHTML = '-';
        discountCell.innerHTML = '-';
        shippingCell.innerHTML = '-';
        categoryCell.innerHTML = '-';
        stockCell.innerHTML = '-';
        actionCell.innerHTML = '';
        return;
    }
    
    // Product info
    productCell.innerHTML = `
        <div class="product-card-compare">
            <button class="remove-product-btn" onclick="removeProduct(${index})">
                <i class="fas fa-times"></i>
            </button>
            <img src="${product.image}" alt="${product.name}" class="product-image-compare">
            <div class="product-name-compare">${product.name}</div>
        </div>
    `;
    
    // Price
    priceCell.innerHTML = `
        ${product.oldPrice ? `<div class="old-price-compare">R$ ${product.oldPrice.toFixed(2)}</div>` : ''}
        <div class="price-compare">R$ ${product.price.toFixed(2)}</div>
    `;
    
    // Rating
    ratingCell.innerHTML = `
        <div class="rating-compare">
            ${getStars(product.rating)}
            <span>${product.rating}</span>
        </div>
    `;
    
    // Discount
    discountCell.innerHTML = product.discount > 0 
        ? `<div class="discount-badge-compare">-${product.discount}%</div>`
        : '<span>Sem desconto</span>';
    
    // Shipping
    shippingCell.innerHTML = product.freeShipping
        ? '<div class="shipping-badge shipping-free"><i class="fas fa-truck"></i> Grátis</div>'
        : '<div class="shipping-badge shipping-paid"><i class="fas fa-dollar-sign"></i> Pago</div>';
    
    // Category
    categoryCell.innerHTML = `<div class="category-badge">${product.category}</div>`;
    
    // Stock
    const stockInfo = {
        'available': { class: 'stock-available', icon: 'check-circle', text: 'Em estoque' },
        'low': { class: 'stock-low', icon: 'exclamation-circle', text: 'Últimas unidades' },
        'out': { class: 'stock-out', icon: 'times-circle', text: 'Esgotado' }
    };
    const stock = stockInfo[product.stock] || stockInfo['available'];
    stockCell.innerHTML = `
        <div class="stock-badge ${stock.class}">
            <i class="fas fa-${stock.icon}"></i>
            ${stock.text}
        </div>
    `;
    
    // Action button
    actionCell.innerHTML = `
        <button class="buy-btn-compare" onclick="buyProduct(${product.id})">
            <i class="fas fa-shopping-cart"></i>
            Comprar
        </button>
    `;
}

function getStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function determineWinner() {
    const validProducts = comparedProducts.filter(p => p !== null);
    
    if (validProducts.length < 2) {
        document.getElementById('winner-section').style.display = 'none';
        return;
    }
    
    // Calculate score based on: price (lower is better), rating (higher is better), discount (higher is better)
    const scores = validProducts.map(product => {
        const priceScore = 1 / product.price * 10000; // Normalize price
        const ratingScore = product.rating * 20;
        const discountScore = product.discount;
        const shippingScore = product.freeShipping ? 10 : 0;
        
        return {
            product,
            score: priceScore + ratingScore + discountScore + shippingScore
        };
    });
    
    // Find winner
    scores.sort((a, b) => b.score - a.score);
    const winner = scores[0].product;
    
    // Display winner
    document.getElementById('winner-section').style.display = 'block';
    document.getElementById('winner-name').textContent = winner.name;
}

function clearComparison() {
    if (confirm('Deseja limpar toda a comparação?')) {
        comparedProducts = [null, null, null, null];
        updateComparison();
    }
}

function buyProduct(productId) {
    const product = availableProducts.find(p => p.id === productId);
    if (product) {
        alert(`Adicionando ${product.name} ao carrinho!`);
        // Here you would add to cart logic
        window.location.href = 'purchase.html';
    }
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('product-selector-modal');
    if (event.target == modal) {
        closeProductSelector();
    }
}
