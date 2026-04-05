// src/shared/components/Forms/TextArea.tsx
import React, { forwardRef } from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  rows?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, fullWidth = true, rows = 4, className = '', ...props }, ref) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && <label className="game-label">{label}</label>}
        <textarea
          ref={ref}
          rows={rows}
          className={`game-input ${error ? 'border-red-500 focus:border-red-500' : ''}`}
          {...props}
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;