import LogoutButton from '@/components/auth/logout-button';
import React from 'react';

type Props = {};

const ChatPage = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 h-screen justify-center items-center">
      <h1 className="text-lg font-medium">Welcome, you are logged in!</h1>
      <LogoutButton />
    </div>
  );
};

export default ChatPage;
