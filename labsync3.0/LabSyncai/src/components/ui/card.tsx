import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
};

export default function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
}: CardProps) {
  const baseClasses = 'bg-card rounded-xl border border-gray-800 p-6';
  const hoverClasses = hoverable ? 'hover:border-accent/50 transition-colors cursor-pointer' : '';
  const cardClasses = `${baseClasses} ${hoverClasses} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
}

type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

type CardTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
}

type CardDescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`px-1 py-2 ${className}`}>{children}</div>;
}

type CardFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={`mt-4 flex justify-end ${className}`}>{children}</div>;
}