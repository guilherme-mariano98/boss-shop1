// Função para carregar o carrinho do localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error parsing cart:', e);
            cart = [];
        }
    }
    updateCartDisplay();
}

// Função para carregar o último pedido
function loadLastOrder() {
    const lastOrder = localStorage.getItem('lastOrder');
    
    if (lastOrder) {
        try {
            const orderData = JSON.parse(lastOrder);
            
            // Preencher os campos com os dados do último pedido
            if (document.getElementById('orderNumber')) {
                document.getElementById('orderNumber').textContent = orderData.orderId;
            }
            
            if (document.getElementById('orderDate')) {
                document.getElementById('orderDate').textContent = orderData.orderDate;
            }
            
            if (document.getElementById('orderTotal')) {
                document.getElementById('orderTotal').textContent = orderData.total;
            }
            
            if (document.getElementById('paymentMethodDisplay')) {
                const paymentMethodText = {
                    'credit': 'Cartão de Crédito',
                    'debit': 'Cartão de Débito',
                    'boleto': 'Boleto Bancário',
                    'pix': 'PIX'
                };
                document.getElementById('paymentMethodDisplay').textContent = 
                    paymentMethodText[orderData.payment.method] || orderData.payment.method;
            }
            
            // Atualizar itens do pedido
            cart = orderData.items;
            updateCartDisplay();
            
        } catch (e) {
            console.error('Error loading last order:', e);
        }
    }
}

// Função para confirmar o pedido e limpar o carrinho
function confirmOrder() {
    // Coletar dados de pagamento
    const paymentData = collectPaymentData();
    
    // Coletar dados de envio
    const shippingData = collectShippingData();
    
    // Salvar dados do pedido (em um sistema real, isso seria enviado para um servidor)
    const orderData = {
        orderId: document.getElementById('orderNumber').textContent,
        orderDate: document.getElementById('orderDate').textContent,
        items: [...cart],
        total: document.getElementById('orderTotal').textContent,
        payment: paymentData,
        shipping: shippingData,
        status: 'confirmed'
    };
    
    // Salvar dados do pedido no localStorage (para demonstração)
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Adicionar ao histórico de pedidos
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    orderHistory.push(orderData);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    // Limpar carrinho após confirmação do pedido
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Atualizar exibição do carrinho
    updateCartDisplay();
    
    // Mostrar mensagem de confirmação
    showNotification('Pedido confirmado com sucesso!');
}

// Função para coletar dados de pagamento
function collectPaymentData() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const paymentData = {
        method: paymentMethod
    };
    
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
        paymentData.cardNumber = document.getElementById('cardNumber').value;
        paymentData.cardName = document.getElementById('cardName').value;
        paymentData.expiryDate = document.getElementById('expiryDate').value;
        paymentData.cvv = document.getElementById('cvv').value;
    } else if (paymentMethod === 'pix') {
        // Para PIX, não coletamos dados sensíveis, apenas confirmamos a escolha
        paymentData.pixGenerated = true;
    }
    
    return paymentData;
}

// Função para coletar dados de envio
function collectShippingData() {
    return {
        cep: document.getElementById('cep').value,
        street: document.getElementById('street').value,
        number: document.getElementById('number').value,
        complement: document.getElementById('complement').value,
        neighborhood: document.getElementById('neighborhood').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value
    };
}

// Função para mostrar notificação (cópia da função em script.js)
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

// Carrinho de compras (cópia do carrinho principal)
let cart = [];

