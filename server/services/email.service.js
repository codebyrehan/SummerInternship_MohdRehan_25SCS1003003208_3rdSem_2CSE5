// Email service stubbed — nodemailer removed for Render free tier
export const sendEmail = async () => ({ success: false, message: 'Email not configured' });
export const sendWelcomeEmail = async () => {};
export const sendPasswordResetEmail = async () => {};
export const sendVerificationEmail = async () => {};
export default { sendEmail, sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail };
