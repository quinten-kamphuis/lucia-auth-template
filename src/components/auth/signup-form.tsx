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
import { signupSchema } from '@/lib/schemas/auth';
import { TAuthFormState, TSignupFormValues } from '@/lib/types/auth';
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
import Message from '../extra/message';
import LoadingButton from '../extra/loading-button';
import { signupAction } from '@/actions/auth';

type Props = {
  setShowForm: (form: TAuthFormState) => void;
};

const SignupForm = ({ setShowForm }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<{
    message: string;
    type: 'error' | 'success';
  }>({
    message: '',
    type: 'error',
  });

  const form = useForm<TSignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: TSignupFormValues) => {
    setFormMessage({ message: '', type: 'error' });
    startTransition(async () => {
      const res = await signupAction(values);
      if (res.error) {
        form.setValue('password', '');
        setFormMessage({ message: res.error, type: 'error' });
      } else if (res.success) {
        setFormMessage({ message: res.success, type: 'success' });
      }
    });
  };

  const handelGoBack = () => {
    form.reset();
    setShowForm('none');
  };
  const handleHasAccount = () => {
    form.reset();
    setShowForm('login');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Fill in the form below to create an account.
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
                      disabled={isPending}
                      placeholder="Email"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    We will send your confirmation to this email.
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
                    Use at least 8 characters for a strong password.
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
                      disabled={isPending}
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
            <LoadingButton
              loading={isPending}
              type="submit"
              className="w-full"
              loadingMessage="Signing up..."
            >
              Sign up
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handelGoBack}>
          Go back
        </Button>
        <Button variant="link" onClick={handleHasAccount}>
          Already have an account?
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
