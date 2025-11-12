// Carrinho de compras
let cart = [];

// Carregar carrinho do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
});

// Função para adicionar produto ao carrinho
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    // Salvar carrinho no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    showNotification(`${productName} adicionado ao carrinho!`);
}

// Atualizar contador do carrinho
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Mostrar notificação
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #000000;
        color: #ffffff;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Abrir modal do carrinho
function openCartModal() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Carregar carrinho do localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // Limpar itens anteriores
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Seu carrinho está vazio</p>';
        cartTotal.textContent = '0,00';
    } else {
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            `;
            
            const subtotal = item.price * item.quantity;
            total += subtotal;
            
            itemElement.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <span style="color: #666;">R$ ${item.price.toFixed(2).replace('.', ',')} x ${item.quantity}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: bold;">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                    <button onclick="removeFromCart(${index})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cartItems.appendChild(itemElement);
        });
        
        cartTotal.textContent = total.toFixed(2).replace('.', ',');
    }
    
    modal.style.display = 'block';
}

// Remover item do carrinho
function removeFromCart(index) {
    // Carregar carrinho do localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    cart.splice(index, 1);
    
    // Salvar carrinho atualizado no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    openCartModal(); // Reabrir modal atualizado
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'none';
}

// Timer do Flash Sale
function startFlashSaleTimer() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    let totalSeconds = 12 * 3600 + 34 * 60 + 56; // 12:34:56
    
    const timer = setInterval(() => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        totalSeconds--;
        
        if (totalSeconds < 0) {
            clearInterval(timer);
            // Reiniciar timer
            totalSeconds = 24 * 3600; // 24 horas
        }
    }, 1000);
}

// Busca de produtos
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            showNotification(`Buscando por: "${query}"`);
            // Aqui você implementaria a lógica de busca real
            console.log('Busca realizada:', query);
        }
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Smooth scroll para links internos
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animação de entrada dos produtos
function animateProducts() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Funcionalidade dos favoritos
function setupFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Adicionar botões de favorito aos produtos
    document.querySelectorAll('.product-card').forEach((card, index) => {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        `;
        
        const productName = card.querySelector('h4').textContent;
        const isFavorited = favorites.includes(productName);
        
        favoriteBtn.innerHTML = `<i class="fas fa-heart" style="color: ${isFavorited ? '#ff4444' : '#ccc'}"></i>`;
        
        favoriteBtn.addEventListener('click', () => {
            const heartIcon = favoriteBtn.querySelector('i');
            
            if (favorites.includes(productName)) {
                favorites = favorites.filter(fav => fav !== productName);
                heartIcon.style.color = '#ccc';
                showNotification(`${productName} removido dos favoritos`);
            } else {
                favorites.push(productName);
                heartIcon.style.color = '#ff4444';
                showNotification(`${productName} adicionado aos favoritos`);
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
        
        card.querySelector('.product-image').appendChild(favoriteBtn);
    });
}

// Menu mobile
function setupMobileMenu() {
    // Adicionar botão de menu mobile se não existir
    const navbar = document.querySelector('.navbar');
    const navContent = document.querySelector('.nav-content');
    
    if (window.innerWidth <= 768) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.style.cssText = `
            display: block;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #000;
        `;
        
        mobileMenuBtn.addEventListener('click', () => {
            const categories = document.querySelector('.categories');
            categories.style.display = categories.style.display === 'none' ? 'block' : 'none';
        });
        
        navContent.appendChild(mobileMenuBtn);
    }
}

// Filtro de produtos por categoria
function setupCategoryFilter() {
    document.querySelectorAll('.category-item').forEach(category => {
        category.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryName = category.querySelector('span').textContent;
            showNotification(`Filtrando por categoria: ${categoryName}`);
            
            // Aqui você implementaria a lógica de filtro real
            console.log('Categoria selecionada:', categoryName);
        });
    });
}

// Lazy loading para ícones/imagens
function setupLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const icon = entry.target;
                icon.style.opacity = '1';
                observer.unobserve(icon);
            }
        });
    });
    
    document.querySelectorAll('.product-icon').forEach(icon => {
        icon.style.opacity = '0.3';
        icon.style.transition = 'opacity 0.5s ease';
        observer.observe(icon);
    });
}