// Função para atualizar a exibição do carrinho
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const orderItems = document.getElementById('orderItems');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666;">Seu carrinho está vazio</p>';
        } else {
            let total = 0;
            
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'item';
                
                const subtotal = item.price * item.quantity;
                total += subtotal;
                
                itemElement.innerHTML = `
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-quantity">Quantidade: ${item.quantity}</div>
                    </div>
                    <div class="item-price">R$ ${subtotal.toFixed(2).replace('.', ',')}</div>
                `;
                
                cartItems.appendChild(itemElement);
            });
            
            if (cartTotal) {
                cartTotal.textContent = total.toFixed(2).replace('.', ',');
            }
            
            // Atualizar também os valores de parcelamento
            const installmentValue = document.getElementById('installmentValue');
            if (installmentValue) {
                installmentValue.textContent = total.toFixed(2).replace('.', ',');
            }
            
            const installmentValue2 = document.getElementById('installmentValue2');
            if (installmentValue2) {
                installmentValue2.textContent = (total/2).toFixed(2).replace('.', ',');
            }
            
            const installmentValue3 = document.getElementById('installmentValue3');
            if (installmentValue3) {
                installmentValue3.textContent = (total/3).toFixed(2).replace('.', ',');
            }
            
            const installmentValue4 = document.getElementById('installmentValue4');
            if (installmentValue4) {
                installmentValue4.textContent = (total/4).toFixed(2).replace('.', ',');
            }
            
            const installmentValue5 = document.getElementById('installmentValue5');
            if (installmentValue5) {
                installmentValue5.textContent = (total/5).toFixed(2).replace('.', ',');
            }
            
            const installmentValue6 = document.getElementById('installmentValue6');
            if (installmentValue6) {
                installmentValue6.textContent = (total/6).toFixed(2).replace('.', ',');
            }
            
            const installmentValue7 = document.getElementById('installmentValue7');
            if (installmentValue7) {
                installmentValue7.textContent = (total/7).toFixed(2).replace('.', ',');
            }
            
            const installmentValue8 = document.getElementById('installmentValue8');
            if (installmentValue8) {
                installmentValue8.textContent = (total/8).toFixed(2).replace('.', ',');
            }
            
            const installmentValue9 = document.getElementById('installmentValue9');
            if (installmentValue9) {
                installmentValue9.textContent = (total/9).toFixed(2).replace('.', ',');
            }
            
            const installmentValue10 = document.getElementById('installmentValue10');
            if (installmentValue10) {
                installmentValue10.textContent = (total/10).toFixed(2).replace('.', ',');
            }
            
            const installmentValue11 = document.getElementById('installmentValue11');
            if (installmentValue11) {
                installmentValue11.textContent = (total/11).toFixed(2).replace('.', ',');
            }
            
            const installmentValue12 = document.getElementById('installmentValue12');
            if (installmentValue12) {
                installmentValue12.textContent = (total/12).toFixed(2).replace('.', ',');
            }
        }
    }
    
    // Atualizar itens do pedido na confirmação
    if (orderItems) {
        orderItems.innerHTML = '';
        
        if (cart.length === 0) {
            orderItems.innerHTML = '<p style="text-align: center; color: #666;">Nenhum item no pedido</p>';
        } else {
            let total = 0;
            
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'item';
                
                const subtotal = item.price * item.quantity;
                total += subtotal;
                
                itemElement.innerHTML = `
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-quantity">Quantidade: ${item.quantity}</div>
                    </div>
                    <div class="item-price">R$ ${subtotal.toFixed(2).replace('.', ',')}</div>
                `;
                
                orderItems.appendChild(itemElement);
            });
            
            // Atualizar total do pedido
            const orderTotal = document.getElementById('orderTotal');
            if (orderTotal) {
                orderTotal.textContent = total.toFixed(2).replace('.', ',');
            }
        }
    }
}

