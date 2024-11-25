import { config } from '../config';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const response = await fetch(`${config.API_URL}/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: options.html,
        from: options.from || config.EMAIL_FROM,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    logger.info('Email sent successfully', { to: options.to });
    return true;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
}