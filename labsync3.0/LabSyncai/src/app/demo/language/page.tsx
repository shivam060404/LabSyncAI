/**
 * Language Demo Page for LabSyncAI
 * Demonstrates the multi-language capabilities
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import RegionalReferenceRanges from '@/components/RegionalReferenceRanges';
import { SupportedLanguage } from '@/types';

/**
 * Language Demo Page Component
 */
export default function LanguageDemoPage() {
  const { translate, language, setLanguage, region, setRegion, availableLanguages, availableRegions } = useLanguage();
  
  // Sample medical terms to demonstrate translation
  const medicalTerms = [
    'Blood Test',
    'Hemoglobin',
    'Cholesterol',
    'Diabetes',
    'Heart Rate',
    'Blood Pressure',
    'Vitamin D',
    'Thyroid',
    'Recommendations',
    'Normal Range',
    'Abnormal Result',
    'Fasting Required',
    'Health Plan'
  ];
  
  // Sample sentences to demonstrate translation
  const sentences = [
    'Your blood test results are ready.',
    'Your hemoglobin level is normal.',
    'Please consult a doctor for abnormal results.',
    'Take your medication as prescribed.',
    'Drink plenty of water and exercise regularly.',
    'Follow up with your doctor in 3 months.'
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{translate('Language Demo')}</h1>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{translate('Language Selector')}</h2>
          <LanguageSelector className="ml-4" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">{translate('Current Settings')}</h3>
            <div className="space-y-2">
              <p><strong>{translate('Language')}:</strong> {language}</p>
              <p><strong>{translate('Region')}:</strong> {translate(region)}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">{translate('Available Languages')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableLanguages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`p-2 rounded-md text-sm ${language === lang ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {lang === 'en' ? 'English' : 
                     lang === 'hi' ? 'हिन्दी' :
                     lang === 'bn' ? 'বাংলা' :
                     lang === 'te' ? 'తెలుగు' :
                     lang === 'ta' ? 'தமிழ்' :
                     lang === 'mr' ? 'मराठी' :
                     lang === 'gu' ? 'ગુજરાતી' :
                     lang === 'kn' ? 'ಕನ್ನಡ' :
                     lang === 'ml' ? 'മലയാളം' :
                     lang === 'pa' ? 'ਪੰਜਾਬੀ' :
                     lang === 'ur' ? 'اردو' :
                     lang === 'or' ? 'ଓଡ଼ିଆ' :
                     lang === 'as' ? 'অসমীয়া' : lang}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">{translate('Available Regions')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableRegions.map(reg => (
                  <button
                    key={reg}
                    onClick={() => setRegion(reg)}
                    className={`p-2 rounded-md text-sm ${region === reg ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {translate(reg)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">{translate('Medical Terms Translation')}</h3>
            <div className="space-y-2 mb-6">
              {medicalTerms.map(term => (
                <div key={term} className="p-2 bg-gray-50 rounded-md">
                  <span className="font-medium">{term}:</span> {translate(term)}
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold mb-3 mt-6">{translate('Sentences Translation')}</h3>
            <div className="space-y-2">
              {sentences.map(sentence => (
                <div key={sentence} className="p-2 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">{sentence}</p>
                  <p>{translate(sentence)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <RegionalReferenceRanges />
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">{translate('About Multi-Language Support')}</h2>
        <p className="text-blue-700 mb-4">
          {translate('LabSyncAI provides support for multiple Indian languages to make medical information accessible to all users across India. The application can translate medical reports, health recommendations, and the user interface.')}
        </p>
        <p className="text-blue-700">
          {translate('Regional reference ranges are also provided to account for population differences across various regions of India.')}
        </p>
      </div>
      
      <div className="mt-8 text-center">
        <a href="/settings" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {translate('Go to Settings')}
        </a>
      </div>
    </div>
  );
}