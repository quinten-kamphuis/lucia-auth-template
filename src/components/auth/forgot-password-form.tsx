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
import { forgotPasswordSchema } from '@/lib/schemas/auth';
import { TAuthFormState, TForgotPasswordFormValues } from '@/lib/types/auth';
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
import { forgotPasswordAction } from '@/actions/auth';

type Props = {
  setShowForm: (form: TAuthFormState) => void;
};

const ForgotPasswordForm = ({ setShowForm }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<{
    message: string;
    type: 'error' | 'success';
  }>({
    message: '',
    type: 'error',
  });

  const form = useForm<TForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: TForgotPasswordFormValues) => {
    setFormMessage({ message: '', type: 'error' });
    startTransition(async () => {
      const res = await forgotPasswordAction(values);
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={formMessage.type === 'success' || isPending}
                      placeholder="Email"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the email you used to sign up.
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
                loadingMessage="Sending email..."
              >
                Send email
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

export default ForgotPasswordForm;
