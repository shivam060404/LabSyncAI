/**
 * Utility functions for medical data formatting and analysis
 */

type ReferenceRange = {
  min: number;
  max: number;
  unit: string;
};

type TestStatus = 'normal' | 'low' | 'high' | 'critical-low' | 'critical-high';

/**
 * Format a medical value with its unit
 * @param value - The numerical value
 * @param unit - The unit of measurement
 * @param precision - Number of decimal places
 * @returns Formatted string with value and unit
 */
export function formatMedicalValue(value: number, unit: string, precision: number = 1): string {
  return `${value.toFixed(precision)} ${unit}`;
}

/**
 * Determine the status of a test result based on reference range
 * @param value - The test result value
 * @param referenceRange - The reference range for the test
 * @param criticalThreshold - Percentage beyond reference range to be considered critical (default: 25%)
 * @returns Status of the test result
 */
export function getTestStatus(value: number, referenceRange: ReferenceRange, criticalThreshold: number = 25): TestStatus {
  const { min, max } = referenceRange;
  
  // Calculate critical thresholds
  const criticalLowThreshold = min - (min * (criticalThreshold / 100));
  const criticalHighThreshold = max + (max * (criticalThreshold / 100));
  
  if (value < criticalLowThreshold) {
    return 'critical-low';
  } else if (value < min) {
    return 'low';
  } else if (value > criticalHighThreshold) {
    return 'critical-high';
  } else if (value > max) {
    return 'high';
  } else {
    return 'normal';
  }
}

/**
 * Get color class based on test status
 * @param status - The test status
 * @returns Tailwind CSS color class
 */
export function getStatusColorClass(status: TestStatus): string {
  switch (status) {
    case 'critical-low':
    case 'critical-high':
      return 'text-danger font-bold';
    case 'low':
    case 'high':
      return 'text-warning';
    case 'normal':
      return 'text-success';
    default:
      return '';
  }
}

/**
 * Calculate Body Mass Index (BMI)
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @returns BMI value
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) {
    return 0;
  }
  
  // Convert height from cm to meters
  const heightM = heightCm / 100;
  
  // BMI formula: weight (kg) / (height (m))²
  return weightKg / (heightM * heightM);
}

/**
 * Get BMI category
 * @param bmi - Body Mass Index value
 * @returns BMI category description
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 16) {
    return 'Severe Thinness';
  } else if (bmi < 17) {
    return 'Moderate Thinness';
  } else if (bmi < 18.5) {
    return 'Mild Thinness';
  } else if (bmi < 25) {
    return 'Normal';
  } else if (bmi < 30) {
    return 'Overweight';
  } else if (bmi < 35) {
    return 'Obese Class I';
  } else if (bmi < 40) {
    return 'Obese Class II';
  } else {
    return 'Obese Class III';
  }
}

/**
 * Format a percentage value
 * @param value - The decimal value (e.g., 0.75 for 75%)
 * @param precision - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, precision: number = 1): string {
  return `${(value * 100).toFixed(precision)}%`;
}