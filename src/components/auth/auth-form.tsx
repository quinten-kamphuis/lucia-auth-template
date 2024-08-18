'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import LoginForm from './login-form';
import SignupForm from './signup-form';
import { TAuthFormState } from '@/lib/types/auth';
import GoogleButton from './google-button';
import { useSearchParams } from 'next/navigation';
import VerifyEmail from './verify-email';
import ResetPasswordForm from './reset-password-form';
import ForgotPasswordForm from './forgot-password-form';
import { Separator } from '@/components/ui/separator';

type Props = {};

const AuthForm = (props: Props) => {
  const [showForm, setShowForm] = useState<TAuthFormState>('none');
  const searchParams = useSearchParams();
  const verify = searchParams.get('verify');
  const token = searchParams.get('token');

  if (verify && token && verify === 'email') {
    return <VerifyEmail token={token} />;
  }
  if (verify && token && verify === 'password')
    return <ResetPasswordForm token={token} setShowForm={setShowForm} />;

  if (showForm === 'none') {
    return (
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-lg font-bold">Get started</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowForm('login')} variant="secondary">
            Log in
          </Button>
          <Button onClick={() => setShowForm('signup')} variant="default">
            Sign up
          </Button>
        </div>
      </div>
    );
  }

  if (showForm === 'forgot-password') {
    return <ForgotPasswordForm setShowForm={setShowForm} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {showForm === 'login' && <LoginForm setShowForm={setShowForm} />}
      {showForm === 'signup' && <SignupForm setShowForm={setShowForm} />}
      <Separator className="my-4 relative">
        <span className="text-muted-foreground absolute left-1/2 transform -translate-x-1/2 px-2 -top-3 bg-background">
          or
        </span>
      </Separator>
      <GoogleButton />
    </div>
  );
};

export default AuthForm;
