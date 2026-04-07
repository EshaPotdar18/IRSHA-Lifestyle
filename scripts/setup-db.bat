@echo off
REM Database Setup Script for Health Assessment App (Windows)
REM This script helps set up PostgreSQL and Prisma for local development

echo.
echo ==========================================
echo Health Assessment App - Database Setup
echo ==========================================
echo.

REM Check if PostgreSQL is running
echo Checking PostgreSQL connection...
psql -U postgres -c "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo X PostgreSQL is not running
    echo.
    echo Please start PostgreSQL:
    echo   - Open pgAdmin from your Start menu
    echo   - Or start PostgreSQL service manually
    echo   - Or use Docker: docker-compose up -d
    pause
    exit /b 1
)
echo [OK] PostgreSQL is running
echo.

REM Create database if it doesn't exist
echo Creating database (if not exists)...
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'health_assessment'" 2>nul | find "1" >nul
if errorlevel 1 (
    psql -U postgres -c "CREATE DATABASE health_assessment;"
)
echo [OK] Database 'health_assessment' is ready
echo.

REM Create .env.local if it doesn't exist
echo Setting up environment variables...
if not exist .env.local (
    (
        echo DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/health_assessment
    ) > .env.local
    echo [OK] Created .env.local
    echo WARNING: Edit .env.local and replace PASSWORD with your PostgreSQL password
) else (
    echo [OK] .env.local already exists
)
echo.

REM Install dependencies
echo Installing Prisma dependencies...
call npm install @prisma/client prisma
echo.

REM Generate Prisma Client
echo Generating Prisma Client...
call npx prisma generate
echo.

REM Run migrations
echo Running database migrations...
call npx prisma migrate dev --name init
echo.

REM Verify
echo Verifying setup...
call npx prisma db push --skip-generate
echo.

echo ==========================================
echo [OK] Database setup complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Edit .env.local and ensure DATABASE_URL is correct
echo 2. Start your app: npm run dev
echo 3. Test the API endpoints
echo 4. View your data: npx prisma studio
echo.
pause
