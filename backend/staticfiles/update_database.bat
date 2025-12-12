@echo off
title BOSS SHOPP Database Update
color 0A

echo ========================================
echo   BOSS SHOPP - Database Schema Update
echo ========================================
echo.
echo This script will update your database schema to support enhanced customer information.
echo.

echo Checking MySQL connection...
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -P 3307 -h localhost --execute="SELECT 1;" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ MySQL connection successful
) else (
    echo ✗ MySQL connection failed
    echo Please check your MySQL installation and credentials.
    echo.
    pause
    exit /b 1
)

echo.
echo Updating database schema...
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -P 3307 -h localhost < "update_customer_schema.sql"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Database schema updated successfully
) else (
    echo ✗ Failed to update database schema
    echo Please check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo Testing enhanced customer data storage...
echo.
node test_customer_data.js
if %ERRORLEVEL% EQU 0 (
    echo ✓ Customer data verification completed
) else (
    echo ✗ Customer data verification failed
    echo Please check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Database update completed successfully!
echo ========================================
echo.
echo The enhanced customer information storage is now ready for use.
echo.
echo Next steps:
echo 1. Restart the BOSS SHOPP server
echo 2. Test the enhanced registration and profile features
echo.
pause