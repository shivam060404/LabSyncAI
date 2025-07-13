'use client';

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Loading spinner component
 */
export default function Loading({ size = 'md', text, fullScreen = false, className = '' }: LoadingProps) {
  // Size classes
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  // Container classes
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-t-accent border-r-accent/30 border-b-accent/10 border-l-accent/10 animate-spin`}
      />
      {text && <p className="mt-4 text-sm text-gray-300">{text}</p>}
    </div>
  );
}