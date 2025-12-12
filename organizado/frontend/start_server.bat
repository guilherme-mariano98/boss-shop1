@echo off
echo Starting BOSS SHOPP Server...
echo.
echo Make sure you have:
echo 1. Created the boss_shopp database using MySQL Workbench
echo 2. MySQL service is running on port 3307
echo.
echo Server will be available at: http://localhost:3000
echo API endpoints available at: http://localhost:3000/api
echo.
node server.js