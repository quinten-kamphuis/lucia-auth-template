import { cn } from '@/lib/utils';
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import React from 'react';

type Props = {
  type: 'error' | 'success';
  message: string;
};

const Message = ({ type, message }: Props) => {
  return (
    <div
      className={cn(
        'w-full rounded-md inline-flex gap-2 items-center text-sm h-9 px-4 py-2',
        type === 'error' && 'bg-red-100 text-red-800',
        type === 'success' && 'bg-green-100 text-green-800'
      )}
    >
      {type === 'error' && <ExclamationTriangleIcon />}
      {type === 'success' && <CheckCircledIcon />}
      <p>{message}</p>
    </div>
  );
};

export default Message;
