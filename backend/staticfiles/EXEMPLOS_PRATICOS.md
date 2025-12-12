# 💡 Exemplos Práticos - BOSS SHOPP

## 📋 Índice
1. [Sistema de Notificações](#sistema-de-notificações)
2. [Chat de Atendimento](#chat-de-atendimento)
3. [Busca de Produtos](#busca-de-produtos)
4. [Comparação de Produtos](#comparação-de-produtos)
5. [Página de Detalhes](#página-de-detalhes)
6. [Carrinho de Compras](#carrinho-de-compras)
7. [Favoritos](#favoritos)
8. [Loading e Feedback](#loading-e-feedback)

---

## 🔔 Sistema de Notificações

### Exemplo 1: Notificação de Sucesso
```javascript
// Quando um produto é adicionado ao carrinho
notificationSystem.show(
    'Produto Adicionado! 🛒',
    'iPhone 15 Pro Max foi adicionado ao seu carrinho',
    'success',
    4000
);
```

### Exemplo 2: Notificação de Erro
```javascript
// Quando ocorre um erro
notificationSystem.show(
    'Erro ao Processar ❌',
    'Não foi possível adicionar o produto. Tente novamente.',
    'error',
    5000
);
```

### Exemplo 3: Notificação de Aviso
```javascript
// Quando o estoque está baixo
notificationSystem.show(
    'Atenção! ⚠️',
    'Restam apenas 3 unidades deste produto',
    'warning',
    4000
);
```

### Exemplo 4: Notificação de Informação
```javascript
// Informação geral
notificationSystem.show(
    'Frete Grátis! 🚚',
    'Adicione mais R$ 50,00 para ganhar frete grátis',
    'info',
    6000
);
```

### Exemplo 5: Notificação Persistente
```javascript
// Notificação que não desaparece automaticamente
notificationSystem.show(
    'Promoção Especial! 🎉',
    'Use o cupom BOSS10 para 10% de desconto',
    'success',
    0  // 0 = não desaparece automaticamente
);
```

---

## 💬 Chat de Atendimento

### Exemplo 1: Abrir Chat Automaticamente
```javascript
// Abrir chat quando o usuário entra na página
setTimeout(() => {
    toggleChat();
}, 3000);  // Abre após 3 segundos
```

### Exemplo 2: Enviar Mensagem Programática
```javascript
// Enviar mensagem automática
function sendAutoMessage(message) {
    addMessage(message, 'bot');
}

// Exemplo de uso
sendAutoMessage('Olá! Posso ajudar com algo?');
```

### Exemplo 3: Chat com Contexto
```javascript
// Abrir chat com contexto do produto
function openChatWithProduct(productName) {
    toggleChat();
    setTimeout(() => {
        addMessage(`Olá! Vi que você está interessado em ${productName}. Como posso ajudar?`, 'bot');
    }, 500);
}

// Uso
openChatWithProduct('iPhone 15 Pro Max');
```

---

## 🔍 Busca de Produtos

### Exemplo 1: Busca Simples
```html
<!-- HTML -->
<input type="text" id="search" placeholder="Buscar...">
<button onclick="search()">Buscar</button>

<script>
function search() {
    const query = document.getElementById('search').value;
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}
</script>
```

### Exemplo 2: Busca com Enter
```javascript
document.getElementById('search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }
});
```

### Exemplo 3: Busca com Filtros
```javascript
// Buscar com filtros pré-definidos
function searchWithFilters(query, category, minPrice, maxPrice) {
    const params = new URLSearchParams({
        q: query,
        category: category,
        min: minPrice,
        max: maxPrice
    });
    window.location.href = `search.html?${params.toString()}`;
}

// Uso
searchWithFilters('notebook', 'eletronicos', 2000, 5000);
```

### Exemplo 4: Busca por Categoria
```javascript
// Buscar apenas em uma categoria
function searchInCategory(category) {
    window.location.href = `search.html?category=${category}`;
}

// Uso
searchInCategory('moda');
```

---

## ⚖️ Comparação de Produtos

### Exemplo 1: Adicionar à Comparação
```javascript
function addToCompare(productId, productName) {
    let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    
    if (compareList.length >= 4) {
        notificationSystem.show(
            'Limite Atingido',
            'Você já tem 4 produtos para comparar',
            'warning'
        );
        return;
    }
    
    if (!compareList.includes(productId)) {
        compareList.push(productId);
        localStorage.setItem('compareList', JSON.stringify(compareList));
        
        notificationSystem.show(
            'Adicionado à Comparação',
            `${productName} foi adicionado`,
            'success'
        );
    }
}
```

### Exemplo 2: Remover da Comparação
```javascript
function removeFromCompare(productId) {
    let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    compareList = compareList.filter(id => id !== productId);
    localStorage.setItem('compareList', JSON.stringify(compareList));
    
    notificationSystem.show(
        'Removido',
        'Produto removido da comparação',
        'info'
    );
}
```

### Exemplo 3: Ir para Comparação
```javascript
function goToCompare() {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    
    if (compareList.length < 2) {
        notificationSystem.show(
            'Adicione Mais Produtos',
            'Você precisa de pelo menos 2 produtos para comparar',
            'warning'
        );
        return;
    }
    
    window.location.href = 'compare.html';
}
```

---

## 📦 Página de Detalhes

### Exemplo 1: Abrir Página de Produto
```javascript
// Abrir página de detalhes
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Uso em um card de produto
<div class="product-card" onclick="viewProduct(1)">
    <!-- Conteúdo do card -->
</div>
```

### Exemplo 2: Compartilhar Produto
```javascript
// Compartilhar no WhatsApp
function shareOnWhatsApp(productName, productUrl) {
    const text = `Olha que produto legal: ${productName}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text + ' - ' + productUrl)}`;
    window.open(url, '_blank');
}

// Compartilhar no Facebook
function shareOnFacebook(productUrl) {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(url, '_blank');
}
```

### Exemplo 3: Adicionar aos Favoritos
```javascript
function toggleFavorite(productId, productName) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
        notificationSystem.show(
            'Removido dos Favoritos',
            `${productName} foi removido`,
            'info'
        );
    } else {
        favorites.push(productId);
        notificationSystem.show(
            'Adicionado aos Favoritos ❤️',
            `${productName} foi adicionado`,
            'success'
        );
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
```

---

## 🛒 Carrinho de Compras

### Exemplo 1: Adicionar ao Carrinho
```javascript
function addToCart(productId, productName, price, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Verificar se já existe
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Atualizar contador
    updateCartCount();
    
    // Notificar
    notificationSystem.show(
        'Adicionado ao Carrinho! 🛒',
        `${quantity}x ${productName}`,
        'success'
    );
}
```

### Exemplo 2: Atualizar Contador do Carrinho
```javascript
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Chamar ao carregar a página
updateCartCount();
```

### Exemplo 3: Calcular Total do Carrinho
```javascript
function calculateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return total.toFixed(2);
}

// Exibir total
document.getElementById('cart-total').textContent = `R$ ${calculateCartTotal()}`;
```

### Exemplo 4: Remover do Carrinho
```javascript
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    
    notificationSystem.show(
        'Removido do Carrinho',
        'Produto removido com sucesso',
        'info'
    );
}
```

---

## ❤️ Favoritos

### Exemplo 1: Verificar se é Favorito
```javascript
function isFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(productId);
}

// Atualizar ícone
function updateFavoriteIcon(productId) {
    const icon = document.querySelector(`[data-product-id="${productId}"] .favorite-icon`);
    if (icon) {
        if (isFavorite(productId)) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#ff6b35';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '#666';
        }
    }
}
```

### Exemplo 2: Contar Favoritos
```javascript
function getFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.length;
}

// Atualizar contador
document.querySelector('.favorites-count').textContent = getFavoritesCount();
```

---

## ⏳ Loading e Feedback

### Exemplo 1: Mostrar Loading Durante Operação
```javascript
async function buyProduct(productId) {
    showLoading();
    
    try {
        // Simular operação assíncrona
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Sucesso
        hideLoading();
        notificationSystem.show(
            'Compra Realizada! 🎉',
            'Seu pedido foi confirmado',
            'success'
        );
        
        window.location.href = 'order-confirmation.html';
    } catch (error) {
        hideLoading();
        notificationSystem.show(
            'Erro na Compra',
            'Ocorreu um erro. Tente novamente.',
            'error'
        );
    }
}
```

### Exemplo 2: Loading com Progresso
```javascript
function processOrder() {
    showLoading();
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        
        if (progress >= 100) {
            clearInterval(interval);
            hideLoading();
            notificationSystem.show(
                'Pedido Processado!',
                'Seu pedido foi confirmado',
                'success'
            );
        }
    }, 500);
}
```

### Exemplo 3: Feedback Visual em Botões
```javascript
function addToCartWithFeedback(button, productId, productName, price) {
    // Desabilitar botão
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adicionando...';
    
    // Simular operação
    setTimeout(() => {
        addToCart(productId, productName, price);
        
        // Feedback de sucesso
        button.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        button.style.background = '#4caf50';
        
        // Restaurar botão
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho';
            button.style.background = '';
        }, 2000);
    }, 1000);
}
```

---

## 🎯 Exemplo Completo: Card de Produto

```html
<div class="product-card" data-product-id="1">
    <div class="product-image">
        <img src="product.jpg" alt="iPhone 15 Pro Max">
        
        <!-- Botão de Favorito -->
        <button class="wishlist-btn" onclick="toggleFavorite(1, 'iPhone 15 Pro Max')">
            <i class="far fa-heart favorite-icon"></i>
        </button>
        
        <!-- Botão de Comparação -->
        <button class="compare-btn" onclick="addToCompare(1, 'iPhone 15 Pro Max')">
            <i class="fas fa-balance-scale"></i>
        </button>
    </div>
    
    <div class="product-info">
        <h3>iPhone 15 Pro Max</h3>
        <div class="product-rating">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <span>(1.234)</span>
        </div>
        <div class="product-price">
            <span class="old-price">R$ 8.999,00</span>
            <span class="new-price">R$ 5.849,00</span>
        </div>
        
        <!-- Botões de Ação -->
        <div class="product-actions">
            <button class="btn-view" onclick="viewProduct(1)">
                <i class="fas fa-eye"></i> Ver Detalhes
            </button>
            <button class="btn-cart" onclick="addToCart(1, 'iPhone 15 Pro Max', 5849)">
                <i class="fas fa-shopping-cart"></i> Adicionar
            </button>
        </div>
    </div>
</div>

<script>
// Inicializar ícone de favorito ao carregar
document.addEventListener('DOMContentLoaded', function() {
    updateFavoriteIcon(1);
});
</script>
```

---

## 🚀 Dicas de Performance

### 1. Debounce para Busca
```javascript
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Uso
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce(function() {
    performSearch(this.value);
}, 500));
```

### 2. Lazy Loading de Imagens
```javascript
// Adicionar ao HTML
<img data-src="product.jpg" class="lazy" alt="Produto">

// JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});
```

---

## 📱 Exemplos Mobile

### 1. Detectar Dispositivo Móvel
```javascript
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    // Ajustar comportamento para mobile
    console.log('Usuário está em um dispositivo móvel');
}
```

### 2. Menu Mobile
```javascript
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    menu.classList.toggle('active');
}
```

---

## 🎉 Pronto para Usar!

Todos esses exemplos estão prontos para serem copiados e colados no seu projeto. Adapte conforme necessário! 🚀
