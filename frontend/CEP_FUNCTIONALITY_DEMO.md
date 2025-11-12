# Demonstração da Funcionalidade de Busca de CEP

## Visão Geral
Implementamos uma funcionalidade de busca de CEP (Código de Endereçamento Postal) na tela de compra do BOSS SHOPP. Esta funcionalidade permite que os usuários insiram seu CEP e automaticamente preencham os campos de endereço como rua, bairro, cidade e estado.

## Como Funciona

### 1. Campo de CEP
- Localizado na seção "Informações de Envio" do processo de compra
- Aceita entrada no formato XXXXX-XXX
- Inclui um botão de busca ao lado do campo

### 2. Processo de Busca
1. Usuário digita o CEP no campo apropriado
2. Clica no botão "Buscar" (ícone de lupa)
3. O sistema consulta a API ViaCEP (https://viacep.com.br/)
4. Os campos de endereço são automaticamente preenchidos com os dados retornados

### 3. Campos Preenchidos Automaticamente
- Rua/Logradouro
- Bairro
- Cidade
- Estado (UF)

### 4. Benefícios
- Reduz erros de digitação no preenchimento de endereços
- Agiliza o processo de compra
- Melhora a experiência do usuário
- Garante consistência nos dados de endereço

## Teste da Funcionalidade

Para testar a funcionalidade:

1. Abra o arquivo `cep-test.html` no navegador
2. Digite um CEP válido (ex: 01001-000 para São Paulo)
3. Clique no botão "Buscar"
4. Observe os campos sendo preenchidos automaticamente

## CEPs de Teste
- 01001-000 (São Paulo, SP)
- 20010-000 (Rio de Janeiro, RJ)
- 29010-000 (Vitória, ES)
- 30110-000 (Belo Horizonte, MG)
- 40010-000 (Salvador, BA)
- 50010-000 (Recife, PE)
- 60010-000 (Fortaleza, CE)
- 70010-000 (Brasília, DF)
- 80010-000 (Curitiba, PR)
- 90010-000 (Porto Alegre, RS)

## Integração Técnica

A funcionalidade foi implementada no arquivo `purchase.js` com a função `searchCEP()`:

```javascript
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

## Tratamento de Erros

A implementação inclui tratamento para os seguintes cenários:
- CEP inválido (menos de 8 dígitos)
- CEP não encontrado na base de dados
- Erros de rede durante a requisição
- Respostas inválidas da API

## Requisitos

- Conexão com a internet para consultar a API
- Navegador com suporte a JavaScript e Fetch API
- Acesso à API ViaCEP (gratuita e sem necessidade de autenticação)

## Benefícios para o Usuário Final

1. **Economia de Tempo**: Preenchimento automático de campos
2. **Precisão**: Redução de erros de digitação
3. **Facilidade de Uso**: Interface intuitiva
4. **Padronização**: Dados de endereço consistentes