// Função para simular checkout
function checkout() {
    // Carregar carrinho do localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (cart.length === 0) {
        showNotification('Adicione produtos ao carrinho primeiro!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`Pedido realizado! Total: R$ ${total.toFixed(2).replace('.', ',')}`);
    
    // NOT clearing the cart here - it will be cleared on the purchase page after confirmation
    updateCartCount();
    closeModal();
    
    // Redirecionar para a página de confirmação
    setTimeout(() => {
        window.location.href = 'purchase.html';
    }, 2000);
}

// Event listener for abrir carrinho ao clicar no ícone
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas as funcionalidades
    startFlashSaleTimer();
    setupSearch();
    setupSmoothScroll();
    
    // Aguardar um pouco para animações
    setTimeout(() => {
        animateProducts();
        setupFavorites();
        setupCategoryFilter();
        setupLazyLoading();
    }, 500);
    
    // Setup mobile menu no resize
    window.addEventListener('resize', setupMobileMenu);
    setupMobileMenu();
    
    // Event listener para abrir carrinho
    document.querySelector('.cart-icon').addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
    });
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('cartModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Adicionar efeito de hover nos botões CTA
    document.querySelectorAll('.cta-button, .add-to-cart, .checkout-btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
    
    // Efeito de digitação no hero
    const heroTitle = document.querySelector('.hero-text h2');
    const originalText = heroTitle.textContent;
    let currentIndex = 0;
    
    heroTitle.textContent = '';
    
    const typeWriter = () => {
        if (currentIndex < originalText.length) {
            heroTitle.textContent += originalText.charAt(currentIndex);
            currentIndex++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Iniciar efeito de digitação após um delay
    setTimeout(typeWriter, 1000);
    
    // Atualizar contador do carrinho ao carregar a página
    updateCartCount();
});

// Adicionar event listener ao botão de checkout
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});

