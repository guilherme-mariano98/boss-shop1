/**
 * BOSS SHOPP - Script de Integração Automática
 * Este script adiciona automaticamente todas as novas funcionalidades
 * Adicione este script em todas as páginas do site
 */

(function() {
    'use strict';
    
    // Configurações
    const config = {
        enableChat: true,
        enableNotifications: true,
        enableFooter: true,
        enableSearch: true,
        enableCompareButton: true
    };
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('🚀 Inicializando BOSS SHOPP...');
        
        // Adicionar funcionalidades
        if (config.enableNotifications) loadNotifications();
        if (config.enableChat) loadChatWidget();
        if (config.enableFooter) loadFooter();
        if (config.enableSearch) enhanceSearch();
        if (config.enableCompareButton) addCompareButton();
        
        // Adicionar botão "Voltar ao topo"
        addBackToTop();
        
        // Adicionar loading overlay
        addLoadingOverlay();
        
        console.log('✅ BOSS SHOPP inicializado com sucesso!');
    }
    
    // Carregar sistema de notificações
    function loadNotifications() {
        if (document.getElementById('notification-system-loaded')) return;
        
        const script = document.createElement('script');
        script.id = 'notification-system-loaded';
        script.src = 'notifications.js';
        script.onload = function() {
            console.log('✅ Sistema de notificações carregado');
            
            // Mostrar notificação de boas-vindas
            setTimeout(() => {
                if (typeof notificationSystem !== 'undefined') {
                    notificationSystem.show(
                        'Bem-vindo ao BOSS SHOPP! 🎉',
                        'Aproveite nossas ofertas especiais!',
                        'success',
                        4000
                    );
                }
            }, 1500);
        };
        document.head.appendChild(script);
    }
    
    // Carregar chat widget
    function loadChatWidget() {
        if (document.getElementById('chat-widget')) return;
        
        fetch('chat-widget.html')
            .then(response => response.text())
            .then(html => {
                const div = document.createElement('div');
                div.innerHTML = html;
                document.body.appendChild(div);
                console.log('✅ Chat widget carregado');
            })
            .catch(error => {
                console.warn('⚠️ Erro ao carregar chat widget:', error);
            });
    }
    
    // Carregar rodapé
    function loadFooter() {
        if (document.querySelector('.footer-enhanced')) return;
        
        fetch('footer-enhanced.html')
            .then(response => response.text())
            .then(html => {
                const div = document.createElement('div');
                div.innerHTML = html;
                document.body.appendChild(div);
                console.log('✅ Rodapé carregado');
            })
            .catch(error => {
                console.warn('⚠️ Erro ao carregar rodapé:', error);
            });
    }
    
    // Melhorar busca
    function enhanceSearch() {
        const searchInputs = document.querySelectorAll('.search-input');
        
        searchInputs.forEach(input => {
            // Adicionar sugestões de busca
            input.addEventListener('input', function() {
                const query = this.value.trim();
                if (query.length >= 3) {
                    showSearchSuggestions(this, query);
                }
            });
            
            // Buscar ao pressionar Enter
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const query = this.value.trim();
                    if (query) {
                        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                    }
                }
            });
        });
        
        // Adicionar funcionalidade aos botões de busca
        const searchButtons = document.querySelectorAll('.search-btn');
        searchButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.previousElementSibling;
                if (input && input.classList.contains('search-input')) {
                    const query = input.value.trim();
                    if (query) {
                        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                    }
                }
            });
        });
        
        console.log('✅ Busca aprimorada');
    }
    
    // Mostrar sugestões de busca
    function showSearchSuggestions(input, query) {
        // Remover sugestões antigas
        const oldSuggestions = document.querySelector('.search-suggestions');
        if (oldSuggestions) oldSuggestions.remove();
        
        // Sugestões mockadas (em produção, buscar da API)
        const suggestions = [
            'iPhone 15 Pro Max',
            'Notebook Dell',
            'Smart TV 65"',
            'Tênis Nike',
            'AirPods Pro'
        ].filter(s => s.toLowerCase().includes(query.toLowerCase()));
        
        if (suggestions.length === 0) return;
        
        // Criar elemento de sugestões
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'search-suggestions';
        suggestionsDiv.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            max-height: 300px;
            overflow-y: auto;
        `;
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.style.cssText = `
                padding: 12px 15px;
                cursor: pointer;
                transition: background 0.2s;
            `;
            item.addEventListener('mouseenter', function() {
                this.style.background = '#f8f9fa';
            });
            item.addEventListener('mouseleave', function() {
                this.style.background = 'white';
            });
            item.addEventListener('click', function() {
                window.location.href = `search.html?q=${encodeURIComponent(suggestion)}`;
            });
            suggestionsDiv.appendChild(item);
        });
        
        // Posicionar sugestões
        const container = input.parentElement;
        container.style.position = 'relative';
        container.appendChild(suggestionsDiv);
        
        // Remover ao clicar fora
        setTimeout(() => {
            document.addEventListener('click', function removeSuggestions(e) {
                if (!container.contains(e.target)) {
                    suggestionsDiv.remove();
                    document.removeEventListener('click', removeSuggestions);
                }
            });
        }, 100);
    }
    
    // Adicionar botão de comparação nos cards de produto
    function addCompareButton() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            if (card.querySelector('.compare-btn')) return;
            
            const compareBtn = document.createElement('button');
            compareBtn.className = 'compare-btn';
            compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i>';
            compareBtn.title = 'Comparar produto';
            compareBtn.style.cssText = `
                position: absolute;
                top: 50px;
                right: 10px;
                background: white;
                border: none;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: all 0.3s;
                z-index: 10;
            `;
            
            compareBtn.addEventListener('mouseenter', function() {
                this.style.background = '#ff6b35';
                this.style.color = 'white';
                this.style.transform = 'scale(1.1)';
            });
            
            compareBtn.addEventListener('mouseleave', function() {
                this.style.background = 'white';
                this.style.color = '#333';
                this.style.transform = 'scale(1)';
            });
            
            compareBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                // Adicionar à comparação (salvar no localStorage)
                const productName = card.querySelector('h3')?.textContent || 'Produto';
                let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
                
                if (compareList.length >= 4) {
                    alert('Você já tem 4 produtos para comparar. Remova um para adicionar outro.');
                    return;
                }
                
                if (!compareList.includes(productName)) {
                    compareList.push(productName);
                    localStorage.setItem('compareList', JSON.stringify(compareList));
                    
                    if (typeof notificationSystem !== 'undefined') {
                        notificationSystem.show(
                            'Produto adicionado!',
                            `${productName} foi adicionado à comparação`,
                            'success',
                            3000
                        );
                    }
                    
                    updateCompareCounter();
                }
            });
            
            const imageContainer = card.querySelector('.product-image');
            if (imageContainer) {
                imageContainer.style.position = 'relative';
                imageContainer.appendChild(compareBtn);
            }
        });
        
        // Adicionar contador de comparação no navbar
        updateCompareCounter();
        
        console.log('✅ Botões de comparação adicionados');
    }
    
    // Atualizar contador de comparação
    function updateCompareCounter() {
        const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
        let compareIcon = document.querySelector('.compare-icon');
        
        if (!compareIcon) {
            const navIcons = document.querySelector('.nav-icons');
            if (navIcons) {
                compareIcon = document.createElement('a');
                compareIcon.href = 'compare.html';
                compareIcon.className = 'nav-icon compare-icon';
                compareIcon.innerHTML = `
                    <i class="fas fa-balance-scale"></i>
                    <span>Comparar</span>
                    <span class="compare-count">0</span>
                `;
                
                // Inserir antes do carrinho
                const cartIcon = navIcons.querySelector('.cart-icon');
                if (cartIcon) {
                    navIcons.insertBefore(compareIcon, cartIcon);
                } else {
                    navIcons.appendChild(compareIcon);
                }
            }
        }
        
        const counter = document.querySelector('.compare-count');
        if (counter) {
            counter.textContent = compareList.length;
            counter.style.display = compareList.length > 0 ? 'flex' : 'none';
        }
    }
    
    // Adicionar botão "Voltar ao topo"
    function addBackToTop() {
        if (document.getElementById('back-to-top')) return;
        
        const btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff6b35, #ff8c42);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
            z-index: 9998;
        `;
        
        btn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        document.body.appendChild(btn);
        
        // Mostrar/ocultar baseado no scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
            }
        });
        
        console.log('✅ Botão "Voltar ao topo" adicionado');
    }
    
    // Adicionar overlay de loading
    function addLoadingOverlay() {
        if (document.getElementById('loading-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 99999;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 60px; height: 60px; border: 5px solid #f3f3f3; border-top: 5px solid #ff6b35; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p style="font-size: 18px; font-weight: 600; color: #333;">Carregando...</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Adicionar animação de spin
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Função global para mostrar/ocultar loading
        window.showLoading = function() {
            overlay.style.display = 'flex';
        };
        
        window.hideLoading = function() {
            overlay.style.display = 'none';
        };
        
        console.log('✅ Overlay de loading adicionado');
    }
    
})();
