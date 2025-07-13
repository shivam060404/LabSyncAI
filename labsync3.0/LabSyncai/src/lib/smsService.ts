/**
 * SMS Notification Service for LabSyncAI
 * Provides functionality to send SMS notifications for users without smartphones
 */

import { SmsNotificationSettings, SupportedLanguage } from '@/types';
import { localizationService } from './localizationService';
import { generateSMSSummary } from './compressionUtils';

/**
 * SMS Service class for sending notifications
 */
export class SMSService {
  private apiKey: string;
  private sender: string;
  
  /**
   * Initialize the SMS service
   * @param apiKey - API key for the SMS service provider
   * @param sender - Sender ID or phone number
   */
  constructor(apiKey: string = '', sender: string = 'LabSyncAI') {
    this.apiKey = apiKey;
    this.sender = sender;
  }
  
  /**
   * Set the API key for the SMS service
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  /**
   * Set the sender ID or phone number
   */
  setSender(sender: string): void {
    this.sender = sender;
  }
  
  /**
   * Send an SMS notification
   * @param phoneNumber - Recipient's phone number
   * @param message - Message content
   * @param language - Language for the message
   * @returns Promise resolving to success status
   */
  async sendSMS(
    phoneNumber: string,
    message: string,
    language: SupportedLanguage = 'en'
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Check if API key is set
      if (!this.apiKey) {
        console.warn('SMS API key not configured');
        return { success: false, message: 'SMS API key not configured' };
      }
      
      // Check if phone number is valid
      if (!this.isValidPhoneNumber(phoneNumber)) {
        return { success: false, message: 'Invalid phone number' };
      }
      
      // Translate message if needed
      let translatedMessage = message;
      if (language !== 'en') {
        // Save current language
        const prevLanguage = localizationService.getLanguage();
        // Set language for translation
        localizationService.setLanguage(language);
        
        // Translate key phrases in the message
        translatedMessage = this.translateKeyPhrases(message, language);
        
        // Restore previous language
        localizationService.setLanguage(prevLanguage);
      }
      
      // In a real implementation, this would call an SMS API
      // This is a placeholder for demonstration purposes
      console.log(`Sending SMS to ${phoneNumber} in ${language}:`, translatedMessage);
      
      // Simulate API call
      // In a real implementation, this would be an actual API call to an SMS service provider
      // For example, using Twilio, Vonage, or a local Indian SMS provider like MSG91
      /*
      const response = await fetch('https://api.sms-provider.com/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to: phoneNumber,
          from: this.sender,
          text: translatedMessage,
          language: language
        })
      });
      
      const data = await response.json();
      return { success: data.success, message: data.message };
      */
      
      // Simulate successful sending
      return { success: true };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error sending SMS' 
      };
    }
  }
  
  /**
   * Send a report notification via SMS
   * @param phoneNumber - Recipient's phone number
   * @param report - The medical report
   * @param settings - SMS notification settings
   * @returns Promise resolving to success status
   */
  async sendReportNotification(
    phoneNumber: string,
    report: any,
    settings: SmsNotificationSettings
  ): Promise<{ success: boolean; message?: string }> {
    // Generate SMS summary based on settings
    let message = '';
    
    if (settings.includeReportSummary) {
      // Generate a summary with the report details
      const maxLength = settings.maxMessageLength || 160;
      message = generateSMSSummary(report, maxLength);
    } else {
      // Simple notification without details
      message = `New medical report '${report.title}' is available. Login to LabSyncAI to view details.`;
    }
    
    // Send the SMS
    return this.sendSMS(phoneNumber, message, settings.language);
  }
  
  /**
   * Send an abnormal results notification via SMS
   * @param phoneNumber - Recipient's phone number
   * @param report - The medical report with abnormal results
   * @param settings - SMS notification settings
   * @returns Promise resolving to success status
   */
  async sendAbnormalResultsNotification(
    phoneNumber: string,
    report: any,
    settings: SmsNotificationSettings
  ): Promise<{ success: boolean; message?: string }> {
    // Count abnormal results
    const abnormalResults = report.results?.filter((r: any) => 
      r.status && r.status !== 'normal'
    ) || [];
    
    if (abnormalResults.length === 0) {
      return { success: false, message: 'No abnormal results to report' };
    }
    
    // Generate message
    let message = `ALERT: ${abnormalResults.length} abnormal results in your report '${report.title}'. `;
    
    // Add critical results if any
    const criticalResults = abnormalResults.filter((r: any) => 
      r.status && (r.status === 'critical-high' || r.status === 'critical-low')
    );
    
    if (criticalResults.length > 0) {
      message += `URGENT: ${criticalResults.map((r: any) => r.name).join(', ')}. `;
    }
    
    message += 'Please consult your healthcare provider.';
    
    // Send the SMS
    return this.sendSMS(phoneNumber, message, settings.language);
  }
  
  /**
   * Send a recommendations notification via SMS
   * @param phoneNumber - Recipient's phone number
   * @param recommendations - The recommendations object
   * @param settings - SMS notification settings
   * @returns Promise resolving to success status
   */
  async sendRecommendationsNotification(
    phoneNumber: string,
    recommendations: any,
    settings: SmsNotificationSettings
  ): Promise<{ success: boolean; message?: string }> {
    // Generate message with top recommendations
    let message = 'Health recommendations: ';
    
    // Add dietary recommendations
    if (recommendations.dietary && recommendations.dietary.length > 0) {
      message += `Diet: ${recommendations.dietary[0]}. `;
    }
    
    // Add lifestyle recommendations
    if (recommendations.lifestyle && recommendations.lifestyle.length > 0) {
      message += `Lifestyle: ${recommendations.lifestyle[0]}. `;
    }
    
    // Add follow-up recommendations
    if (recommendations.followUp && recommendations.followUp.length > 0) {
      message += `Follow-up: ${recommendations.followUp[0]}.`;
    }
    
    // Truncate if too long
    const maxLength = settings.maxMessageLength || 160;
    if (message.length > maxLength) {
      message = message.substring(0, maxLength - 3) + '...';
    }
    
    // Send the SMS
    return this.sendSMS(phoneNumber, message, settings.language);
  }
  
  /**
   * Validate a phone number
   * @param phoneNumber - Phone number to validate
   * @returns Whether the phone number is valid
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic validation for Indian phone numbers
    // Indian mobile numbers are 10 digits, often prefixed with +91 or 0
    const indianPhoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
    return indianPhoneRegex.test(phoneNumber);
  }
  
  /**
   * Translate key phrases in a message
   * @param message - Original message
   * @param language - Target language
   * @returns Translated message
   */
  private translateKeyPhrases(message: string, language: SupportedLanguage): string {
    // List of common phrases to translate
    const phrases = [
      'New medical report',
      'is available',
      'Login to',
      'to view details',
      'ALERT',
      'abnormal results',
      'in your report',
      'URGENT',
      'Please consult your healthcare provider',
      'Health recommendations',
      'Diet',
      'Lifestyle',
      'Follow-up',
      'All results normal',
    ];
    
    // Replace each phrase with its translation
    let translatedMessage = message;
    phrases.forEach(phrase => {
      const translation = localizationService.translate(phrase);
      translatedMessage = translatedMessage.replace(phrase, translation);
    });
    
    return translatedMessage;
  }
}

// Export a singleton instance
export const smsService = new SMSService();