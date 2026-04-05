// src/shared/utils/formatters.ts
export const formatters = {
  // Format currency
  currency: (amount: number, symbol = 'CQT') => {
    return `${amount.toLocaleString()} ${symbol}`;
  },
  
  // Format address (truncate)
  address: (address: string, start = 6, end = 4) => {
    if (!address) return '';
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  },
  
  // Format date
  date: (date: Date | string | number) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },
  
  // Format time ago
  timeAgo: (date: Date | string | number) => {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  },
  
  // Format number with suffix (K, M, B)
  compactNumber: (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  },
  
  // Calculate percentage
  percentage: (value: number, total: number) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  },
};