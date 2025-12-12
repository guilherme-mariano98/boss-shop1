# CHECKLIST DE IMPLANTAÇÃO - BOSS SHOPP

**Chamado:** #4  
**Analista:** Infraestrutura  
**Data:** 01/12/2025  
**Hora Abertura:** 16h40min  
**Prazo:** 1 hora  
**Prioridade:** Média

---

## PRÉ-INSTALAÇÃO

### Verificações Iniciais
- [ ] Sistema Operacional: Windows 10/11 ou Server 2019+
- [ ] Memória RAM disponível: Mínimo 4GB
- [ ] Espaço em disco: Mínimo 10GB livres
- [ ] Conexão de rede ativa
- [ ] Permissões de administrador disponíveis

### Software Base
- [ ] Python 3.8+ instalado
- [ ] pip instalado e funcionando
- [ ] Navegador web moderno instalado
- [ ] Editor de texto (Notepad++ ou VS Code)

---

## INSTALAÇÃO

### Etapa 1: Preparação do Ambiente
- [ ] Projeto extraído no diretório correto
- [ ] PowerShell ou CMD aberto
- [ ] Navegado até a pasta do projeto

### Etapa 2: Instalação de Dependências
- [ ] Executado: `pip install -r requirements.txt`
- [ ] Todas as dependências instaladas sem erros
- [ ] Django 5.2.3 instalado
- [ ] djangorestframework instalado
- [ ] django-cors-headers instalado

### Etapa 3: Banco de Dados
- [ ] Executado: `python create_database_sqlite.py`
- [ ] Arquivo `bossshopp_complete.db` criado
- [ ] 17 tabelas criadas
- [ ] 6 categorias inseridas
- [ ] 24 produtos inseridos
- [ ] Usuário admin criado

### Etapa 4: Migrações Django
- [ ] Executado: `python manage.py makemigrations`
- [ ] Executado: `python manage.py migrate`
- [ ] Migrações aplicadas sem erros

### Etapa 5: Arquivos Estáticos
- [ ] Executado: `python manage.py collectstatic`
- [ ] Arquivos coletados com sucesso

---

## CONFIGURAÇÃO

### Configuração de Rede
- [ ] IP do servidor identificado (comando: `ipconfig`)
- [ ] IP anotado: ___________________
- [ ] Porta 8000 disponível

### Configuração do Django
- [ ] Arquivo `.env` criado (se necessário)
- [ ] `ALLOWED_HOSTS` configurado com IPs corretos
- [ ] `CORS_ALLOWED_ORIGINS` configurado
- [ ] `DEBUG` configurado apropriadamente

### Firewall
- [ ] PowerShell aberto como Administrador
- [ ] Regra de firewall criada para porta 8000
- [ ] Regra verificada e ativa
- [ ] Comando executado:
  ```
  netsh advfirewall firewall add rule name="BOSS SHOPP Django Server" dir=in action=allow protocol=TCP localport=8000
  ```

---

## INICIALIZAÇÃO

### Servidor Backend
- [ ] Navegado até pasta `backend`
- [ ] Servidor iniciado: `python manage.py runserver 0.0.0.0:8000`
- [ ] Mensagem de sucesso exibida
- [ ] Servidor rodando sem erros
- [ ] Porta 8000 em uso pelo Django

### Verificação de Logs
- [ ] Logs do servidor sendo exibidos
- [ ] Sem mensagens de erro críticas
- [ ] Sistema de reload automático ativo

---

## TESTES

### Testes Locais
- [ ] Acesso a `http://localhost:8000` funcionando
- [ ] Acesso a `http://127.0.0.1:8000` funcionando
- [ ] Página inicial carregando corretamente
- [ ] Imagens e CSS carregando

### Testes de API
- [ ] Acesso a `http://localhost:8000/api/` funcionando
- [ ] Interface DRF (Django REST Framework) exibida
- [ ] Endpoints listados corretamente

### Testes de Admin
- [ ] Acesso a `http://localhost:8000/admin/` funcionando
- [ ] Login com admin@bossshopp.com / password bem-sucedido
- [ ] Painel administrativo carregado
- [ ] Modelos visíveis (Users, Products, Categories, etc.)

