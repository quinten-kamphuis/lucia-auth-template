import 'server-only';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

//TODO: Change to your email address
const from = 'Lucia Auth Template <onboarding@resend.dev>';

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const confirmLink = `${process.env.BASE_URL}/auth/login?verify=email&token=${token}`;
    const res = await resend.emails.send({
      from,
      to: email,
      subject: 'Verify your email address',
      //TODO: Change to react: <component>
      //(https://resend.dev/docs/emails#react-components)
      //(https://react.email/docs/introduction)
      html: `
        <p>Click the link below to verify your email address:</p>
        <a href="${confirmLink}">${confirmLink}</a>
      `,
    });
    if (res.error) {
      console.error('Failed to send verification email:', res.error);
    }
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetLink = `${process.env.BASE_URL}/auth/login?verify=password&token=${token}`;
    await resend.emails.send({
      from,
      to: email,
      subject: 'Reset your password',
      //TODO: Change to react: <component>
      //(https://resend.dev/docs/emails#react-components)
      //(https://react.email/docs/introduction)
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};
