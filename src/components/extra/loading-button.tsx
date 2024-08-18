import React, { ButtonHTMLAttributes } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import Loading from './loading';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  children?: React.ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  loading: boolean;
  loadingMessage?: string;
  onClick?: () => void;
  variant?: ButtonProps;
};

const LoadingButton = ({
  className,
  children,
  type,
  loading,
  loadingMessage,
  onClick,
  variant,
  ...props
}: Props) => {
  return (
    <Button
      type={type}
      disabled={loading}
      className={cn('flex items-center gap-2', className)}
      onClick={onClick}
    >
      {loading && <Loading />}
      <span>{loading && loadingMessage ? loadingMessage : children}</span>
    </Button>
  );
};

export default LoadingButton;
