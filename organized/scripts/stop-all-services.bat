@echo off
echo Stopping BOSS SHOPP Services...
echo.

REM Kill Python processes (this will stop both services)
echo Stopping all Python processes...
taskkill /f /im python.exe /t >nul 2>&1

echo Services stopped.
pause