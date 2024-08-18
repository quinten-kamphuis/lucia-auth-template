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
import { loginSchema } from '@/lib/schemas/auth';
import { TAuthFormState, TLoginFormValues } from '@/lib/types/auth';
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
import { loginAction } from '@/actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  setShowForm: (form: TAuthFormState) => void;
};

const LoginForm = ({ setShowForm }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<{
    message: string;
    type: 'error' | 'success';
  }>({
    message: '',
    type: 'error',
  });

  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: TLoginFormValues) => {
    setFormMessage({ message: '', type: 'error' });
    startTransition(async () => {
      const res = await loginAction(values, callbackUrl);
      if (res.error) {
        form.setValue('password', '');
        setFormMessage({ message: res.error, type: 'error' });
      } else if (res.success) {
        if (res.redirect) {
          toast({
            title: 'Success',
            description: res.success,
          });
          router.push(res.redirect);
        } else {
          setFormMessage({ message: res.success, type: 'success' });
        }
      }
    });
  };

  const handelGoBack = () => {
    form.reset();
    setShowForm('none');
  };
  const handleNoAccount = () => {
    form.reset();
    setShowForm('signup');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to log in</CardDescription>
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
                      disabled={isPending}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the password you used to sign up.
                  </FormDescription>
                  <FormMessage />
                  <Button
                    variant="link"
                    type="button"
                    className="p-0"
                    onClick={() => {
                      form.reset();
                      setShowForm('forgot-password');
                    }}
                  >
                    Forgot password?
                  </Button>
                </FormItem>
              )}
            />
            {formMessage.message && (
              <Message type={formMessage.type} message={formMessage.message} />
            )}
            <LoadingButton
              loading={isPending}
              type="submit"
              className="w-full"
              loadingMessage="Logging in..."
            >
              Log in
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handelGoBack}>
          Go back
        </Button>
        <Button variant="link" onClick={handleNoAccount}>
          Don&apos;t have an account yet?
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
