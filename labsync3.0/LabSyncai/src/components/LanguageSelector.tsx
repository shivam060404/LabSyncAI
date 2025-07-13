/**
 * Language Selector Component for LabSyncAI
 * Provides a dropdown for quick language switching in the navigation bar
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SupportedLanguage } from '../types';

interface LanguageSelectorProps {
  variant?: 'minimal' | 'standard';
  className?: string;
}

/**
 * Language Selector Component
 * @param variant - 'minimal' for icon-only, 'standard' for text and icon
 * @param className - Additional CSS classes
 */
export default function LanguageSelector({ 
  variant = 'standard',
  className = ''
}: LanguageSelectorProps) {
  const { language, setLanguage, translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Language options with their display names
  const languageOptions: { code: SupportedLanguage; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' }
  ];
  
  // Get current language display info
  const currentLanguage = languageOptions.find(lang => lang.code === language) || languageOptions[0];
  
  // Handle language change
  const handleLanguageChange = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setIsOpen(false);
  };
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);
  
  // Prevent clicks inside the dropdown from closing it
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div className={`relative ${className}`} onClick={handleDropdownClick}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none"
        aria-label={translate('Change language')}
        title={translate('Change language')}
      >
        {variant === 'standard' && (
          <span className="text-sm font-medium">
            {currentLanguage.nativeName}
          </span>
        )}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-gray-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
          />
        </svg>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-gray-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
          {languageOptions.map((option) => (
            <button
              key={option.code}
              onClick={() => handleLanguageChange(option.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${language === option.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
            >
              <span className="flex items-center">
                <span className="mr-2">{option.nativeName}</span>
              </span>
              {language === option.code && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-blue-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}