// Profile Page JavaScript

// API Base URL for Node.js backend
const API_BASE_URL = 'http://localhost:3000/api';

// Load user data on page load
async function loadUserData() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Show loading spinner
    showLoadingSpinner();
    
    try {
        // Fetch user data from Node.js backend
        const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            
            // Update profile header
            document.getElementById('profileName').textContent = `${userData.name}` || 'Usuário';
            document.getElementById('profileEmail').textContent = userData.email || '';
            
            // Fill form fields
            if (userData.name) document.getElementById('firstName').value = userData.name;
            if (userData.email) document.getElementById('email').value = userData.email;
            if (userData.phone) document.getElementById('phone').value = userData.phone;
            
            // Save user data to localStorage for offline access
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Hide loading spinner
            hideLoadingSpinner();
            
            return userData;
        } else {
            // Hide loading spinner
            hideLoadingSpinner();
            
            // Token might be invalid, redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        // Hide loading spinner
        hideLoadingSpinner();
        
        // Use cached data if available
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
            const userData = JSON.parse(cachedUser);
            document.getElementById('profileName').textContent = `${userData.name}` || 'Usuário';
            document.getElementById('profileEmail').textContent = userData.email || '';
            if (userData.name) document.getElementById('firstName').value = userData.name;
            if (userData.email) document.getElementById('email').value = userData.email;
            return userData;
        }
    }
}

// Load addresses
async function loadAddresses() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;
    
    try {
        // In a real application, this would fetch from the backend
        // For now, we'll use sample data
        const addresses = [
            {
                id: 1,
                name: 'Casa',
                street: 'Rua das Flores, 123',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01234-567',
                country: 'Brasil',
                isDefault: true
            },
            {
                id: 2,
                name: 'Trabalho',
                street: 'Av. Paulista, 1000',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01310-100',
                country: 'Brasil',
                isDefault: false
            }
        ];
        
        displayAddresses(addresses);
    } catch (error) {
        console.error('Error loading addresses:', error);
        // Display empty state
        displayAddresses([]);
    }
}

// Display addresses
function displayAddresses(addresses) {
    const addressesList = document.querySelector('#addresses .addresses-list');
    
    if (addresses.length === 0) {
        addressesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt"></i>
                <h3>Nenhum endereço cadastrado</h3>
                <p>Adicione um endereço para facilitar suas compras.</p>
                <button class="add-address-btn" onclick="showAddAddressForm()">
                    <i class="fas fa-plus"></i>
                    Adicionar Endereço
                </button>
            </div>
        `;
        return;
    }
    
    addressesList.innerHTML = `
        <div class="addresses-grid">
            ${addresses.map(address => `
                <div class="address-card ${address.isDefault ? 'default' : ''}">
                    <div class="address-header">
                        <h4>${address.name}</h4>
                        ${address.isDefault ? '<span class="default-badge">Padrão</span>' : ''}
                    </div>
                    <div class="address-details">
                        <p>${address.street}</p>
                        <p>${address.city} - ${address.state}</p>
                        <p>CEP: ${address.zipCode}</p>
                        <p>${address.country}</p>
                    </div>
                    <div class="address-actions">
                        <button class="edit-btn" onclick="editAddress(${address.id})">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                        <button class="delete-btn" onclick="deleteAddress(${address.id})">
                            <i class="fas fa-trash"></i>
                            Excluir
                        </button>
                    </div>
                </div>
            `).join('')}
            <div class="address-card add-new">
                <button class="add-address-btn" onclick="showAddAddressForm()">
                    <i class="fas fa-plus"></i>
                    <span>Adicionar Novo Endereço</span>
                </button>
            </div>
        </div>
    `;
}

// Load orders
async function loadOrders() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;
    
    try {
        // In a real application, this would fetch from the backend
        // For now, we'll use sample data
        const orders = [
            {
                id: 'PED-2023-001',
                date: '15/10/2023',
                status: 'Entregue',
                total: 249.90,
                items: [
                    { name: 'Camiseta Básica', quantity: 2, price: 39.90 },
                    { name: 'Calça Jeans', quantity: 1, price: 89.90 },
                    { name: 'Tênis Esportivo', quantity: 1, price: 169.90 }
                ]
            },
            {
                id: 'PED-2023-002',
                date: '05/09/2023',
                status: 'Entregue',
                total: 89.90,
                items: [
                    { name: 'Boné Estiloso', quantity: 1, price: 34.90 },
                    { name: 'Óculos de Sol', quantity: 1, price: 54.90 }
                ]
            },
            {
                id: 'PED-2023-003',
                date: '22/08/2023',
                status: 'Em trânsito',
                total: 129.90,
                items: [
                    { name: 'Mochila Moderna', quantity: 1, price: 79.90 },
                    { name: 'Relógio Elegante', quantity: 1, price: 49.90 }
                ]
            }
        ];
        
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        // Display empty state
        displayOrders([]);
    }
}

// Display orders
function displayOrders(orders) {
    const ordersList = document.querySelector('#orders .orders-list');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>Nenhum pedido encontrado</h3>
                <p>Você ainda não fez nenhum pedido. Que tal começar suas compras?</p>
                <a href="index.html" class="cta-button">Ir às Compras</a>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = `
        <div class="orders-grid">
            ${orders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-info">
                            <h4>Pedido #${order.id}</h4>
                            <p class="order-date">${order.date}</p>
                        </div>
                        <div class="order-status ${order.status.toLowerCase().replace(' ', '-')}">
                            ${order.status}
                        </div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span class="item-name">${item.name}</span>
                                <span class="item-quantity">${item.quantity}x</span>
                                <span class="item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-total">
                        <strong>Total: R$ ${order.total.toFixed(2).replace('.', ',')}</strong>
                    </div>
                    <div class="order-actions">
                        <button class="details-btn" onclick="viewOrderDetails('${order.id}')">
                            <i class="fas fa-eye"></i>
                            Ver Detalhes
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Save profile data to Node.js backend
async function saveProfile(formData) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        showToast('Você precisa estar logado para salvar o perfil', 'error');
        return;
    }
    
    // Show loading spinner
    showLoadingSpinner();
    
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                name: formData.get('firstName'),
                phone: formData.get('phone')
            })
        });
        
        // Hide loading spinner
        hideLoadingSpinner();
        
        if (response.ok) {
            const userData = await response.json();
            
            // Update display
            document.getElementById('profileName').textContent = userData.name;
            
            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Show success message
            showToast('Perfil atualizado com sucesso!', 'success');
        } else {
            const errorData = await response.json();
            showToast(errorData.detail || 'Erro ao atualizar o perfil', 'error');
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        // Hide loading spinner
        hideLoadingSpinner();
        showToast('Erro de conexão. Tente novamente.', 'error');
    }
}