// Product data for the Casa category with multiple images
const productData = {
    'Sofá Confortável': {
        name: 'Sofá Confortável',
        images: [
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1555041469-a586c61ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ],
        category: 'Móveis',
        rating: 4.5,
        reviews: 156,
        oldPrice: 1200.00,
        currentPrice: 1020.00,
        discount: 15,
        description: 'Sofá confortável com estrutura de madeira maciça e estofamento de alta qualidade. Perfeito para salas de estar.',
        specs: {
            'Material': 'Madeira e tecido',
            'Cor': 'Cinza',
            'Dimensões': '200x90x85 cm',
            'Assentos': '3 lugares',
            'Modelo': 'Retrátil e reclinável'
        },
        sizes: [],
        code: 'SOF-CONF-001'
    },
    'Cama Queen Size': {
        name: 'Cama Queen Size',
        images: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1554247866-0621b6a27cfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1554247866-0621b6a27cfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ],
        category: 'Móveis',
        rating: 5,
        reviews: 234,
        oldPrice: 0,
        currentPrice: 899.90,
        discount: 0,
        description: 'Cama queen size com cabeceira estofada e estrutura de madeira. Design moderno que combina com qualquer decoração.',
        specs: {
            'Material': 'Madeira e estofamento',
            'Cor': 'Bege',
            'Dimensões': '160x200 cm',
            'Altura': '45 cm',
            'Modelo': 'Com cabeceira'
        },
        sizes: [],
        code: 'CAM-QS-001'
    },
    'Jogo de Talheres': {
        name: 'Jogo de Talheres',
        images: [
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ],
        category: 'Utensílios',
        rating: 4,
        reviews: 89,
        oldPrice: 199.90,
        currentPrice: 159.90,
        discount: 20,
        description: 'Jogo de talheres inox 18/10 com 24 peças. Peças polidas e com acabamento de alta qualidade.',
        specs: {
            'Material': 'Aço inoxidável 18/10',
            'Peças': '24 peças (4 facas, 4 garfos, 4 colheres de sobremesa, 4 colheres de chá, 4 colheres de sopa, 4 colheres de café)',
            'Cor': 'Prata',
            'Lavável': 'Lava-louças',
            'Embalagem': 'Caixa de presente'
        },
        sizes: [],
        code: 'TAL-24P-001'
    },
    'Processador de Alimentos': {
        name: 'Processador de Alimentos',
        images: [
            'https://images.unsplash.com/photo-1595148968605-4e420d2b9d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1595148968605-4e420d2b9d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1595148968605-4e420d2b9d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ],
        category: 'Eletrodomésticos',
        rating: 4.5,
        reviews: 76,
        oldPrice: 0,
        currentPrice: 249.90,
        discount: 0,
        description: 'Processador de alimentos com 800W de potência e 5 velocidades. Ideal para preparar sopas, molhos, picar carne e muito mais.',
        specs: {
            'Potência': '800W',
            'Capacidade': '2L',
            'Velocidades': '5 + pulsar',
            'Material do copo': 'Plástico resistente',
            'Acessórios': 'Lâmina multiuso, disco fatiador, disco raspador',
            'Voltagem': '127V / 220V'
        },
        sizes: [],
        code: 'PROC-800W-001'
    },
    'Conjunto de Panelas': {
        name: 'Conjunto de Panelas',
        images: [
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ],
        category: 'Utensílios',
        rating: 5,
        reviews: 145,
        oldPrice: 399.90,
        currentPrice: 299.90,
        discount: 25,
        description: 'Conjunto de panelas antiaderentes com 5 peças. Material de alta qualidade com distribuição uniforme de calor.',
        specs: {
            'Material': 'Alumínio com revestimento antiaderente',
            'Peças': 'Panela 20cm, 22cm, 24cm + frigideira 24cm + panela de pressão 4L',
            'Cor': 'Preto e vermelho',
            'Compatibilidade': 'Indução, forno, fogão a gás',
            'Lavável': 'Lava-louças'
        },
        sizes: [],
        code: 'PAN-5P-001'
    },
    'Abajur Moderno': {
        name: 'Abajur Moderno',
        images: [
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ],
        category: 'Decoração',
        rating: 4,
        reviews: 67,
        oldPrice: 0,
        currentPrice: 89.90,
        discount: 0,
        description: 'Abajur moderno com base de metal e abertura em tecido. Iluminação suave e aconchegante para ambientes.',
        specs: {
            'Material': 'Metal e tecido',
            'Cor': 'Preto e bege',
            'Altura': '45 cm',
            'Potência máxima': 'LED 11W',
            'Tipo de soquete': 'E27'
        },
        sizes: [],
        code: 'ABA-MOD-001'
    },
    'Mesa de Jantar': {
        name: 'Mesa de Jantar',
        images: [
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ],
        category: 'Móveis',
        rating: 4.5,
        reviews: 98,
        oldPrice: 1500.00,
        currentPrice: 1050.00,
        discount: 30,
        description: 'Mesa de jantar retangular com tampo de vidro temperado e estrutura de madeira. Ideal para 6 pessoas.',
        specs: {
            'Material': 'Madeira e vidro temperado',
            'Cor': 'Madeira natural e vidro transparente',
            'Dimensões': '160x90x75 cm',
            'Assentos': '6 lugares',
            'Modelo': 'Com extensão'
        },
        sizes: [],
        code: 'MES-JAN-001'
    },
    'Cortina Blackout': {
        name: 'Cortina Blackout',
        images: [
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1591123120675-6f7f1aa7eb39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ],
        category: 'Decoração',
        rating: 5,
        reviews: 112,
        oldPrice: 0,
        currentPrice: 129.90,
        discount: 0,
        description: 'Cortina blackout com 2 painéis. Bloqueia 100% da luz e reduz ruídos externos. Tecido de alta qualidade.',
        specs: {
            'Material': 'Poliéster',
            'Cor': 'Cinza escuro',
            'Dimensões': '2x140x250 cm',
            'Tecnologia': 'Blackout 100%',
            'Lavável': 'Lava-louças',
            'Acabamento': 'Ilhós metálicos'
        },
        sizes: [],
        code: 'COR-BLO-001'
    }
};

