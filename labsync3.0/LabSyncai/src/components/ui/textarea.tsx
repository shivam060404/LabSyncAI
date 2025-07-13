'use client';

import React from 'react';

type TextAreaProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
  id?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
  minHeight?: string;
};

export default function TextArea({
  placeholder = '',
  value = '',
  onChange,
  name,
  id,
  label,
  error,
  required = false,
  disabled = false,
  className = '',
  rows = 3,
  maxLength,
  minHeight,
}: TextAreaProps) {
  const textareaId = id || name;
  
  const baseClasses = 'bg-card-hover border border-gray-800 rounded-lg px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors';
  const errorClasses = error ? 'border-danger focus:ring-danger' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const heightStyle = minHeight ? { minHeight } : {};
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium mb-1">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        style={heightStyle}
        className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
      />
      
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
}