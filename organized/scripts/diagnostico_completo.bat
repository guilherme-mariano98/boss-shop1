@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════════════════
echo   BOSS SHOPP - DIAGNÓSTICO COMPLETO DE REDE
echo ═══════════════════════════════════════════════════════════════════
echo.

echo [1/8] Verificando IP da máquina...
echo.
ipconfig | findstr "IPv4"
echo.

echo [2/8] Verificando portas em uso...
echo.
netstat -ano | findstr ":8000" | findstr "LISTENING"
netstat -ano | findstr ":8001" | findstr "LISTENING"
echo.

echo [3/8] Testando acesso local (localhost)...
echo.
curl http://localhost:8000 -s -o nul -w "Status: %%{http_code}\n" --connect-timeout 5
echo.

echo [4/8] Testando acesso via IP local...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4" ^| findstr /V "127.0.0.1"') do (
    set IP=%%a
    set IP=!IP: =!
    echo Testando: http://!IP!:8000
    curl http://!IP!:8000 -s -o nul -w "Status: %%{http_code}\n" --connect-timeout 5
)
echo.

echo [5/8] Verificando regras do firewall...
echo.
netsh advfirewall firewall show rule name="BOSS SHOPP Frontend" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Regra "BOSS SHOPP Frontend" encontrada
) else (
    echo ✗ Regra "BOSS SHOPP Frontend" NÃO encontrada
)

netsh advfirewall firewall show rule name="BOSS SHOPP API" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Regra "BOSS SHOPP API" encontrada
) else (
    echo ✗ Regra "BOSS SHOPP API" NÃO encontrada
)
echo.

echo [6/8] Verificando status do firewall...
echo.
netsh advfirewall show allprofiles state | findstr "Estado"
echo.

echo [7/8] Verificando processos dos servidores...
echo.
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo Porta 8000 - PID: %%a
    tasklist /FI "PID eq %%a" /FO TABLE /NH
)
echo.

echo [8/8] Informações de rede...
echo.
ipconfig | findstr /C:"Adaptador" /C:"IPv4" /C:"Gateway"
echo.

echo ═══════════════════════════════════════════════════════════════════
echo   RESUMO DO DIAGNÓSTICO
echo ═══════════════════════════════════════════════════════════════════
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4" ^| findstr /V "127.0.0.1"') do (
    set IP=%%a
    set IP=!IP: =!
    echo IP para acesso via rede: !IP!
    echo.
    echo URLs de acesso:
    echo   Frontend: http://!IP!:8000
    echo   API:      http://!IP!:8001
    echo.
)

echo ═══════════════════════════════════════════════════════════════════
echo   INSTRUÇÕES PARA OUTRO COMPUTADOR
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 1. Certifique-se que o outro computador está na MESMA REDE
echo.
echo 2. No outro computador, abra o CMD e execute:
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4" ^| findstr /V "127.0.0.1"') do (
    set IP=%%a
    set IP=!IP: =!
    echo    ping !IP!
    echo.
    echo    Se o ping funcionar, tente acessar no navegador:
    echo    http://!IP!:8000
)
echo.
echo 3. Se não funcionar, execute este script como ADMINISTRADOR:
echo    enable_network_access.bat
echo.

echo ═══════════════════════════════════════════════════════════════════
pause
