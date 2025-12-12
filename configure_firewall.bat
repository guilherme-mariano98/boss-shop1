@echo off
REM ============================================
REM Script para Configurar Firewall - BOSS SHOPP
REM EXECUTE COMO ADMINISTRADOR
REM ============================================

echo.
echo ============================================
echo   BOSS SHOPP - Configuracao de Firewall
echo ============================================
echo.
echo ATENCAO: Este script deve ser executado
echo como ADMINISTRADOR!
echo.
echo Pressione qualquer tecla para continuar...
pause > nul

echo.
echo Adicionando regra no firewall para porta 8000...
netsh advfirewall firewall add rule name="BOSS SHOPP Django Server" dir=in action=allow protocol=TCP localport=8000

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo   SUCESSO!
    echo ============================================
    echo.
    echo Regra de firewall adicionada com sucesso!
    echo A porta 8000 agora esta liberada.
    echo.
    echo Voce pode iniciar o servidor com:
    echo   start_server.bat
    echo.
) else (
    echo.
    echo ============================================
    echo   ERRO!
    echo ============================================
    echo.
    echo Falha ao adicionar regra no firewall.
    echo.
    echo Certifique-se de:
    echo 1. Executar este script como Administrador
    echo 2. O Firewall do Windows esta ativo
    echo.
)

pause
