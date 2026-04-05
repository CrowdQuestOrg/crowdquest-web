// src/shared/components/Common/Toast.tsx
import React from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: 'bg-green-500/90 border-green-400',
    error: 'bg-red-500/90 border-red-400',
    info: 'bg-blue-500/90 border-blue-400',
    warning: 'bg-yellow-500/90 border-yellow-400',
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`${colors[type]} backdrop-blur-md border rounded-xl shadow-lg p-4 min-w-[300px] relative`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
        <p className="text-white text-sm flex-1">{message}</p>
        <button onClick={() => onClose(id)} className="text-white/70 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;