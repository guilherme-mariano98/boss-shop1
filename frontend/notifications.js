// Global Notification System

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        // Create notification container
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        // Create notification center button
        if (!document.querySelector('.notification-center-btn')) {
            this.createNotificationCenter();
        }

        // Load saved notifications
        this.loadNotifications();

        // Add styles
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            }

            .notification {
                background: white;
                border-radius: 12px;
                padding: 16px 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: flex-start;
                gap: 12px;
                animation: slideInRight 0.3s ease;
                border-left: 4px solid #ff6b35;
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .notification.success {
                border-left-color: #4caf50;
            }

            .notification.error {
                border-left-color: #f44336;
            }

            .notification.warning {
                border-left-color: #ff9800;
            }

            .notification.info {
                border-left-color: #2196f3;
            }

            .notification-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                flex-shrink: 0;
            }

            .notification.success .notification-icon {
                background: #e8f5e9;
                color: #4caf50;
            }

            .notification.error .notification-icon {
                background: #ffebee;
                color: #f44336;
            }

            .notification.warning .notification-icon {
                background: #fff3e0;
                color: #ff9800;
            }

            .notification.info .notification-icon {
                background: #e3f2fd;
                color: #2196f3;
            }

            .notification-content {
                flex: 1;
            }

            .notification-title {
                font-weight: 700;
                font-size: 14px;
                margin-bottom: 4px;
                color: #333;
            }

            .notification-message {
                font-size: 13px;
                color: #666;
                line-height: 1.4;
            }

            .notification-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 18px;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s;
            }

            .notification-close:hover {
                background: #f5f5f5;
                color: #333;
            }

            .notification-center-btn {
                position: relative;
                background: none;
                border: none;
                color: #333;
                cursor: pointer;
                font-size: 20px;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.3s;
            }

            .notification-center-btn:hover {
                background: #f5f5f5;
            }

            .notification-center-badge {
                position: absolute;
                top: 0;
                right: 0;
                background: #ff4444;
                color: white;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                font-size: 11px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .notification-center-panel {
                position: fixed;
                top: 70px;
                right: 20px;
                width: 400px;
                max-height: 600px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                z-index: 10001;
            }

            .notification-center-panel.active {
                display: flex;
                animation: slideDown 0.3s ease;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .notification-center-header {
                padding: 20px;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .notification-center-header h3 {
                font-size: 18px;
                font-weight: 800;
                margin: 0;
            }

            .notification-center-actions {
                display: flex;
                gap: 10px;
            }

            .notification-center-actions button {
                background: none;
                border: none;
                color: #ff6b35;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
            }

            .notification-center-list {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
            }

            .notification-item {
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: all 0.3s;
                border: 1px solid #e0e0e0;
            }

            .notification-item:hover {
                background: #f8f9fa;
            }

            .notification-item.unread {
                background: #fff5f2;
                border-color: #ff6b35;
            }

            .notification-item-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }

            .notification-item-title {
                font-weight: 700;
                font-size: 14px;
            }

            .notification-item-time {
                font-size: 12px;
                color: #999;
            }

            .notification-item-message {
                font-size: 13px;
                color: #666;
            }

            .notification-empty {
                text-align: center;
                padding: 40px 20px;
                color: #999;
            }

            .notification-empty i {
                font-size: 48px;
                margin-bottom: 15px;
                opacity: 0.5;
            }

            @media (max-width: 480px) {
                .notification-container,
                .notification-center-panel {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createNotificationCenter() {
        // Add button to navbar
        const navIcons = document.querySelector('.nav-icons');
        if (!navIcons) return;

        const notificationBtn = document.createElement('button');
        notificationBtn.className = 'notification-center-btn';
        notificationBtn.innerHTML = `
            <i class="fas fa-bell"></i>
            <span class="notification-center-badge" style="display: none;">0</span>
        `;
        notificationBtn.onclick = () => this.toggleNotificationCenter();

        // Insert before cart icon
        const cartIcon = navIcons.querySelector('.cart-icon');
        if (cartIcon) {
            navIcons.insertBefore(notificationBtn, cartIcon);
        } else {
            navIcons.appendChild(notificationBtn);
        }

        // Create notification center panel
        const panel = document.createElement('div');
        panel.id = 'notification-center-panel';
        panel.className = 'notification-center-panel';
        panel.innerHTML = `
            <div class="notification-center-header">
                <h3>Notificações</h3>
                <div class="notification-center-actions">
                    <button onclick="notificationSystem.markAllAsRead()">Marcar todas como lidas</button>
                    <button onclick="notificationSystem.clearAll()">Limpar</button>
                </div>
            </div>
            <div class="notification-center-list" id="notification-center-list">
                <div class="notification-empty">
                    <i class="fas fa-bell-slash"></i>
                    <p>Nenhuma notificação</p>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    show(title, message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icons[type]}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(notification);

        // Save to notification center
        this.addToCenter(title, message, type);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    }

    addToCenter(title, message, type) {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            time: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        this.updateNotificationCenter();
        this.updateBadge();
    }

    loadNotifications() {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            this.notifications = JSON.parse(saved);
            this.updateNotificationCenter();
            this.updateBadge();
        }
    }

    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    updateNotificationCenter() {
        const list = document.getElementById('notification-center-list');
        if (!list) return;

        if (this.notifications.length === 0) {
            list.innerHTML = `
                <div class="notification-empty">
                    <i class="fas fa-bell-slash"></i>
                    <p>Nenhuma notificação</p>
                </div>
            `;
            return;
        }

        list.innerHTML = this.notifications.map(notif => `
            <div class="notification-item ${notif.read ? '' : 'unread'}" onclick="notificationSystem.markAsRead(${notif.id})">
                <div class="notification-item-header">
                    <span class="notification-item-title">${notif.title}</span>
                    <span class="notification-item-time">${this.getTimeAgo(notif.time)}</span>
                </div>
                <div class="notification-item-message">${notif.message}</div>
            </div>
        `).join('');
    }

    updateBadge() {
        const badge = document.querySelector('.notification-center-badge');
        if (!badge) return;

        const unreadCount = this.notifications.filter(n => !n.read).length;
        
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    toggleNotificationCenter() {
        const panel = document.getElementById('notification-center-panel');
        if (panel) {
            panel.classList.toggle('active');
        }
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationCenter();
            this.updateBadge();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateNotificationCenter();
        this.updateBadge();
    }

    clearAll() {
        if (confirm('Deseja limpar todas as notificações?')) {
            this.notifications = [];
            this.saveNotifications();
            this.updateNotificationCenter();
            this.updateBadge();
        }
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = Math.floor((now - time) / 1000);

        if (diff < 60) return 'Agora';
        if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d atrás`;
        return time.toLocaleDateString('pt-BR');
    }
}

// Initialize notification system
const notificationSystem = new NotificationSystem();

// Example notifications on page load (for demo)
setTimeout(() => {
    notificationSystem.show(
        'Bem-vindo!',
        'Aproveite nossas ofertas especiais de hoje!',
        'success'
    );
}, 2000);

// Close notification center when clicking outside
document.addEventListener('click', function(e) {
    const panel = document.getElementById('notification-center-panel');
    const btn = document.querySelector('.notification-center-btn');
    
    if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('active');
    }
});
