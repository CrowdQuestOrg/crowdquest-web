export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rounded' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}: SkeletonProps) => {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    rectangular: '',
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : 'auto'),
    height: height || (variant === 'text' ? '1rem' : 'auto'),
  };

  const skeletonItem = (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${variantStyles[variant]}
        ${className}
      `}
      style={style}
    />
  );

  if (count === 1) return skeletonItem;

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{skeletonItem}</div>
      ))}
    </div>
  );
};