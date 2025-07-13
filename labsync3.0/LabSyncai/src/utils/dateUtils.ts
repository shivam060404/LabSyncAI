/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date to a readable string
 * @param date - Date to format
 * @param format - Format style ('short', 'medium', 'long', 'full')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
  };
  
  if (format === 'long' || format === 'full') {
    options.weekday = format === 'full' ? 'long' : 'short';
  }
  
  if (format === 'full') {
    options.hour = 'numeric';
    options.minute = 'numeric';
    options.second = format === 'full' ? 'numeric' : undefined;
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * @param date - Date to compare against current time
 * @returns Relative time string
 */
export function getRelativeTimeString(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  const diffInSecs = Math.round(diffInMs / 1000);
  const diffInMins = Math.round(diffInSecs / 60);
  const diffInHours = Math.round(diffInMins / 60);
  const diffInDays = Math.round(diffInHours / 24);
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  if (Math.abs(diffInDays) >= 365) {
    return formatDate(dateObj, 'medium');
  } else if (Math.abs(diffInDays) >= 30) {
    const months = Math.round(diffInDays / 30);
    return rtf.format(months, 'month');
  } else if (Math.abs(diffInDays) >= 1) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInHours) >= 1) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInMins) >= 1) {
    return rtf.format(diffInMins, 'minute');
  } else {
    return rtf.format(diffInSecs, 'second');
  }
}

/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date of birth
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: Date | string | number): number {
  const birthDate = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
  
  if (isNaN(birthDate.getTime())) {
    return 0;
  }
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}