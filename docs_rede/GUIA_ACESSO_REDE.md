# 🌐 GUIA DE ACESSO VIA REDE LOCAL - BOSS SHOPP

## 📋 Informações da Rede

**IP Atual da Máquina:** `10.160.216.59`

**Portas Utilizadas:**
- Frontend (Node.js): `8000`
- API Server (Python): `8001`
- Backend Django: `8000` (alternativo)

---

## 🚀 PASSO A PASSO PARA CONFIGURAR ACESSO VIA REDE

### 1️⃣ Configurar Firewall do Windows

Execute o script de configuração do firewall **como Administrador**:

```cmd
# Clique com botão direito e selecione "Executar como Administrador"
enable_network_access.bat
```

Ou execute manualmente os comandos no PowerShell (como Administrador):

```powershell
# Adicionar regra para o servidor Frontend (porta 8000)
netsh advfirewall firewall add rule name="BOSS SHOPP Frontend" dir=in action=allow protocol=TCP localport=8000

# Adicionar regra para o servidor API (porta 8001)
netsh advfirewall firewall add rule name="BOSS SHOPP API Server" dir=in action=allow protocol=TCP localport=8001
```

### 2️⃣ Verificar Configuração dos Servidores

Os servidores já estão configurados para aceitar conexões de rede:

✅ **Frontend Server (server.js)** - Escuta em `0.0.0.0:8000`
✅ **API Server (api_server.py)** - Escuta em `0.0.0.0:8001`
✅ **Django Backend** - Escuta em `0.0.0.0:8000`

### 3️⃣ Iniciar os Servidores

**Opção A - Iniciar todos os serviços:**
```cmd
cd "PI3 (1)\PI3\PI2"
start-all-services.bat
```

**Opção B - Iniciar serviços individualmente:**

Terminal 1 - Frontend:
```cmd
cd "PI3 (1)\PI3\PI2\frontend"
node server.js
```

Terminal 2 - API Server:
```cmd
cd "PI3 (1)\PI3\PI2"
python api_server.py
```

### 4️⃣ Acessar de Outro Computador

De qualquer computador na **mesma rede local**, acesse:

**Frontend (Site Principal):**
```
http://10.160.216.59:8000
```

**API Server (Painel Admin):**
```
http://10.160.216.59:8001/api/stats
```

**Páginas Específicas:**
- Login: `http://10.160.216.59:8000/login.html`
- Painel Admin: `http://10.160.216.59:8000/admin-panel.html`
- Perfil: `http://10.160.216.59:8000/profile.html`

---

## 🔍 VERIFICAÇÃO E TESTES

### Verificar IP da Máquina

```cmd
ipconfig | findstr "IPv4"
```

### Testar Conectividade

**Do próprio computador:**
```cmd
curl http://localhost:8000
curl http://localhost:8001/api/stats
```

**De outro computador na rede:**
```cmd
curl http://10.160.216.59:8000
curl http://10.160.216.59:8001/api/stats
```

### Verificar Portas Abertas

```cmd
netstat -an | findstr "8000"
netstat -an | findstr "8001"
```

### Verificar Regras do Firewall

```powershell
netsh advfirewall firewall show rule name="BOSS SHOPP Frontend"
netsh advfirewall firewall show rule name="BOSS SHOPP API Server"
```

---

## 🛠️ SOLUÇÃO DE PROBLEMAS

### ❌ Problema: Não consigo acessar de outro computador

**Soluções:**

1. **Verificar se os servidores estão rodando:**
   ```cmd
   netstat -an | findstr "8000"
   netstat -an | findstr "8001"
   ```

2. **Verificar firewall:**
   - Abra "Firewall do Windows com Segurança Avançada"
   - Verifique se as regras "BOSS SHOPP Frontend" e "BOSS SHOPP API Server" estão ativas

3. **Testar temporariamente sem firewall:**
   ```powershell
   # ATENÇÃO: Apenas para teste! Reative depois!
   netsh advfirewall set allprofiles state off
   
   # Para reativar:
   netsh advfirewall set allprofiles state on
   ```

4. **Verificar se ambos os computadores estão na mesma rede:**
   - Devem estar conectados ao mesmo roteador/switch
   - Devem estar na mesma sub-rede (ex: 10.160.216.x)

5. **Verificar antivírus:**
   - Alguns antivírus bloqueiam conexões de rede
   - Adicione exceção para Node.js e Python

### ❌ Problema: IP mudou

Se o IP da máquina mudar (comum em redes DHCP):

1. Verificar novo IP:
   ```cmd
   ipconfig | findstr "IPv4"
   ```

2. Atualizar documentação e acessar com novo IP

### ❌ Problema: Porta já em uso

```cmd
# Verificar o que está usando a porta
netstat -ano | findstr "8000"

# Matar processo (substitua PID pelo número encontrado)
taskkill /PID <número_do_processo> /F
```

---

## 📱 ACESSO VIA DISPOSITIVOS MÓVEIS

Smartphones e tablets na mesma rede Wi-Fi também podem acessar:

1. Conecte o dispositivo à mesma rede Wi-Fi
2. Abra o navegador
3. Digite: `http://10.160.216.59:8000`

---

## 🔒 SEGURANÇA

⚠️ **IMPORTANTE:**

- Este servidor é para **desenvolvimento/uso local**
- **NÃO exponha para a internet** sem configurações de segurança adequadas
- Use apenas em redes confiáveis
- Para produção, configure:
  - HTTPS/SSL
  - Autenticação robusta
  - Rate limiting
  - Firewall adequado

---

## 📊 MONITORAMENTO

### Ver logs em tempo real:

**Frontend:**
```cmd
# Os logs aparecem no terminal onde você executou node server.js
```

**API Server:**
```cmd
# Os logs aparecem no terminal onde você executou python api_server.py
```

---

## 🎯 RESUMO RÁPIDO

```cmd
# 1. Configurar firewall (como Admin)
enable_network_access.bat

# 2. Iniciar servidores
cd "PI3 (1)\PI3\PI2"
start-all-services.bat

# 3. Acessar de outro computador
http://10.160.216.59:8000
```

---

## 📞 INFORMAÇÕES ADICIONAIS

**Arquivos de Configuração:**
- `frontend/server.js` - Servidor Node.js
- `api_server.py` - Servidor API Python
- `enable_network_access.bat` - Script de configuração do firewall

**Scripts Úteis:**
- `start-all-services.bat` - Inicia todos os serviços
- `stop-all-services.bat` - Para todos os serviços
- `enable_network_access.bat` - Configura firewall

---

**Última atualização:** 12/11/2025
**IP Configurado:** 10.160.216.59