function showStep(step) {
    // Esconder todas as etapas
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remover classe active de todos os passos
    document.querySelectorAll('.step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Mostrar etapa atual
    const stepId = `${['cart', 'address', 'payment', 'confirmation'][step-1]}-step`;
    
    const stepElement = document.getElementById(stepId);
    if (stepElement) {
        stepElement.classList.add('active');
    }
    
    // Adicionar classe active aos passos concluídos
    for (let i = 1; i <= step; i++) {
        const stepElement = document.getElementById(`step${i}`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
    }
    
    // If we're showing the cart step, make sure the cart is updated
    if (step === 1) {
        loadCart();
    }
}

// Função para navegar entre etapas
function nextStep(step) {
    // Validar formulário da etapa atual antes de avançar
    if (step === 2) {
        // Não há validação especial para a etapa 1
        showStep(step);
    } else if (step === 3) {
        // Validar formulário de endereço
        const cep = document.getElementById('cep').value;
        const street = document.getElementById('street').value;
        const number = document.getElementById('number').value;
        const neighborhood = document.getElementById('neighborhood').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        
        if (!cep || !street || !number || !neighborhood || !city || !state) {
            alert('Por favor, preencha todos os campos obrigatórios do endereço.');
            return;
        }
        
        // Atualizar endereço de envio na confirmação
        const shippingAddress = `${street}, ${number} - ${neighborhood}<br>${city} - ${state}, ${cep}`;
        document.getElementById('shippingAddress').innerHTML = shippingAddress;
        
        showStep(step);
    } else if (step === 4) {
        // Validar formulário de pagamento
        const paymentMethod = document.getElementById('paymentMethod').value;
        
        if (!paymentMethod) {
            alert('Por favor, selecione uma forma de pagamento.');
            return;
        }
        
        if (paymentMethod === 'credit' || paymentMethod === 'debit') {
            const cardNumber = document.getElementById('cardNumber').value;
            const cardName = document.getElementById('cardName').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            
            if (!cardNumber || !cardName || !expiryDate || !cvv) {
                alert('Por favor, preencha todos os dados do cartão.');
                return;
            }
            
            // Validar formato do número do cartão (simples)
            if (cardNumber.replace(/\s/g, '').length < 16) {
                alert('Por favor, insira um número de cartão válido.');
                return;
            }
            
            // Validar formato da data de expiração
            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                alert('Por favor, insira uma data de validade no formato MM/AA.');
                return;
            }
            
            // Validar CVV
            if (!/^\d{3,4}$/.test(cvv)) {
                alert('Por favor, insira um CVV válido.');
                return;
            }
        } else if (paymentMethod === 'pix') {
            // Para PIX, não há validação adicional necessária
            // O QR Code já foi gerado quando o método foi selecionado
        }
        
        // Gerar número do pedido e data
        const orderNumber = '#BS' + Math.floor(100000000 + Math.random() * 900000000);
        const now = new Date();
        const orderDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        
        document.getElementById('orderNumber').textContent = orderNumber;
        document.getElementById('orderDate').textContent = orderDate;
        
        // Atualizar método de pagamento na confirmação
        const paymentMethodDisplay = document.getElementById('paymentMethodDisplay');
        const paymentMethodText = {
            'credit': 'Cartão de Crédito',
            'debit': 'Cartão de Débito',
            'boleto': 'Boleto Bancário',
            'pix': 'PIX'
        };
        paymentMethodDisplay.textContent = paymentMethodText[paymentMethod] || paymentMethod;
        
        // Confirmar o pedido e limpar o carrinho
        confirmOrder();
        
        showStep(step);
    }
}

function prevStep(step) {
    showStep(step);
}

// Função para buscar CEP
function buscarCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, ''); // Remove non-digit characters
    
    // Validar CEP
    if (cep.length !== 8) {
        alert('Por favor, insira um CEP válido com 8 dígitos.');
        return;
    }
    
    // Mostrar indicador de carregamento
    const searchBtn = cepInput.parentElement.querySelector('.search-btn');
    const originalHTML = searchBtn.innerHTML;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    searchBtn.disabled = true;
    
    // Usar nosso próprio serviço de CEP (com fallback automático)
    fetch(`http://localhost:5001/api/cep/${cep}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Preencher os campos com os dados retornados
                document.getElementById('street').value = data.data.street || '';
                document.getElementById('neighborhood').value = data.data.neighborhood || '';
                document.getElementById('city').value = data.data.city || '';
                document.getElementById('state').value = data.data.state || '';
                
                // Se o campo de número estiver vazio, colocar o foco nele
                const numberInput = document.getElementById('number');
                if (!numberInput.value) {
                    numberInput.focus();
                }
                
                showNotification(`CEP ${cep} encontrado com sucesso!`);
            } else {
                throw new Error(data.error || 'CEP não encontrado');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar CEP:', error);
            // Tentar uma API alternativa se o serviço local não estiver disponível
            buscarCEPAlternativo(cep);
        })
        .finally(() => {
            // Restaurar botão de busca
            searchBtn.innerHTML = originalHTML;
            searchBtn.disabled = false;
        });
}

// Função para buscar CEP usando API alternativa
function buscarCEPAlternativo(cep) {
    // Mostrar indicador de carregamento
    const cepInput = document.getElementById('cep');
    const searchBtn = cepInput.parentElement.querySelector('.search-btn');
    const originalHTML = searchBtn.innerHTML;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    searchBtn.disabled = true;
    
    // Usar ViaCEP como fallback
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.erro) {
                // Preencher os campos com os dados retornados
                document.getElementById('street').value = data.logradouro || '';
                document.getElementById('neighborhood').value = data.bairro || '';
                document.getElementById('city').value = data.localidade || '';
                document.getElementById('state').value = data.uf || '';
                
                // Se o campo de número estiver vazio, colocar o foco nele
                const numberInput = document.getElementById('number');
                if (!numberInput.value) {
                    numberInput.focus();
                }
                
                showNotification(`CEP ${cep} encontrado com sucesso! (ViaCEP)`);
            } else {
                throw new Error('CEP não encontrado');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar CEP alternativo:', error);
            alert('Não foi possível encontrar o CEP. Por favor, verifique o número e tente novamente.');
            showNotification(`Erro ao buscar CEP: ${error.message}`, 'error');
        })
        .finally(() => {
            // Restaurar botão de busca
            searchBtn.innerHTML = originalHTML;
            searchBtn.disabled = false;
        });
}

// Função para alternar campos de cartão
function togglePaymentFields() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cardFields = document.getElementById('cardFields');
    const pixFields = document.getElementById('pixFields');
    
    // Esconder todos os campos primeiro
    cardFields.style.display = 'none';
    if (pixFields) pixFields.style.display = 'none';
    
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
        cardFields.style.display = 'block';
    } else if (paymentMethod === 'pix' && pixFields) {
        pixFields.style.display = 'block';
        generatePixQRCode();
    }
}

// Função para gerar QR Code do PIX
function generatePixQRCode() {
    // Calcular o total do pedido
    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formattedTotal = orderTotal.toFixed(2).replace('.', ',');
    
    // Atualizar o valor exibido
    if (document.getElementById('pixAmount')) {
        document.getElementById('pixAmount').textContent = formattedTotal;
    }
    
    // Gerar um código PIX de exemplo (em um sistema real, isso viria de um serviço de pagamento)
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136pix@bossshopp.com.br0210Compra BOSS520400005303986540${formattedTotal.replace(',', '')}5802BR5910BOSS SHOPP6009SAO PAULO62250521pix.bossshopp.com.br/checkout6304ABCD`;
    
    // Atualizar o campo de texto copiável
    if (document.getElementById('pixCode')) {
        document.getElementById('pixCode').value = pixCode;
    }
    
    // Gerar o QR Code
    const qrcodeContainer = document.getElementById('qrcode');
    if (qrcodeContainer) {
        // Limpar conteúdo anterior
        qrcodeContainer.innerHTML = '';
        
        // Criar novo QR Code
        new QRCode(qrcodeContainer, {
            text: pixCode,
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

// Função para copiar o código PIX
function copyPixCode() {
    const pixCodeElement = document.getElementById('pixCode');
    if (pixCodeElement) {
        pixCodeElement.select();
        document.execCommand('copy');
        showNotification('Código PIX copiado para a área de transferência!');
    }
}

// Função para imprimir comprovante
function printReceipt() {
    // Criar uma janela de impressão com informações do pedido
    const printWindow = window.open('', '_blank');
    const orderNumber = document.getElementById('orderNumber').textContent;
    const orderDate = document.getElementById('orderDate').textContent;
    const orderTotal = document.getElementById('orderTotal').textContent;
    const paymentMethod = document.getElementById('paymentMethodDisplay').textContent;
    const shippingAddress = document.getElementById('shippingAddress').innerHTML.replace(/<br>/g, '\n');
    
    let itemsHtml = '';
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        itemsHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                <td>R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
            </tr>
        `;
    });
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Comprovante de Pedido - ${orderNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .order-info { margin-bottom: 20px; }
                .order-info div { margin-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total { text-align: right; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>BOSS SHOPP</h1>
                <h2>Comprovante de Pedido</h2>
            </div>
            
            <div class="order-info">
                <div><strong>Número do Pedido:</strong> ${orderNumber}</div>
                <div><strong>Data:</strong> ${orderDate}</div>
                <div><strong>Método de Pagamento:</strong> ${paymentMethod}</div>
                <div><strong>Endereço de Entrega:</strong><br>${shippingAddress}</div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Preço Unitário</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div class="total">
                <div><strong>Total: R$ ${orderTotal}</strong></div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <p>Obrigado por sua compra!</p>
                <p>www.bossshopp.com</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Função para continuar comprando
function continueShopping() {
    window.location.href = 'index.html';
}

// Função para voltar ao início
function goToHome() {
    window.location.href = 'index.html';
}

// Função para formatar o número do cartão
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    input.value = formattedValue;
}

// Função para formatar a data de expiração
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    input.value = value;
}

// Função para formatar o CEP
function formatCEP(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    
    input.value = value;
}

// Adicionar formatação aos campos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar formatação ao campo de número do cartão
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            formatCardNumber(this);
        });
    }
    
    // Adicionar formatação ao campo de data de expiração
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function() {
            formatExpiryDate(this);
        });
    }
    
    // Adicionar formatação ao campo de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            formatCEP(this);
        });
    }
});

// Função para validar o CVV
function validateCVV(input) {
    // Permitir apenas números
    input.value = input.value.replace(/\D/g, '');
    
    // Limitar a 3 ou 4 dígitos
    if (input.value.length > 4) {
        input.value = input.value.substring(0, 4);
    }
}

// Função para mostrar histórico de pedidos
function showOrderHistory() {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    if (orderHistory.length === 0) {
        showNotification('Nenhum pedido encontrado no histórico.');
        return;
    }
    
    // Criar uma janela para mostrar o histórico
    const historyWindow = window.open('', '_blank');
    
    let historyHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Histórico de Pedidos - BOSS SHOPP</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>BOSS SHOPP</h1>
                <h2>Histórico de Pedidos</h2>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Número do Pedido</th>
                        <th>Data</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    orderHistory.forEach(order => {
        historyHtml += `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.orderDate}</td>
                <td>R$ ${order.total}</td>
                <td>${order.status}</td>
            </tr>
        `;
    });
    
    historyHtml += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    historyWindow.document.write(historyHtml);
    historyWindow.document.close();
}

// Atualizar contador do carrinho
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const cart = JSON.parse(savedCart);
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
            } catch (e) {
                cartCount.textContent = '0';
            }
        } else {
            cartCount.textContent = '0';
        }
    }
}

// Função de inicialização robusta
function initPurchasePage() {
    // Garantir que o carrinho seja carregado
    loadCart();
    
    // Mostrar a primeira etapa do processo de compra
    showStep(1);
    
    // Gerar número do pedido inicial
    const orderNumber = '#BS' + Math.floor(100000000 + Math.random() * 900000000);
    if (document.getElementById('orderNumber')) {
        document.getElementById('orderNumber').textContent = orderNumber;
    }
    
    // Definir data atual
    const now = new Date();
    const orderDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    if (document.getElementById('orderDate')) {
        document.getElementById('orderDate').textContent = orderDate;
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are ready
    setTimeout(function() {
        initPurchasePage();
    }, 100);
});

// Inicialização alternativa caso o DOMContentLoaded falhe
window.addEventListener('load', function() {
    console.log('Window loaded, ensuring purchase page is initialized...');
    setTimeout(function() {
        initPurchasePage();
    }, 100);
});

// Inicialização imediata caso o DOM já esteja pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            initPurchasePage();
        }, 100);
    });
} else {
    // DOM is already ready
    setTimeout(function() {
        initPurchasePage();
    }, 100);
}