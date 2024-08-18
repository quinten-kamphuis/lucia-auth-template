'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useRef, useState } from 'react';
import { verifyEmailAction } from '@/actions/auth';
import Message from '../extra/message';
import Loading from '../extra/loading';
import { useRouter } from 'next/navigation';

type Props = {
  token: string;
};

const VerifyEmail = ({ token }: Props) => {
  const router = useRouter();
  const initialized = useRef(false);
  const [formMessage, setFormMessage] = useState<{
    message: string;
    type: 'error' | 'success';
  }>({
    message: '',
    type: 'error',
  });

  const onSubmit = useCallback(async () => {
    setFormMessage({ message: '', type: 'error' });
    if (formMessage.message) return;
    const res = await verifyEmailAction(token);
    if (res.error) {
      setFormMessage({ message: res.error, type: 'error' });
    } else if (res.success) {
      setFormMessage({ message: res.success, type: 'success' });
    }
  }, [token, formMessage.message]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      onSubmit();
    }
  }, [onSubmit, initialized]);

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Verify email</CardTitle>
        <CardDescription>We are verifying your email address.</CardDescription>
      </CardHeader>
      <CardContent>
        {!formMessage.message && (
          <div className="flex w-full items-center justify-center h-16 gap-4">
            <Loading className="h-6 w-6" />
            <span className="font-semibold text-lg">Verifying email</span>
          </div>
        )}
        {formMessage.message && (
          <Message type={formMessage.type} message={formMessage.message} />
        )}
      </CardContent>
      <CardFooter>
        {formMessage.message && (
          <Button variant="default" onClick={() => router.push('/auth/login')}>
            Back to sign in
          </Button>
        )}
        {formMessage.message && formMessage.type === 'error' && (
          <Button variant="secondary" onClick={onSubmit} className="ml-2">
            Try again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VerifyEmail;
