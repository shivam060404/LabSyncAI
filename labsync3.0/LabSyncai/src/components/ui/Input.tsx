import React from 'react';

type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  autoComplete?: string;
};

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  id,
  label,
  error,
  required = false,
  disabled = false,
  className = '',
  min,
  max,
  step,
  autoComplete,
}: InputProps) {
  const inputId = id || name;
  
  const baseClasses = 'bg-card-hover border border-gray-800 rounded-lg px-4 py-2 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors';
  const errorClasses = error ? 'border-danger focus:ring-danger' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium mb-1">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={inputId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={inputClasses}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
      />
      
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
}