import AuthForm from '@/components/auth/auth-form';
import React, { Suspense } from 'react';

type Props = {};

const LoginPage = (props: Props) => {
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <Suspense>
        <AuthForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
