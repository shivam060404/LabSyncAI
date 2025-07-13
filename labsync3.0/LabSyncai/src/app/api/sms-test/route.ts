import { NextResponse } from 'next/server';
import { localizationService } from '@/lib/localizationService';
import { SupportedLanguage } from '@/types';

/**
 * API route to simulate sending an SMS notification
 * This is a mock implementation for demonstration purposes
 */
export async function POST(request: Request) {
  try {
    const { phoneNumber, language, messageType, reportId } = await request.json();
    
    // Validate required fields
    if (!phoneNumber || !language || !messageType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Set language for translation
    localizationService.setLanguage(language as SupportedLanguage);
    
    // Generate appropriate message based on type
    let message = '';
    let status = 'success';
    
    switch (messageType) {
      case 'report':
        message = localizationService.translate('Your medical report is ready. View it on LabSyncAI or check your SMS for a summary.');
        break;
      case 'abnormal':
        message = localizationService.translate('Alert: Some test results in your recent report require attention. Please consult your healthcare provider.');
        break;
      case 'recommendation':
        message = localizationService.translate('New health recommendations based on your recent test results are available on LabSyncAI.');
        break;
      default:
        message = localizationService.translate('Notification from LabSyncAI');
    }
    
    // In a real implementation, this would connect to an SMS gateway service
    // For demo purposes, we'll just simulate a successful send
    console.log(`SMS notification sent to ${phoneNumber} in ${language}: ${message}`);
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.1) {
      status = 'failed';
      throw new Error('Simulated SMS delivery failure');
    }
    
    return NextResponse.json({
      status,
      message: 'SMS notification sent successfully',
      details: {
        phoneNumber,
        language,
        messageType,
        reportId,
        content: message,
        timestamp: new Date().toISOString(),
      }
    });
    
  } catch (error) {
    console.error('Error sending SMS notification:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}