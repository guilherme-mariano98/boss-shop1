# Serviço de CEP para BOSS SHOPP

## Visão Geral

Este serviço fornece uma API para consulta de CEPs diretamente dos Correios brasileiros, com fallback para APIs públicas. Ele foi desenvolvido para melhorar a precisão e confiabilidade da busca de endereços no BOSS SHOPP.

## Arquitetura

O serviço utiliza uma abordagem em camadas:

1. **Camada Primária**: Conexão direta com os serviços SOAP dos Correios
2. **Camada Secundária**: Fallback para APIs públicas (ViaCEP, BrasilAPI)
3. **Interface Frontend**: JavaScript otimizado com tratamento de erros

## Funcionalidades

- Consulta direta aos Correios através de SOAP
- Fallback automático para APIs públicas
- Tratamento robusto de erros
- Formatação automática de CEP
- Indicador de carregamento
- Verificação de status do serviço

## Requisitos

- Python 3.7 ou superior
- Pip (gerenciador de pacotes do Python)
- Acesso à internet

## Instalação

1. Navegue até o diretório backend:
   ```
   cd c:\Users\guilherme54220026\PI3\PI2\backend
   ```

2. Instale as dependências:
   ```
   pip install -r requirements-cep.txt
   ```

   Ou instale manualmente:
   ```
   pip install flask flask-cors requests
   ```

## Execução

### Método 1: Usando o arquivo batch (recomendado)
```
start_cep_service.bat
```

### Método 2: Executando diretamente
```
python cep_service.py
```

O serviço estará disponível em: `http://localhost:5001`

## Endpoints da API

### Consultar CEP
```
GET /api/cep/{cep}
```

**Exemplo:**
```
GET http://localhost:5001/api/cep/01001000
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "data": {
    "street": "Praça da Sé",
    "neighborhood": "Sé",
    "city": "São Paulo",
    "state": "SP",
    "cep": "01001-000"
  }
}
```

**Resposta de erro:**
```json
{
  "success": false,
  "error": "CEP não encontrado"
}
```

### Verificação de Saúde
```
GET /health
```

**Resposta:**
```json
{
  "status": "ok",
  "service": "CEP Service"
}
```

## Integração com Frontend

O serviço é automaticamente utilizado pelo frontend do BOSS SHOPP. A implementação JavaScript:

1. Primeiro tenta conectar ao serviço local (`http://localhost:5001`)
2. Em caso de falha, utiliza APIs públicas como fallback
3. Mostra indicador de carregamento durante as requisições
4. Trata automaticamente diferentes formatos de resposta

## APIs Públicas Utilizadas (Fallback)

1. **ViaCEP** - `https://viacep.com.br/ws/{cep}/json/`
2. **BrasilAPI** - `https://brasilapi.com.br/api/cep/v1/{cep}`
3. **Postmon** - `https://api.postmon.com.br/v1/cep/{cep}`

## Estrutura do Código

```
backend/
├── cep_service.py          # Serviço principal em Python/Flask
├── requirements-cep.txt    # Dependências do Python
├── start_cep_service.bat   # Script para iniciar o serviço
└── CEP_SERVICE_README.md   # Esta documentação
```

## Teste da Funcionalidade

### Usando o frontend
1. Abra o arquivo `cep-correios-demo.html` no navegador
2. Digite um CEP válido (ex: 01001000)
3. Clique no botão de busca
4. Verifique se os campos foram preenchidos

### Usando curl
```bash
curl http://localhost:5001/api/cep/01001000
```

### Usando Postman
1. Método: GET
2. URL: `http://localhost:5001/api/cep/01001000`
3. Envie a requisição

## CEPs para Teste

- 01001-000 (São Paulo, SP - Praça da Sé)
- 20010-000 (Rio de Janeiro, RJ - Centro)
- 29010-000 (Vitória, ES - Centro)
- 30110-000 (Belo Horizonte, MG - Centro)
- 40010-000 (Salvador, BA - Centro)

## Tratamento de Erros

O serviço trata os seguintes cenários:

- CEP inválido (formato incorreto)
- CEP não encontrado
- Serviço dos Correios indisponível
- Problemas de rede
- Respostas inválidas das APIs

## Manutenção

### Atualização de dependências
```
pip install --upgrade flask flask-cors requests
```

### Reinicialização do serviço
1. Pressione Ctrl+C no terminal onde o serviço está rodando
2. Execute novamente o script de inicialização

## Segurança

- O serviço roda localmente (localhost)
- Não armazena dados sensíveis
- Não requer autenticação
- Utiliza HTTPS para APIs externas

## Desempenho

- Tempo médio de resposta: < 1 segundo
- Cache não implementado (dados em tempo real)
- Conexão mantida por requisição

## Suporte

Em caso de problemas:

1. Verifique se o serviço está em execução
2. Confirme a conectividade com a internet
3. Teste as APIs públicas diretamente
4. Verifique o firewall e configurações de rede