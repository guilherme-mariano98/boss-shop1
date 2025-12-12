@echo off
title BOSS SHOPP Complete Setup
color 0A

echo ========================================
echo   BOSS SHOPP - Complete Setup Launcher
echo ========================================
echo.
echo This script will help you launch the complete BOSS SHOPP setup.
echo.

echo Checking current setup status...
echo.
node verify_setup.js
echo.

echo ========================================
echo.
echo Based on the verification results above:
echo.
echo If all checks show "✓", you can proceed to start the server.
echo If any checks show "✗", please follow the troubleshooting steps.
echo.
echo ========================================
echo.
echo Options:
echo 1. Start the BOSS SHOPP server
echo 2. Launch MySQL Workbench
echo 3. Run automated database setup
echo 4. View setup documentation
echo 5. Exit
echo.
echo.

:menu
set /p choice=Enter your choice (1-5): 

if "%choice%"=="1" goto start_server
if "%choice%"=="2" goto launch_mysql
if "%choice%"=="3" goto run_setup
if "%choice%"=="4" goto view_docs
if "%choice%"=="5" goto exit
echo Invalid choice, please try again.
goto menu

:start_server
echo Starting BOSS SHOPP server...
node server.js
goto exit

:launch_mysql
echo Launching MySQL Workbench...
start "" "launch_mysql_workbench.bat"
goto menu

:run_setup
echo Running automated database setup...
powershell -ExecutionPolicy Bypass -File "initialize_mysql.ps1"
goto menu

:view_docs
echo Opening setup documentation...
start "" "SETUP_COMPLETE.md"
goto menu

:exit
echo.
echo Thank you for using BOSS SHOPP!
echo.
pause