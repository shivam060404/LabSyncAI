/**
 * Language Context for LabSyncAI
 * Provides language and localization context for the application
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, LanguagePreference } from '@/types';
import { localizationService } from '@/lib/localizationService';

// Default language preference
const defaultLanguagePreference: LanguagePreference = {
  primary: 'en',
  useTranslatedReports: false,
  useTranslatedRecommendations: false,
  smsNotifications: false,
  voiceLanguage: 'en',
};

// Context type definition
interface LanguageContextType {
  language: SupportedLanguage;
  languagePreference: LanguagePreference;
  setLanguage: (language: SupportedLanguage) => void;
  updateLanguagePreference: (preference: Partial<LanguagePreference>) => void;
  translate: (key: string) => string;
  region: string;
  setRegion: (region: string) => void;
  availableLanguages: SupportedLanguage[];
  availableRegions: string[];
}

// Create the context
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Available languages
const availableLanguages: SupportedLanguage[] = [
  'en', // English
  'hi', // Hindi
  'bn', // Bengali
  'te', // Telugu
  'ta', // Tamil
  'mr', // Marathi
  'gu', // Gujarati
  'kn', // Kannada
  'ml', // Malayalam
  'pa', // Punjabi
  'ur', // Urdu
  'or', // Odia
  'as', // Assamese
];

// Available regions
const availableRegions: string[] = [
  'All India',
  'North India',
  'South India',
  'East India',
  'West India',
  'Northeast India',
];

/**
 * Language Provider Component
 */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for language and preferences
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [languagePreference, setLanguagePreference] = useState<LanguagePreference>(defaultLanguagePreference);
  const [region, setRegionState] = useState<string>('All India');
  
  // Effect to initialize from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load language preference from localStorage
      const storedPreference = localStorage.getItem('languagePreference');
      if (storedPreference) {
        try {
          const parsedPreference = JSON.parse(storedPreference) as LanguagePreference;
          setLanguagePreference(parsedPreference);
          setLanguageState(parsedPreference.primary);
        } catch (error) {
          console.error('Error parsing stored language preference:', error);
        }
      }
      
      // Load region from localStorage
      const storedRegion = localStorage.getItem('region');
      if (storedRegion) {
        setRegionState(storedRegion);
      }
    }
  }, []);
  
  // Effect to update localization service when language changes
  useEffect(() => {
    localizationService.setLanguage(language);
  }, [language]);
  
  // Effect to update localization service when region changes
  useEffect(() => {
    localizationService.setRegion(region);
  }, [region]);
  
  // Set language and update localStorage
  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    setLanguagePreference(prev => {
      const updated = { ...prev, primary: newLanguage };
      if (typeof window !== 'undefined') {
        localStorage.setItem('languagePreference', JSON.stringify(updated));
      }
      return updated;
    });
  };
  
  // Update language preference and localStorage
  const updateLanguagePreference = (preference: Partial<LanguagePreference>) => {
    setLanguagePreference(prev => {
      const updated = { ...prev, ...preference };
      if (typeof window !== 'undefined') {
        localStorage.setItem('languagePreference', JSON.stringify(updated));
      }
      return updated;
    });
    
    // If primary language is updated, also update the current language
    if (preference.primary) {
      setLanguageState(preference.primary);
    }
  };
  
  // Set region and update localStorage
  const setRegion = (newRegion: string) => {
    setRegionState(newRegion);
    if (typeof window !== 'undefined') {
      localStorage.setItem('region', newRegion);
    }
  };
  
  // Translate function that uses the localization service
  const translate = (key: string) => {
    return localizationService.translate(key);
  };
  
  // Context value
  const contextValue: LanguageContextType = {
    language,
    languagePreference,
    setLanguage,
    updateLanguagePreference,
    translate,
    region,
    setRegion,
    availableLanguages,
    availableRegions,
  };
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to use the language context
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};