/**
 * Utility functions for authentication and user management
 */

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns Boolean indicating if the email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: 'Password is strong' };
}

/**
 * Calculate password strength score (0-100)
 * @param password - Password to evaluate
 * @returns Numeric score representing password strength
 */
export function getPasswordStrength(password: string): number {
  if (!password) return 0;
  
  let score = 0;
  
  // Length contribution (up to 25 points)
  score += Math.min(25, password.length * 2);
  
  // Character variety contribution
  if (/[A-Z]/.test(password)) score += 15; // Uppercase
  if (/[a-z]/.test(password)) score += 10; // Lowercase
  if (/[0-9]/.test(password)) score += 15; // Numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 20; // Special chars
  
  // Variety of character types
  const charTypes = [
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ].filter(Boolean).length;
  
  score += charTypes * 5;
  
  // Penalize repetitive patterns
  if (/(.+)\1{2,}/.test(password)) score -= 15;
  
  // Penalize sequential characters
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
    score -= 10;
  }
  
  // Penalize sequential numbers
  if (/(?:012|123|234|345|456|567|678|789)/i.test(password)) {
    score -= 10;
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get descriptive strength label based on password score
 * @param score - Password strength score (0-100)
 * @returns String describing password strength
 */
export function getPasswordStrengthLabel(score: number): string {
  if (score < 30) return 'Very Weak';
  if (score < 50) return 'Weak';
  if (score < 70) return 'Moderate';
  if (score < 90) return 'Strong';
  return 'Very Strong';
}

/**
 * Get color class for password strength visualization
 * @param score - Password strength score (0-100)
 * @returns Tailwind CSS color class
 */
export function getPasswordStrengthColor(score: number): string {
  if (score < 30) return 'bg-danger';
  if (score < 50) return 'bg-warning';
  if (score < 70) return 'bg-yellow-500';
  if (score < 90) return 'bg-green-500';
  return 'bg-success';
}

/**
 * Generate a random secure token
 * @param length - Length of the token
 * @returns Random token string
 */
export function generateToken(length: number = 32): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  // Use crypto API if available for better randomness
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += characters.charAt(values[i] % charactersLength);
    }
    return result;
  }
  
  // Fallback to Math.random
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}