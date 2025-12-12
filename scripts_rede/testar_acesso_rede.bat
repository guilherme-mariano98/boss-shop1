@echo off
chcp 65001 >nul
echo ========================================
echo BOSS SHOPP - Teste de Acesso via Rede
echo ========================================
echo.

echo [1/5] Verificando IP da máquina...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    set IP=%%a
    set IP=!IP: =!
    echo ✓ IP encontrado: !IP!
)
echo.

echo [2/5] Verificando se as portas estão em uso...
echo.
netstat -an | findstr "8000" >nul
if %errorlevel% equ 0 (
    echo ✓ Porta 8000 está em uso
) else (
    echo ✗ Porta 8000 NÃO está em uso - Inicie o servidor frontend!
)

netstat -an | findstr "8001" >nul
if %errorlevel% equ 0 (
    echo ✓ Porta 8001 está em uso
) else (
    echo ✗ Porta 8001 NÃO está em uso - Inicie o servidor API!
)
echo.

echo [3/5] Verificando regras do firewall...
echo.
netsh advfirewall firewall show rule name="BOSS SHOPP Frontend" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Regra do firewall para Frontend encontrada
) else (
    echo ✗ Regra do firewall para Frontend NÃO encontrada
    echo   Execute: enable_network_access.bat como Administrador
)

netsh advfirewall firewall show rule name="BOSS SHOPP API Server" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Regra do firewall para API Server encontrada
) else (
    echo ✗ Regra do firewall para API Server NÃO encontrada
    echo   Execute: enable_network_access.bat como Administrador
)
echo.

echo [4/5] Testando acesso local...
echo.
curl -s http://localhost:8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Frontend acessível localmente
) else (
    echo ✗ Frontend NÃO acessível - Verifique se o servidor está rodando
)

curl -s http://localhost:8001/api/stats >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ API Server acessível localmente
) else (
    echo ✗ API Server NÃO acessível - Verifique se o servidor está rodando
)
echo.

echo [5/5] Informações de acesso via rede:
echo.
echo Para acessar de outro computador na mesma rede, use:
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4" ^| findstr /V "127.0.0.1"') do (
    set IP=%%a
    set IP=!IP: =!
    echo   Frontend: http://!IP!:8000
    echo   API:      http://!IP!:8001
    echo.
)

echo ========================================
echo Teste concluído!
echo ========================================
echo.
echo Próximos passos:
echo 1. Se alguma verificação falhou, corrija o problema
echo 2. Inicie os servidores com: start-all-services.bat
echo 3. Configure o firewall com: enable_network_access.bat (como Admin)
echo 4. Acesse de outro computador usando os URLs acima
echo.
pause
