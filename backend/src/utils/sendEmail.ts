import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL as string,
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};
