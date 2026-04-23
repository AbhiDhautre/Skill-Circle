import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:shadow-[0_0_15px_var(--color-primary-glow)] hover:-translate-y-[1px] px-4 py-2',
    outline: 'border border-base-border bg-transparent text-text-secondary hover:text-text-primary hover:bg-base-surface px-4 py-2',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-base-surface px-3 py-1.5'
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
