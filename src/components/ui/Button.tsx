import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600',
  secondary: 'bg-gray-500 text-white hover:bg-gray-600',
  outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50',
  danger: 'bg-red-500 text-white hover:bg-red-600'
};

export function Button({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        px-4 py-2 rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Loading...
        </div>
      ) : children}
    </button>
  );
}