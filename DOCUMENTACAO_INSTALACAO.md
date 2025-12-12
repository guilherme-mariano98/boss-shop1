# DOCUMENTAÇÃO DE INSTALAÇÃO E IMPLANTAÇÃO
## Sistema BOSS SHOPP - E-commerce

**Chamado:** #4  
**Prioridade:** Média  
**Tempo de Entrega:** 1 hora  
**Hora de Abertura:** 16h40min  
**Data:** 01/12/2025

---

## ÍNDICE

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação do Ambiente](#instalação-do-ambiente)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [Implantação do Backend (Django)](#implantação-do-backend-django)
5. [Implantação do Frontend](#implantação-do-frontend)
6. [Configuração de Rede e Firewall](#configuração-de-rede-e-firewall)
7. [Testes de Funcionamento](#testes-de-funcionamento)
8. [Troubleshooting](#troubleshooting)

---

## REQUISITOS DO SISTEMA

### Hardware Mínimo
- Processador: 2 cores
- Memória RAM: 4GB
- Espaço em Disco: 10GB livres
- Conexão de Rede: 100Mbps

### Software Necessário
- Sistema Operacional: Windows 10/11 ou Windows Server 2019+
- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)
- Navegador Web moderno (Chrome, Firefox, Edge)

---

## INSTALAÇÃO DO AMBIENTE

### PASSO 1: Verificar Instalação do Python

Abra o PowerShell ou CMD e execute:

```powershell
python --version
```

**Resultado esperado:**
```
Python 3.x.x
```

**Se o Python não estiver instalado:**

1. Acesse: https://www.python.org/downloads/
2. Baixe a versão mais recente do Python 3
3. Durante a instalação, marque a opção "Add Python to PATH"
4. Clique em "Install Now"

![Instalação Python - Marcar Add to PATH]

### PASSO 2: Verificar pip

```powershell
pip --version
```

**Resultado esperado:**
```
pip 24.x.x from ...
```

### PASSO 3: Baixar o Projeto

Extraia o projeto BOSS SHOPP para um diretório, exemplo:
```
C:\boss-shopp\
```

### PASSO 4: Instalar Dependências do Backend

Navegue até a pasta do backend:

```powershell
cd "C:\boss-shopp\PI3 (2)\PI3 (1)\PI3\PI2\backend"
```

Instale as dependências:

```powershell
pip install -r requirements.txt
```

**Principais pacotes instalados:**
- Django 5.2.3
- djangorestframework
- django-cors-headers
- Pillow (para imagens)
- python-decouple (configurações)

**Tempo estimado:** 2-5 minutos

---

## CONFIGURAÇÃO DO BANCO DE DADOS

### PASSO 5: Criar o Banco de Dados SQLite

O projeto usa SQLite, que não requer instalação adicional.

Execute o script de criação do banco:

```powershell
cd "C:\boss-shopp\PI3 (2)\PI3 (1)\PI3"
python create_database_sqlite.py
```

**Resultado esperado:**
```
Successfully connected to SQLite database: bossshopp_complete.db
Creating tables...
All tables created successfully!
Inserting initial data...
Initial data inserted successfully!

==================================================
DATABASE SETUP COMPLETED SUCCESSFULLY!
==================================================
Database file: bossshopp_complete.db
Tables created: 17
Initial categories: 6
Initial products: 24
Admin user: admin@bossshopp.com / password
==================================================
```

### PASSO 6: Executar Migrações do Django

Volte para a pasta do backend:

```powershell
cd "C:\boss-shopp\PI3 (2)\PI3 (1)\PI3\PI2\backend"
```

Execute as migrações:

```powershell
python manage.py makemigrations
python manage.py migrate
```

**Resultado esperado:**
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
```

### PASSO 7: Criar Superusuário (Opcional)

```powershell
python manage.py createsuperuser
```

Preencha os dados solicitados:
- Username: admin
- Email: admin@bossshopp.com
- Password: (sua senha segura)

---

## IMPLANTAÇÃO DO BACKEND (DJANGO)

### PASSO 8: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend`:

```powershell
cd "C:\boss-shopp\PI3 (2)\PI3 (1)\PI3\PI2\backend"
notepad .env
```

Adicione as seguintes configurações:

```env
SECRET_KEY=django-insecure-sua-chave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,10.160.216.66
CORS_ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000,http://10.160.216.66:8000
DATABASE_URL=sqlite:///bossshopp_complete.db
```

**IMPORTANTE:** Em produção, altere `DEBUG=False` e gere uma nova `SECRET_KEY`.

### PASSO 9: Coletar Arquivos Estáticos

```powershell
python manage.py collectstatic --noinput
```

### PASSO 10: Iniciar o Servidor Django

**Para acesso local apenas:**
```powershell
python manage.py runserver
```

**Para acesso na rede local:**
```powershell
python manage.py runserver 0.0.0.0:8000
```

**Resultado esperado:**
```
Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
December 01, 2025 - 16:40:00
Django version 5.2.3, using settings 'boss_shopp.settings'
Starting development server at http://0.0.0.0:8000/
Quit the server with CTRL-BREAK.
```

**O servidor está rodando!**

---

## IMPLANTAÇÃO DO FRONTEND

### PASSO 11: Configurar Frontend

O frontend é composto por arquivos HTML, CSS e JavaScript estáticos.

Localização dos arquivos:
```
C:\boss-shopp\PI3 (2)\PI3 (1)\PI3\PI2\frontend\
```

### PASSO 12: Servir Frontend

**Opção 1: Usar o próprio Django (Recomendado para desenvolvimento)**

O Django já serve os arquivos estáticos quando em modo DEBUG.

**Opção 2: Usar um servidor web separado**

Para produção, use IIS ou Apache:

#### Configuração com IIS (Windows Server):

1. Abra o Gerenciador do IIS
2. Clique com botão direito em "Sites" → "Adicionar Site"
3. Configure:
   - Nome do site: BOSS SHOPP Frontend
   - Caminho físico: `C:\boss-shopp\PI3 (2)\PI3 (1)\PI3\PI2\frontend`
   - Porta: 80 ou 8080
4. Clique em "OK"

### PASSO 13: Configurar URLs da API no Frontend

Edite os arquivos JavaScript do frontend para apontar para o backend:

```javascript
const API_URL = 'http://10.160.216.66:8000/api';
```

Substitua `10.160.216.66` pelo IP do servidor onde o Django está rodando.

---

## CONFIGURAÇÃO DE REDE E FIREWALL

### PASSO 14: Descobrir IP do Servidor

```powershell
ipconfig
```

Procure por "Endereço IPv4" na seção do adaptador de rede ativo.

**Exemplo de resultado:**
```
Adaptador Ethernet Ethernet:
   Endereço IPv4. . . . . . . . . . . . . : 10.160.216.66
   Máscara de Sub-rede . . . . . . . . . : 255.255.255.0
   Gateway Padrão. . . . . . . . . . . . : 10.160.216.1
```

### PASSO 15: Liberar Porta no Firewall

**Abra o PowerShell como Administrador** (botão direito → Executar como administrador)

Execute:

```powershell
netsh advfirewall firewall add rule name="Django Server Port 8000" dir=in action=allow protocol=TCP localport=8000
```

**Resultado esperado:**
```
Ok.
```

**Verificar regra criada:**

```powershell
netsh advfirewall firewall show rule name="Django Server Port 8000"
```

### PASSO 16: Configurar ALLOWED_HOSTS no Django

Edite o arquivo `settings.py`:

```powershell
notepad "C:\boss-shopp\PI3 (2)\PI3 (1)\PI3\PI2\backend\boss_shopp\settings.py"
```

Localize a linha `ALLOWED_HOSTS` e adicione o IP do servidor:

```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '10.160.216.66', '*']
```

**IMPORTANTE:** O `'*'` permite qualquer host (use apenas em desenvolvimento).

Salve e reinicie o servidor Django.

---

## TESTES DE FUNCIONAMENTO

### PASSO 17: Testar Acesso Local

Abra o navegador e acesse:

```
http://localhost:8000
```

ou

```
http://127.0.0.1:8000
```

**Resultado esperado:** Página inicial do BOSS SHOPP carregada.

### PASSO 18: Testar API

Acesse:

```
http://localhost:8000/api/
```

**Resultado esperado:** Interface da API Django REST Framework.

### PASSO 19: Testar Admin

Acesse:

```
http://localhost:8000/admin/
```

Faça login com:
- Usuário: admin@bossshopp.com
- Senha: password (ou a senha que você criou)

**Resultado esperado:** Painel administrativo do Django.

### PASSO 20: Testar Acesso na Rede

De outro computador na mesma rede, acesse:

```
http://10.160.216.66:8000
```

(Substitua pelo IP do seu servidor)

**Resultado esperado:** Página inicial do BOSS SHOPP carregada.

---

## TROUBLESHOOTING

### Problema 1: "Python não é reconhecido"

**Solução:**
1. Reinstale o Python marcando "Add to PATH"
2. Ou adicione manualmente ao PATH:
   - Painel de Controle → Sistema → Configurações avançadas
   - Variáveis de Ambiente → PATH
   - Adicione: `C:\Python3x\` e `C:\Python3x\Scripts\`

### Problema 2: "Port 8000 already in use"

**Solução:**
```powershell
# Encontrar processo usando a porta
netstat -ano | findstr :8000

# Matar o processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F

# Ou use outra porta
python manage.py runserver 0.0.0.0:8001
```

### Problema 3: "DisallowedHost at /"

**Solução:**
Adicione o IP/domínio em `ALLOWED_HOSTS` no `settings.py`:

```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'seu-ip-aqui']
```

### Problema 4: Não consegue acessar da rede

**Checklist:**
1. ✓ Servidor está rodando com `0.0.0.0:8000`?
2. ✓ Firewall liberou a porta 8000?
3. ✓ IP está correto em ALLOWED_HOSTS?
4. ✓ Computadores estão na mesma rede?
5. ✓ Antivírus não está bloqueando?

### Problema 5: Erro de CORS no Frontend

**Solução:**
Verifique `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://10.160.216.66:8000",
]

# Ou para desenvolvimento:
CORS_ALLOW_ALL_ORIGINS = True
```

### Problema 6: Banco de dados não encontrado

**Solução:**
```powershell
# Verifique se o arquivo existe
dir bossshopp_complete.db

# Se não existir, execute novamente
python create_database_sqlite.py

# Execute as migrações
python manage.py migrate
```

---

## IMPLANTAÇÃO EM PRODUÇÃO

### Usando Gunicorn (Linux) ou Waitress (Windows)

**Para Windows, instale Waitress:**

```powershell
pip install waitress
```

**Execute:**

```powershell
waitress-serve --host=0.0.0.0 --port=8000 boss_shopp.wsgi:application
```

### Configurações de Produção

No arquivo `.env`, altere:

```env
DEBUG=False
SECRET_KEY=gere-uma-chave-secreta-forte-aqui
ALLOWED_HOSTS=seu-dominio.com,www.seu-dominio.com
```

**Gerar SECRET_KEY:**

```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## MANUTENÇÃO

### Backup do Banco de Dados

```powershell
# Copiar arquivo SQLite
copy bossshopp_complete.db bossshopp_complete_backup_YYYYMMDD.db
```

### Logs do Django

Os logs são exibidos no console onde o servidor está rodando.

Para salvar em arquivo:

```powershell
python manage.py runserver 0.0.0.0:8000 > logs.txt 2>&1
```

### Atualizar Dependências

```powershell
pip install --upgrade -r requirements.txt
```

---

## INFORMAÇÕES DE CONTATO

**Sistema:** BOSS SHOPP E-commerce  
**Versão:** 1.0  
**Framework:** Django 5.2.3  
**Banco de Dados:** SQLite  

**Credenciais Padrão:**
- Admin: admin@bossshopp.com / password

**Portas Utilizadas:**
- Backend API: 8000
- Frontend: 80 ou 8080 (se usar IIS)

---

## CHECKLIST DE IMPLANTAÇÃO

- [ ] Python 3.8+ instalado
- [ ] Dependências instaladas (pip install -r requirements.txt)
- [ ] Banco de dados criado (create_database_sqlite.py)
- [ ] Migrações executadas (python manage.py migrate)
- [ ] Variáveis de ambiente configuradas (.env)
- [ ] Arquivos estáticos coletados (collectstatic)
- [ ] Firewall configurado (porta 8000 liberada)
- [ ] ALLOWED_HOSTS configurado
- [ ] Servidor Django iniciado
- [ ] Testes de acesso local realizados
- [ ] Testes de acesso na rede realizados
- [ ] Backup do banco de dados criado

---

**Documentação criada em:** 01/12/2025  
**Última atualização:** 01/12/2025  
**Responsável:** Equipe de Infraestrutura BOSS SHOPP
