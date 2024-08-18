import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { getGoogleOauthConsentUrl } from '@/actions/auth';
import { toast } from '@/components/ui/use-toast';

type Props = {};

const GoogleButton = (props: Props) => {
  return (
    <Button
      onClick={async () => {
        const res = await getGoogleOauthConsentUrl();
        if (res.url) {
          window.location.href = res.url;
        } else {
          toast({
            title: 'Error',
            description: res.error,
            variant: 'destructive',
          });
        }
      }}
    >
      <FcGoogle className="w-4 h-4 mr-2" />
      Continue with Google
    </Button>
  );
};

export default GoogleButton;
