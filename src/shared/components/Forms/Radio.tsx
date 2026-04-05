import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Label } from './Label';
import { FormError } from './FormError';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  options: RadioOption[];
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
  labelClassName?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      options,
      label,
      error,
      helper,
      containerClassName = '',
      labelClassName = '',
      orientation = 'vertical',
      value,
      name,
      disabled,
      onChange,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const radioName = name || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`${containerClassName}`}>
        {label && (
          <Label className={labelClassName}>
            {label}
          </Label>
        )}
        
        <div className={`mt-1 ${orientation === 'vertical' ? 'space-y-2' : 'flex space-x-4'}`}>
          {options.map((option) => (
            <label
              key={option.value}
              className={`flex items-center ${option.disabled || disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <input
                type="radio"
                name={radioName}
                value={option.value}
                checked={value === option.value}
                disabled={disabled || option.disabled}
                onChange={onChange}
                className={`w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20 border-gray-300 ${
                  disabled || option.disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'
                }`}
                {...props}
              />
              <span className={`ml-2 text-sm ${disabled || option.disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
        
        {helper && !error && (
          <p className="text-xs text-gray-500 mt-1">{helper}</p>
        )}
        {hasError && <FormError>{error}</FormError>}
      </div>
    );
  }
);

Radio.displayName = 'Radio';