import nodemailer from 'nodemailer';

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || user === 'your_email@gmail.com') {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });
};

export const sendVerificationEmail = async (email, name, token) => {
  const transporter = getTransporter();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verifyUrl = `${clientUrl}/verify-email?token=${token}`;

  if (!transporter) {
    console.log(`📧 [Mock Email] Verification email to ${email}: ${verifyUrl}`);
    return { mock: true, url: verifyUrl };
  }

  await transporter.sendMail({
    from: `"QuickHire AI" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your QuickHire AI account',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #6366f1; font-size: 28px;">Welcome to QuickHire AI! 🚀</h1>
        <p style="color: #64748b; font-size: 16px;">Hi ${name},</p>
        <p style="color: #64748b; font-size: 16px;">Thanks for signing up. Please verify your email to get started:</p>
        <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #06b6d4); color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; margin: 20px 0;">Verify Email</a>
        <p style="color: #94a3b8; font-size: 14px;">This link expires in 24 hours.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email, name, token) => {
  const transporter = getTransporter();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password?token=${token}`;

  if (!transporter) {
    console.log(`📧 [Mock Email] Password reset to ${email}: ${resetUrl}`);
    return { mock: true, url: resetUrl };
  }

  await transporter.sendMail({
    from: `"QuickHire AI" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your QuickHire AI password',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #6366f1; font-size: 28px;">Password Reset Request</h1>
        <p style="color: #64748b; font-size: 16px;">Hi ${name},</p>
        <p style="color: #64748b; font-size: 16px;">Click below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #06b6d4); color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; margin: 20px 0;">Reset Password</a>
        <p style="color: #94a3b8; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

export const sendContactEmail = async (toEmail, fromName, fromEmail, message) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`📧 [Mock Contact] From ${fromName} (${fromEmail}) to ${toEmail}: ${message}`);
    return { mock: true };
  }

  await transporter.sendMail({
    from: `"QuickHire AI Contact" <${process.env.SMTP_USER}>`,
    to: toEmail,
    replyTo: fromEmail,
    subject: `Portfolio Contact: Message from ${fromName}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #6366f1;">New Portfolio Contact Message</h2>
        <p><strong>From:</strong> ${fromName} (${fromEmail})</p>
        <div style="background: #f1f5f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p style="color: #334155; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `,
  });
};
