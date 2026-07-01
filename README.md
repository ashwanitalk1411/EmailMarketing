# EmailMark - Email Marketing SaaS (Version 1 MVP)

A clean, modern Email Marketing web application built with Next.js, Express.js, and MySQL.

## Features

- **Authentication** — JWT-based login/logout with role-based access
- **Dashboard** — Contact counts, email stats, recent logs
- **Contacts** — CRUD, search, CSV import with duplicate skipping
- **Templates** — Create, edit, delete, preview HTML email templates
- **Send Email** — Select contacts, choose template, send immediately
- **Email Logs** — Track pending, sending, sent, and failed emails
- **SMTP Settings** — Admin-only SMTP configuration

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MySQL, Knex.js |
| Auth | JWT, bcrypt |
| Email | Nodemailer |
| Validation | Zod |

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+

### 1. Database Setup

```sql
CREATE DATABASE email_marketing;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run migrate
npm run seed
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@emailmarketing.com | Admin@123 |
| User | user@emailmarketing.com | User@123 |

## Project Structure

```
EmailMarketing/
├── backend/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── knexfile.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   ├── helpers/
│   │   ├── utils/
│   │   ├── emails/
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   └── public/
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── contexts/
│       ├── lib/
│       └── types/
└── docs/
    ├── API.md
    ├── DATABASE.md
    ├── INSTALLATION.md
    ├── DEPLOYMENT.md
    ├── TESTING.md
    ├── USER_MANUAL.md
    ├── ADMIN_MANUAL.md
    ├── DEVELOPER_GUIDE.md
    └── postman/
```

## Documentation

| Document | Description |
|----------|-------------|
| [Installation Guide](docs/INSTALLATION.md) | Detailed setup instructions |
| [API Documentation](docs/API.md) | REST API reference |
| [Database Documentation](docs/DATABASE.md) | Schema and relationships |
| [Deployment Guide](docs/DEPLOYMENT.md) | Production deployment |
| [Testing Guide](docs/TESTING.md) | How to test the application |
| [User Manual](docs/USER_MANUAL.md) | End-user guide |
| [Admin Manual](docs/ADMIN_MANUAL.md) | Super admin guide |
| [Developer Guide](docs/DEVELOPER_GUIDE.md) | Architecture and conventions |
| [Postman Collection](docs/postman/EmailMarketing.postman_collection.json) | API testing collection |

## API Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## License

MIT
