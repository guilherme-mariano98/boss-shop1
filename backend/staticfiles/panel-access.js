// Panel Access Management
// Gerencia o acesso aos painéis administrativo e de vendedor

// Tipos de usuário
const USER_TYPES = {
    CUSTOMER: 'customer',
    SELLER: 'seller', 
    ADMIN: 'admin'
};

// Função para determinar o tipo de usuário
function getUserType() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Verificar se é admin (baseado no email ou flag específica)
    if (user.email && (
        user.email.includes('admin@') || 
        user.is_admin === true ||
        user.role === 'admin' ||
        user.type === 'admin'
    )) {
        return USER_TYPES.ADMIN;
    }
    
    // Verificar se é vendedor (baseado no email ou flag específica)
    if (user.email && (
        user.email.includes('seller@') ||
        user.email.includes('vendedor@') ||
        user.is_seller === true ||
        user.role === 'seller' ||
        user.type === 'seller'
    )) {
        return USER_TYPES.SELLER;
    }
    
    // Por padrão é cliente
    return USER_TYPES.CUSTOMER;
}

// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
}

// Função para mostrar/esconder botões dos painéis - REMOVIDA
// Os botões dos painéis foram completamente removidos do sistema
function updatePanelAccess() {
    // Função mantida vazia para compatibilidade
    // Não há mais botões de painéis para controlar
}

// Funções de teste removidas conforme solicitado

// Função para verificar acesso ao painel
function checkPanelAccess(requiredType) {
    const isLoggedIn = isUserLoggedIn();
    const userType = getUserType();
    
    if (!isLoggedIn) {
        alert('Você precisa estar logado para acessar este painel.');
        window.location.href = 'login.html';
        return false;
    }
    
    if (requiredType === USER_TYPES.ADMIN && userType !== USER_TYPES.ADMIN) {
        alert('Acesso negado. Apenas administradores podem acessar este painel.');
        window.location.href = 'index.html';
        return false;
    }
    
    if (requiredType === USER_TYPES.SELLER && userType !== USER_TYPES.SELLER && userType !== USER_TYPES.ADMIN) {
        alert('Acesso negado. Apenas vendedores podem acessar este painel.');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Função removida - botões de teste não são mais necessários

// Função para mostrar notificação
function showNotification(message, type = 'success') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.panel-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'panel-notification';
    notification.style.cssText = `
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
    
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    // Esconder notificação após 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Função para atualizar ícone do usuário (compatibilidade com auth.js)
function updateUserIcon() {
    const userIcon = document.getElementById('userIcon');
    const userText = document.getElementById('userText');
    
    if (!userIcon || !userText) return;
    
    const authToken = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (authToken && user) {
        const userData = JSON.parse(user);
        const name = userData.name || userData.username || 'Perfil';
        const userType = getUserType();
        
        let icon = 'fa-user';
        if (userType === USER_TYPES.ADMIN) {
            icon = 'fa-user-shield';
        } else if (userType === USER_TYPES.SELLER) {
            icon = 'fa-store';
        }
        
        userIcon.href = 'profile.html';
        userIcon.innerHTML = `
            <i class="fas ${icon}"></i>
            <span id="userText">${name}</span>
        `;
    } else {
        userIcon.href = 'login.html';
        userIcon.innerHTML = `
            <i class="fas fa-user"></i>
            <span id="userText">Entrar</span>
        `;
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar acesso aos painéis
    updatePanelAccess();
    
    // Botões de teste removidos conforme solicitado
    
    // Escutar mudanças no localStorage (para quando o usuário fizer login/logout)
    window.addEventListener('storage', function(e) {
        if (e.key === 'authToken' || e.key === 'user') {
            updatePanelAccess();
        }
    });
    
    // Verificar periodicamente se o usuário ainda está logado
    setInterval(updatePanelAccess, 30000); // A cada 30 segundos
});

// Exportar funções para uso global
window.updatePanelAccess = updatePanelAccess;
window.checkPanelAccess = checkPanelAccess;
window.getUserType = getUserType;
window.USER_TYPES = USER_TYPES;