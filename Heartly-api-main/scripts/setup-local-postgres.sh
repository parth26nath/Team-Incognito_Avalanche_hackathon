#!/bin/bash

echo "======================================"
echo "   Heartly PostgreSQL Local Setup"
echo "======================================"
echo

echo "Checking if PostgreSQL is installed..."
if ! command -v psql &> /dev/null; then
    echo "ERROR: PostgreSQL is not installed"
    echo "Please install PostgreSQL:"
    echo "  - Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "  - macOS: brew install postgresql"
    echo "  - Or use Docker: docker run --name heartly-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=heartlydb -p 5432:5432 -d postgres:15"
    exit 1
fi

echo "PostgreSQL found! ✓"
echo

echo "Creating database 'heartlydb'..."
read -s -p "Enter PostgreSQL password for user 'postgres': " POSTGRES_PASSWORD
echo

PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -h localhost -c "CREATE DATABASE heartlydb;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "Database 'heartlydb' created successfully! ✓"
else
    echo "Database 'heartlydb' might already exist (this is OK)"
fi

echo
echo "Creating .env file from template..."
if [ ! -f .env ]; then
    cp env.template .env
    echo ".env file created! ✓"
    echo
    echo "IMPORTANT: Please edit .env file and update DB_PASSWORD with your PostgreSQL password"
    echo "Current .env file:"
    cat .env
else
    echo ".env file already exists"
fi

echo
echo "======================================"
echo "Setup complete! Next steps:"
echo "1. Edit .env file with your PostgreSQL password"
echo "2. Run: npm run dev"
echo "======================================"