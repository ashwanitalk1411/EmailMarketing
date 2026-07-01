# Testing Guide

## Manual Testing

### 1. Authentication

| Test | Steps | Expected |
|------|-------|----------|
| Valid login | Login with `user@emailmarketing.com` / `User@123` | Redirect to dashboard |
| Invalid login | Wrong password | Error message displayed |
| Protected route | Access `/dashboard` without login | Redirect to login |
| Logout | Click logout | Redirect to login, token cleared |

### 2. Contacts

| Test | Steps | Expected |
|------|-------|----------|
| Add contact | Create contact with name and email | Contact appears in list |
| Duplicate email | Add same email twice | Error on second attempt |
| Edit contact | Update name/email | Changes saved |
| Delete contact | Delete a contact | Removed from list |
| Search | Type in search box | Filtered results |
| CSV import | Upload `backend/public/sample-contacts.csv` | Summary shows saved/skipped/invalid |

### 3. Templates

| Test | Steps | Expected |
|------|-------|----------|
| Create template | Add name, subject, HTML | Template in grid |
| Preview | Click preview | HTML rendered |
| Edit template | Modify and save | Changes reflected |
| Delete template | Delete template | Removed from list |

### 4. Send Email

| Test | Steps | Expected |
|------|-------|----------|
| Send without SMTP | Send before SMTP configured | Failed status in logs |
| Send with SMTP | Configure SMTP, select contacts + template, send | Sent count in result |
| Subject override | Enter custom subject | Custom subject used |

### 5. Email Logs

| Test | Steps | Expected |
|------|-------|----------|
| View logs | Navigate to logs page | All sent emails listed |
| Filter by status | Select "failed" filter | Only failed emails shown |

### 6. Admin Features

| Test | Steps | Expected |
|------|-------|----------|
| Manage users | Login as admin, create/edit/delete user | User CRUD works |
| SMTP settings | Configure and test SMTP | Connection success |
| All email logs | View logs as admin | See logs from all users |

## API Testing with Postman

1. Import `docs/postman/EmailMarketing.postman_collection.json`
2. Run **Login** request to set token automatically
3. Test each endpoint in sequence

## Sample CSV for Import Testing

Use `backend/public/sample-contacts.csv`:

```csv
name,email
John Doe,john@example.com
Jane Smith,jane@example.com
Invalid User,not-an-email
John Doe,john@example.com
```

Expected: 2 saved, 1 skipped (duplicate), 1 invalid

## Health Check

```bash
curl http://localhost:5000/api/health
```

## Database Verification

```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM contacts;
SELECT status, COUNT(*) FROM email_logs GROUP BY status;
```
