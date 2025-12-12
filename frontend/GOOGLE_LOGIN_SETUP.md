# 🔐 Configuração do Login com Google - BOSS SHOPP

## 📋 Status Atual

O login com Google está implementado com **modo DEMO** funcionando. Para usar o login real do Google, siga as instruções abaixo.

## ✅ Modo DEMO (Atual)

**Funciona sem configuração!**

- Clique em "Continuar com Google"
- Login simulado é criado automaticamente
- Dados salvos no localStorage
- Redireciona para a página inicial

**Dados do usuário demo:**
- Nome: Usuário Google Demo
- Email: usuario.demo@gmail.com
- Avatar gerado automaticamente

## 🚀 Configurar Login Real com Google

### Passo 1: Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Nome sugerido: "BOSS SHOPP"

### Passo 2: Ativar Google Identity Services

1. No menu lateral, vá em **APIs e Serviços** → **Biblioteca**
2. Procure por "Google Identity Services"
3. Clique em **Ativar**

### Passo 3: Criar Credenciais OAuth 2.0

1. Vá em **APIs e Serviços** → **Credenciais**
2. Clique em **+ CRIAR CREDENCIAIS**
3. Selecione **ID do cliente OAuth**
4. Tipo de aplicativo: **Aplicativo da Web**
5. Nome: "BOSS SHOPP Web Client"

### Passo 4: Configurar Origens Autorizadas

**Origens JavaScript autorizadas:**
```
http://localhost:8000
http://127.0.0.1:8000
http://10.160.216.66:8000
```

**URIs de redirecionamento autorizados:**
```
http://localhost:8000/login.html
http://127.0.0.1:8000/login.html
http://10.160.216.66:8000/login.html
```

### Passo 5: Copiar Client ID

1. Após criar, copie o **Client ID**
2. Formato: `123456789-abc123.apps.googleusercontent.com`

### Passo 6: Atualizar o Código

**Arquivo: `login.html`**

Encontre esta linha:
```html
<meta name="google-signin-client_id" content="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
```

Substitua por:
```html
<meta name="google-signin-client_id" content="SEU_CLIENT_ID_AQUI.apps.googleusercontent.com">
```

**No script do final do arquivo, encontre:**
```javascript
client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
```

Substitua por:
```javascript
client_id: 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com',
```

### Passo 7: Testar

1. Salve as alterações
2. Recarregue a página de login
3. Clique em "Continuar com Google"
4. Faça login com sua conta Google
5. Autorize o aplicativo

## 🔧 Funcionalidades Implementadas

### Login com Google:
- ✅ Botão "Continuar com Google"
- ✅ Popup de autenticação do Google
- ✅ Recebe dados do usuário (nome, email, foto)
- ✅ Salva token no localStorage
- ✅ Redireciona para página inicial
- ✅ Atualiza ícone do usuário

### Cadastro com Google:
- ✅ Mesmo fluxo do login
- ✅ Cria conta automaticamente
- ✅ Não precisa preencher formulário

### Dados Recebidos do Google:
```javascript
{
    id: "google_user_id",
    name: "Nome Completo",
    email: "email@gmail.com",
    picture: "url_da_foto",
    provider: "google",
    email_verified: true
}
```

## 📱 Login com Facebook

**Status:** Modo DEMO implementado

Para ativar o login real com Facebook:

1. Crie um app em [Facebook Developers](https://developers.facebook.com/)
2. Configure Facebook Login
3. Adicione domínios autorizados
4. Implemente Facebook SDK no código

## 🔒 Segurança

### Boas Práticas:
- ✅ Token JWT armazenado no localStorage
- ✅ Validação de email verificado
- ✅ HTTPS recomendado para produção
- ✅ Client ID público (não é secreto)
- ⚠️ Client Secret NUNCA deve estar no frontend

### Produção:
- Use HTTPS obrigatoriamente
- Configure domínio real nas origens autorizadas
- Implemente refresh token
- Adicione logout do Google
- Valide tokens no backend

## 🧪 Testando

### Modo DEMO (Sem configuração):
```javascript
// Clique no botão "Continuar com Google"
// Login automático com dados demo
```

### Modo Real (Com configuração):
```javascript
// 1. Configure Client ID
// 2. Clique no botão
// 3. Popup do Google abre
// 4. Faça login
// 5. Autorize o app
// 6. Redirecionado automaticamente
```

## 📝 Código Importante

### Inicialização do Google:
```javascript
google.accounts.id.initialize({
    client_id: 'SEU_CLIENT_ID.apps.googleusercontent.com',
    callback: handleGoogleCallback,
    auto_select: false,
    cancel_on_tap_outside: true
});
```

### Callback do Login:
```javascript
function handleGoogleCallback(response) {
    const credential = response.credential;
    const payload = parseJwt(credential);
    
    // Processar dados do usuário
    const googleUser = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture
    };
    
    // Salvar e redirecionar
    localStorage.setItem('user', JSON.stringify(googleUser));
    window.location.href = 'index.html';
}
```

## 🐛 Troubleshooting

### Erro: "popup_closed_by_user"
**Solução:** Usuário fechou o popup. Normal.

### Erro: "access_denied"
**Solução:** Usuário negou permissão. Normal.

### Erro: "idpiframe_initialization_failed"
**Solução:** 
- Verifique se o Client ID está correto
- Verifique se a origem está autorizada
- Limpe cache do navegador

### Botão não aparece
**Solução:**
- Verifique console do navegador
- Confirme que o script do Google carregou
- Verifique Client ID

### "Invalid client"
**Solução:**
- Client ID incorreto
- Origem não autorizada no Google Cloud Console

## 📚 Documentação Oficial

- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

## ✨ Próximos Passos

1. [ ] Configurar Client ID real
2. [ ] Testar em produção com HTTPS
3. [ ] Implementar backend para validar tokens
4. [ ] Adicionar logout do Google
5. [ ] Implementar refresh token
6. [ ] Adicionar login com Facebook real
7. [ ] Adicionar mais provedores (Apple, Microsoft)

---

**Desenvolvido para BOSS SHOPP**  
**Versão 1.0 - Dezembro 2025**
