@echo off
echo Starting BOSS SHOPP Services...
echo.

REM Start the CEP service in the background
echo Starting CEP Service...
cd /d "%~dp0backend"
start "CEP Service" /min cmd /c "python cep_service.py"
cd /d "%~dp0"

REM Wait a moment for the CEP service to start
timeout /t 3 /nobreak >nul

REM Ask user which server to start
echo Choose which server to start:
echo 1. Python HTTP Server (default)
echo 2. Node.js Server
echo.
choice /c 12 /m "Select server type"
if errorlevel 2 goto node_server
if errorlevel 1 goto python_server

:python_server
REM Start the main frontend server (Python)
echo Starting Frontend Server (Python)... Accessible from other devices on the network.
python serve_frontend.py
goto end

:node_server
REM Start the Node.js server
echo Starting Frontend Server (Node.js)... Accessible from other devices on the network.
cd /d "%~dp0frontend"
node server.js
goto end

:end
REM If we get here, the frontend server was stopped
echo.
echo Frontend server stopped.
echo To stop the CEP service, close the CEP Service window manually.
pause