/**
 * Regional Reference Ranges Component for LabSyncAI
 * Displays region-specific reference ranges for medical tests
 */

'use client';

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getReferenceRange, getAvailableTests } from '../lib/regionalReferenceRanges';

interface RegionalReferenceRangesProps {
  className?: string;
}

/**
 * Regional Reference Ranges Component
 * @param className - Additional CSS classes
 */
export default function RegionalReferenceRanges({ className = '' }: RegionalReferenceRangesProps) {
  const { region, translate, availableRegions } = useLanguage();
  const [selectedTest, setSelectedTest] = useState<string>('Hemoglobin');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  // Get available tests
  const availableTests = getAvailableTests();
  
  // Get reference range for selected test, region, and gender
  const referenceRange = getReferenceRange(selectedTest, region, gender);
  
  // Handle test change
  const handleTestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTest(e.target.value);
  };
  
  // Handle gender change
  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value as 'male' | 'female');
  };
  
  // Get unit for test
  const getUnitForTest = (testName: string): string => {
    const units: Record<string, string> = {
      'Hemoglobin': 'g/dL',
      'Vitamin D': 'ng/mL',
      'Fasting Blood Sugar': 'mg/dL',
      'Total Cholesterol': 'mg/dL',
      'HDL Cholesterol': 'mg/dL',
      'LDL Cholesterol': 'mg/dL',
      'Triglycerides': 'mg/dL',
      'TSH': 'mIU/L',
      'Creatinine': 'mg/dL',
      'Uric Acid': 'mg/dL'
    };
    
    return units[testName] || '';
  };
  
  return (
    <div className={`p-6 bg-white rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{translate('Regional Reference Ranges')}</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          {translate('Reference ranges for medical tests can vary by region due to differences in population genetics, diet, and environmental factors. View the appropriate ranges for your region below.')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translate('Select Test')}
            </label>
            <select
              value={selectedTest}
              onChange={handleTestChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableTests.map(test => (
                <option key={test} value={test}>
                  {translate(test)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translate('Gender')}
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={handleGenderChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="male" className="ml-2 block text-sm text-gray-700">
                  {translate('Male')}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={handleGenderChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="female" className="ml-2 block text-sm text-gray-700">
                  {translate('Female')}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reference Range Display */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          {translate('Reference Range for')} {translate(selectedTest)}
        </h3>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{translate('Region')}:</span>
            <span className="text-sm text-gray-900">{translate(region)}</span>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{translate('Gender')}:</span>
            <span className="text-sm text-gray-900">{translate(gender === 'male' ? 'Male' : 'Female')}</span>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{translate('Normal Range')}:</span>
            <span className="text-sm text-gray-900">
              {referenceRange ? `${referenceRange.min} - ${referenceRange.max} ${getUnitForTest(selectedTest)}` : translate('Not available')}
            </span>
          </div>
        </div>
        
        {/* Visual Range Indicator */}
        {referenceRange && (
          <div className="mt-4">
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-green-400 rounded-full" 
                style={{ 
                  left: '10%', 
                  right: '10%'
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="text-xs font-medium z-10">{referenceRange.min}</span>
                <span className="text-xs font-medium z-10">{referenceRange.max}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Regional Variations */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-blue-800 mb-2">
            {translate('Regional Variations')}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {availableRegions.slice(0, 6).map(reg => {
              const rangeForRegion = getReferenceRange(selectedTest, reg, gender);
              return (
                <div 
                  key={reg} 
                  className={`p-2 rounded-md text-xs ${region === reg ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'}`}
                >
                  <span className="font-medium">{translate(reg)}:</span> {rangeForRegion ? `${rangeForRegion.min} - ${rangeForRegion.max} ${getUnitForTest(selectedTest)}` : translate('Not available')}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Information Note */}
      <div className="mt-6 text-xs text-gray-500">
        <p>
          {translate('Note: These reference ranges are based on population studies and may not apply to all individuals. Always consult with your healthcare provider for interpretation of your test results.')}
        </p>
      </div>
    </div>
  );
}