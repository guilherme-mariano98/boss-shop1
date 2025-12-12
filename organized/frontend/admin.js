// Admin Dashboard JavaScript

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
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
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
        background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
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

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Navigation event listeners
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
    
    // Product modal event listeners
    document.getElementById('addProductBtn').addEventListener('click', function() {
        openModal('productModal');
    });
    
    document.getElementById('closeProductModal').addEventListener('click', function() {
        closeModal('productModal');
    });
    
    document.getElementById('cancelProductBtn').addEventListener('click', function() {
        closeModal('productModal');
    });
    
    // Category modal event listeners
    document.getElementById('addCategoryBtn').addEventListener('click', function() {
        openModal('categoryModal');
    });
    
    document.getElementById('closeCategoryModal').addEventListener('click', function() {
        closeModal('categoryModal');
    });
    
    document.getElementById('cancelCategoryBtn').addEventListener('click', function() {
        closeModal('categoryModal');
    });
    
    // Admin modal event listeners
    document.getElementById('addAdminBtn').addEventListener('click', function() {
        openModal('adminModal');
    });
    
    document.getElementById('closeAdminModal').addEventListener('click', function() {
        closeModal('adminModal');
    });
    
    document.getElementById('cancelAdminBtn').addEventListener('click', function() {
        closeModal('adminModal');
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Product form submission
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real application, this would send data to the server
        showToast('Produto salvo com sucesso!', 'success');
        closeModal('productModal');
        this.reset();
    });
    
    // Category form submission
    document.getElementById('categoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real application, this would send data to the server
        showToast('Categoria salva com sucesso!', 'success');
        closeModal('categoryModal');
        this.reset();
    });
    
    // Admin form submission
    document.getElementById('adminForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real application, this would send data to the server
        showToast('Administrador salvo com sucesso!', 'success');
        closeModal('adminModal');
        this.reset();
    });
    
    // Edit button functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-btn')) {
            showToast('Funcionalidade de edição em desenvolvimento', 'success');
        }
        
        if (e.target.closest('.delete-btn')) {
            if (confirm('Tem certeza que deseja excluir este item?')) {
                showToast('Item excluído com sucesso!', 'success');
                // In a real application, this would send a delete request to the server
            }
        }
        
        if (e.target.closest('.view-btn')) {
            showToast('Funcionalidade de visualização em desenvolvimento', 'success');
        }
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                showToast(`Buscando por: "${this.value}"`, 'success');
                // In a real application, this would filter the data
            }
        });
    }
    
    // Logout functionality
    const logoutBtn = document.querySelector('.nav-icons .fa-sign-out-alt').closest('a');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Tem certeza que deseja sair?')) {
                // In a real application, this would clear session data
                showToast('Logout realizado com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }
});

// Settings functionality
    document.getElementById('saveStoreSettings').addEventListener('click', function() {
        showToast('Configurações salvas com sucesso!', 'success');
        // In a real application, this would send data to the server
    });
    
    document.getElementById('changePasswordBtn').addEventListener('click', function() {
        // Create a simple password change modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'passwordModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Alterar Senha</h3>
                    <span class="close" id="closePasswordModal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="passwordForm">
                        <div class="form-group">
                            <label for="currentPassword">Senha Atual</label>
                            <input type="password" id="currentPassword" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="newPassword">Nova Senha</label>
                            <input type="password" id="newPassword" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="confirmPassword">Confirmar Nova Senha</label>
                            <input type="password" id="confirmPassword" class="form-control" required>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" id="cancelPasswordBtn">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Alterar Senha</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show the modal
        modal.style.display = 'block';
        
        // Add event listeners
        document.getElementById('closePasswordModal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        document.getElementById('cancelPasswordBtn').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        document.getElementById('passwordForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                showToast('As senhas não coincidem!', 'error');
                return;
            }
            
            if (newPassword.length < 6) {
                showToast('A senha deve ter pelo menos 6 caracteres!', 'error');
                return;
            }
            
            showToast('Senha alterada com sucesso!', 'success');
            document.body.removeChild(modal);
            // In a real application, this would send data to the server
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    });

// Add CSS for toast notifications
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    .toast.success {
        background-color: #28a745;
    }
    
    .toast.error {
        background-color: #dc3545;
    }
`;
document.head.appendChild(toastStyle);