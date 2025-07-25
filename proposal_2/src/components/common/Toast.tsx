import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-miranda-orange-dark" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-miranda-orange-light/10 border-miranda-orange-light';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-miranda-orange-dark';
    }
  };

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 border rounded-lg p-4 flex items-center gap-3 shadow-lg ${getBgColor()}`}>
      {getIcon()}
      <span className={`flex-1 text-sm font-medium ${getTextColor()}`}>{message}</span>
      <button
        onClick={onClose}
        className={`hover:opacity-70 font-bold text-lg ${getTextColor()}`}
      >
        ×
      </button>
    </div>
  );
};