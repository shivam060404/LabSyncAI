/**
 * Settings Page for LabSyncAI
 * Allows users to configure language, region, SMS notifications, and low resource mode
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSettings from '@/components/LanguageSettings';
import SmsNotificationSettings from '@/components/SmsNotificationSettings';
import LowResourceModeSettings from '@/components/LowResourceModeSettings';
import RegionalReferenceRanges from '@/components/RegionalReferenceRanges';

/**
 * Settings Page Component
 */
export default function SettingsPage() {
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('language');
  
  // Tabs configuration
  const tabs = [
    { id: 'language', label: translate('Language & Region') },
    { id: 'sms', label: translate('SMS Notifications') },
    { id: 'lowResource', label: translate('Low Resource Mode') },
    { id: 'referenceRanges', label: translate('Reference Ranges') }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{translate('Settings')}</h1>
      
      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'language' && (
          <LanguageSettings />
        )}
        
        {activeTab === 'sms' && (
          <SmsNotificationSettings />
        )}
        
        {activeTab === 'lowResource' && (
          <LowResourceModeSettings />
        )}
        
        {activeTab === 'referenceRanges' && (
          <RegionalReferenceRanges />
        )}
      </div>
    </div>
  );
}