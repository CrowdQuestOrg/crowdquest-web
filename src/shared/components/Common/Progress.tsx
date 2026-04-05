export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  className?: string;
}

export const Progress = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  labelPosition = 'outside',
  className = '',
}: ProgressProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorStyles = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && labelPosition === 'outside' && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="text-gray-700 font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`
            ${colorStyles[color]} rounded-full transition-all duration-300
            ${sizeStyles[size]}
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {showLabel && labelPosition === 'inside' && percentage > 15 && (
            <span className="text-xs text-white px-2 flex items-center justify-center h-full">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};