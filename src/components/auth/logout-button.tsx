'use client';

import React, { useTransition } from 'react';
import LoadingButton from '../extra/loading-button';
import { logOutAction } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { DEFAULT_LOGOUT_REDIRECT } from '@/lib/routes';

type Props = {};

const LogoutButton = (props: Props) => {
  const [isPending, startTransition] = useTransition();
  return (
    <LoadingButton
      loading={isPending}
      onClick={() =>
        startTransition(async () => {
          await logOutAction();
          redirect(DEFAULT_LOGOUT_REDIRECT);
        })
      }
    >
      Logout
    </LoadingButton>
  );
};

export default LogoutButton;
