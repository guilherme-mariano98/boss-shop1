@echo off
chcp 65001 >nul
echo ========================================
echo BOSS SHOPP - Enable Network Access
echo ========================================
echo.
echo Este script adicionará regras no firewall para permitir
echo acesso aos servidores BOSS SHOPP de outros computadores na rede.
echo.
echo Pressione qualquer tecla para continuar ou Ctrl+C para cancelar...
pause >nul

echo.
echo Adicionando regra do firewall para Frontend (porta 8000)...
netsh advfirewall firewall add rule name="BOSS SHOPP Frontend" dir=in action=allow protocol=TCP localport=8000

echo.
echo Adicionando regra do firewall para API Server (porta 8001)...
netsh advfirewall firewall add rule name="BOSS SHOPP API Server" dir=in action=allow protocol=TCP localport=8001

echo.
echo ========================================
echo Regras do firewall adicionadas com sucesso!
echo ========================================
echo.
echo Para acessar BOSS SHOPP de outros dispositivos na rede, use:
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4" ^| findstr /V "127.0.0.1"') do (
    set IP=%%a
    set IP=!IP: =!
    echo   Frontend: http://!IP!:8000
    echo   API:      http://!IP!:8001
    echo.
)

echo ========================================
echo.
echo Próximos passos:
echo 1. Inicie os servidores: start-all-services.bat
echo 2. Acesse de outro computador usando os URLs acima
echo.
pause
