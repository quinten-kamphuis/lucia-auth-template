import { randomUUID } from 'crypto';
import 'server-only';
import prisma from '@/lib/prisma';
import {
  EMAIL_VERIFICATION_TOKEN_EXPIRY,
  PASSWORD_RESET_TOKEN_EXPIRY,
} from '../constants/auth';

export const generateVerificationToken = async (email: string) => {
  const token = randomUUID();
  const expires = new Date(
    new Date().getTime() + EMAIL_VERIFICATION_TOKEN_EXPIRY
  );

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      token,
      email,
      expires,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = randomUUID();
  const expires = new Date(new Date().getTime() + PASSWORD_RESET_TOKEN_EXPIRY);

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      token,
      email,
      expires,
    },
  });

  return passwordResetToken;
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch (error) {
    console.error('Failed to fetch verification token:', error);
    throw new Error('Failed to process verification token');
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch (error) {
    console.error('Failed to fetch verification token:', error);
    throw new Error('Failed to process verification token');
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        email,
      },
    });

    return passwordResetToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};
