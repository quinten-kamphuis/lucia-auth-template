'use client';

import React, { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, resetPasswordSchema } from '@/lib/schemas/auth';
import { TAuthFormState, TResetPasswordFormValues } from '@/lib/types/auth';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import Message from '../extra/message';
import LoadingButton from '../extra/loading-button';
import { useRouter } from 'next/navigation';
import { resetPasswordAction } from '@/actions/auth';

type Props = {
  token: string;
  setShowForm: (form: TAuthFormState) => void;
};

const ResetPasswordForm = ({ token, setShowForm }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<{
    message: string;
    type: 'error' | 'success';
  }>({
    message: '',
    type: 'error',
  });

  const form = useForm<TResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = (values: TResetPasswordFormValues) => {
    setFormMessage({ message: '', type: 'error' });
    startTransition(async () => {
      const res = await resetPasswordAction(values, token);
      if (res.error) {
        setFormMessage({ message: res.error, type: 'error' });
      } else if (res.success) {
        setFormMessage({ message: res.success, type: 'success' });
      }
    });
  };

  const handelGoBack = () => {
    form.reset();
    setShowForm('login');
    router.push('/auth/login');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Please enter your new password.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={formMessage.type === 'success' || isPending}
                      placeholder="Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your password must be at least 8 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={formMessage.type === 'success' || isPending}
                      placeholder="Confirm password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please re-enter your password to confirm.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formMessage.message && (
              <Message type={formMessage.type} message={formMessage.message} />
            )}
            {formMessage.type !== 'success' && (
              <LoadingButton
                loading={isPending}
                type="submit"
                className="w-full"
                loadingMessage="Resetting password..."
              >
                Reset password
              </LoadingButton>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handelGoBack}>
          Go back to login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordForm;
