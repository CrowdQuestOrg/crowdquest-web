import type { HTMLAttributes } from 'react';

export interface FormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const FormError = ({ children, className = '', ...props }: FormErrorProps) => {
  return (
    <p
      className={`text-sm text-error mt-1 flex items-center gap-1 ${className}`}
      {...props}
    >
      <span>{children}</span>
    </p>
  );
};