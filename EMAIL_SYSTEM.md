# Email System Documentation

This document explains the complete email system setup for Coach Himanshu platform.

## Features Implemented

1. **Contact Form Email Notifications** - Contact form submissions are saved to database and emailed to info@coachhimanshu.com
2. **Client Credentials Email** - Send login credentials to clients via email (with password reset)
3. **Membership Expiry Reminders** - Automated emails sent 7 days before membership expires

## Email Configuration

### Required Environment Variables

Add these to your `.env` file:

```env
# SMTP Configuration (Hostinger)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@coachhimanshu.com
SMTP_PASSWORD=your-email-password-here

# Cron Job Security
CRON_SECRET=your-random-secret-key-here

# JWT Secret (if not already set)
JWT_SECRET=your-jwt-secret-key-here
```

### Email Templates

All email templates are located in `lib/email.ts`:

1. **sendContactFormEmail()** - Professional HTML template for contact form submissions
2. **sendCredentialsEmail()** - Welcome email with login credentials
3. **sendMembershipExpiryReminder()** - Urgent reminder for expiring memberships

## API Endpoints

### 1. Contact Form Submission

**Endpoint:** `POST /api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "subject": "subscription",
  "message": "I want to know more about the plans"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you soon.",
  "submissionId": 123
}
```

**Features:**
- Saves submission to `ContactSubmission` table
- Sends email notification to info@coachhimanshu.com
- Returns success even if email fails (data is saved)

### 2. Send Credentials to Client

**Endpoint:** `POST /api/auth/send-credentials`

**Authentication:** Requires coach JWT token

**Request Body:**
```json
{
  "clientId": 123
}
```

**Response:**
```json
{
  "success": true,
  "message": "New credentials sent successfully to client@example.com. The client's password has been reset."
}
```

**Features:**
- Generates a new random password
- Hashes and updates password in database
- Sends professional welcome email with credentials
- Includes dashboard link and getting started guide

**Security Notes:**
- Only coaches can send credentials
- Generates new password (old one is invalidated)
- Password is immediately hashed (never stored in plain text)
- Client receives temporary password and should change it on first login

### 3. Membership Expiry Reminders (Cron Job)

**Endpoint:** `GET /api/cron/expiry-reminders` or `POST /api/cron/expiry-reminders`

**Authentication:** Bearer token with `CRON_SECRET`

**Headers:**
```
Authorization: Bearer your-cron-secret-here
```

**Response:**
```json
{
  "success": true,
  "message": "Expiry reminder cron job completed",
  "stats": {
    "totalFound": 15,
    "sent": 14,
    "errors": 1
  },
  "timestamp": "2025-01-16T10:00:00.000Z"
}
```

**How It Works:**
1. Runs daily (configured via cron service)
2. Finds all active subscriptions expiring in exactly 7 days
3. Sends reminder email to each client
4. Returns stats on success/failure

## Setting Up Cron Jobs

You have several options for running the expiry reminder cron job:

### Option 1: Vercel Cron Jobs (Recommended for Vercel deployment)

1. Create `vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/expiry-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

2. Add `CRON_SECRET` to Vercel environment variables

3. The cron job will run daily at 9:00 AM UTC

### Option 2: cron-job.org (External Service)

1. Sign up at https://cron-job.org
2. Create a new cron job:
   - **URL:** `https://coachhimanshu.com/api/cron/expiry-reminders`
   - **Schedule:** Daily at 9:00 AM IST (3:30 AM UTC)
   - **Headers:** Add `Authorization: Bearer your-cron-secret-here`
3. Save and activate

### Option 3: GitHub Actions (Free)

1. Create `.github/workflows/expiry-reminders.yml`:

```yaml
name: Membership Expiry Reminders

on:
  schedule:
    - cron: '30 3 * * *' # Runs at 9:00 AM IST (3:30 AM UTC) daily

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Call Expiry Reminder API
        run: |
          curl -X POST https://coachhimanshu.com/api/cron/expiry-reminders \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

2. Add `CRON_SECRET` to GitHub repository secrets

### Option 4: Your Own Server

If you have your own server, add this to crontab:

```bash
0 9 * * * curl -X GET https://coachhimanshu.com/api/cron/expiry-reminders -H "Authorization: Bearer your-cron-secret-here"
```

## Testing the Email System

### Test Contact Form

1. Go to https://coachhimanshu.com/contact
2. Fill out the form
3. Check database: `SELECT * FROM ContactSubmission ORDER BY createdAt DESC LIMIT 1;`
4. Check email: info@coachhimanshu.com should receive notification

### Test Send Credentials

1. Login as coach
2. Go to coach dashboard
3. Click on a client to open detail modal
4. Click "Send Credentials" button
5. Confirm the action
6. Client should receive email with new login credentials

### Test Expiry Reminders

**Manual Test:**

```bash
curl -X GET https://coachhimanshu.com/api/cron/expiry-reminders \
  -H "Authorization: Bearer your-cron-secret-here"
```

**What to check:**
- Response shows count of subscriptions found
- Clients with subscriptions expiring in 7 days receive emails
- Check email inbox of test clients

## Database Schema

### ContactSubmission Table

```sql
CREATE TABLE ContactSubmission (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);
```

## Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials:**
   - Verify `SMTP_USER` and `SMTP_PASSWORD` in `.env`
   - Test login to Hostinger email account

2. **Check Hostinger email settings:**
   - Ensure SMTP is enabled
   - Check email sending limits
   - Verify domain is verified

3. **Check email logs:**
   - Check server logs for email errors
   - Look for "Failed to send email notification" messages

4. **Test SMTP connection:**
   ```javascript
   // Run in Node.js
   const nodemailer = require('nodemailer');
   const transporter = nodemailer.createTransporter({
     host: 'smtp.hostinger.com',
     port: 465,
     secure: true,
     auth: {
       user: 'info@coachhimanshu.com',
       pass: 'your-password',
     },
   });
   transporter.verify().then(console.log).catch(console.error);
   ```

### Cron Job Not Running

1. **Verify cron secret:**
   - Check `CRON_SECRET` environment variable
   - Ensure it matches in both `.env` and cron service

2. **Check cron service logs:**
   - Vercel: Check deployment logs
   - cron-job.org: Check execution history
   - GitHub Actions: Check workflow runs

3. **Test endpoint manually:**
   ```bash
   curl -X GET https://coachhimanshu.com/api/cron/expiry-reminders \
     -H "Authorization: Bearer your-cron-secret" -v
   ```

### Client Not Receiving Credentials

1. **Check spam folder** - Automated emails often go to spam
2. **Verify client email address** - Ensure email is correct in database
3. **Check email sending limits** - Hostinger may have daily limits
4. **Review email logs** - Check for errors in credential sending

## Email Deliverability Best Practices

1. **SPF Record:** Ensure your domain has proper SPF record for Hostinger
2. **DKIM:** Enable DKIM signing in Hostinger email settings
3. **From Address:** Always use verified domain email (info@coachhimanshu.com)
4. **Content:** Avoid spam trigger words, maintain good text-to-image ratio
5. **Unsubscribe Link:** Consider adding for marketing emails (not required for transactional)

## Future Enhancements

- [ ] Email templates with better customization
- [ ] Multiple reminder emails (7 days, 3 days, 1 day before expiry)
- [ ] Email analytics and tracking
- [ ] Welcome email series for new clients
- [ ] Progress update emails
- [ ] Newsletter functionality
- [ ] Email preferences for clients (opt-in/opt-out)

## Support

For issues or questions:
- Email: info@coachhimanshu.com
- Phone/WhatsApp: +91 7303484648
