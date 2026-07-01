# Installation Guide

## Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher
- **MySQL** 8.0 or higher
- **Git**

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd EmailMarketing
```

## Step 2: Create Database

```sql
CREATE DATABASE email_marketing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Step 3: Backend Setup

```bash
cd backend
npm install
```

Copy environment file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=email_marketing
JWT_SECRET=generate-a-strong-random-secret
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

Run migrations and seed:
```bash
npm run migrate
npm run seed
```

Start backend:
```bash
npm run dev
```

Verify: `http://localhost:5000/api/health`

## Step 4: Frontend Setup

```bash
cd ../frontend
npm install
```

Copy environment file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Open: `http://localhost:3000`

## Step 5: Configure SMTP (Required for Sending)

1. Login as Super Admin (`admin@emailmarketing.com` / `Admin@123`)
2. Go to **SMTP Settings**
3. Enter your SMTP credentials
4. Click **Test Connection**
5. Click **Save Settings**

### Gmail Example

- Host: `smtp.gmail.com`
- Port: `587`
- Encryption: `TLS`
- Username: your Gmail address
- Password: App Password (not regular password)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection failed | Verify MySQL is running and credentials in `.env` |
| CORS errors | Ensure `FRONTEND_URL` matches frontend URL |
| Migration errors | Drop database and recreate, then re-run migrations |
| SMTP test fails | Check firewall, credentials, and encryption settings |
