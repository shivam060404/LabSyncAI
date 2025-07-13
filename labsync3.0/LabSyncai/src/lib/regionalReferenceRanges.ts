/**
 * Regional Reference Ranges for LabSyncAI
 * Provides region-specific reference ranges for common lab tests in India
 */

import { RegionalReferenceRange } from '@/types';

/**
 * Database of region-specific reference ranges for common tests in India
 */
export const regionalReferenceRanges: RegionalReferenceRange[] = [
  // Hemoglobin (g/dL) - varies by region, gender, and altitude
  {
    region: 'North India',
    gender: 'male',
    testName: 'Hemoglobin',
    min: 13.0,
    max: 17.0,
    unit: 'g/dL',
    description: 'Hemoglobin levels for adult males in North India',
  },
  {
    region: 'North India',
    gender: 'female',
    testName: 'Hemoglobin',
    min: 12.0,
    max: 15.5,
    unit: 'g/dL',
    description: 'Hemoglobin levels for adult females in North India',
  },
  {
    region: 'South India',
    gender: 'male',
    testName: 'Hemoglobin',
    min: 12.5,
    max: 16.5,
    unit: 'g/dL',
    description: 'Hemoglobin levels for adult males in South India',
  },
  {
    region: 'South India',
    gender: 'female',
    testName: 'Hemoglobin',
    min: 11.5,
    max: 15.0,
    unit: 'g/dL',
    description: 'Hemoglobin levels for adult females in South India',
  },
  {
    region: 'East India',
    gender: 'male',
    testName: 'Hemoglobin',
    min: 12.5,
    max: 16.5,
    unit: 'g/dL',
    description: 'Hemoglobin levels for adult males in East India',
  },
  {
    region: 'East India',
    gender: 'female',
    testName: 'Hemoglobin',
    min: 11.5,
    max: 15.0,
    unit: 'g/dL',
    description: 'Hemoglobin levels for adult females in East India',
  },
  {
    region: 'West India',
    gender: 'male',
    testName: 'Hemoglobin',
    min: 13.0,
    max: 17.0,
    unit: 'g/dL',
    description: 'Hemoglobin levels for adult males in West India',
  },
  {
    region: 'West India',
    gender: 'female',
    testName: 'Hemoglobin',
    min: 12.0,
    max: 15.5,
    unit: 'g/dL',
    description: 'Hemoglobin levels for adult females in West India',
  },
  {
    region: 'Northeast India',
    gender: 'male',
    testName: 'Hemoglobin',
    min: 12.0,
    max: 16.0,
    unit: 'g/dL',
    description: 'Hemoglobin levels for adult males in Northeast India (adjusted for higher altitude)',
  },
  {
    region: 'Northeast India',
    gender: 'female',
    testName: 'Hemoglobin',
    min: 11.0,
    max: 14.5,
    unit: 'g/dL',
    description: 'Hemoglobin levels for adult females in Northeast India (adjusted for higher altitude)',
  },
  
  // Vitamin D (ng/mL) - varies by region and sun exposure
  {
    region: 'North India',
    gender: 'all',
    testName: 'Vitamin D',
    min: 20,
    max: 40,
    unit: 'ng/mL',
    description: 'Vitamin D levels for adults in North India',
  },
  {
    region: 'South India',
    gender: 'all',
    testName: 'Vitamin D',
    min: 25,
    max: 45,
    unit: 'ng/mL',
    description: 'Vitamin D levels for adults in South India (higher due to increased sun exposure)',
  },
  {
    region: 'East India',
    gender: 'all',
    testName: 'Vitamin D',
    min: 20,
    max: 40,
    unit: 'ng/mL',
    description: 'Vitamin D levels for adults in East India',
  },
  {
    region: 'West India',
    gender: 'all',
    testName: 'Vitamin D',
    min: 22,
    max: 42,
    unit: 'ng/mL',
    description: 'Vitamin D levels for adults in West India',
  },
  {
    region: 'Northeast India',
    gender: 'all',
    testName: 'Vitamin D',
    min: 18,
    max: 38,
    unit: 'ng/mL',
    description: 'Vitamin D levels for adults in Northeast India (lower due to less sun exposure in mountainous regions)',
  },
  
  // Fasting Blood Sugar (mg/dL)
  {
    region: 'All India',
    gender: 'all',
    testName: 'Fasting Blood Sugar',
    min: 70,
    max: 100,
    unit: 'mg/dL',
    description: 'Fasting blood sugar levels for adults in India',
  },
  
  // Total Cholesterol (mg/dL)
  {
    region: 'All India',
    gender: 'all',
    testName: 'Total Cholesterol',
    min: 125,
    max: 200,
    unit: 'mg/dL',
    description: 'Total cholesterol levels for adults in India',
  },
  
  // LDL Cholesterol (mg/dL)
  {
    region: 'All India',
    gender: 'all',
    testName: 'LDL Cholesterol',
    min: 0,
    max: 100,
    unit: 'mg/dL',
    description: 'LDL cholesterol levels for adults in India',
  },
  
  // HDL Cholesterol (mg/dL)
  {
    region: 'All India',
    gender: 'male',
    testName: 'HDL Cholesterol',
    min: 40,
    max: 60,
    unit: 'mg/dL',
    description: 'HDL cholesterol levels for adult males in India',
  },
  {
    region: 'All India',
    gender: 'female',
    testName: 'HDL Cholesterol',
    min: 50,
    max: 70,
    unit: 'mg/dL',
    description: 'HDL cholesterol levels for adult females in India',
  },
  
  // Triglycerides (mg/dL)
  {
    region: 'All India',
    gender: 'all',
    testName: 'Triglycerides',
    min: 0,
    max: 150,
    unit: 'mg/dL',
    description: 'Triglyceride levels for adults in India',
  },
  
  // Thyroid Stimulating Hormone (TSH) (mIU/L)
  {
    region: 'All India',
    gender: 'all',
    testName: 'TSH',
    min: 0.4,
    max: 4.0,
    unit: 'mIU/L',
    description: 'Thyroid Stimulating Hormone levels for adults in India',
  },
  
  // Creatinine (mg/dL)
  {
    region: 'All India',
    gender: 'male',
    testName: 'Creatinine',
    min: 0.7,
    max: 1.3,
    unit: 'mg/dL',
    description: 'Creatinine levels for adult males in India',
  },
  {
    region: 'All India',
    gender: 'female',
    testName: 'Creatinine',
    min: 0.5,
    max: 1.1,
    unit: 'mg/dL',
    description: 'Creatinine levels for adult females in India',
  },
  
  // Uric Acid (mg/dL)
  {
    region: 'All India',
    gender: 'male',
    testName: 'Uric Acid',
    min: 3.5,
    max: 7.2,
    unit: 'mg/dL',
    description: 'Uric Acid levels for adult males in India',
  },
  {
    region: 'All India',
    gender: 'female',
    testName: 'Uric Acid',
    min: 2.5,
    max: 6.0,
    unit: 'mg/dL',
    description: 'Uric Acid levels for adult females in India',
  },
  
  // Calcium (mg/dL)
  {
    region: 'All India',
    gender: 'all',
    testName: 'Calcium',
    min: 8.5,
    max: 10.5,
    unit: 'mg/dL',
    description: 'Calcium levels for adults in India',
  },
  
  // Sodium (mmol/L)
  {
    region: 'All India',
    gender: 'all',
    testName: 'Sodium',
    min: 135,
    max: 145,
    unit: 'mmol/L',
    description: 'Sodium levels for adults in India',
  },
  
  // Potassium (mmol/L)
  {
    region: 'All India',
    gender: 'all',
    testName: 'Potassium',
    min: 3.5,
    max: 5.0,
    unit: 'mmol/L',
    description: 'Potassium levels for adults in India',
  },
];

/**
 * Get region-specific reference range for a test
 */
export function getReferenceRange(
  testName: string, 
  region: string = 'All India', 
  gender: 'male' | 'female' | 'all' = 'all'
): RegionalReferenceRange | null {
  // First try to find a region and gender specific match
  let range = regionalReferenceRanges.find(r => 
    r.region === region && 
    r.testName === testName && 
    (r.gender === gender || r.gender === 'all')
  );
  
  // If not found, try to find an 'All India' match
  if (!range) {
    range = regionalReferenceRanges.find(r => 
      r.region === 'All India' && 
      r.testName === testName && 
      (r.gender === gender || r.gender === 'all')
    );
  }
  
  return range || null;
}

/**
 * Get all available regions
 */
export function getAvailableRegions(): string[] {
  const regions = new Set<string>();
  
  regionalReferenceRanges.forEach(range => {
    regions.add(range.region);
  });
  
  return Array.from(regions);
}

/**
 * Get all available tests
 */
export function getAvailableTests(): string[] {
  const tests = new Set<string>();
  
  regionalReferenceRanges.forEach(range => {
    tests.add(range.testName);
  });
  
  return Array.from(tests);
}