import nodemailer from 'nodemailer';

// Email configuration for Hostinger SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // Use SSL
    auth: {
      user: process.env.SMTP_USER || 'info@coachhimanshu.com',
      pass: process.env.SMTP_PASSWORD || '',
    },
  });
};

// Send contact form submission email
export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      </div>

      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
        <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e3a8a; margin-top: 0; font-size: 18px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Contact Details</h2>

          <p style="margin: 10px 0;"><strong style="color: #1e3a8a;">Name:</strong> ${data.name}</p>
          <p style="margin: 10px 0;"><strong style="color: #1e3a8a;">Email:</strong> <a href="mailto:${data.email}" style="color: #3b82f6;">${data.email}</a></p>
          ${data.phone ? `<p style="margin: 10px 0;"><strong style="color: #1e3a8a;">Phone:</strong> ${data.phone}</p>` : ''}
          <p style="margin: 10px 0;"><strong style="color: #1e3a8a;">Subject:</strong> ${data.subject}</p>
        </div>

        <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
          <h2 style="color: #1e3a8a; margin-top: 0; font-size: 18px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Message</h2>
          <p style="margin: 10px 0; white-space: pre-wrap;">${data.message}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #1e3a8a;">
            <strong>Quick Action:</strong> Reply directly to this email to respond to ${data.name}
          </p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
        <p style="margin: 5px 0;">Coach Himanshu Fitness Coaching</p>
        <p style="margin: 5px 0;">This is an automated notification from your website contact form</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Coach Himanshu Website" <${process.env.SMTP_USER || 'info@coachhimanshu.com'}>`,
    to: 'info@coachhimanshu.com',
    replyTo: data.email,
    subject: `New Contact Form: ${data.subject}`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}

// Send credentials to client
export async function sendCredentialsEmail(data: {
  clientName: string;
  clientEmail: string;
  password: string;
}) {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Coach Himanshu Login Credentials</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Coach Himanshu!</h1>
      </div>

      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${data.clientName}</strong>,</p>

        <p style="margin-bottom: 20px;">Your account has been created successfully! Here are your login credentials to access your personalized fitness dashboard:</p>

        <div style="background: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 10px 0;"><strong style="color: #1e3a8a;">Email:</strong> ${data.clientEmail}</p>
          <p style="margin: 10px 0;"><strong style="color: #1e3a8a;">Password:</strong> <code style="background: #dbeafe; padding: 4px 8px; border-radius: 4px; font-size: 14px; color: #1e3a8a;">${data.password}</code></p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://coachhimanshu.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Login to Dashboard</a>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>🔒 Security Tip:</strong> We recommend changing your password after your first login. Go to Dashboard → Settings → Change Password
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <h3 style="color: #1e3a8a; font-size: 18px; margin-bottom: 15px;">What's Next?</h3>
          <ul style="color: #4b5563; padding-left: 20px;">
            <li style="margin: 8px 0;">Log in to your dashboard</li>
            <li style="margin: 8px 0;">Complete your fitness assessment (if not done already)</li>
            <li style="margin: 8px 0;">View your personalized workout and meal plans</li>
            <li style="margin: 8px 0;">Track your daily progress</li>
            <li style="margin: 8px 0;">Connect with Coach Himanshu via WhatsApp for 24/7 support</li>
          </ul>
        </div>

        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin-top: 25px; text-align: center;">
          <p style="margin: 0 0 10px 0; color: #1e3a8a; font-weight: bold;">Need Help?</p>
          <p style="margin: 5px 0; color: #1e40af;">📧 Email: info@coachhimanshu.com</p>
          <p style="margin: 5px 0; color: #1e40af;">📱 WhatsApp: +91 7303484648</p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
        <p style="margin: 5px 0;">Coach Himanshu - NASM Certified Fitness Expert</p>
        <p style="margin: 5px 0;">Making fitness affordable, accessible, and science-backed</p>
        <p style="margin: 10px 0;">
          <a href="https://coachhimanshu.com" style="color: #3b82f6; text-decoration: none;">coachhimanshu.com</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Coach Himanshu" <${process.env.SMTP_USER || 'info@coachhimanshu.com'}>`,
    to: data.clientEmail,
    subject: 'Your Coach Himanshu Login Credentials',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}

// Send membership expiry reminder
export async function sendMembershipExpiryReminder(data: {
  clientName: string;
  clientEmail: string;
  planName: string;
  expiryDate: Date;
  daysRemaining: number;
}) {
  const transporter = createTransporter();

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'long',
    timeZone: 'Asia/Kolkata',
  }).format(data.expiryDate);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Membership Expiring Soon</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #f59e0b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px;">⚠️ Membership Expiring Soon</h1>
      </div>

      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${data.clientName}</strong>,</p>

        <p style="margin-bottom: 20px;">This is a friendly reminder that your fitness coaching membership is expiring soon!</p>

        <div style="background: #fff7ed; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 10px 0;"><strong style="color: #92400e;">Current Plan:</strong> ${data.planName}</p>
          <p style="margin: 10px 0;"><strong style="color: #92400e;">Expiry Date:</strong> ${formattedDate}</p>
          <p style="margin: 10px 0; font-size: 20px; color: #dc2626;"><strong>Days Remaining:</strong> ${data.daysRemaining} days</p>
        </div>

        <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e3a8a; margin-top: 0;">Don't Let Your Progress Stop!</h3>
          <p style="color: #4b5563;">Continue your fitness journey without interruption. Renew your membership now to:</p>
          <ul style="color: #4b5563; padding-left: 20px;">
            <li style="margin: 8px 0;">Keep access to personalized workout plans</li>
            <li style="margin: 8px 0;">Continue with custom meal plans</li>
            <li style="margin: 8px 0;">Maintain 24/7 WhatsApp support</li>
            <li style="margin: 8px 0;">Track your ongoing progress</li>
            <li style="margin: 8px 0;">Stay motivated with expert guidance</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://coachhimanshu.com/#plans" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Renew Membership Now</a>
        </div>

        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin-top: 25px;">
          <p style="margin: 0 0 10px 0; color: #1e3a8a; font-weight: bold;">What Happens After Expiry?</p>
          <p style="margin: 5px 0; color: #1e40af;">• You'll lose access to personalized plans</p>
          <p style="margin: 5px 0; color: #1e40af;">• WhatsApp support will be discontinued</p>
          <p style="margin: 5px 0; color: #1e40af;">• Your progress data will be saved for 90 days</p>
          <p style="margin: 5px 0; color: #1e40af;">• You can reactivate anytime!</p>
        </div>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 25px; text-align: center;">
          <p style="margin: 0 0 10px 0; color: #1f2937; font-weight: bold;">Need Help?</p>
          <p style="margin: 5px 0; color: #4b5563;">Contact us for any questions about renewal or plan changes</p>
          <p style="margin: 10px 0; color: #1e40af;">📧 info@coachhimanshu.com</p>
          <p style="margin: 5px 0; color: #1e40af;">📱 WhatsApp: +91 7303484648</p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
        <p style="margin: 5px 0;">Coach Himanshu - NASM Certified Fitness Expert</p>
        <p style="margin: 5px 0;">Your fitness journey is our priority</p>
        <p style="margin: 10px 0;">
          <a href="https://coachhimanshu.com" style="color: #3b82f6; text-decoration: none;">coachhimanshu.com</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Coach Himanshu" <${process.env.SMTP_USER || 'info@coachhimanshu.com'}>`,
    to: data.clientEmail,
    subject: `⚠️ Your Membership Expires in ${data.daysRemaining} Days!`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}