// Reviews data for products
const productReviews = {
    'Sofá Confortável': [
        {
            reviewer: 'Carlos Silva',
            date: '10/10/2025',
            rating: 5,
            title: 'Conforto e qualidade excelentes!',
            content: 'Produto de excelente qualidade, muito confortável. A entrega foi rápida e o produto veio bem embalado.'
        },
        {
            reviewer: 'Ana Oliveira',
            date: '05/10/2025',
            rating: 4,
            title: 'Bom sofá, recomendo',
            content: 'Sofá bonito e confortável. A montagem foi fácil e o acabamento é bom. Único ponto negativo foi que veio um pequeno arranhão na lateral.'
        }
    ],
    'Cama Queen Size': [
        {
            reviewer: 'Roberto Santos',
            date: '12/10/2025',
            rating: 5,
            title: 'Perfeita!',
            content: 'A cama é exatamente como na foto. Muito confortável e bonita. A entrega foi antes do previsto.'
        }
    ],
    'Jogo de Talheres': [
        {
            reviewer: 'Fernanda Costa',
            date: '08/10/2025',
            rating: 4,
            title: 'Boa qualidade',
            content: 'Talheres de boa qualidade, com acabamento bonito. Fácil de limpar e resistente.'
        }
    ]
};

// Function to open product modal
function openProductModal(productName) {
    const product = productData[productName];
    if (!product) return;
    
    // Populate modal with product data
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductImage').src = product.images[0];
    document.getElementById('modalProductCode').textContent = product.code;
    
    // Set prices
    if (product.oldPrice > 0) {
        document.getElementById('modalOldPrice').textContent = `R$ ${product.oldPrice.toFixed(2).replace('.', ',')}`;
        document.getElementById('modalOldPrice').style.display = 'inline';
    } else {
        document.getElementById('modalOldPrice').style.display = 'none';
    }
    
    document.getElementById('modalCurrentPrice').textContent = `R$ ${product.currentPrice.toFixed(2).replace('.', ',')}`;
    
    if (product.discount > 0) {
        document.getElementById('modalDiscount').textContent = `${product.discount}% OFF`;
        document.getElementById('modalDiscount').style.display = 'inline';
    } else {
        document.getElementById('modalDiscount').style.display = 'none';
    }
    
    // Set installments
    const installments = Math.floor(product.currentPrice / 3);
    document.getElementById('modalInstallments').textContent = `ou 3x de R$ ${installments.toFixed(2).replace('.', ',')} sem juros`;
    
    // Set description
    document.getElementById('modalProductDescription').textContent = product.description;
    
    // Set specifications list
    const specsList = document.getElementById('modalProductSpecs');
    specsList.innerHTML = '';
    for (const [key, value] of Object.entries(product.specs)) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${key}:</strong> ${value}`;
        specsList.appendChild(li);
    }
    
    // Set specifications table
    const specTable = document.getElementById('modalSpecTable');
    specTable.innerHTML = '';
    for (const [key, value] of Object.entries(product.specs)) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>${key}</strong></td><td>${value}</td>`;
        specTable.appendChild(tr);
    }
    
    // Set rating stars
    const ratingStars = document.getElementById('modalProductRating');
    ratingStars.innerHTML = '';
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        ratingStars.appendChild(star);
    }
    
    if (hasHalfStar) {
        const halfStar = document.createElement('i');
        halfStar.className = 'fas fa-star-half-alt';
        ratingStars.appendChild(halfStar);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        const star = document.createElement('i');
        star.className = 'far fa-star';
        ratingStars.appendChild(star);
    }
    
    const ratingSpan = document.createElement('span');
    ratingSpan.textContent = `(${product.reviews})`;
    ratingStars.appendChild(ratingSpan);
    
    // Set reviews tab
    document.getElementById('modalReviewCount').textContent = product.reviews;
    document.getElementById('modalAverageRating').textContent = product.rating.toFixed(1);
    document.getElementById('modalTotalReviews').textContent = `${product.reviews} avaliações`;
    
    // Set rating stars for reviews section
    const reviewStars = document.getElementById('modalRatingStars');
    reviewStars.innerHTML = '';
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        reviewStars.appendChild(star);
    }
    
    if (hasHalfStar) {
        const halfStar = document.createElement('i');
        halfStar.className = 'fas fa-star-half-alt';
        reviewStars.appendChild(halfStar);
    }
    
    // Set rating distribution
    const ratingDistribution = document.getElementById('modalRatingDistribution');
    ratingDistribution.innerHTML = '';
    // This is a simplified version - in a real app, this would be based on actual data
    const distributions = [
        { stars: 5, percentage: 65, count: Math.floor(product.reviews * 0.65) },
        { stars: 4, percentage: 20, count: Math.floor(product.reviews * 0.20) },
        { stars: 3, percentage: 10, count: Math.floor(product.reviews * 0.10) },
        { stars: 2, percentage: 3, count: Math.floor(product.reviews * 0.03) },
        { stars: 1, percentage: 2, count: Math.floor(product.reviews * 0.02) }
    ];
    
    distributions.forEach(dist => {
        const ratingBar = document.createElement('div');
        ratingBar.className = 'rating-bar';
        ratingBar.innerHTML = `
            <span>${dist.stars} estrelas</span>
            <div class="bar-container">
                <div class="bar" style="width: ${dist.percentage}%"></div>
            </div>
            <span>${dist.count}</span>
        `;
        ratingDistribution.appendChild(ratingBar);
    });
    
    // Set recent reviews
    const recentReviews = document.getElementById('modalRecentReviews');
    recentReviews.innerHTML = '';
    
    const reviews = productReviews[productName] || [];
    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.innerHTML = `
            <div class="review-header">
                <div class="reviewer">${review.reviewer}</div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-rating">
                ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                ${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
            </div>
            <div class="review-title">${review.title}</div>
            <div class="review-content">${review.content}</div>
        `;
        recentReviews.appendChild(reviewElement);
    });
    
    // Set thumbnails
    const thumbnailContainer = document.getElementById('modalThumbnails');
    thumbnailContainer.innerHTML = '';
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="${product.name}" class="thumbnail-img">`;
        thumbnail.addEventListener('click', function() {
            document.getElementById('modalProductImage').src = image;
            // Remove active class from all thumbnails
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            // Add active class to clicked thumbnail
            this.classList.add('active');
        });
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // Set add to cart button
    document.getElementById('modalAddToCart').onclick = function() {
        const quantity = parseInt(document.getElementById('modalQuantity').textContent);
        for (let i = 0; i < quantity; i++) {
            addToCart(product.name, product.currentPrice);
        }
        closeModal(); // Close product modal
        openCartModal(); // Open cart modal to show added item
    };
    
    // Show modal
    document.getElementById('productModal').style.display = 'block';
}

// Function to close product modal
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Quantity functions for modal
function increaseModalQuantity() {
    const quantityElement = document.getElementById('modalQuantity');
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;
}

function decreaseModalQuantity() {
    const quantityElement = document.getElementById('modalQuantity');
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
    }
}

// Tab functions for modal
function showModalTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.product-specifications .tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const tabButtons = document.querySelectorAll('.specifications-tabs .tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected tab content
    document.getElementById('modal' + tabName.charAt(0).toUpperCase() + tabName.slice(1) + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    event.currentTarget.classList.add('active');
}

// Global script for all pages

// Update user icon based on login status
// This function is now in auth-utils.js to avoid duplication
// document.addEventListener('DOMContentLoaded', function() {
//     updateUserIcon();
// });

// Add click event to product cards
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to all product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent triggering when clicking on buttons inside the card
            if (e.target.closest('button')) return;
            
            const productName = this.querySelector('h3').textContent;
            openProductModal(productName);
        });
    });
    
    // Close modal when clicking on close button
    document.getElementById('closeProductModal').addEventListener('click', closeProductModal);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('productModal');
        if (e.target === modal) {
            closeProductModal();
        }
    });
});
