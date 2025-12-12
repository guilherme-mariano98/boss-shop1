# Demonstração Prática da Funcionalidade de Busca de CEP

## Como funciona na prática

A funcionalidade de busca de CEP foi implementada na tela de compra do BOSS SHOPP e funciona da seguinte maneira:

### 1. Localização da Funcionalidade
- Acesse a tela de compra em `purchase.html`
- O campo de CEP está localizado na seção "Informações de Envio"
- Ao lado do campo de CEP há um botão com ícone de lupa para realizar a busca

### 2. Passo a passo do uso

#### Passo 1: Digitar o CEP
- Digite um CEP válido no campo apropriado
- O sistema formata automaticamente para o padrão XXXXX-XXX

#### Passo 2: Clicar no botão de busca
- Clique no botão com o ícone de lupa (<i class="fas fa-search"></i>)
- Um ícone de carregamento (<i class="fas fa-spinner fa-spin"></i>) aparecerá no botão durante a busca

#### Passo 3: Visualizar o resultado
- Se o CEP for válido, os seguintes campos serão preenchidos automaticamente:
  - Rua/Logradouro
  - Bairro
  - Cidade
  - Estado (UF)
- O foco será movido automaticamente para o campo de número

### 3. Exemplo prático

1. Digite: `01001000` (CEP do Edifício Martinelli em São Paulo)
2. Clique no botão de busca
3. Veja os campos serem preenchidos:
   - Rua: Praça da Sé
   - Bairro: Sé
   - Cidade: São Paulo
   - Estado: SP

### 4. Tratamento de erros

- **CEP inválido**: Se digitar menos de 8 dígitos, aparece um alerta
- **CEP não encontrado**: Se o CEP não existir, aparece uma mensagem de erro
- **Problemas de conexão**: Se houver erro na requisição, aparece uma mensagem de erro

### 5. Benefícios para o usuário

- **Economia de tempo**: Preenchimento automático de 4 campos com um único clique
- **Redução de erros**: Evita digitação incorreta de endereços
- **Experiência melhorada**: Processo de compra mais rápido e intuitivo

## Teste a funcionalidade

Para testar a funcionalidade, abra o arquivo `cep-demo-practical.html` no seu navegador. Esta página contém:

1. Um campo para digitar o CEP
2. O botão de busca com ícone de lupa
3. Campos de endereço que serão preenchidos automaticamente
4. CEPs de teste para diferentes cidades brasileiras
5. Um botão para testar automaticamente com o CEP 01001-000

## Tecnologia utilizada

- **API ViaCEP**: Serviço gratuito de consulta de CEP
- **Fetch API**: Para requisições HTTP assíncronas
- **JavaScript**: Para processamento e manipulação da interface
- **CSS**: Para estilização e feedback visual

A funcionalidade está totalmente integrada e pronta para uso na tela de compra do BOSS SHOPP.