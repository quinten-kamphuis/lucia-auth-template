'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from '@/lib/schemas/auth';
import { Argon2id } from 'oslo/password';
import { lucia } from '@/lib/lucia';
import { generateCodeVerifier, generateState } from 'arctic';
import {
  generatePasswordResetToken,
  generateVerificationToken,
  getPasswordResetTokenByToken,
  getVerificationTokenByToken,
} from '@/lib/server-utils/tokens';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes';
import { googleOAuthClient } from '@/lib/clients/googleOauth';

export const signupAction = async (values: unknown) => {
  try {
    const { email, password } = signupSchema.parse(values);
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return { error: 'Email already in use.' };
    }

    const hashedPassword = await new Argon2id().hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    const { token } = await generateVerificationToken(user.email);
    await sendVerificationEmail(email, token);
    return { success: 'Confirmation email sent!' };
  } catch (error) {
    console.error(error);
    return { error: 'Something went wrong' };
  }
};

export const loginAction = async (values: unknown, callbackUrl: unknown) => {
  try {
    const { email, password } = loginSchema.parse(values);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user || !user.hashedPassword) {
      return { error: 'Invalid Credentials!' };
    }
    const passwordMatch = await new Argon2id().verify(
      user.hashedPassword,
      password
    );
    if (!passwordMatch) {
      return { error: 'Invalid Credentials!' };
    }

    if (!user.emailVerified) {
      const { token } = await generateVerificationToken(user.email);
      await sendVerificationEmail(email, token);
      return { success: 'Confirmation email sent!' };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    let redirectUrl = DEFAULT_LOGIN_REDIRECT;
    if (typeof callbackUrl === 'string' && callbackUrl.startsWith('/')) {
      redirectUrl = callbackUrl;
    }

    return { success: 'Logged in!', redirect: redirectUrl };
  } catch (error) {
    console.error(error);
    return { error: 'Something went wrong' };
  }
};

export const logOutAction = async () => {
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};

export const verifyEmailAction = async (token: string) => {
  try {
    const verificationToken = await getVerificationTokenByToken(token);
    if (!verificationToken) {
      return { error: 'Invalid token' };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: verificationToken.email,
      },
    });
    if (!user) {
      return { error: 'User not found' };
    }

    if (new Date(verificationToken.expires) < new Date()) {
      return { error: 'Token expired' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { success: 'Email verified!' };
  } catch (error) {
    console.error(error);
    return { error: 'Something went wrong' };
  }
};

export const forgotPasswordAction = async (values: unknown) => {
  try {
    const { email } = forgotPasswordSchema.parse(values);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return { error: 'User not found' };
    }

    const { token } = await generatePasswordResetToken(user.email);
    await sendPasswordResetEmail(email, token);
    return { success: 'Password reset email sent!' };
  } catch (error) {
    console.error(error);
    return { error: 'Something went wrong' };
  }
};

export const resetPasswordAction = async (values: unknown, token: unknown) => {
  try {
    const { password, passwordConfirmation } =
      resetPasswordSchema.parse(values);
    if (typeof token !== 'string') {
      return { error: 'Invalid token!' };
    }

    if (password !== passwordConfirmation) {
      return { error: 'Passwords do not match!' };
    }

    const passwordResetToken = await getPasswordResetTokenByToken(token);
    if (!passwordResetToken) {
      return { error: 'Invalid token!' };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: passwordResetToken.email,
      },
    });
    if (!user) {
      return { error: 'User not found' };
    }

    if (new Date(passwordResetToken.email) < new Date()) {
      return { error: 'Token expired' };
    }

    const hashedPassword = await new Argon2id().hash(password);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: passwordResetToken.id },
    });

    return { success: 'Password updated!' };
  } catch (error) {
    console.error(error);
    return { error: 'Something went wrong' };
  }
};

export const getGoogleOauthConsentUrl = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set('codeVerifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    cookies().set('state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    const authUrl = await googleOAuthClient.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ['email', 'profile'],
      }
    );
    return {
      success: 'Successfully created Google OAuth URL',
      url: authUrl.toString(),
    };
  } catch (error) {
    return { error: 'Something went wrong' };
  }
};
