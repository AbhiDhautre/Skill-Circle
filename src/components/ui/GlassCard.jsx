import React from 'react';

export default function GlassCard({ children, className = '', hoverEffect = false, ...props }) {
  const hoverClasses = hoverEffect 
    ? 'hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer' 
    : '';

  return (
    <div 
      className={`bg-base-surface border border-base-border backdrop-blur-md rounded-xl shadow-sm ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
