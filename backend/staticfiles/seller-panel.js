// BOSS SHOPP - Seller Panel JavaScript

// Global variables
let currentSection = 'dashboard';
let salesChart = null;
let salesEvolutionChart = null;
let currentEditingProduct = null;

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize seller panel
document.addEventListener('DOMContentLoaded', function() {
    initializeSellerPanel();
});

function initializeSellerPanel() {
    // Check seller authentication
    checkSellerAuth();
    
    // Setup navigation
    setupNavigation();
    
    // Load initial data
    loadDashboardData();
    
    // Setup form handlers
    setupFormHandlers();
    
    // Setup filters
    setupFilters();
    
    // Load seller info
    loadSellerInfo();
    
    // Set default dates
    setDefaultDates();
}

// Authentication
function checkSellerAuth() {
    const authToken = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (!authToken || !user) {
        redirectToLogin();
        return;
    }
    
    try {
        const userData = JSON.parse(user);
        // For demo purposes, we'll allow any logged user to access seller panel
        // In production, you'd check for seller role/permissions
    } catch (e) {
        redirectToLogin();
    }
}

function redirectToLogin() {
    showAlert('Acesso negado. Faça login para acessar o painel do vendedor.', 'error');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function loadSellerInfo() {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
 