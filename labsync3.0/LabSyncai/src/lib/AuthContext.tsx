'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import api from './api';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get<UserProfile>('/auth/me');
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<UserProfile>('/auth/login', { email, password });
      
      if (response.success && response.data) {
        setUser(response.data);
        return { success: true };
      }
      
      return { 
        success: false, 
        message: response.error || 'Login failed. Please check your credentials.'
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<UserProfile>('/auth/signup', { name, email, password });
      
      if (response.success && response.data) {
        setUser(response.data);
        return { success: true };
      }
      
      return { 
        success: false, 
        message: response.error || 'Signup failed. Please try again.'
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };
  
  // Update profile function
  const updateProfile = async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      const response = await api.patch<UserProfile>('/auth/profile', data);
      
      if (response.success && response.data) {
        setUser(response.data);
        return { success: true };
      }
      
      return { 
        success: false, 
        message: response.error || 'Failed to update profile. Please try again.'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}