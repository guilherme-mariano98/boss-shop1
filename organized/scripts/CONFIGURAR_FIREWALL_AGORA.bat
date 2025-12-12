@echo off
echo ═══════════════════════════════════════════════════════════════════
echo   BOSS SHOPP - Configurando Firewall
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Este script vai adicionar regras no firewall do Windows.
echo.
echo IMPORTANTE: Clique com BOTAO DIREITO neste arquivo e selecione
echo "Executar como administrador"
echo.
echo Se voce NAO executou como administrador, feche e execute novamente!
echo.
pause
echo.

echo Adicionando regra para porta 8000...
netsh advfirewall firewall delete rule name="BOSS SHOPP Frontend" >nul 2>&1
netsh advfirewall firewall add rule name="BOSS SHOPP Frontend" dir=in action=allow protocol=TCP localport=8000 profile=any

if %errorlevel% equ 0 (
    echo [OK] Regra para porta 8000 adicionada!
) else (
    echo [ERRO] Nao foi possivel adicionar regra. Execute como Administrador!
    pause
    exit /b 1
)

echo.
echo Adicionando regra para porta 8001...
netsh advfirewall firewall delete rule name="BOSS SHOPP API" >nul 2>&1
netsh advfirewall firewall add rule name="BOSS SHOPP API" dir=in action=allow protocol=TCP localport=8001 profile=any

if %errorlevel% equ 0 (
    echo [OK] Regra para porta 8001 adicionada!
) else (
    echo [ERRO] Nao foi possivel adicionar regra. Execute como Administrador!
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo   SUCESSO! Firewall configurado!
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Agora acesse de outro computador:
echo.
echo   http://10.160.216.59:8000
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause
