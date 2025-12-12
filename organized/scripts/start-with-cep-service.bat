@echo off
echo Starting BOSS SHOPP with CEP Service...
echo.

REM Start the CEP service in the background
cd backend
start "CEP Service" /min cmd /c "python cep_service.py"
cd ..

REM Start the main frontend server
python serve_frontend.py