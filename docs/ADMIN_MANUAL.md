# Admin Manual (Super Admin)

## Admin Capabilities

As Super Admin, you have access to:

- **Dashboard** — System-wide statistics
- **Manage Users** — Create, edit, delete user accounts
- **All Email Logs** — View email logs from all users
- **SMTP Settings** — Configure email delivery

## Managing Users

### Create a User

1. Go to **Manage Users**
2. Click **Add User**
3. Enter name, email, password, and role
4. Click **Save**

### Roles

| Role | Access |
|------|--------|
| **User** | Contacts, Templates, Send Email, own logs, Profile |
| **Super Admin** | Dashboard, Users, All Logs, SMTP Settings |

### Edit a User

Click **Edit** on any user row to update their details or change role.

### Delete a User

Click **Delete** to remove a user. You cannot delete your own account.

> **Login As User** — Placeholder for Version 2. Not implemented in MVP.

## SMTP Configuration

Email sending requires SMTP configuration.

### Setup Steps

1. Go to **SMTP Settings**
2. Enter your SMTP server details:

| Field | Description | Example |
|-------|-------------|---------|
| Host | SMTP server address | smtp.gmail.com |
| Port | SMTP port | 587 |
| Username | SMTP login | your@gmail.com |
| Password | SMTP password | App password |
| Encryption | TLS, SSL, or None | TLS |

3. Click **Test Connection** to verify
4. Click **Save Settings**

### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: Google Account → Security → App Passwords
3. Use the App Password (not your regular password) in SMTP settings

### Common SMTP Providers

| Provider | Host | Port | Encryption |
|----------|------|------|------------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook | smtp.office365.com | 587 | TLS |
| SendGrid | smtp.sendgrid.net | 587 | TLS |
| Mailgun | smtp.mailgun.org | 587 | TLS |

## Viewing All Email Logs

As admin, the **All Email Logs** page shows emails from every user, including:
- User name who sent the email
- Recipient, subject, status, timestamps
- Error messages for failed deliveries

Filter by status to investigate delivery issues.

## Dashboard (Admin View)

Admin dashboard shows system-wide metrics:
- Total contacts across all users
- Total emails sent, pending, and failed system-wide
- Recent email activity from all users

## Security Recommendations

- Change default admin password immediately after setup
- Use strong, unique passwords for all accounts
- Store SMTP credentials securely
- Regularly review email logs for anomalies
- Limit super_admin role to trusted personnel only

## Troubleshooting

| Issue | Action |
|-------|--------|
| Users can't send emails | Verify SMTP settings and test connection |
| High failed email count | Check SMTP credentials and recipient validity |
| User locked out | Reset password via user edit |
