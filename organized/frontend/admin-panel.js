// BOSS SHOPP - Admin Panel JavaScript

// Global variables
let currentSection = 'dashboard';
let salesChart = null;
let currentEditingProduct = null;
let currentEditingCategory = null;
let currentEditingSeller = null;

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

function initializeAdminPanel() {
    // Check admin authentication
    checkAdminAuth();
    
    // Setup navigation
    setupNavigation();
    
    // Load initial data
    loadDashboardData();
    
    // Setup form handlers
    setupFormHandlers();
    
    // Setup filters
    setupFilters();
    
    // Load admin info
    loadAdminInfo();
}

// Authentication
function checkAdminAuth() {
    const authToken = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (!authToken || !user) {
        redirectToLogin();
        return;
    }
    
    try {
        const userData = JSON.parse(user);
        if (!userData.is_admin) {
            showAlert('Acesso negado. Apenas administradores podem acessar este painel.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
    } catch (e) {
        redirectToLogin();
    }
}

function redirectToLogin() {
    showAlert('Acesso negado. Faça login como administrador.', 'error');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function loadAdminInfo() {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            document.getElementById('adminName').textContent = userData.name || 'Administrador';
        } catch (e) {
            console.error('Erro ao carregar dados do admin:', e);
        }
    }
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        showAlert('Logout realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Set active nav item
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    currentSection = sectionId;
    
    // Load section data
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProducts();
            loadProductCategories();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'sellers':
            loadSellers();
            break;
        case 'reports':
            // Reports are generated on demand
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// Dashboard
function loadDashboardData() {
    loadDashboardStats();
    loadRecentOrders();
    loadTopProducts();
    initializeSalesChart();
}

function loadDashboardStats() {
    // Simulate API calls - replace with real API endpoints
    const stats = {
        totalOrders: Math.floor(Math.random() * 100) + 50,
        totalRevenue: (Math.random() * 10000 + 5000).toFixed(2),
        totalCustomers: Math.floor(Math.random() * 500) + 200,
        totalProducts: Math.floor(Math.random() * 200) + 100
    };
    
    document.getElementById('totalOrders').textContent = stats.totalOrders;
    document.getElementById('totalRevenue').textContent = `R$ ${stats.totalRevenue.replace('.', ',')}`;
    document.getElementById('totalCustomers').textContent = stats.totalCustomers;
    document.getElementById('totalProducts').textContent = stats.totalProducts;
}

function loadRecentOrders() {
    // Simulate recent orders data
    const orders = [
        { id: 'BS001', customer: 'João Silva', total: 299.90, status: 'processing', date: '2024-01-15' },
        { id: 'BS002', customer: 'Maria Santos', total: 159.90, status: 'shipped', date: '2024-01-15' },
        { id: 'BS003', customer: 'Pedro Oliveira', total: 89.90, status: 'delivered', date: '2024-01-14' },
        { id: 'BS004', customer: 'Ana Costa', total: 199.90, status: 'pending', date: '2024-01-14' },
        { id: 'BS005', customer: 'Carlos Lima', total: 349.90, status: 'processing', date: '2024-01-13' }
    ];
    
    const tableBody = document.getElementById('recentOrdersTable');
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>R$ ${order.total.toFixed(2).replace('.', ',')}</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>${formatDate(order.date)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editOrder('${order.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadTopProducts() {
    // Simulate top products data
    const topProducts = [
        { name: 'Smartphone Premium', sales: 45 },
        { name: 'Notebook Ultrafino', sales: 32 },
        { name: 'Tênis Esportivo', sales: 28 },
        { name: 'Fone Bluetooth', sales: 25 },
        { name: 'Smart TV 55"', sales: 22 }
    ];
    
    const container = document.getElementById('topProducts');
    container.innerHTML = topProducts.map(product => `
        <div class="top-product-item">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-sales">${product.sales} vendas</div>
            </div>
        </div>
    `).join('');
}

function initializeSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    if (salesChart) {
        salesChart.destroy();
    }
    
    // Simulate sales data for last 7 days
    const salesData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 5000) + 1000);
    const labels = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    }
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Vendas (R$)',
                data: salesData,
                borderColor: '#000000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

// Products Management
function loadProducts() {
    // Simulate products data
    const products = [
        {
            id: 1,
            name: 'Smartphone Premium',
            category: 'Eletrônicos',
            price: 1760.00,
            stock: 25,
            status: 'active',
            image: 'https://via.placeholder.com/50x50'
        },
        {
            id: 2,
            name: 'Camiseta Básica',
            category: 'Moda',
            price: 39.90,
            stock: 100,
            status: 'active',
            image: 'https://via.placeholder.com/50x50'
        },
        {
            id: 3,
            name: 'Notebook Ultrafino',
            category: 'Eletrônicos',
            price: 2975.00,
            stock: 15,
            status: 'active',
            image: 'https://via.placeholder.com/50x50'
        },
        {
            id: 4,
            name: 'Sofá Confortável',
            category: 'Casa',
            price: 1020.00,
            stock: 8,
            status: 'inactive',
            image: 'https://via.placeholder.com/50x50'
        }
    ];
    
    const tableBody = document.getElementById('productsTable');
    tableBody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-image"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>R$ ${product.price.toFixed(2).replace('.', ',')}</td>
            <td>${product.stock}</td>
            <td><span class="status-badge status-${product.status}">${product.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadProductCategories() {
    const categories = [
        { id: 1, name: 'Moda', slug: 'moda' },
        { id: 2, name: 'Eletrônicos', slug: 'eletronicos' },
        { id: 3, name: 'Casa', slug: 'casa' },
        { id: 4, name: 'Games', slug: 'games' },
        { id: 5, name: 'Esportes', slug: 'esportes' },
        { id: 6, name: 'Infantil', slug: 'infantil' }
    ];
    
    const select = document.getElementById('productCategory');
    const filterSelect = document.getElementById('productCategoryFilter');
    
    const options = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    
    select.innerHTML = '<option value="">Selecione uma categoria</option>' + options;
    filterSelect.innerHTML = '<option value="">Todas as categorias</option>' + options;
}

// Categories Management
function loadCategories() {
    const categories = [
        { id: 1, name: 'Moda', slug: 'moda', description: 'Roupas e acessórios', products: 45 },
        { id: 2, name: 'Eletrônicos', slug: 'eletronicos', description: 'Dispositivos eletrônicos', products: 32 },
        { id: 3, name: 'Casa', slug: 'casa', description: 'Produtos para o lar', products: 28 },
        { id: 4, name: 'Games', slug: 'games', description: 'Jogos e acessórios', products: 25 },
        { id: 5, name: 'Esportes', slug: 'esportes', description: 'Equipamentos esportivos', products: 22 },
        { id: 6, name: 'Infantil', slug: 'infantil', description: 'Produtos para crianças', products: 18 }
    ];
    
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = categories.map(category => `
        <div class="category-card">
            <div class="category-header">
                <div class="category-name">${category.name}</div>
                <div class="category-actions">
                    <button class="btn btn-sm btn-primary" onclick="editCategory(${category.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p><strong>Slug:</strong> ${category.slug}</p>
            <p><strong>Descrição:</strong> ${category.description}</p>
            <p><strong>Produtos:</strong> ${category.products}</p>
        </div>
    `).join('');
}

// Orders Management
function loadOrders() {
    const orders = [
        { id: 'BS001', customer: 'João Silva', items: 3, total: 299.90, status: 'processing', date: '2024-01-15' },
        { id: 'BS002', customer: 'Maria Santos', items: 2, total: 159.90, status: 'shipped', date: '2024-01-15' },
        { id: 'BS003', customer: 'Pedro Oliveira', items: 1, total: 89.90, status: 'delivered', date: '2024-01-14' },
        { id: 'BS004', customer: 'Ana Costa', items: 2, total: 199.90, status: 'pending', date: '2024-01-14' },
        { id: 'BS005', customer: 'Carlos Lima', items: 4, total: 349.90, status: 'processing', date: '2024-01-13' },
        { id: 'BS006', customer: 'Lucia Ferreira', items: 1, total: 79.90, status: 'cancelled', date: '2024-01-13' }
    ];
    
    const tableBody = document.getElementById('ordersTable');
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.items}</td>
            <td>R$ ${order.total.toFixed(2).replace('.', ',')}</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>${formatDate(order.date)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="updateOrderStatus('${order.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Customers Management
function loadCustomers() {
    const customers = [
        { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-1111', city: 'São Paulo', orders: 5, status: 'active' },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '(21) 88888-2222', city: 'Rio de Janeiro', orders: 3, status: 'active' },
        { id: 3, name: 'Pedro Oliveira', email: 'pedro@email.com', phone: '(31) 77777-3333', city: 'Belo Horizonte', orders: 2, status: 'active' },
        { id: 4, name: 'Ana Costa', email: 'ana@email.com', phone: '(41) 66666-4444', city: 'Curitiba', orders: 1, status: 'inactive' }
    ];
    
    const tableBody = document.getElementById('customersTable');
    tableBody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.city}</td>
            <td>${customer.orders}</td>
            <td><span class="status-badge status-${customer.status}">${customer.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewCustomer(${customer.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editCustomer(${customer.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Sellers Management
function loadSellers() {
    const sellers = [
        { id: 1, name: 'Carlos Vendedor', email: 'carlos@vendedor.com', phone: '(11) 99999-5555', sales: 150, commission: 5.0, status: 'active' },
        { id: 2, name: 'Ana Vendedora', email: 'ana@vendedora.com', phone: '(21) 88888-6666', sales: 120, commission: 4.5, status: 'active' },
        { id: 3, name: 'Pedro Vendas', email: 'pedro@vendas.com', phone: '(31) 77777-7777', sales: 80, commission: 3.0, status: 'inactive' }
    ];
    
    const tableBody = document.getElementById('sellersTable');
    tableBody.innerHTML = sellers.map(seller => `
        <tr>
            <td>${seller.name}</td>
            <td>${seller.email}</td>
            <td>${seller.phone}</td>
            <td>${seller.sales}</td>
            <td>${seller.commission}%</td>
            <td><span class="status-badge status-${seller.status}">${seller.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewSeller(${seller.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editSeller(${seller.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSeller(${seller.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Settings Management
function loadSettings() {
    // Load current settings
    document.getElementById('storeName').value = 'BOSS SHOPP';
    document.getElementById('contactEmail').value = 'contato@bossshopp.com';
    document.getElementById('contactPhone').value = '(11) 99999-9999';
    document.getElementById('enableCreditCard').checked = true;
    document.getElementById('enablePix').checked = true;
    document.getElementById('enableBoleto').checked = true;
    document.getElementById('freeShippingLimit').value = '200.00';
    document.getElementById('defaultShippingRate').value = '15.00';
}

// Modal Functions
function openProductModal(productId = null) {
    currentEditingProduct = productId;
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    
    if (productId) {
        title.textContent = 'Editar Produto';
        // Load product data for editing
        loadProductForEdit(productId);
    } else {
        title.textContent = 'Novo Produto';
        document.getElementById('productForm').reset();
    }
    
    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    currentEditingProduct = null;
}

function openCategoryModal(categoryId = null) {
    currentEditingCategory = categoryId;
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('categoryModalTitle');
    
    if (categoryId) {
        title.textContent = 'Editar Categoria';
        // Load category data for editing
        loadCategoryForEdit(categoryId);
    } else {
        title.textContent = 'Nova Categoria';
        document.getElementById('categoryForm').reset();
    }
    
    modal.style.display = 'block';
}

function closeCategoryModal() {
    document.getElementById('categoryModal').style.display = 'none';
    currentEditingCategory = null;
}

function openSellerModal(sellerId = null) {
    currentEditingSeller = sellerId;
    const modal = document.getElementById('sellerModal');
    const title = document.getElementById('sellerModalTitle');
    
    if (sellerId) {
        title.textContent = 'Editar Vendedor';
        // Load seller data for editing
        loadSellerForEdit(sellerId);
    } else {
        title.textContent = 'Novo Vendedor';
        document.getElementById('sellerForm').reset();
    }
    
    modal.style.display = 'block';
}

function closeSellerModal() {
    document.getElementById('sellerModal').style.display = 'none';
    currentEditingSeller = null;
}

// Form Handlers
function setupFormHandlers() {
    // Product form
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
    
    // Category form
    document.getElementById('categoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveCategory();
    });
    
    // Seller form
    document.getElementById('sellerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSeller();
    });
    
    // Settings forms
    document.getElementById('generalSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveGeneralSettings();
    });
    
    document.getElementById('paymentSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        savePaymentSettings();
    });
    
    document.getElementById('shippingSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveShippingSettings();
    });
    
    // Auto-generate slug for categories
    document.getElementById('categoryName').addEventListener('input', function() {
        const slug = this.value.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        document.getElementById('categorySlug').value = slug;
    });
}

// Save Functions
function saveProduct() {
    const formData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value
    };
    
    // Simulate API call
    showAlert(currentEditingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!', 'success');
    closeProductModal();
    loadProducts();
}

function saveCategory() {
    const formData = {
        name: document.getElementById('categoryName').value,
        slug: document.getElementById('categorySlug').value,
        description: document.getElementById('categoryDescription').value
    };
    
    // Simulate API call
    showAlert(currentEditingCategory ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!', 'success');
    closeCategoryModal();
    loadCategories();
    loadProductCategories();
}

function saveSeller() {
    const formData = {
        name: document.getElementById('sellerName').value,
        email: document.getElementById('sellerEmail').value,
        phone: document.getElementById('sellerPhone').value,
        commission: parseFloat(document.getElementById('sellerCommission').value)
    };
    
    // Simulate API call
    showAlert(currentEditingSeller ? 'Vendedor atualizado com sucesso!' : 'Vendedor criado com sucesso!', 'success');
    closeSellerModal();
    loadSellers();
}

function saveGeneralSettings() {
    showAlert('Configurações gerais salvas com sucesso!', 'success');
}

function savePaymentSettings() {
    showAlert('Configurações de pagamento salvas com sucesso!', 'success');
}

function saveShippingSettings() {
    showAlert('Configurações de entrega salvas com sucesso!', 'success');
}

// Action Functions
function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        showAlert('Produto excluído com sucesso!', 'success');
        loadProducts();
    }
}

function editCategory(categoryId) {
    openCategoryModal(categoryId);
}

function deleteCategory(categoryId) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        showAlert('Categoria excluída com sucesso!', 'success');
        loadCategories();
    }
}

function viewOrder(orderId) {
    showAlert(`Visualizando pedido ${orderId}`, 'success');
}

function editOrder(orderId) {
    showAlert(`Editando pedido ${orderId}`, 'success');
}

function updateOrderStatus(orderId) {
    const newStatus = prompt('Novo status (pending, processing, shipped, delivered, cancelled):');
    if (newStatus) {
        showAlert(`Status do pedido ${orderId} atualizado para ${newStatus}`, 'success');
        loadOrders();
    }
}

function viewCustomer(customerId) {
    showAlert(`Visualizando cliente ${customerId}`, 'success');
}

function editCustomer(customerId) {
    showAlert(`Editando cliente ${customerId}`, 'success');
}

function viewSeller(sellerId) {
    showAlert(`Visualizando vendedor ${sellerId}`, 'success');
}

function editSeller(sellerId) {
    openSellerModal(sellerId);
}

function deleteSeller(sellerId) {
    if (confirm('Tem certeza que deseja excluir este vendedor?')) {
        showAlert('Vendedor excluído com sucesso!', 'success');
        loadSellers();
    }
}

// Report Functions
function generateSalesReport() {
    showAlert('Gerando relatório de vendas...', 'success');
    // Simulate report generation
    setTimeout(() => {
        showAlert('Relatório de vendas gerado com sucesso!', 'success');
    }, 2000);
}

function generateProductsReport() {
    showAlert('Gerando relatório de produtos...', 'success');
    setTimeout(() => {
        showAlert('Relatório de produtos gerado com sucesso!', 'success');
    }, 2000);
}

function generateCustomersReport() {
    showAlert('Gerando relatório de clientes...', 'success');
    setTimeout(() => {
        showAlert('Relatório de clientes gerado com sucesso!', 'success');
    }, 2000);
}

function generateFinancialReport() {
    showAlert('Gerando relatório financeiro...', 'success');
    setTimeout(() => {
        showAlert('Relatório financeiro gerado com sucesso!', 'success');
    }, 2000);
}

// Filter Functions
function setupFilters() {
    // Product filters
    document.getElementById('productCategoryFilter').addEventListener('change', filterProducts);
    document.getElementById('productStatusFilter').addEventListener('change', filterProducts);
    document.getElementById('productSearch').addEventListener('input', filterProducts);
    
    // Order filters
    document.getElementById('orderStatusFilter').addEventListener('change', filterOrders);
    document.getElementById('orderDateFilter').addEventListener('change', filterOrders);
    document.getElementById('orderCustomerFilter').addEventListener('input', filterOrders);
    
    // Customer filters
    document.getElementById('customerStatusFilter').addEventListener('change', filterCustomers);
    document.getElementById('customerSearch').addEventListener('input', filterCustomers);
}

function filterProducts() {
    // Implement product filtering logic
    console.log('Filtering products...');
}

function filterOrders() {
    // Implement order filtering logic
    console.log('Filtering orders...');
}

function filterCustomers() {
    // Implement customer filtering logic
    console.log('Filtering customers...');
}

// Utility Functions
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendente',
        'processing': 'Processando',
        'shipped': 'Enviado',
        'delivered': 'Entregue',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function showAlert(message, type = 'success') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert at top of main content
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(alert, mainContent.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function loadProductForEdit(productId) {
    // Simulate loading product data
    const product = {
        name: 'Produto Exemplo',
        category: '1',
        price: 99.90,
        stock: 50,
        description: 'Descrição do produto',
        image: 'https://via.placeholder.com/300x300'
    };
    
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImage').value = product.image;
}

function loadCategoryForEdit(categoryId) {
    // Simulate loading category data
    const category = {
        name: 'Categoria Exemplo',
        slug: 'categoria-exemplo',
        description: 'Descrição da categoria'
    };
    
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categorySlug').value = category.slug;
    document.getElementById('categoryDescription').value = category.description;
}

function loadSellerForEdit(sellerId) {
    // Simulate loading seller data
    const seller = {
        name: 'Vendedor Exemplo',
        email: 'vendedor@exemplo.com',
        phone: '(11) 99999-9999',
        commission: 5.0
    };
    
    document.getElementById('sellerName').value = seller.name;
    document.getElementById('sellerEmail').value = seller.email;
    document.getElementById('sellerPhone').value = seller.phone;
    document.getElementById('sellerCommission').value = seller.commission;
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}