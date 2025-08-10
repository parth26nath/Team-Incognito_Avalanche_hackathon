# PostgreSQL Setup Guide for Heartly Backend

## 1. Install PostgreSQL

### Windows:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is 5432 (keep it unless you have conflicts)

### Alternative - Using Docker:
```bash
docker run --name heartly-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=heartlydb -p 5432:5432 -d postgres:15
```

## 2. Create Database

### Option A: Using pgAdmin (GUI)
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to your PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `heartlydb`
5. Click "Save"

### Option B: Using Command Line
```bash
# Connect to PostgreSQL
psql -U postgres -h localhost

# Create database
CREATE DATABASE heartlydb;

# Exit
\q
```

## 3. Configure Environment

Copy `.env.template` to `.env` and update:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_actual_password_here
DB_DATABASE=heartlydb
```

## 4. Test Connection

The backend will automatically create tables when you start it with `npm run dev`.

## 5. Verify Setup

Once the backend starts, you should see:
- "Database connected successfully"
- No database connection errors
- Tables created automatically via TypeORM

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL service is running
- Check if port 5432 is available
- Verify username/password in .env

### Authentication Failed
- Double-check password in .env file
- Ensure user `postgres` exists and has proper permissions

### Database Not Found
- Create the database manually using pgAdmin or psql
- Ensure database name matches .env configuration