'use client';

import React from 'react';

type AvatarProps = {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
};

type AvatarFallbackProps = {
  children: React.ReactNode;
  className?: string;
};

export function Avatar({
  src,
  alt = '',
  fallback,
  size = 'md',
  className = '',
  children,
}: AvatarProps) {
  const [error, setError] = React.useState(false);
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const baseClasses = 'rounded-full overflow-hidden flex items-center justify-center bg-card-hover';
  
  return (
    <div className={`${baseClasses} ${sizeClasses[size]} ${className}`}>
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : children ? (
        children
      ) : fallback ? (
        <div className="text-white font-medium">{fallback}</div>
      ) : (
        <div className="text-white font-medium">U</div>
      )}
    </div>
  );
}

export function AvatarFallback({ children, className = '' }: AvatarFallbackProps) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-accent text-white font-medium ${className}`}>
      {children}
    </div>
  );
}