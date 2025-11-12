# Alterações de Código - Funcionalidade de Busca de CEP

## Arquivo Modificado: purchase.js

### Função searchCEP() - Versão Antiga
```javascript
// Função para procurar CEP
function searchCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('Por favor, insira um CEP válido com 8 dígitos.');
        return;
    }
    
    // Simular uma pequena espera para parecer uma busca real
    showNotification('Buscando CEP...');
    
    // Simular busca de CEP (em um projeto real, você usaria uma API de CEP)
    setTimeout(function() {
        // Preencher com dados fictícios baseados no CEP
        document.getElementById('street').value = 'Rua Exemplo';
        document.getElementById('neighborhood').value = 'Centro';
        document.getElementById('city').value = 'São Paulo';
        document.getElementById('state').value = 'SP';
        
        showNotification(`CEP ${cep} encontrado!`);
    }, 1000);
}
```

### Função searchCEP() - Versão Nova (Atualizada)
```javascript
// Função para procurar CEP
function searchCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('Por favor, insira um CEP válido com 8 dígitos.');
        return;
    }
    
    // Mostrar indicador de carregamento
    const searchBtn = cepInput.parentElement.querySelector('.search-btn');
    const originalHTML = searchBtn.innerHTML;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    searchBtn.disabled = true;
    
    // Buscar CEP usando a API ViaCEP
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert('CEP não encontrado. Por favor, verifique o número e tente novamente.');
                return;
            }
            
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
            
            showNotification(`CEP ${cep} encontrado com sucesso!`);
        })
        .catch(error => {
            console.error('Erro ao buscar CEP:', error);
            alert('Erro ao buscar CEP. Por favor, tente novamente.');
        })
        .finally(() => {
            // Restaurar botão de busca
            searchBtn.innerHTML = originalHTML;
            searchBtn.disabled = false;
        });
}
```

## Melhorias Implementadas

### 1. Integração com API Real
- **Antes**: Dados fictícios gerados localmente
- **Depois**: Consulta à API ViaCEP para dados reais e atualizados

### 2. Indicador de Carregamento
- **Antes**: Notificação genérica "Buscando CEP..."
- **Depois**: Ícone de spinner no botão de busca durante a requisição

### 3. Tratamento de Erros Avançado
- **Antes**: Nenhum tratamento de erro real
- **Depois**: 
  - Verificação da propriedade `erro` na resposta da API
  - Tratamento de erros de rede com `.catch()`
  - Mensagens de erro específicas para o usuário

### 4. Experiência do Usuário
- **Antes**: Simulação de espera com `setTimeout`
- **Depois**: 
  - Foco automático no campo de número após busca bem-sucedida
  - Feedback imediato com notificações
  - Botão de busca desabilitado durante a requisição

### 5. Código Mais Robusto
- **Antes**: Código de demonstração com dados fixos
- **Depois**: 
  - Uso da Fetch API para requisições HTTP
  - Validação de resposta da API
  - Tratamento adequado de dados ausentes (`|| ''`)

## Benefícios Técnicos

1. **Dados Reais**: Integração com serviço oficial de CEP
2. **Performance**: Requisições assíncronas sem bloqueio da interface
3. **Confiabilidade**: Tratamento completo de casos de erro
4. **Usabilidade**: Feedback visual durante operações assíncronas
5. **Manutenibilidade**: Código limpo e bem estruturado

## Requisitos Técnicos

- Navegador com suporte a Fetch API
- Conexão com a internet
- Acesso à API ViaCEP (gratuita e sem autenticação)
- Biblioteca Font Awesome para ícones (já incluída no projeto)

## Teste de Funcionalidade

Para testar a funcionalidade atualizada:

1. Abra o arquivo `cep-demo.html` no navegador
2. Digite um CEP válido (ex: 01001-000)
3. Clique no botão de busca
4. Observe:
   - Ícone de carregamento no botão
   - Preenchimento automático dos campos
   - Notificação de sucesso
   - Foco no campo de número

## Compatibilidade

A implementação é compatível com:
- Chrome 42+
- Firefox 39+
- Safari 10.1+
- Edge 14+
- Opera 29+

Todos os navegadores modernos suportam a Fetch API utilizada na implementação.