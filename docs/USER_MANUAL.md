# User Manual

## Getting Started

1. Open the application URL (default: `http://localhost:3000`)
2. Login with your credentials provided by the administrator
3. You will land on the **Dashboard**

## Dashboard

The dashboard shows:
- **Total Contacts** — Number of contacts in your account
- **Emails Sent** — Successfully delivered emails
- **Pending Emails** — Emails waiting to be sent
- **Failed Emails** — Emails that failed to deliver
- **Recent Email Logs** — Last 10 email activities

## Managing Contacts

### Add a Contact

1. Go to **Contacts**
2. Click **Add Contact**
3. Enter name and email
4. Click **Save**

### Import from CSV

1. Go to **Contacts**
2. Click **Import CSV**
3. Select a CSV file with `name` and `email` columns
4. Review the import summary:
   - **Total Records** — Rows in the file
   - **Saved** — New unique contacts added
   - **Skipped** — Duplicate emails (already exist)
   - **Invalid** — Rows with invalid email format

### Search Contacts

Use the search box to filter by name or email.

## Email Templates

### Create a Template

1. Go to **Templates**
2. Click **Create Template**
3. Fill in:
   - **Template Name** — Internal reference name
   - **Subject** — Default email subject line
   - **HTML Content** — Email body in HTML
4. Click **Save**

### Preview a Template

Click **Preview** on any template card to see how the email will look.

## Sending Emails

1. Go to **Send Email**
2. **Select Contacts** — Check the contacts to receive the email
3. **Choose Template** — Select from your templates
4. **Subject** (optional) — Override the template subject
5. Click **Send**

Emails are sent immediately. Results show sent and failed counts.

> **Note:** SMTP must be configured by the administrator before emails can be sent.

## Email Logs

View all your sent emails:
- **Recipient** — Who received the email
- **Subject** — Email subject line
- **Status** — pending, sending, sent, or failed
- **Sent At** — When the email was delivered
- **Error** — Error message if delivery failed

Filter by status using the dropdown.

## Profile

Update your account:
- Change name or email
- Change password (requires current password)

## Tips

- Import contacts in bulk using CSV to save time
- Use descriptive template names for easy selection
- Check email logs after sending to verify delivery
- Duplicate emails are automatically prevented during import
