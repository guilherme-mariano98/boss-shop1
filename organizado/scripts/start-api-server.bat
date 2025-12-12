@echo off
echo ========================================
echo BOSS SHOPP API SERVER
echo ========================================
echo.

echo Starting BOSS SHOPP API Server...
echo The API will be available at http://localhost:8001 and accessible from other devices on the network
echo.

python api_server.py

echo.
echo API Server stopped.
pause