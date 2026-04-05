export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square' | 'rounded';
  className?: string;
  onClick?: () => void;
}

export const Avatar = ({
  src,
  name,
  size = 'md',
  variant = 'circle',
  className = '',
  onClick,
}: AvatarProps) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const variantStyles = {
    circle: 'rounded-full',
    square: 'rounded-md',
    rounded: 'rounded-lg',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const bgColors = [
    'bg-primary',
    'bg-primary-light',
    'bg-primary-medium',
    'bg-primary-dark',
    'bg-success',
    'bg-warning',
    'bg-error',
  ];
  const bgColor = bgColors[(name?.length || 0) % bgColors.length];

  return (
    <div
      className={`
        flex items-center justify-center font-medium text-white
        ${sizeStyles[size]} ${variantStyles[variant]} ${bgColor}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover rounded-inherit" />
      ) : name ? (
        getInitials(name)
      ) : (
        <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      )}
    </div>
  );
};