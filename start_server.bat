@echo off
REM ============================================
REM Script para Iniciar Servidor - BOSS SHOPP
REM ============================================

echo.
echo ============================================
echo   BOSS SHOPP - Iniciando Servidor
echo ============================================
echo.

cd backend

REM Descobrir IP local
echo Descobrindo IP local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%
echo.
echo ============================================
echo   Servidor Django Iniciando...
echo ============================================
echo.
echo Acesso Local:
echo   http://localhost:8000
echo   http://127.0.0.1:8000
echo.
echo Acesso na Rede:
echo   http://%IP%:8000
echo.
echo Admin:
echo   http://localhost:8000/admin
echo   Usuario: admin@bossshopp.com
echo   Senha: password
echo.
echo ============================================
echo Para parar o servidor: CTRL + C
echo ============================================
echo.

python manage.py runserver 0.0.0.0:8000
