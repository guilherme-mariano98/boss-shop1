@echo off
echo ========================================
echo BOSS SHOPP - Organized Project Startup
echo ========================================
echo.

echo Starting BOSS SHOPP servers...
echo.

echo 1. Starting Django Backend Server...
cd backend
start "Django Backend" cmd /k "python run_server.py"
cd ..

echo.
echo 2. Starting Frontend Server...
cd frontend
start "Frontend Server" cmd /k "python ../scripts/serve_frontend.py"
cd ..

echo.
echo Servers started successfully!
echo.
echo Access the application at:
echo Frontend: http://localhost:8000
echo Backend API: http://localhost:8001
echo.
echo Press any key to exit...
pause >nul