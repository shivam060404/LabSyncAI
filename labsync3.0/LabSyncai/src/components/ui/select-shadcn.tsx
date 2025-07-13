import * as React from 'react';
import { cn } from '@/lib/utils';

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

export function Select({
  children,
  value,
  onValueChange,
  defaultValue,
}: SelectProps) {
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(defaultValue || value);
  
  const handleValueChange = React.useCallback((newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);
  
  React.useEffect(() => {
    if (value !== undefined && value !== selectedValue) {
      setSelectedValue(value);
    }
  }, [value, selectedValue]);
  
  return (
    <SelectContext.Provider value={{ value: selectedValue, onValueChange: handleValueChange }}>
      {children}
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SelectTrigger({ children, className, id }: SelectTriggerProps) {
  return (
    <div
      id={id}
      className={cn(
        'flex items-center justify-between rounded-md border border-gray-800 bg-card-hover px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer',
        className
      )}
    >
      {children}
      <svg
        className="h-5 w-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = React.useContext(SelectContext);
  return <span>{value || placeholder}</span>;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({ children, className }: SelectContentProps) {
  return (
    <div
      className={cn(
        'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-800 bg-card-hover py-1 shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}

export function SelectItem({ children, value, disabled, className }: SelectItemProps) {
  const { value: selectedValue, onValueChange } = React.useContext(SelectContext);
  
  const isSelected = selectedValue === value;
  
  const handleClick = () => {
    if (!disabled && onValueChange) {
      onValueChange(value);
    }
  };
  
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center px-4 py-2 text-white hover:bg-gray-700',
        isSelected && 'bg-accent text-white',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}