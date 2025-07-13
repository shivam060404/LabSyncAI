/**
 * Low Resource Mode Settings Component for LabSyncAI
 * Allows users to configure settings for low-bandwidth environments
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CompressionSettings } from '@/types';

interface LowResourceModeSettingsProps {
  initialSettings?: Partial<CompressionSettings>;
  className?: string;
  onSave?: (settings: CompressionSettings) => void;
}

/**
 * Low Resource Mode Settings Component
 * @param initialSettings - Initial compression settings
 * @param className - Additional CSS classes
 * @param onSave - Callback function when settings are saved
 */
export default function LowResourceModeSettings({ 
  initialSettings,
  className = '',
  onSave
}: LowResourceModeSettingsProps) {
  const { translate } = useLanguage();
  
  // Default compression settings
  const defaultSettings: CompressionSettings = {
    enabled: false,
    imageQuality: 'medium',
    compressReports: false,
    offlineMode: false,
    syncFrequency: 'when-connected'
  };
  
  // Merge initial settings with defaults
  const mergedSettings = { ...defaultSettings, ...initialSettings };
  
  // State for compression settings
  const [settings, setSettings] = useState<CompressionSettings>(mergedSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Handle settings change
  const handleSettingsChange = (key: keyof CompressionSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Reset success message
    setSaveSuccess(false);
  };
  
  // Handle toggle for enabled/disabled
  const handleToggleEnabled = () => {
    handleSettingsChange('enabled', !settings.enabled);
  };
  
  // Handle save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // In a real app, this would save to the database
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(settings);
      }
      
      // Apply settings to the app
      applyLowResourceSettings(settings);
      
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error saving low resource mode settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Apply low resource settings to the app
  const applyLowResourceSettings = (settings: CompressionSettings) => {
    if (typeof window === 'undefined') return;
    
    // Store settings in localStorage
    localStorage.setItem('compressionSettings', JSON.stringify(settings));
    
    // Apply CSS classes to body based on settings
    const body = document.body;
    
    if (settings.enabled) {
      body.classList.add('low-resource-mode');
      
      // Apply image quality classes
      body.classList.remove('image-quality-low', 'image-quality-medium', 'image-quality-high');
      body.classList.add(`image-quality-${settings.imageQuality}`);
      
      // Apply simplified UI and disable animations for all low resource mode
      body.classList.add('simplified-ui', 'disable-animations');
    } else {
      body.classList.remove(
        'low-resource-mode', 
        'simplified-ui', 
        'disable-animations',
        'image-quality-low',
        'image-quality-medium',
        'image-quality-high'
      );
    }
  };
  
  // Calculate estimated data savings
  const calculateDataSavings = (): string => {
    if (!settings.enabled) return '0%';
    
    let savingsPercentage = 0;
    
    // Image quality savings
    switch (settings.imageQuality) {
      case 'low':
        savingsPercentage += 70;
        break;
      case 'medium':
        savingsPercentage += 50;
        break;
      case 'high':
        savingsPercentage += 30;
        break;
    }
    
    // Report compression savings
    if (settings.compressReports) savingsPercentage += 15;
    
    // Offline mode savings (cached content)
    if (settings.offlineMode) savingsPercentage += 10;
    
    // Sync frequency savings
    if (settings.syncFrequency === 'weekly') savingsPercentage += 10;
    else if (settings.syncFrequency === 'daily') savingsPercentage += 5;
    else if (settings.syncFrequency === 'when-connected') savingsPercentage += 3;
    
    // Cap at 90%
    return `${Math.min(savingsPercentage, 90)}%`;
  };
  
  return (
    <div className={`p-6 bg-white rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{translate('Low Resource Mode Settings')}</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          {translate('Configure low resource mode to optimize the app for slower internet connections and older devices. This can significantly reduce data usage and improve performance.')}
        </p>
        
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-md">
          <div>
            <h3 className="text-md font-semibold text-blue-800">
              {translate('Low Resource Mode')}
            </h3>
            <p className="text-sm text-blue-600">
              {translate('Optimize for slower connections and older devices')}
            </p>
          </div>
          
          <div className="relative inline-block w-12 align-middle select-none">
            <input 
              type="checkbox" 
              name="toggle" 
              id="lowResourceToggle" 
              checked={settings.enabled}
              onChange={handleToggleEnabled}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
              style={{
                left: settings.enabled ? '24px' : '0',
                borderColor: settings.enabled ? '#3B82F6' : '#D1D5DB'
              }}
            />
            <label 
              htmlFor="lowResourceToggle" 
              className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
              style={{ backgroundColor: settings.enabled ? '#3B82F6' : '#D1D5DB' }}
            ></label>
          </div>
        </div>
        
        {settings.enabled && (
          <div className="space-y-6">
            {/* Image Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {translate('Image Settings')}
              </h3>
              
              <div className="space-y-3 ml-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('Image Quality')}
                  </label>
                  <select
                    value={settings.imageQuality}
                    onChange={(e) => handleSettingsChange('imageQuality', e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">{translate('Low')} (30%)</option>
                    <option value="medium">{translate('Medium')} (50%)</option>
                    <option value="high">{translate('High')} (70%)</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Report Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {translate('Report Settings')}
              </h3>
              
              <div className="space-y-3 ml-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="compressReports"
                    checked={settings.compressReports}
                    onChange={(e) => handleSettingsChange('compressReports', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="compressReports" className="ml-2 block text-sm text-gray-700">
                    {translate('Compress Reports')}
                  </label>
                </div>
              </div>
            </div>
            
            {/* Connection Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {translate('Connection Settings')}
              </h3>
              
              <div className="space-y-3 ml-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="offlineMode"
                    checked={settings.offlineMode}
                    onChange={(e) => handleSettingsChange('offlineMode', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="offlineMode" className="ml-2 block text-sm text-gray-700">
                    {translate('Enable Offline Mode When Possible')}
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('Sync Frequency')}
                  </label>
                  <select
                    value={settings.syncFrequency}
                    onChange={(e) => handleSettingsChange('syncFrequency', e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="manual">{translate('Manual')}</option>
                    <option value="daily">{translate('Daily')}</option>
                    <option value="weekly">{translate('Weekly')}</option>
                    <option value="when-connected">{translate('When Connected')}</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Data Savings Estimate */}
            <div className="mt-6 p-4 bg-green-50 rounded-md">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                {translate('Estimated Data Savings')}
              </h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: calculateDataSavings() }}
                  ></div>
                </div>
                <span className="ml-3 text-sm font-medium text-green-800">
                  {calculateDataSavings()}
                </span>
              </div>
              <p className="mt-2 text-xs text-green-700">
                {translate('Actual savings may vary based on usage patterns and content.')}
              </p>
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
          {translate('Low Resource Mode is designed for users with limited internet connectivity or older devices. Some visual elements and features may be simplified or disabled to improve performance.')}
        </p>
      </div>
    </div>
  );
}