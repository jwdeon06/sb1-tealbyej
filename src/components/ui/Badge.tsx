import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800'
};

export function Badge({ variant = 'primary', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}