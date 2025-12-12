@echo off
echo ========================================
echo   BOSS SHOPP - Deploy para GitHub
echo ========================================
echo.

REM Verificar se git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Git nao esta instalado!
    echo Baixe em: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/6] Verificando status do Git...
git status

echo.
echo [2/6] Adicionando arquivos...
git add .

echo.
echo [3/6] Criando commit...
set /p commit_msg="Digite a mensagem do commit (ou pressione Enter para usar padrao): "
if "%commit_msg%"=="" set commit_msg=Atualizacao do site BOSS SHOPP

git commit -m "%commit_msg%"

echo.
echo [4/6] Verificando repositorio remoto...
git remote -v

REM Se não houver remote, pedir para adicionar
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo ATENCAO: Nenhum repositorio remoto configurado!
    echo.
    set /p repo_url="Cole a URL do seu repositorio GitHub: "
    git remote add origin !repo_url!
    echo Repositorio adicionado!
)

echo.
echo [5/6] Enviando para GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo Tentando criar branch main e enviar...
    git branch -M main
    git push -u origin main
)

echo.
echo [6/6] Deploy concluido!
echo.
echo ========================================
echo   Seu site sera publicado em:
echo   https://SEU_USUARIO.github.io/boss-shopp/frontend/
echo ========================================
echo.
echo Proximos passos:
echo 1. Acesse seu repositorio no GitHub
echo 2. Va em Settings - Pages
echo 3. Selecione branch 'main' e pasta '/frontend'
echo 4. Clique em Save
echo 5. Aguarde alguns minutos
echo.
pause
