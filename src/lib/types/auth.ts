import { z } from 'zod';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from '../schemas/auth';
import { getUser } from '@/lib/lucia';

export type TLoginFormValues = z.infer<typeof loginSchema>;

export type TSignupFormValues = z.infer<typeof signupSchema>;

export type TForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type TResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export type TAuthFormState = 'login' | 'signup' | 'none' | 'forgot-password';

export type TUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;
