// Shared chart colors based on Hiwot palette
export const chartColors = {
  primary: {
    main: '#006666',
    light: '#009999',
    dark: '#003333',
    lighter: '#00CCCC',
  },
  secondary: {
    cyan: '#00FFFF',
    teal: '#00CCCC',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  gradients: {
    start: '#006666',
    end: '#00CCCC',
  },
};

// Default color palette for multiple data series
export const defaultColors = [
  '#006666', // Primary
  '#009999', // Primary Light
  '#00CCCC', // Primary Lighter
  '#00FFFF', // Cyan
  '#10B981', // Success
  '#F59E0B', // Warning
  '#EF4444', // Error
  '#3B82F6', // Info
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];

export const getColor = (index: number): string => {
  return defaultColors[index % defaultColors.length];
};

export const getGradientFill = (color: string): string => {
  return `url(#gradient-${color.replace('#', '')})`;
};