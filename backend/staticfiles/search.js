// Search functionality

// Sample products database
const productsDatabase = [
    { id: 1, name: 'iPhone 15 Pro Max', category: 'eletronicos', price: 5849, oldPrice: 8999, rating: 5, discount: 35, image: 'https://images.unsplash.com/photo-1592286927505-2fd0f3a1f3b4?w=400', freeShipping: true },
    { id: 2, name: 'Tênis Nike Air Max', category: 'esportes', price: 479.90, oldPrice: 799.90, rating: 4.5, discount: 40, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', freeShipping: true },
    { id: 3, name: 'Notebook Dell Inspiron', category: 'eletronicos', price: 3009, oldPrice: 4299, rating: 5, discount: 30, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', freeShipping: true },
    { id: 4, name: 'Smart TV 65" 4K', category: 'eletronicos', price: 2199, oldPrice: 3999, rating: 4.5, discount: 45, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', freeShipping: true },
    { id: 5, name: 'AirPods Pro 2', category: 'eletronicos', price: 1487, oldPrice: 2399, rating: 5, discount: 38, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400', freeShipping: true },
    { id: 6, name: 'Apple Watch Series 9', category: 'eletronicos', price: 2493, oldPrice: 4299, rating: 5, discount: 42, image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400', freeShipping: true },
    { id: 7, name: 'Camiseta Básica', category: 'moda', price: 39.90, oldPrice: 49.90, rating: 4.5, discount: 20, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', freeShipping: false },
    { id: 8, name: 'Calça Jeans', category: 'moda', price: 89.90, oldPrice: null, rating: 4, discount: 0, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', freeShipping: false },
    { id: 9, name: 'Sofá Confortável', category: 'casa', price: 1020, oldPrice: 1200, rating: 4.5, discount: 15, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400', freeShipping: true },
    { id: 10, name: 'Console PlayStation 5', category: 'games', price: 2250, oldPrice: 2500, rating: 5, discount: 10, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', freeShipping: true },
    { id: 11, name: 'Fone Gamer RGB', category: 'games', price: 299.90, oldPrice: 350, rating: 4.5, discount: 15, image: 'https://images.unsplash.com/photo-1589578151266-11308265d904?w=400', freeShipping: false },
    { id: 12, name: 'Conjunto de Halteres', category: 'esportes', price: 254.90, oldPrice: 319.90, rating: 4.5, discount: 20, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', freeShipping: false },
];

let currentPage = 1;
let filteredProducts = [...productsDatabase];
let activeFilters = {
    categories: [],
    minPrice: null,
    maxPrice: null,
    ratings: [],
    discounts: [],
    shipping: []
};

// Initialize search on page load
window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        document.getElementById('search-input').value = query;
        document.querySelector('#search-query span').textContent = query;
        performSearch(query);
    } else {
        displayProducts(productsDatabase);
    }
});

// Perform search
function performSearch(query) {
    if (!query) {
        query = document.getElementById('search-input').value.trim();
    }
    
    if (!query) {
        displayProducts(productsDatabase);
        return;
    }
    
    document.querySelector('#search-query span').textContent = query;
    
    // Filter products by search query
    const searchResults = productsDatabase.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    filteredProducts = searchResults;
    applyFilters();
}

// Apply filters
function applyFilters() {
    let results = [...productsDatabase];
    
    // Search query filter
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        results = results.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    // Category filter
    const categoryCheckboxes = document.querySelectorAll('.filter-options input[value="eletronicos"], .filter-options input[value="moda"], .filter-options input[value="casa"], .filter-options input[value="games"], .filter-options input[value="esportes"]');
    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    if (selectedCategories.length > 0) {
        results = results.filter(product => selectedCategories.includes(product.category));
    }
    
    // Price filter
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    results = results.filter(product => product.price >= minPrice && product.price <= maxPrice);
    
    // Rating filter
    const ratingCheckboxes = document.querySelectorAll('.filter-options input[value="5"], .filter-options input[value="4"], .filter-options input[value="3"]');
    const selectedRatings = Array.from(ratingCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => parseFloat(cb.value));
    
    if (selectedRatings.length > 0) {
        const minRating = Math.min(...selectedRatings);
        results = results.filter(product => product.rating >= minRating);
    }
    
    // Discount filter
    const discountCheckboxes = document.querySelectorAll('.filter-options input[value="50"], .filter-options input[value="40"], .filter-options input[value="30"], .filter-options input[value="20"]');
    const selectedDiscounts = Array.from(discountCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => parseFloat(cb.value));
    
    if (selectedDiscounts.length > 0) {
        const minDiscount = Math.min(...selectedDiscounts);
        results = results.filter(product => product.discount >= minDiscount);
    }
    
    // Shipping filter
    const freeShippingCheckbox = document.querySelector('.filter-options input[value="free-shipping"]');
    if (freeShippingCheckbox && freeShippingCheckbox.checked) {
        results = results.filter(product => product.freeShipping);
    }
    
    filteredProducts = results;
    displayProducts(results);
    updateActiveFilters();
}

// Display products
function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    const resultsCount = document.getElementById('results-count');
    
    resultsCount.innerHTML = `Encontramos <strong>${products.length}</strong> produtos`;
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou fazer uma nova busca</p>
                <button onclick="clearFilters()">Limpar Filtros</button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}'">
            ${product.discount > 0 ? `<div class="product-badge">-${product.discount}%</div>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3>${product.name}</h3>
                <div class="product-rating">
                    ${getStars(product.rating)}
                    <span>(${Math.floor(Math.random() * 500) + 50})</span>
                </div>
                <div class="product-price">
                    ${product.oldPrice ? `<span class="old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
                    <span class="new-price">R$ ${product.price.toFixed(2)}</span>
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${product.name}', ${product.price})">
                    <i class="fas fa-shopping-cart"></i> Adicionar
                </button>
            </div>
        </div>
    `).join('');
}

// Helper functions
function getCategoryName(category) {
    const names = {
        'eletronicos': 'Eletrônicos',
        'moda': 'Moda',
        'casa': 'Casa',
        'games': 'Games',
        'esportes': 'Esportes'
    };
    return names[category] || category;
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

// Sort results
function sortResults() {
    const sortValue = document.getElementById('sort-select').value;
    let sorted = [...filteredProducts];
    
    switch(sortValue) {
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'discount':
            sorted.sort((a, b) => b.discount - a.discount);
            break;
        case 'newest':
            sorted.sort((a, b) => b.id - a.id);
            break;
        default:
            // relevance - keep original order
            break;
    }
    
    displayProducts(sorted);
}

// Set price range
function setPriceRange(min, max) {
    document.getElementById('min-price').value = min;
    document.getElementById('max-price').value = max;
    applyFilters();
}

// Clear filters
function clearFilters() {
    document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    applyFilters();
}

// Update active filters display
function updateActiveFilters() {
    const container = document.getElementById('active-filters');
    const filters = [];
    
    // Category filters
    document.querySelectorAll('.filter-options input[type="checkbox"]:checked').forEach(cb => {
        const label = cb.parentElement.querySelector('span').textContent;
        filters.push({ type: 'category', value: cb.value, label: label });
    });
    
    // Price filter
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    if (minPrice || maxPrice) {
        filters.push({ 
            type: 'price', 
            value: 'price', 
            label: `R$ ${minPrice || '0'} - R$ ${maxPrice || '∞'}` 
        });
    }
    
    if (filters.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = filters.map(filter => `
        <div class="filter-tag">
            <span>${filter.label}</span>
            <button onclick="removeFilter('${filter.type}', '${filter.value}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Remove individual filter
function removeFilter(type, value) {
    if (type === 'price') {
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
    } else {
        const checkbox = document.querySelector(`.filter-options input[value="${value}"]`);
        if (checkbox) checkbox.checked = false;
    }
    applyFilters();
}

// Pagination
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
}

function nextPage() {
    currentPage++;
    updatePagination();
}

function updatePagination() {
    // Update active page button
    document.querySelectorAll('.page-btn').forEach((btn, index) => {
        if (index > 0 && index < 6) {
            btn.classList.toggle('active', index === currentPage);
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Search on Enter key
document.getElementById('search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});
