# API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require: `Authorization: Bearer <token>`

---

## Authentication

### POST /auth/login

Login and receive JWT token.

**Body:**
```json
{
  "email": "user@emailmarketing.com",
  "password": "User@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbG...",
    "user": {
      "id": 2,
      "name": "Demo User",
      "email": "user@emailmarketing.com",
      "role": "user"
    }
  }
}
```

### POST /auth/logout

Logout (client-side token removal).

### GET /auth/profile

Get current user profile. **Auth required.**

### PUT /auth/profile

Update profile. **Auth required.**

**Body:**
```json
{
  "name": "Updated Name",
  "email": "new@email.com",
  "current_password": "User@123",
  "new_password": "NewPass@123"
}
```

---

## Dashboard

### GET /dashboard/stats

Get dashboard statistics. **Auth required.**

**Response:**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved",
  "data": {
    "total_contacts": 100,
    "emails_sent": 50,
    "pending_emails": 2,
    "failed_emails": 3,
    "recent_logs": []
  }
}
```

---

## Users (Super Admin Only)

### GET /users

List all users. Query: `page`, `limit`

### POST /users

Create user.

**Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "Password@123",
  "role": "user"
}
```

### PUT /users/:id

Update user.

### DELETE /users/:id

Delete user.

---

## Contacts (User Only)

### GET /contacts

List contacts. Query: `search`, `page`, `limit`

### POST /contacts

Create contact.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### PUT /contacts/:id

Update contact.

### DELETE /contacts/:id

Delete contact.

### POST /contacts/import

Import CSV file. **Content-Type: multipart/form-data**

Field: `file` (CSV with name, email columns)

**Response:**
```json
{
  "success": true,
  "message": "Import completed",
  "data": {
    "total": 500,
    "saved": 470,
    "skipped": 25,
    "invalid": 5
  }
}
```

---

## Templates (User Only)

### GET /templates

List all templates.

### GET /templates/:id

Get single template.

### POST /templates

Create template.

**Body:**
```json
{
  "name": "Welcome Email",
  "subject": "Welcome to our platform!",
  "html_content": "<h1>Hello!</h1><p>Welcome aboard.</p>"
}
```

### PUT /templates/:id

Update template.

### DELETE /templates/:id

Delete template.

---

## Emails

### POST /emails/send (User Only)

Send emails immediately.

**Body:**
```json
{
  "contact_ids": [1, 2, 3],
  "template_id": 1,
  "subject": "Optional subject override"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emails processed",
  "data": {
    "sent": 2,
    "failed": 1,
    "total": 3
  }
}
```

### GET /emails/logs

Get email logs. Query: `status`, `page`, `limit`, `user_id` (admin)

---

## SMTP Settings (Super Admin Only)

### GET /smtp

Get SMTP settings (password masked).

### POST /smtp

Save SMTP settings.

**Body:**
```json
{
  "host": "smtp.gmail.com",
  "port": 587,
  "username": "your@gmail.com",
  "password": "app-password",
  "encryption": "tls"
}
```

### POST /smtp/test

Test SMTP connection.

---

## Health Check

### GET /health

```json
{
  "success": true,
  "message": "API is running",
  "data": { "status": "healthy" }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 422 | Validation Error |
| 500 | Internal Server Error |
