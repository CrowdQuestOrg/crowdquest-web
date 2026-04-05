// src/shared/components/Common/StatusBadge.tsx
import React from 'react';
import { CheckCircle, Clock, AlertCircle, Trophy } from 'lucide-react';

export interface StatusBadgeProps {
  status: 'found' | 'active' | 'expired' | 'completed';
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const config = {
    found: {
      label: 'Found',
      variant: 'badge-success',
      icon: CheckCircle,
    },
    active: {
      label: 'Active',
      variant: 'badge-info',
      icon: Clock,
    },
    expired: {
      label: 'Expired',
      variant: 'badge-warning',
      icon: AlertCircle,
    },
    completed: {
      label: 'Completed',
      variant: 'badge-gold',
      icon: Trophy,
    },
  };

  const { label, variant, icon: Icon } = config[status];
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`badge ${variant} ${sizes[size]}`}>
      {showIcon && <Icon className="w-3 h-3" />}
      {label}
    </span>
  );
};

export default StatusBadge;