'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/AuthContext';
import { isValidEmail, validatePassword, getPasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from '../../../utils/authUtils';

export default function SignUp() {
  const router = useRouter();
  const { signup, isLoading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState('');
  
  // Update password strength when password changes
  useEffect(() => {
    if (password) {
      const score = getPasswordStrength(password);
      setPasswordScore(score);
      setPasswordStrength(getPasswordStrengthLabel(score));
    } else {
      setPasswordScore(0);
      setPasswordStrength('');
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await signup(name, email, password);
      
      if (result.success) {
        // Redirect to profile completion page after successful registration
        router.push('/profile/setup');
      } else {
        setError(result.message || 'Failed to create account');
      }
    } catch (err) {
      setError('An error occurred during sign up. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-accent mb-2">LABSYNC AI</h1>
          <h2 className="text-xl">Create an Account</h2>
        </div>
        
        {error && (
          <div className="bg-danger/20 border border-danger text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
              required
              minLength={8}
            />
            {password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Password Strength:</span>
                  <span className="text-xs font-medium">{passwordStrength}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getPasswordStrengthColor(passwordScore)}`}
                    style={{ width: `${passwordScore}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input w-full"
              required
              minLength={8}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary w-full"
            disabled={isLoading || authLoading}
          >
            {isLoading || authLoading ? 'Creating account...' : 'Sign Up'}
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-4 text-sm text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <button 
            type="button" 
            className="flex items-center justify-center w-full border border-gray-700 rounded-lg p-2 hover:bg-card-hover transition-colors"
          >
            <span className="mr-2">G</span>
            Google
          </button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}