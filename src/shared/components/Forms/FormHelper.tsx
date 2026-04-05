import type { HTMLAttributes } from 'react';

export interface FormHelperProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const FormHelper = ({ children, className = '', ...props }: FormHelperProps) => {
  return (
    <p
      className={`text-sm text-gray-500 mt-1 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};