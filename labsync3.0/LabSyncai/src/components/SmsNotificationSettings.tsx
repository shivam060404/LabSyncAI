/**
 * SMS Notification Settings Component for LabSyncAI
 * Allows users to configure SMS notification preferences
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SmsNotificationSettings as SmsSettings } from '@/types';

interface SmsNotificationSettingsProps {
  userId?: string;
  className?: string;
  onSave?: (settings: SmsSettings) => void;
}

/**
 * SMS Notification Settings Component
 * @param userId - User ID for saving settings
 * @param className - Additional CSS classes
 * @param onSave - Callback function when settings are saved
 */
export default function SmsNotificationSettings({ 
  userId,
  className = '',
  onSave
}: SmsNotificationSettingsProps) {
  const { translate, language } = useLanguage();
  
  // Default SMS settings
  const defaultSettings: SmsSettings = {
    enabled: false,
    phoneNumber: '',
    language: language,
    notifyOnNewReport: true,
    notifyOnAbnormalResults: true,
    notifyOnRecommendations: false,
    includeReportSummary: true,
    maxMessageLength: 160
  };
  
  // State for SMS settings
  const [settings, setSettings] = useState<SmsSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Load user settings if userId is provided
  useEffect(() => {
    if (userId) {
      // In a real app, this would fetch the user's settings from the database
      // For now, we'll just use the default settings
      console.log(`Loading SMS settings for user ${userId}`);
      // Simulating API call
      setTimeout(() => {
        setSettings({
          ...defaultSettings,
          phoneNumber: '+91' // Simulated data
        });
      }, 500);
    }
  }, [userId, language]);
  
  // Handle settings change
  const handleSettingsChange = (key: keyof SmsSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Reset status messages
    setSaveSuccess(false);
    setSaveError('');
  };
  
  // Handle toggle for enabled/disabled
  const handleToggleEnabled = () => {
    handleSettingsChange('enabled', !settings.enabled);
  };
  
  // Validate phone number (basic validation)
  const isValidPhoneNumber = (phone: string): boolean => {
    // Basic validation for Indian phone numbers
    const phoneRegex = /^\+?[0-9]{10,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };
  
  // Handle save settings
  const handleSaveSettings = async () => {
    // Validate phone number if enabled
    if (settings.enabled && !isValidPhoneNumber(settings.phoneNumber)) {
      setSaveError(translate('Please enter a valid phone number'));
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // In a real app, this would save to the database
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(settings);
      }
      
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error saving SMS settings:', error);
      setSaveError(translate('Failed to save settings. Please try again.'));
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className={`p-6 bg-white rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{translate('SMS Notification Settings')}</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          {translate('Configure SMS notifications to receive updates about your medical reports and health recommendations on your mobile phone.')}
        </p>
        
        {/* Enable/Disable Toggle */}
        <div className="flex items-center mb-6">
          <div className="relative inline-block w-12 mr-2 align-middle select-none">
            <input 
              type="checkbox" 
              name="toggle" 
              id="smsToggle" 
              checked={settings.enabled}
              onChange={handleToggleEnabled}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
              style={{
                left: settings.enabled ? '24px' : '0',
                borderColor: settings.enabled ? '#3B82F6' : '#D1D5DB'
              }}
            />
            <label 
              htmlFor="smsToggle" 
              className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
              style={{ backgroundColor: settings.enabled ? '#3B82F6' : '#D1D5DB' }}
            ></label>
          </div>
          <label htmlFor="smsToggle" className="text-sm font-medium text-gray-700">
            {translate('Enable SMS Notifications')}
          </label>
        </div>
        
        {settings.enabled && (
          <div className="space-y-6">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate('Phone Number')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="tel"
                  value={settings.phoneNumber}
                  onChange={(e) => handleSettingsChange('phoneNumber', e.target.value)}
                  placeholder="+91 XXXXXXXXXX"
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {translate('Include country code (e.g., +91 for India)')}
              </p>
            </div>
            
            {/* SMS Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate('SMS Language')}
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingsChange('language', e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ml">മലയാളം (Malayalam)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="ur">اردو (Urdu)</option>
                <option value="or">ଓଡ଼ିଆ (Odia)</option>
                <option value="as">অসমীয়া (Assamese)</option>
              </select>
            </div>
            
            {/* Notification Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {translate('Notification Types')}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyNewReport"
                    checked={settings.notifyOnNewReport}
                    onChange={(e) => handleSettingsChange('notifyOnNewReport', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifyNewReport" className="ml-2 block text-sm text-gray-700">
                    {translate('New Reports Available')}
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyAbnormal"
                    checked={settings.notifyOnAbnormalResults}
                    onChange={(e) => handleSettingsChange('notifyOnAbnormalResults', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifyAbnormal" className="ml-2 block text-sm text-gray-700">
                    {translate('Abnormal Test Results')}
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyRecommendations"
                    checked={settings.notifyOnRecommendations}
                    onChange={(e) => handleSettingsChange('notifyOnRecommendations', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifyRecommendations" className="ml-2 block text-sm text-gray-700">
                    {translate('New Health Recommendations')}
                  </label>
                </div>
              </div>
            </div>
            
            {/* Content Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {translate('Content Options')}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeSummary"
                    checked={settings.includeReportSummary}
                    onChange={(e) => handleSettingsChange('includeReportSummary', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeSummary" className="ml-2 block text-sm text-gray-700">
                    {translate('Include Report Summary')}
                  </label>
                </div>
              </div>
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('Maximum Message Length')}
                </label>
                <select
                  value={settings.maxMessageLength}
                  onChange={(e) => handleSettingsChange('maxMessageLength', parseInt(e.target.value))}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="160">160 {translate('characters')} (1 SMS)</option>
                  <option value="320">320 {translate('characters')} (2 SMS)</option>
                  <option value="480">480 {translate('characters')} (3 SMS)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {translate('Standard SMS messages are limited to 160 characters. Longer messages may be split into multiple SMS.')}
                </p>
              </div>
            </div>
            
            {/* Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {translate('Sample SMS Preview')}
              </h3>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-sm text-gray-800 font-mono">
                  LabSyncAI: {translate('Your blood test results are ready. Hemoglobin: 14.2 g/dL (Normal). 2 abnormal results found. View details at')} labsync.ai/r/123456
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Save Button */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {saveSuccess && (
            <p className="text-sm text-green-600">
              {translate('Settings saved successfully')}
            </p>
          )}
          {saveError && (
            <p className="text-sm text-red-600">
              {saveError}
            </p>
          )}
        </div>
        
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSaving ? translate('Saving...') : translate('Save Settings')}
        </button>
      </div>
      
      {/* Information Note */}
      <div className="mt-6 text-xs text-gray-500">
        <p>
          {translate('Standard SMS rates may apply based on your mobile carrier. LabSyncAI does not charge for SMS notifications.')}
        </p>
      </div>
    </div>
  );
}