export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  className?: string;
  label?: string;
}

export const Divider = ({
  orientation = 'horizontal',
  variant = 'solid',
  className = '',
  label,
}: DividerProps) => {
  const variantStyles = {
    solid: 'border-gray-200',
    dashed: 'border-dashed border-gray-300',
    dotted: 'border-dotted border-gray-300',
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={`h-full w-px ${variantStyles[variant]} mx-2 ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${variantStyles[variant]}`} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-t ${variantStyles[variant]} my-4 ${className}`}
      role="separator"
    />
  );
};