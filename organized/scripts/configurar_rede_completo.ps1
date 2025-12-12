# BOSS SHOPP - Configuração Completa de Acesso via Rede
# Execute como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BOSS SHOPP - Configuração de Rede" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está rodando como Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERRO: Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Clique com botão direito no arquivo e selecione 'Executar como Administrador'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "✓ Executando como Administrador" -ForegroundColor Green
Write-Host ""

# Obter IP local
Write-Host "[1/4] Obtendo IP da máquina..." -ForegroundColor Yellow
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "127.*"} | Select-Object -First 1).IPAddress

if ($localIP) {
    Write-Host "✓ IP encontrado: $localIP" -ForegroundColor Green
} else {
    Write-Host "❌ Não foi possível determinar o IP local" -ForegroundColor Red
    $localIP = "SEU_IP_AQUI"
}
Write-Host ""

# Configurar regras do firewall
Write-Host "[2/4] Configurando regras do firewall..." -ForegroundColor Yellow

# Remover regras antigas se existirem
Remove-NetFirewallRule -DisplayName "BOSS SHOPP Frontend" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "BOSS SHOPP API Server" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "BOSS SHOPP Django Server" -ErrorAction SilentlyContinue

# Adicionar novas regras
try {
    New-NetFirewallRule -DisplayName "BOSS SHOPP Frontend" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow -Profile Any | Out-Null
    Write-Host "  ✓ Regra adicionada: Frontend (porta 8000)" -ForegroundColor Green
    
    New-NetFirewallRule -DisplayName "BOSS SHOPP API Server" -Direction Inbound -Protocol TCP -LocalPort 8001 -Action Allow -Profile Any | Out-Null
    Write-Host "  ✓ Regra adicionada: API Server (porta 8001)" -ForegroundColor Green
    
    New-NetFirewallRule -DisplayName "BOSS SHOPP Django Server" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow -Profile Any | Out-Null
    Write-Host "  ✓ Regra adicionada: Django Server (porta 8000)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Erro ao adicionar regras: $_" -ForegroundColor Red
}
Write-Host ""

# Verificar portas em uso
Write-Host "[3/4] Verificando portas..." -ForegroundColor Yellow
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
$port8001 = Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue

if ($port8000) {
    Write-Host "  ✓ Porta 8000 está em uso (servidor rodando)" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Porta 8000 livre (servidor não está rodando)" -ForegroundColor Yellow
}

if ($port8001) {
    Write-Host "  ✓ Porta 8001 está em uso (servidor rodando)" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Porta 8001 livre (servidor não está rodando)" -ForegroundColor Yellow
}
Write-Host ""

# Exibir informações de acesso
Write-Host "[4/4] Informações de Acesso" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "URLs para acesso via rede local:" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend:  http://$localIP:8000" -ForegroundColor Green
Write-Host "  API:       http://$localIP:8001" -ForegroundColor Green
Write-Host ""
Write-Host "Páginas específicas:" -ForegroundColor White
Write-Host "  Login:     http://$localIP:8000/login.html" -ForegroundColor Cyan
Write-Host "  Admin:     http://$localIP:8000/admin-panel.html" -ForegroundColor Cyan
Write-Host "  Perfil:    http://$localIP:8000/profile.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Instruções finais
Write-Host "PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Inicie os servidores:" -ForegroundColor White
Write-Host "   start-all-services.bat" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Acesse de outro computador na mesma rede usando os URLs acima" -ForegroundColor White
Write-Host ""
Write-Host "3. Para testar a configuração:" -ForegroundColor White
Write-Host "   testar_acesso_rede.bat" -ForegroundColor Cyan
Write-Host ""

# Criar arquivo de configuração
$configContent = @"
# BOSS SHOPP - Configuração de Rede
# Gerado automaticamente em $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")

IP_LOCAL=$localIP
PORTA_FRONTEND=8000
PORTA_API=8001

# URLs de Acesso
URL_FRONTEND=http://$localIP:8000
URL_API=http://$localIP:8001

# Status do Firewall
FIREWALL_CONFIGURADO=SIM
DATA_CONFIGURACAO=$(Get-Date -Format "dd/MM/yyyy HH:mm:ss")
"@

$configContent | Out-File -FilePath "config_rede.txt" -Encoding UTF8
Write-Host "✓ Configuração salva em: config_rede.txt" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuração concluída com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

pause
