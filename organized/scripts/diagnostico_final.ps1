# BOSS SHOPP - Diagnóstico Final Completo
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  BOSS SHOPP - DIAGNÓSTICO FINAL" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# 1. IP da máquina
Write-Host "[1] IP da Máquina:" -ForegroundColor Yellow
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "172.*"} | Select-Object -First 1).IPAddress
Write-Host "    IP: $localIP" -ForegroundColor Green
Write-Host ""

# 2. Portas em uso
Write-Host "[2] Portas em Uso:" -ForegroundColor Yellow
$port8000 = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
$port8001 = Get-NetTCPConnection -LocalPort 8001 -State Listen -ErrorAction SilentlyContinue

if ($port8000) {
    Write-Host "    ✓ Porta 8000: ABERTA (PID: $($port8000.OwningProcess))" -ForegroundColor Green
} else {
    Write-Host "    ✗ Porta 8000: FECHADA" -ForegroundColor Red
}

if ($port8001) {
    Write-Host "    ✓ Porta 8001: ABERTA (PID: $($port8001.OwningProcess))" -ForegroundColor Green
} else {
    Write-Host "    ✗ Porta 8001: FECHADA" -ForegroundColor Red
}
Write-Host ""

# 3. Teste de conexão local
Write-Host "[3] Teste de Conexão Local:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "    ✓ localhost:8000 → Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "    ✗ localhost:8000 → FALHOU" -ForegroundColor Red
}
Write-Host ""

# 4. Teste de conexão via IP
Write-Host "[4] Teste de Conexão via IP:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://${localIP}:8000" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "    ✓ ${localIP}:8000 → Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "    ✗ ${localIP}:8000 → FALHOU: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 5. Firewall
Write-Host "[5] Status do Firewall:" -ForegroundColor Yellow
$firewallProfiles = Get-NetFirewallProfile
foreach ($profile in $firewallProfiles) {
    $status = if ($profile.Enabled) { "LIGADO" } else { "DESLIGADO" }
    $color = if ($profile.Enabled) { "Red" } else { "Green" }
    Write-Host "    $($profile.Name): $status" -ForegroundColor $color
}
Write-Host ""

# 6. Regras do Firewall
Write-Host "[6] Regras do Firewall para BOSS SHOPP:" -ForegroundColor Yellow
$rules = Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*BOSS*"}
if ($rules) {
    foreach ($rule in $rules) {
        Write-Host "    ✓ $($rule.DisplayName) - Habilitada: $($rule.Enabled)" -ForegroundColor Green
    }
} else {
    Write-Host "    ✗ Nenhuma regra encontrada" -ForegroundColor Red
}
Write-Host ""

# 7. Teste de porta
Write-Host "[7] Teste de Conectividade de Porta:" -ForegroundColor Yellow
$portTest = Test-NetConnection -ComputerName $localIP -Port 8000 -WarningAction SilentlyContinue
if ($portTest.TcpTestSucceeded) {
    Write-Host "    ✓ Porta 8000 acessível via $localIP" -ForegroundColor Green
} else {
    Write-Host "    ✗ Porta 8000 NÃO acessível via $localIP" -ForegroundColor Red
}
Write-Host ""

# 8. Informações de rede
Write-Host "[8] Informações de Rede:" -ForegroundColor Yellow
$adapter = Get-NetAdapter | Where-Object {$_.Status -eq "Up" -and $_.Name -notlike "*Loopback*"} | Select-Object -First 1
Write-Host "    Adaptador: $($adapter.Name)" -ForegroundColor Cyan
Write-Host "    Status: $($adapter.Status)" -ForegroundColor Cyan
Write-Host ""

# RESUMO
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  RESUMO E RECOMENDAÇÕES" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "URLs de Acesso:" -ForegroundColor Yellow
Write-Host "  Local:  http://localhost:8000" -ForegroundColor White
Write-Host "  Rede:   http://${localIP}:8000" -ForegroundColor White
Write-Host ""

# Verificar problemas
$problems = @()

if (-not $port8000) {
    $problems += "Servidor não está rodando na porta 8000"
}

if (-not $rules) {
    $problems += "Firewall não tem regras para BOSS SHOPP"
}

if ($firewallProfiles | Where-Object {$_.Enabled}) {
    if (-not $rules) {
        $problems += "Firewall está ativo mas sem regras configuradas"
    }
}

if ($problems.Count -gt 0) {
    Write-Host "⚠️ PROBLEMAS ENCONTRADOS:" -ForegroundColor Red
    foreach ($problem in $problems) {
        Write-Host "  • $problem" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "🔧 SOLUÇÃO:" -ForegroundColor Green
    Write-Host "  Execute este comando como ADMINISTRADOR:" -ForegroundColor White
    Write-Host ""
    Write-Host "  New-NetFirewallRule -DisplayName 'BOSS SHOPP' -Direction Inbound -Protocol TCP -LocalPort 8000,8001 -Action Allow -Profile Any" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✅ Tudo parece estar configurado corretamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Se ainda não funciona de outro PC:" -ForegroundColor Yellow
    Write-Host "  1. Verifique se ambos estão na mesma rede" -ForegroundColor White
    Write-Host "  2. No outro PC, teste: ping $localIP" -ForegroundColor White
    Write-Host "  3. Verifique antivírus/firewall do outro PC" -ForegroundColor White
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
pause
