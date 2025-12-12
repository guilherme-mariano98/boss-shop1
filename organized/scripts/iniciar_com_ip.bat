
@echo off
chcp 65001 >nul
echo ========================================
echo BOSS SHOPP - Iniciando Servidores
echo ========================================
echo.

echo Obtendo IP da máquina...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4" ^| findstr /V "127.0.0.1"') do (
    set IP=%%a
    set IP=!IP: =!
    echo.
    echo ✓ IP encontrado: !IP!
    echo.
    echo ========================================
    echo URLs de Acesso:
    echo ========================================
    echo.
    echo Local:
    echo   http://localhost:8000
    echo.
    echo Rede (outros computadores):
    echo   http://!IP!:8000
    echo   http://!IP!:8001
    echo.
    echo ========================================
    echo.
)

echo Iniciando servidores...
echo.
echo Pressione Ctrl+C para parar os servidores
echo.

REM Iniciar API Server em uma nova janela
start "BOSS SHOPP - API Server" cmd /k "cd /d "%~dp0" && python api_server.py"

REM Aguardar 2 segundos
timeout /t 2 /nobreak >nul

REM Iniciar Frontend Server em uma nova janela
start "BOSS SHOPP - Frontend Server" cmd /k "cd /d "%~dp0frontend" && node server.js"

echo.
echo ✓ Servidores iniciados!
echo.
echo Verifique as janelas abertas para ver os logs dos servidores.
echo.
pause
