/**
 * Language Settings Component for LabSyncAI
 * Allows users to configure language preferences and regional settings
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SupportedLanguage, LanguagePreference, SmsNotificationSettings } from '@/types';

/**
 * Language Settings Component
 */
export default function LanguageSettings() {
  // Get language context
  const { 
    language, 
    languagePreference, 
    updateLanguagePreference, 
    setLanguage,
    translate,
    region,
    setRegion,
    availableLanguages,
    availableRegions
  } = useLanguage();
  
  // Local state for SMS settings
  const [smsSettings, setSmsSettings] = useState<SmsNotificationSettings>({
    enabled: languagePreference.smsNotifications,
    phoneNumber: '',
    language: languagePreference.primary,
    notifyOnNewReport: true,
    notifyOnAbnormalResults: true,
    notifyOnRecommendations: false,
    includeReportSummary: true,
    maxMessageLength: 160
  });
  
  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as SupportedLanguage;
    setLanguage(newLanguage);
  };
  
  // Handle region change
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
  };
  
  // Handle preference toggle
  const handlePreferenceToggle = (key: keyof LanguagePreference) => {
    updateLanguagePreference({
      [key]: !languagePreference[key]
    } as Partial<LanguagePreference>);
    
    // Update SMS settings if smsNotifications is toggled
    if (key === 'smsNotifications') {
      setSmsSettings(prev => ({
        ...prev,
        enabled: !languagePreference.smsNotifications
      }));
    }
  };
  
  // Handle SMS settings change
  const handleSmsSettingsChange = (key: keyof SmsNotificationSettings, value: any) => {
    setSmsSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle save SMS settings
  const handleSaveSmsSettings = () => {
    // In a real app, this would save to the user's profile in the database
    console.log('Saving SMS settings:', smsSettings);
    
    // Show success message
    alert(translate('SMS settings saved successfully'));
  };
  
  // Get language name
  const getLanguageName = (code: SupportedLanguage): string => {
    const languageNames: Record<SupportedLanguage, string> = {
      en: 'English',
      hi: 'हिन्दी (Hindi)',
      bn: 'বাংলা (Bengali)',
      te: 'తెలుగు (Telugu)',
      ta: 'தமிழ் (Tamil)',
      mr: 'मराठी (Marathi)',
      gu: 'ગુજરાતી (Gujarati)',
      kn: 'ಕನ್ನಡ (Kannada)',
      ml: 'മലയാളം (Malayalam)',
      pa: 'ਪੰਜਾਬੀ (Punjabi)',
      ur: 'اردو (Urdu)',
      or: 'ଓଡ଼ିଆ (Odia)',
      as: 'অসমীয়া (Assamese)'
    };
    
    return languageNames[code] || code;
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{translate('Language Settings')}</h2>
      
      {/* Primary Language Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {translate('Primary Language')}
        </label>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableLanguages.map(lang => (
            <option key={lang} value={lang}>
              {getLanguageName(lang)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-sm text-gray-500">
          {translate('This will be used for the main interface')}
        </p>
      </div>
      
      {/* Region Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {translate('Region')}
        </label>
        <select
          value={region}
          onChange={handleRegionChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableRegions.map(reg => (
            <option key={reg} value={reg}>
              {translate(reg)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-sm text-gray-500">
          {translate('This will be used for region-specific reference ranges')}
        </p>
      </div>
      
      {/* Translation Preferences */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{translate('Translation Preferences')}</h3>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="translateReports"
              checked={languagePreference.useTranslatedReports}
              onChange={() => handlePreferenceToggle('useTranslatedReports')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="translateReports" className="ml-2 block text-sm text-gray-700">
              {translate('Translate medical reports')}
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="translateRecommendations"
              checked={languagePreference.useTranslatedRecommendations}
              onChange={() => handlePreferenceToggle('useTranslatedRecommendations')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="translateRecommendations" className="ml-2 block text-sm text-gray-700">
              {translate('Translate health recommendations')}
            </label>
          </div>
        </div>
      </div>
      
      {/* Voice Language */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {translate('Voice Interface Language')}
        </label>
        <select
          value={languagePreference.voiceLanguage}
          onChange={(e) => updateLanguagePreference({ voiceLanguage: e.target.value as SupportedLanguage })}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableLanguages.map(lang => (
            <option key={lang} value={lang}>
              {getLanguageName(lang)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-sm text-gray-500">
          {translate('This will be used for voice interactions')}
        </p>
      </div>
      
      {/* SMS Notifications */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="smsNotifications"
            checked={languagePreference.smsNotifications}
            onChange={() => handlePreferenceToggle('smsNotifications')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="smsNotifications" className="ml-2 block text-sm font-medium text-gray-700">
            {translate('Enable SMS Notifications')}
          </label>
        </div>
        
        {languagePreference.smsNotifications && (
          <div className="pl-6 border-l-2 border-blue-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate('Phone Number')}
              </label>
              <input
                type="tel"
                value={smsSettings.phoneNumber}
                onChange={(e) => handleSmsSettingsChange('phoneNumber', e.target.value)}
                placeholder="+91 XXXXXXXXXX"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate('SMS Language')}
              </label>
              <select
                value={smsSettings.language}
                onChange={(e) => handleSmsSettingsChange('language', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>
                    {getLanguageName(lang)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifyNewReport"
                  checked={smsSettings.notifyOnNewReport}
                  onChange={(e) => handleSmsSettingsChange('notifyOnNewReport', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifyNewReport" className="ml-2 block text-sm text-gray-700">
                  {translate('Notify on new reports')}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifyAbnormal"
                  checked={smsSettings.notifyOnAbnormalResults}
                  onChange={(e) => handleSmsSettingsChange('notifyOnAbnormalResults', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifyAbnormal" className="ml-2 block text-sm text-gray-700">
                  {translate('Notify on abnormal results')}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifyRecommendations"
                  checked={smsSettings.notifyOnRecommendations}
                  onChange={(e) => handleSmsSettingsChange('notifyOnRecommendations', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifyRecommendations" className="ml-2 block text-sm text-gray-700">
                  {translate('Notify on new recommendations')}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeSummary"
                  checked={smsSettings.includeReportSummary}
                  onChange={(e) => handleSmsSettingsChange('includeReportSummary', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeSummary" className="ml-2 block text-sm text-gray-700">
                  {translate('Include report summary in SMS')}
                </label>
              </div>
            </div>
            
            <button
              onClick={handleSaveSmsSettings}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {translate('Save SMS Settings')}
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">{translate('Low Resource Mode')}</h3>
        <p className="text-sm text-blue-700 mb-4">
          {translate('Enable low resource mode for slower connections and older devices')}
        </p>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="lowResourceMode"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="lowResourceMode" className="ml-2 block text-sm font-medium text-blue-700">
            {translate('Enable Low Resource Mode')}
          </label>
        </div>
        
        <p className="mt-2 text-xs text-blue-600">
          {translate('This will compress images, reduce data usage, and optimize the app for slower connections')}
        </p>
      </div>
    </div>
  );
}