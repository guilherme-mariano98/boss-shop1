# Documentação do Sistema de Perfil do Usuário - BOSS SHOPP

## Visão Geral

O sistema de perfil do usuário no BOSS SHOPP permite que os clientes gerenciem suas informações pessoais, endereços, histórico de pedidos, métodos de pagamento e preferências de notificação em um único local conveniente.

## Estrutura do Sistema

### 1. Arquivos Principais

- `profile.html` - Página principal do perfil do usuário
- `profile.js` - Lógica JavaScript para funcionalidades do perfil
- `profile.css` - Estilos específicos para a página de perfil
- `auth-utils.js` - Utilitários de autenticação compartilhados

### 2. Seções do Perfil

#### Minha Conta
- Gerenciamento de informações pessoais
- Atualização de nome, sobrenome, telefone, data de nascimento e gênero
- Visualização de email (somente leitura)

#### Meus Pedidos
- Histórico completo de pedidos
- Status de cada pedido (Processando, Em trânsito, Entregue)
- Detalhes dos itens em cada pedido
- Informações de envio

#### Endereços
- Lista de endereços salvos
- Marcação de endereço padrão
- Adição, edição e remoção de endereços
- Formatos otimizados para entrega

#### Formas de Pagamento
- Cartões de crédito/débito salvos
- Marcação de método de pagamento padrão
- Informações de segurança (últimos 4 dígitos, data de expiração)

#### Notificações
- Preferências de comunicação
- Controle granular sobre tipos de notificações
- Configurações de newsletter

## Funcionalidades Implementadas

### 1. Autenticação e Autorização
```javascript
// Verificação de token de autenticação
const authToken = localStorage.getItem('authToken');
if (!authToken) {
    window.location.href = 'login.html';
}
```

### 2. Carregamento de Dados do Usuário
```javascript
async function loadUserData() {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/`, {
            headers: {
                'Authorization': `Token ${authToken}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            // Atualizar interface com dados do usuário
        }
    } catch (error) {
        // Tratar erros e usar dados em cache
    }
}
```

### 3. Gerenciamento de Endereços
- Exibição em formato de cartões
- Identificação visual do endereço padrão
- Ações de editar e excluir
- Formulário para adicionar novos endereços

### 4. Histórico de Pedidos
- Visualização em formato de grade
- Codificação de cores para status
- Detalhamento de itens e valores
- Ação para ver detalhes completos

### 5. Preferências de Notificação
- Controles deslizantes para ativar/desativar
- Persistência de configurações no localStorage
- Feedback visual imediato

## Integração com Backend

### Endpoints da API
- `GET /api/profile/` - Obter dados do perfil
- `PUT /api/profile/` - Atualizar dados do perfil
- `GET /api/addresses/` - Listar endereços
- `POST /api/addresses/` - Adicionar novo endereço
- `GET /api/orders/` - Listar pedidos

### Tratamento de Erros
- Redirecionamento para login quando o token é inválido
- Uso de dados em cache quando offline
- Mensagens de erro amigáveis para o usuário

## Design e Experiência do Usuário

### Layout Responsivo
- Adaptação para dispositivos móveis e desktop
- Grid flexível para listagens
- Tamanho de fonte e espaçamento otimizados

### Componentes Visuais
- Cartões para organização de conteúdo
- Ícones intuitivos para navegação
- Feedback visual para ações do usuário
- Estados vazios com chamadas para ação

### Animações e Transições
- Efeitos de hover em elementos interativos
- Transições suaves entre seções
- Indicadores de carregamento

## Segurança

### Proteção de Dados
- Token de autenticação no cabeçalho HTTP
- Validação de dados no frontend e backend
- Proteção contra XSS e CSRF

### Práticas Recomendadas
- Não exibir senhas em texto plano
- Criptografia de dados sensíveis
- Tempo limite de sessão

## Extensibilidade

### Adições Futuras
1. Integração com sistema de avaliações
2. Programa de fidelidade
3. Lista de desejos
4. Histórico de buscas
5. Preferências de produto

### Personalização
- Temas de cores
- Layouts alternativos
- Idiomas adicionais

## Testes

### Testes Unitários
- Validação de formulários
- Manipulação de dados
- Tratamento de erros

### Testes de Integração
- Fluxo completo de perfil
- Integração com API
- Persistência de dados

## Manutenção

### Atualizações
- Versionamento de API
- Migração de dados
- Backward compatibility

### Monitoramento
- Logs de erros
- Métricas de uso
- Feedback do usuário

## Conclusão

O sistema de perfil do usuário no BOSS SHOPP oferece uma experiência completa e intuitiva para que os clientes gerenciem todas as suas informações relacionadas à conta em um único lugar. Com foco na usabilidade e segurança, o sistema proporciona uma base sólida para futuras expansões e melhorias.