/**
 * Compression Utilities for LabSyncAI
 * Provides utilities for data compression and optimization for low-resource environments
 */

import { CompressionSettings } from '@/types';

/**
 * Default compression settings
 */
export const defaultCompressionSettings: CompressionSettings = {
  enabled: false,
  imageQuality: 'medium',
  compressReports: false,
  offlineMode: false,
  syncFrequency: 'when-connected',
};

/**
 * Compress image data for low-bandwidth environments
 * @param imageData - The image data as a base64 string
 * @param quality - The desired quality level
 * @returns Compressed image data as a base64 string
 */
export async function compressImageData(
  imageData: string,
  quality: 'low' | 'medium' | 'high' = 'medium'
): Promise<string> {
  // Skip compression if not needed
  if (quality === 'high') {
    return imageData;
  }

  // Convert quality setting to a number between 0 and 1
  const qualityValue = quality === 'low' ? 0.3 : 0.6; // medium = 0.6, low = 0.3

  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  
  // Browser-side implementation
  if (isBrowser) {
    try {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set canvas dimensions to match image
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image to canvas
          if (ctx) {
            ctx.drawImage(img, 0, 0);

            // Get compressed data URL
            const compressedDataUrl = canvas.toDataURL('image/jpeg', qualityValue);
            resolve(compressedDataUrl);
          } else {
            reject(new Error('Could not get canvas context'));
          }
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        img.src = imageData;
      });
    } catch (error) {
      console.error('Error in browser-side image compression:', error);
      return imageData;
    }
  }

  // Server-side implementation would use a library like Sharp
  // This is a placeholder - in a real implementation, you would use a server-side
  // image processing library
  console.warn('Server-side image compression not implemented');
  return imageData;
}

/**
 * Compress text data for low-bandwidth environments
 * @param text - The text to compress
 * @returns Compressed text
 */
export function compressTextData(text: string): string {
  // Simple text compression by removing unnecessary whitespace
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s*([,.:;])\s*/g, '$1 ')
    .trim();
}

/**
 * Generate a compact SMS-friendly summary of a medical report
 * @param report - The medical report object
 * @param maxLength - Maximum length of the SMS message
 * @returns SMS-friendly summary
 */
export function generateSMSSummary(report: any, maxLength: number = 160): string {
  // Extract key information
  const reportTitle = report.title || 'Medical Report';
  const reportDate = new Date(report.uploadDate || report.date).toLocaleDateString();
  
  // Count abnormal results
  const abnormalResults = report.results?.filter((r: any) => 
    r.status && r.status !== 'normal'
  ) || [];
  
  // Start with basic info
  let summary = `${reportTitle} (${reportDate}): `;
  
  // Add abnormal results count
  if (abnormalResults.length > 0) {
    summary += `${abnormalResults.length} abnormal results. `;
    
    // Add critical results if any
    const criticalResults = abnormalResults.filter((r: any) => 
      r.status && (r.status === 'critical-high' || r.status === 'critical-low')
    );
    
    if (criticalResults.length > 0) {
      summary += `URGENT: ${criticalResults.map((r: any) => r.name).join(', ')}. `;
    }
  } else {
    summary += 'All results normal. ';
  }
  
  // Add top recommendation if available
  if (report.analysis?.recommendations && report.analysis.recommendations.length > 0) {
    summary += `Rec: ${report.analysis.recommendations[0]}`;
  }
  
  // Truncate if too long
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength - 3) + '...';
  }
  
  return summary;
}

/**
 * Determine if compression should be applied based on network conditions
 * @returns Whether compression should be applied
 */
export function shouldApplyCompression(): boolean {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';
  
  if (!isBrowser) {
    return false; // Server-side, no compression needed
  }
  
  try {
    // Check for slow connection using Network Information API
    // Use type assertion for NetworkInformation API which is not fully typed in standard lib
    interface NetworkInformation {
      effectiveType?: string;
      downlink?: number;
    }
    
    // Add type declarations for navigator extensions
    interface NavigatorNetworkInformation extends Navigator {
      connection?: NetworkInformation;
      mozConnection?: NetworkInformation;
      webkitConnection?: NetworkInformation;
    }
    
    const nav = navigator as NavigatorNetworkInformation;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    
    if (connection) {
      // Apply compression for slow connections
      if (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.effectiveType === '3g' ||
        (connection.downlink !== undefined && connection.downlink < 1.0) // Less than 1 Mbps
      ) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking network conditions:', error);
    return false;
  }
}

/**
 * Calculate the estimated data size of a report
 * @param report - The medical report object
 * @returns Estimated size in KB
 */
export function estimateReportSize(report: any): number {
  // Convert report to JSON string to estimate size
  const reportString = JSON.stringify(report);
  
  // Estimate size in KB (1 character ≈ 1 byte)
  return Math.round(reportString.length / 1024);
}

/**
 * Optimize data for low-resource environments
 * @param data - The data to optimize
 * @param settings - Compression settings
 * @returns Optimized data
 */
export function optimizeForLowResource(data: any, settings: CompressionSettings): any {
  // Skip optimization if not enabled
  if (!settings.enabled) {
    return data;
  }
  
  // Handle different data types
  if (typeof data === 'string') {
    return compressTextData(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => optimizeForLowResource(item, settings));
  }
  
  if (typeof data === 'object' && data !== null) {
    const result: Record<string, any> = {};
    
    // Process each property
    for (const key in data) {
      // Skip unnecessary fields for low-resource mode
      if (
        settings.compressReports &&
        [
          'description', // Skip detailed descriptions
          'notes',       // Skip notes
          'fileUrl',     // Skip file URLs in low-resource mode
          'fileSize',    // Skip file size info
        ].includes(key)
      ) {
        continue;
      }
      
      result[key] = optimizeForLowResource(data[key], settings);
    }
    
    return result;
  }
  
  // Return primitive values as is
  return data;
}