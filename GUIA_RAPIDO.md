# GUIA RÁPIDO DE INSTALAÇÃO - BOSS SHOPP

## Instalação em 5 Minutos

### 1. Pré-requisitos
```powershell
python --version  # Deve ser 3.8+
pip --version
```

### 2. Instalar Dependências
```powershell
cd "caminho\para\PI3 (2)\PI3 (1)\PI3\PI2\backend"
pip install -r requirements.txt
```

### 3. Criar Banco de Dados
```powershell
cd ..\..\
python create_database_sqlite.py
```

### 4. Executar Migrações
```powershell
cd PI2\backend
python manage.py migrate
```

### 5. Iniciar Servidor
```powershell
python manage.py runserver 0.0.0.0:8000
```

### 6. Acessar
- Local: http://localhost:8000
- Rede: http://SEU_IP:8000
- Admin: http://localhost:8000/admin
  - Usuário: admin@bossshopp.com
  - Senha: password

---

## Comandos Úteis

### Descobrir seu IP
```powershell
ipconfig
```

### Liberar Firewall (como Admin)
```powershell
netsh advfirewall firewall add rule name="Django 8000" dir=in action=allow protocol=TCP localport=8000
```

### Parar Servidor
```
CTRL + C
```

### Ver Logs
O servidor mostra logs em tempo real no console.

---

## Estrutura de Pastas

```
PI3 (2)/PI3 (1)/PI3/
├── create_database_sqlite.py    # Script de criação do BD
├── bossshopp_complete.db         # Banco de dados SQLite
└── PI2/
    ├── backend/                  # Django Backend
    │   ├── manage.py
    │   ├── boss_shopp/          # Configurações
    │   ├── api/                 # API REST
    │   └── requirements.txt     # Dependências
    └── frontend/                 # HTML/CSS/JS
        ├── index.html
        ├── nossa-historia.html
        └── assets/
```

---

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Porta 8000 em uso | `taskkill /F /IM python.exe` |
| Python não encontrado | Adicionar ao PATH |
| Não acessa da rede | Liberar firewall |
| DisallowedHost | Adicionar IP em ALLOWED_HOSTS |

---

## Contatos de Suporte

**Chamado:** #4  
**Prioridade:** Média  
**Prazo:** 1 hora  
**Abertura:** 16h40min
