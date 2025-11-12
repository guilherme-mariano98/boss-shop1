@echo off
echo Starting CEP Service for BOSS SHOPP...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH
    echo Please install Python 3.7 or higher
    pause
    exit /b 1
)

REM Check if required packages are installed
echo Checking required packages...
pip show flask >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing required packages...
    pip install -r requirements-cep.txt
)

echo Starting CEP service on http://localhost:5001
echo Press Ctrl+C to stop the service
echo.

python cep_service.py