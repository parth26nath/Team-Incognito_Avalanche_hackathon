@echo off
echo ======================================
echo    Heartly PostgreSQL Local Setup
echo ======================================
echo.

echo Checking if PostgreSQL is installed...
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL from https://www.postgresql.org/download/windows/
    echo Then add it to your PATH and run this script again.
    pause
    exit /b 1
)

echo PostgreSQL found! ✓
echo.

echo Creating database 'heartlydb'...
set /p POSTGRES_PASSWORD="Enter PostgreSQL password for user 'postgres': "

psql -U postgres -h localhost -c "CREATE DATABASE heartlydb;" 2>nul
if %errorlevel% equ 0 (
    echo Database 'heartlydb' created successfully! ✓
) else (
    echo Database 'heartlydb' might already exist (this is OK)
)

echo.
echo Creating .env file from template...
if not exist .env (
    copy env.template .env >nul
    echo .env file created! ✓
    echo.
    echo IMPORTANT: Please edit .env file and update DB_PASSWORD with your PostgreSQL password
    echo Current .env file:
    type .env
) else (
    echo .env file already exists
)

echo.
echo ======================================
echo Setup complete! Next steps:
echo 1. Edit .env file with your PostgreSQL password
echo 2. Run: npm run dev
echo ======================================
pause