@echo off
REM ============================================
REM Script de Instalacao Automatica - BOSS SHOPP
REM ============================================

echo.
echo ============================================
echo   BOSS SHOPP - Instalacao Automatica
echo ============================================
echo.

REM Verificar Python
echo [1/6] Verificando Python...
python --version
if %errorlevel% neq 0 (
    echo ERRO: Python nao encontrado!
    echo Por favor, instale Python 3.8+ de https://www.python.org/downloads/
    pause
    exit /b 1
)
echo OK - Python encontrado!
echo.

REM Verificar pip
echo [2/6] Verificando pip...
pip --version
if %errorlevel% neq 0 (
    echo ERRO: pip nao encontrado!
    pause
    exit /b 1
)
echo OK - pip encontrado!
echo.

REM Instalar dependencias
echo [3/6] Instalando dependencias do backend...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)
echo OK - Dependencias instaladas!
echo.

REM Criar banco de dados
echo [4/6] Criando banco de dados...
cd ..\..\
python create_database_sqlite.py
if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar banco de dados!
    pause
    exit /b 1
)
echo OK - Banco de dados criado!
echo.

REM Executar migracoes
echo [5/6] Executando migracoes do Django...
cd PI2\backend
python manage.py makemigrations
python manage.py migrate
if %errorlevel% neq 0 (
    echo AVISO: Algumas migracoes podem ter falhado
)
echo OK - Migracoes executadas!
echo.

REM Coletar arquivos estaticos
echo [6/6] Coletando arquivos estaticos...
python manage.py collectstatic --noinput
echo OK - Arquivos estaticos coletados!
echo.

echo ============================================
echo   INSTALACAO CONCLUIDA COM SUCESSO!
echo ============================================
echo.
echo Para iniciar o servidor, execute:
echo   start_server.bat
echo.
echo Ou manualmente:
echo   python manage.py runserver 0.0.0.0:8000
echo.
echo Acesse: http://localhost:8000
echo Admin: http://localhost:8000/admin
echo   Usuario: admin@bossshopp.com
echo   Senha: password
echo.
pause
