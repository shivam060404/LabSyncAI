/**
 * Language Provider Component for LabSyncAI
 * Wraps the application with the LanguageContext
 */

'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import { SupportedLanguage, LanguagePreference } from '@/types';
import { getTranslation, getAvailableLanguages, getAvailableRegions } from '@/lib/localizationService';

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
  initialRegion?: string;
}

/**
 * Language Provider Component
 * @param children - Child components
 * @param initialLanguage - Initial language code
 * @param initialRegion - Initial region code
 */
export function LanguageProvider({ 
  children, 
  initialLanguage = 'en',
  initialRegion = 'North India'
}: LanguageProviderProps) {
  // State for current language and preferences
  const [language, setLanguageState] = useState<SupportedLanguage>(initialLanguage);
  const [region, setRegionState] = useState<string>(initialRegion);
  const [languagePreference, setLanguagePreference] = useState<LanguagePreference>({
    primary: initialLanguage,
    secondary: 'en',
    voiceLanguage: initialLanguage,
    useTranslatedReports: true,
    useTranslatedRecommendations: true,
    smsNotifications: false
  });
  
  // Available languages and regions
  const availableLanguages = getAvailableLanguages();
  const availableRegions = getAvailableRegions();
  
  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Load language
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
          setLanguageState(savedLanguage as SupportedLanguage);
        }
        
        // Load region
        const savedRegion = localStorage.getItem('region');
        if (savedRegion) {
          setRegionState(savedRegion);
        }
        
        // Load language preferences
        const savedPreferences = localStorage.getItem('languagePreference');
        if (savedPreferences) {
          setLanguagePreference(JSON.parse(savedPreferences));
        }
      } catch (error) {
        console.error('Error loading language preferences:', error);
      }
    }
  }, []);
  
  // Save language to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);
  
  // Save region to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('region', region);
    }
  }, [region]);
  
  // Save language preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('languagePreference', JSON.stringify(languagePreference));
    }
  }, [languagePreference]);
  
  // Set language
  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    // Also update primary language in preferences
    setLanguagePreference(prev => ({
      ...prev,
      primary: newLanguage
    }));
  };
  
  // Set region
  const setRegion = (newRegion: string) => {
    setRegionState(newRegion);
  };
  
  // Update language preference
  const updateLanguagePreference = (updates: Partial<LanguagePreference>) => {
    setLanguagePreference(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  // Translate function
  const translate = (key: string): string => {
    return getTranslation(key, language);
  };
  
  // Context value
  const contextValue = {
    language,
    setLanguage,
    languagePreference,
    updateLanguagePreference,
    translate,
    region,
    setRegion,
    availableLanguages,
    availableRegions
  };
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}