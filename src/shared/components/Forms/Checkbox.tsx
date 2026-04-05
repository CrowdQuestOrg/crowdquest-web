import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Label } from './Label';
import { FormError } from './FormError';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helper,
      containerClassName = '',
      labelClassName = '',
      className = '',
      disabled,
      checked,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className={`${containerClassName}`}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={checkboxId}
              name={name}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              className={`w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 transition-colors ${
                disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'
              } ${className}`}
              aria-invalid={hasError}
              {...props}
            />
          </div>
          {label && (
            <div className="ml-3">
              <Label
                htmlFor={checkboxId}
                className={`text-sm font-normal ${disabled ? 'text-gray-400' : 'text-gray-700'} ${labelClassName}`}
              >
                {label}
              </Label>
              {helper && !error && (
                <p className="text-xs text-gray-500 mt-0.5">{helper}</p>
              )}
            </div>
          )}
        </div>
        {hasError && <FormError>{error}</FormError>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';