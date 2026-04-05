// src/shared/components/Forms/Select.tsx
import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && <label className="game-label">{label}</label>}
        <select
          ref={ref}
          className={`game-input ${error ? 'border-red-500 focus:border-red-500' : ''}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;