// Navigation between sections
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
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
}

// Phone formatting (Brazilian format)
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        if (value.length < 14) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
    }
    
    input.value = value;
}

// Show loading spinner
function showLoadingSpinner() {
    // Remove existing spinner
    const existingSpinner = document.querySelector('.loading-spinner');
    if (existingSpinner) {
        existingSpinner.remove();
    }
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #000000;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 10000;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(spinner);
}

// Hide loading spinner
function hideLoadingSpinner() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#00aa00' : '#ff4444'};
        color: #ffffff;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);
    
    // Hide toast after 4 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Logout function
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        showToast('Logout realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Load favorites from localStorage
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoritesList = document.querySelector('#favorites .favorites-list');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>Nenhum favorito adicionado</h3>
                <p>Salve produtos que você gosta para encontrá-los facilmente depois.</p>
                <a href="index.html" class="cta-button">Explorar Produtos</a>
            </div>
        `;
    } else {
        favoritesList.innerHTML = `
            <div class="favorites-grid">
                ${favorites.map(favorite => `
                    <div class="favorite-item">
                        <h4>${favorite}</h4>
                        <button onclick="removeFavorite('${favorite}')" class="remove-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Remove favorite
function removeFavorite(productName) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(fav => fav !== productName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
    showToast(`${productName} removido dos favoritos`, 'success');
}

// Initialize profile page
// Initialization moved to initializeProfile function

// Show add address form
function showAddAddressForm() {
    showToast('Funcionalidade de adicionar endereço em desenvolvimento', 'success');
}

// Edit address
function editAddress(addressId) {
    showToast(`Editar endereço #${addressId}`, 'success');
}

// Delete address
function deleteAddress(addressId) {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
        showToast(`Endereço #${addressId} excluído`, 'success');
    }
}

// View order details
function viewOrderDetails(orderId) {
    showToast(`Detalhes do pedido #${orderId}`, 'success');
}

// Add mobile menu toggle button
function addMobileMenuToggle() {
    // Only add on mobile devices
    if (window.innerWidth <= 480) {
        // Check if toggle already exists
        if (document.querySelector('.mobile-menu-toggle')) return;
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'mobile-menu-toggle';
        toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Insert as first child of body
        document.body.insertBefore(toggleButton, document.body.firstChild);
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', toggleMobileMenu);
        document.body.appendChild(overlay);
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const sidebar = document.querySelector('.profile-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Add CSS for favorites grid and new components
const style = document.createElement('style');
style.textContent = `
    .favorites-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .favorite-item {
        background-color: #f8f8f8;
        padding: 20px;
        border-radius: 8px;
        border: 2px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: border-color 0.3s;
    }
    
    .favorite-item:hover {
        border-color: #000000;
    }
    
    .favorite-item h4 {
        margin: 0;
        color: #000000;
        font-size: 16px;
    }
    
    .remove-btn {
        background-color: #ff4444;
        color: #ffffff;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s;
    }
    
    .remove-btn:hover {
        background-color: #ff2222;
    }
    
    /* Addresses Grid */
    .addresses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .address-card {
        background-color: #f8f8f8;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        transition: all 0.3s;
    }
    
    .address-card:hover {
        border-color: #000000;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .address-card.default {
        border-color: #000000;
        background-color: #f0f0f0;
    }
    
    .address-card.add-new {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ffffff;
        border-style: dashed;
        cursor: pointer;
    }
    
    .address-card.add-new:hover {
        background-color: #f8f8f8;
    }
    
    .address-card.add-new button {
        background: none;
        border: none;
        color: #666666;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .address-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .address-header h4 {
        margin: 0;
        color: #000000;
        font-size: 18px;
    }
    
    .default-badge {
        background-color: #000000;
        color: #ffffff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .address-details p {
        margin: 5px 0;
        color: #666666;
    }
    
    .address-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }
    
    .edit-btn, .delete-btn {
        flex: 1;
        padding: 8px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 14px;
    }
    
    .edit-btn {
        background-color: #000000;
        color: #ffffff;
    }
    
    .delete-btn {
        background-color: #ff4444;
        color: #ffffff;
    }
    
    /* Orders Grid */
    .orders-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .order-card {
        background-color: #f8f8f8;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        transition: all 0.3s;
    }
    
    .order-card:hover {
        border-color: #000000;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .order-info h4 {
        margin: 0;
        color: #000000;
        font-size: 18px;
    }
    
    .order-date {
        color: #666666;
        font-size: 14px;
    }
    
    .order-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .order-status.entregue {
        background-color: #00aa00;
        color: #ffffff;
    }
    
    .order-status.em-transito {
        background-color: #ffaa00;
        color: #ffffff;
    }
    
    .order-status.processando {
        background-color: #0066cc;
        color: #ffffff;
    }
    
    .order-items {
        margin: 15px 0;
    }
    
    .order-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .order-item:last-child {
        border-bottom: none;
    }
    
    .item-name {
        flex: 2;
    }
    
    .item-quantity {
        flex: 1;
        text-align: center;
    }
    
    .item-price {
        flex: 1;
        text-align: right;
        font-weight: bold;
    }
    
    .order-total {
        text-align: right;
        padding-top: 10px;
        border-top: 1px solid #e0e0e0;
    }
    
    .order-actions {
        margin-top: 15px;
        text-align: center;
    }
    
    .details-btn {
        background-color: #000000;
        color: #ffffff;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        transition: background-color 0.3s;
    }
    
    .details-btn:hover {
        background-color: #333333;
    }
`;
document.head.appendChild(style);

// Initialize profile page
function initializeProfile() {
    // Add mobile menu toggle for small screens
    addMobileMenuToggle();
    
    // Add event listener for mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    // Load user data
    loadUserData().then(() => {
        // Load addresses and orders after user data is loaded
        loadAddresses();
        loadOrders();
    });
    
    // Load favorites
    loadFavorites();
    
    // Navigation event listeners
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Load data when switching to addresses or orders section
            if (sectionId === 'addresses') {
                loadAddresses();
            } else if (sectionId === 'orders') {
                loadOrders();
            }
        });
    });
    
    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            saveProfile(formData);
        });
    }
    
    // Phone formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => formatPhone(e.target));
    }
    
    // Notification settings
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.id;
            const enabled = this.checked;
            
            // Save setting to localStorage
            const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
            settings[setting] = enabled;
            localStorage.setItem('notificationSettings', JSON.stringify(settings));
            
            showToast(`Configuração ${enabled ? 'ativada' : 'desativada'}`, 'success');
        });
    });
    
    // Load notification settings
    const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
    Object.keys(settings).forEach(setting => {
        const toggle = document.getElementById(setting);
        if (toggle) {
            toggle.checked = settings[setting];
        }
    });
    
    // Add address button
    const addAddressBtn = document.querySelector('.add-address-btn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            showToast('Funcionalidade de adicionar endereço em desenvolvimento', 'success');
        });
    }
    
    // Add payment button
    const addPaymentBtn = document.querySelector('.add-payment-btn');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', function() {
            showToast('Funcionalidade de adicionar cartão em desenvolvimento', 'success');
        });
    }
}