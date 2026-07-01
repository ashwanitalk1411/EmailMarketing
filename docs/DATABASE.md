# Database Documentation

Database: `email_marketing` (MySQL 8.0+)

## Entity Relationship

```
users (1) ──── (N) contacts
users (1) ──── (N) templates
users (1) ──── (N) email_logs
smtp_settings (standalone, single row)
```

## Tables

### users

| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL (bcrypt hashed) |
| role | ENUM('super_admin','user') | NOT NULL, DEFAULT 'user' |
| created_at | TIMESTAMP | AUTO |
| updated_at | TIMESTAMP | AUTO |

### contacts

| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| user_id | INT | FK → users.id, ON DELETE CASCADE |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | AUTO |
| updated_at | TIMESTAMP | AUTO |

**Unique:** `(user_id, email)` — prevents duplicate emails per user

### templates

| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| user_id | INT | FK → users.id, ON DELETE CASCADE |
| name | VARCHAR(255) | NOT NULL |
| subject | VARCHAR(500) | NOT NULL |
| html_content | LONGTEXT | NOT NULL |
| created_at | TIMESTAMP | AUTO |
| updated_at | TIMESTAMP | AUTO |

### smtp_settings

| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| host | VARCHAR(255) | NOT NULL |
| port | INT | NOT NULL, DEFAULT 587 |
| username | VARCHAR(255) | NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| encryption | ENUM('tls','ssl','none') | NOT NULL, DEFAULT 'tls' |
| created_at | TIMESTAMP | AUTO |
| updated_at | TIMESTAMP | AUTO |

### email_logs

| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| user_id | INT | FK → users.id, ON DELETE CASCADE |
| recipient_email | VARCHAR(255) | NOT NULL |
| subject | VARCHAR(500) | NOT NULL |
| status | ENUM('pending','sending','sent','failed') | NOT NULL, DEFAULT 'pending' |
| error_message | TEXT | NULLABLE |
| sent_at | TIMESTAMP | NULLABLE |
| created_at | TIMESTAMP | AUTO |
| updated_at | TIMESTAMP | AUTO |

**Indexes:** `(user_id, status)`, `created_at`

## Migrations

Run migrations:
```bash
cd backend
npm run migrate
```

Rollback:
```bash
npm run migrate:rollback
```

## Seeders

Default users:
```bash
npm run seed
```

| Email | Password | Role |
|-------|----------|------|
| admin@emailmarketing.com | Admin@123 | super_admin |
| user@emailmarketing.com | User@123 | user |
