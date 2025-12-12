# 🎫 Tela de Cupons de Desconto - BOSS SHOPP

## 📋 Descrição

Página completa de cupons de desconto com design moderno e funcionalidades interativas.

## ✨ Funcionalidades

### 1. **Exibição de Cupons**
- 10 cupons pré-cadastrados
- Cards visuais com gradientes
- Informações detalhadas de cada cupom

### 2. **Tipos de Cupons**
- **Desconto Percentual** (ex: 20% OFF)
- **Desconto Fixo** (ex: R$ 50 OFF)
- **Frete Grátis**

### 3. **Filtros**
- Todos os cupons
- Por porcentagem
- Por valor fixo
- Frete grátis

### 4. **Informações do Cupom**
- Código do cupom
- Valor do desconto
- Compra mínima
- Desconto máximo
- Categoria aplicável
- Data de validade
- Dias restantes

### 5. **Ações**
- **Copiar código** - Copia o cupom para área de transferência
- **Usar cupom** - Aplica o cupom e redireciona para o carrinho
- Feedback visual ao copiar
- Notificações de sucesso

### 6. **Badges**
- Popular
- Novo
- Destaque
- Oferta
- VIP
- Rápido

### 7. **Validação**
- Cupons expirados ficam desabilitados
- Indicador visual de expiração
- Contador de dias restantes

## 🎨 Design

### Cores:
- **Primária:** Gradiente laranja (#ff6b35 → #f7931e)
- **Secundária:** Gradiente roxo (#667eea → #764ba2)
- **Sucesso:** Verde (#28a745)
- **Aviso:** Amarelo (#fff3cd)
- **Erro:** Vermelho (#f8d7da)

### Elementos:
- Cards com sombra e hover effect
- Código do cupom com borda tracejada
- Botões com gradiente
- Ícones Font Awesome
- Animações suaves

## 📊 Cupons Disponíveis

| Código | Tipo | Desconto | Compra Mín. | Categoria |
|--------|------|----------|-------------|-----------|
| ELETRO20 | % | 20% | R$ 200 | Eletrônicos |
| BEMVINDO50 | R$ | R$ 50 | R$ 150 | Todos |
| FRETEGRATIS | Frete | Grátis | R$ 100 | Todos |
| MODA15 | % | 15% | R$ 100 | Moda |
| CASA30 | % | 30% | R$ 250 | Casa |
| MEGA100 | R$ | R$ 100 | R$ 500 | Todos |
| GAMES25 | % | 25% | R$ 150 | Games |
| EXPRESS24 | Frete | Expresso | R$ 200 | Todos |
| PROGRESSIVO10 | % | 10% | R$ 50 | Todos |
| ESPORTE30 | R$ | R$ 30 | R$ 120 | Esportes |

## 🔧 Funcionalidades Técnicas

### JavaScript:
```javascript
// Copiar cupom
copyCouponCode(code, couponId)

// Usar cupom
useCoupon(code)

// Filtrar cupons
filterCoupons(type)

// Renderizar cupons
renderCoupons(filter)

// Notificações
showNotification(message, type)
```

### LocalStorage:
- Salva cupom aplicado: `localStorage.setItem('appliedCoupon', code)`
- Recupera no carrinho: `localStorage.getItem('appliedCoupon')`

### Animações:
- Slide in/out para notificações
- Hover effects nos cards
- Transições suaves

## 📱 Responsividade

- **Desktop:** Grid de 3 colunas
- **Tablet:** Grid de 2 colunas
- **Mobile:** Grid de 1 coluna
- Filtros adaptáveis
- Cards responsivos

## 🚀 Como Usar

### Acessar a Página:
```
http://localhost:8000/cupons.html
```

### Integração com Carrinho:
1. Usuário clica em "Usar Cupom"
2. Código é salvo no localStorage
3. Redireciona para purchase.html
4. Carrinho lê o cupom e aplica desconto

### Adicionar Novo Cupom:
```javascript
{
    id: 11,
    type: 'percentage', // ou 'fixed' ou 'shipping'
    discount: '15%',
    title: 'Título do Cupom',
    description: 'Descrição detalhada',
    code: 'CODIGO15',
    minValue: 100,
    maxDiscount: 50,
    expiryDate: '2025-12-31',
    category: 'Categoria',
    badge: 'Novo' // opcional
}
```

## 🎯 Próximos Passos

### Backend:
- [ ] API para gerenciar cupons
- [ ] Validação de cupons no servidor
- [ ] Histórico de uso de cupons
- [ ] Cupons personalizados por usuário

### Funcionalidades:
- [ ] Busca de cupons
- [ ] Cupons favoritos
- [ ] Compartilhar cupons
- [ ] Notificações de novos cupons
- [ ] Cupons por email

### Analytics:
- [ ] Rastrear uso de cupons
- [ ] Cupons mais populares
- [ ] Taxa de conversão
- [ ] ROI por cupom

## 📝 Notas

- Todos os cupons são fictícios para demonstração
- Datas de validade são exemplos
- Integração com carrinho precisa ser implementada
- Sistema de validação no backend é recomendado

## 🔗 Links Relacionados

- [Página de Cupons](cupons.html)
- [Carrinho de Compras](purchase.html)
- [Página Inicial](index.html)

---

**Desenvolvido para BOSS SHOPP**  
**Versão 1.0 - Dezembro 2025**
