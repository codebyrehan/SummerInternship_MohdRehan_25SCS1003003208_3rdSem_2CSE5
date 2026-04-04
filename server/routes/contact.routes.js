import { Router } from 'express';
import { sendContactEmail } from '../services/email.service.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import Portfolio from '../models/Portfolio.js';

const router = Router();

// Public contact form submission
router.post('/', apiLimiter, async (req, res, next) => {
  try {
    const { name, email, message, portfolioSlug } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    let recipientEmail = process.env.SMTP_USER;

    // If portfolio slug provided, find the portfolio owner's email
    if (portfolioSlug) {
      const portfolio = await Portfolio.findOne({ slug: portfolioSlug }).populate('user', 'email');
      if (portfolio?.user?.email) {
        recipientEmail = portfolio.user.email;
      } else if (portfolio?.personalInfo?.email) {
        recipientEmail = portfolio.personalInfo.email;
      }
    }

    await sendContactEmail(recipientEmail, name, email, message);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    next(error);
  }
});

export default router;
