import sgMail from '@sendgrid/mail';
import { logger } from '../utils/logger';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
  try {
    const msg = {
      to: options.to,
      from: options.from || process.env.SENDGRID_FROM_EMAIL!,
      subject: options.subject,
      html: options.html,
    };

    await sgMail.send(msg);
    logger.info('Email sent successfully', { to: options.to });
    return true;
  } catch (error) {
    logger.error('SendGrid error:', error);
    throw error;
  }
};