### Testes de Rede
- [ ] IP do servidor confirmado: ___________________
- [ ] Acesso de outro computador testado
- [ ] URL testada: `http://___________________:8000`
- [ ] Página carregando de outro dispositivo
- [ ] Sem erros de CORS
- [ ] Sem erros de DisallowedHost

### Testes Funcionais
- [ ] Navegação entre páginas funcionando
- [ ] Listagem de produtos funcionando
- [ ] Detalhes de produtos carregando
- [ ] Carrinho de compras operacional (se implementado)
- [ ] Formulários funcionando

---

## DOCUMENTAÇÃO

### Documentos Criados
- [ ] DOCUMENTACAO_INSTALACAO.md
- [ ] GUIA_RAPIDO.md
- [ ] CHECKLIST_IMPLANTACAO.md (este arquivo)
- [ ] README.md atualizado

### Scripts Criados
- [ ] install.bat (instalação automatizada)
- [ ] start_server.bat (iniciar servidor)
- [ ] configure_firewall.bat (configurar firewall)
- [ ] deploy.bat (deploy completo)

### Informações Documentadas
- [ ] IP do servidor
- [ ] Porta utilizada
- [ ] Credenciais de admin
- [ ] Estrutura de pastas
- [ ] Comandos principais

---

## PÓS-IMPLANTAÇÃO

### Backup
- [ ] Backup do banco de dados criado
- [ ] Backup dos arquivos de configuração
- [ ] Local do backup documentado: ___________________

### Segurança
- [ ] Senha do admin alterada (se em produção)
- [ ] SECRET_KEY alterada (se em produção)
- [ ] DEBUG=False (se em produção)
- [ ] ALLOWED_HOSTS restrito (se em produção)

### Monitoramento
- [ ] Logs sendo salvos
- [ ] Processo de monitoramento definido
- [ ] Responsável pelo monitoramento: ___________________

### Treinamento
- [ ] Equipe treinada para acessar o sistema
- [ ] Documentação entregue
- [ ] Dúvidas esclarecidas

---

## VALIDAÇÃO FINAL

### Checklist de Entrega
- [ ] Sistema acessível localmente
- [ ] Sistema acessível na rede
- [ ] Admin funcionando
- [ ] API funcionando
- [ ] Frontend funcionando
- [ ] Documentação completa entregue
- [ ] Scripts de automação entregues
- [ ] Testes realizados com sucesso

### Informações de Acesso

**URLs de Acesso:**
- Local: http://localhost:8000
- Rede: http://___________________:8000
- Admin: http://localhost:8000/admin

**Credenciais:**
- Usuário: admin@bossshopp.com
- Senha: password (ALTERAR EM PRODUÇÃO)

**Informações Técnicas:**
- Framework: Django 5.2.3
- Banco de Dados: SQLite
- Porta: 8000
- IP do Servidor: ___________________

---

## ASSINATURAS

**Responsável pela Instalação:**

Nome: _______________________________  
Data: _______________________________  
Hora: _______________________________  
Assinatura: _______________________________

**Responsável pela Validação:**

Nome: _______________________________  
Data: _______________________________  
Hora: _______________________________  
Assinatura: _______________________________

---

## OBSERVAÇÕES

_____________________________________________________________________

_____________________________________________________________________

_____________________________________________________________________

_____________________________________________________________________

_____________________________________________________________________

---

## PRÓXIMOS PASSOS

- [ ] Configurar backup automático
- [ ] Implementar monitoramento
- [ ] Configurar SSL/HTTPS (se necessário)
- [ ] Migrar para servidor de produção (se necessário)
- [ ] Configurar domínio personalizado (se necessário)
- [ ] Implementar CI/CD (se necessário)

---

**Status do Chamado:** ⬜ Em Andamento  ⬜ Concluído  ⬜ Pendente

**Tempo Total de Implantação:** __________ minutos

**Chamado Fechado em:** ___/___/_____ às ___:___
