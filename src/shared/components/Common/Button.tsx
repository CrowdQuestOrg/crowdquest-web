// src/shared/components/Common/Button.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  disabled,
  type = 'button',
}) => {
  const variants = {
    primary: 'game-button-primary',
    secondary: 'game-button-secondary',
    outline: 'game-button-outline',
    danger: 'game-button-danger',
  };

  const sizes = {
    sm: 'game-button-sm',
    md: 'game-button-md',
    lg: 'game-button-lg',
  };

  return (
    <button
      type={type}
      className={`game-button ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;