import type { FC } from 'react';

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  className?: string;
}

const variants = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  error: 'bg-red-50 text-red-800 border-red-200'
};

export const Alert: FC<AlertProps> = ({ type, message, className = '' }) => {
  return (
    <div className={`p-4 rounded-lg border ${variants[type]} ${className}`}>
      {message}
    </div>
  );
}