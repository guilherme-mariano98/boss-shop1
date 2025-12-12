@echo off
echo ═══════════════════════════════════════════════════════════════════
echo   BOSS SHOPP - Configurar Firewall para Rede de Dominio
echo ═══════════════════════════════════════════════════════════════════
echo.
echo IMPORTANTE: Execute este arquivo como ADMINISTRADOR!
echo (Clique com botao direito e selecione "Executar como administrador")
echo.
pause
echo.

echo Removendo regras antigas...
netsh advfirewall firewall delete rule name="BOSS SHOPP Frontend" >nul 2>&1
netsh advfirewall firewall delete rule name="BOSS SHOPP API" >nul 2>&1
netsh advfirewall firewall delete rule name="BOSS SHOPP" >nul 2>&1

echo.
echo Adicionando regra para porta 8000 (TODOS OS PERFIS)...
netsh advfirewall firewall add rule name="BOSS SHOPP Frontend" dir=in action=allow protocol=TCP localport=8000 profile=domain,private,public

if %errorlevel% equ 0 (
    echo [OK] Regra para porta 8000 adicionada!
) else (
    echo [ERRO] Falhou! Voce executou como Administrador?
    pause
    exit /b 1
)

echo.
echo Adicionando regra para porta 8001 (TODOS OS PERFIS)...
netsh advfirewall firewall add rule name="BOSS SHOPP API" dir=in action=allow protocol=TCP localport=8001 profile=domain,private,public

if %errorlevel% equ 0 (
    echo [OK] Regra para porta 8001 adicionada!
) else (
    echo [ERRO] Falhou! Voce executou como Administrador?
    pause
    exit /b 1
)

echo.
echo Verificando regras criadas...
netsh advfirewall firewall show rule name="BOSS SHOPP Frontend"
echo.
netsh advfirewall firewall show rule name="BOSS SHOPP API"

echo.
echo ═══════════════════════════════════════════════════════════════════
echo   SUCESSO! Firewall configurado para rede de dominio!
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Agora acesse de outro computador:
echo   http://10.160.216.59:8000
echo.
echo IMPORTANTE: Se ainda nao funcionar, pode ser que a rede do SENAC
echo tenha restricoes que impedem comunicacao entre computadores.
echo.
echo ═══════════════════════════════════════════════════════════════════
pause
