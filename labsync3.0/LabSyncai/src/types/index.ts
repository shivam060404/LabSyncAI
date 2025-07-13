/**
 * Type definitions for the LabSyncAI application
 */

import { ObjectId } from 'mongodb';

/**
 * MongoDB document with ObjectId
 */
export interface MongoDocument {
  _id?: ObjectId;
}

/**
 * User profile information
 */
export interface UserProfile extends MongoDocument {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  location?: string;
  region?: string; // Specific region in India for region-specific reference ranges
  state?: string; // Indian state
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';
  height?: number; // in cm
  weight?: number; // in kg
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  languagePreference?: LanguagePreference;
  smsNotificationSettings?: SmsNotificationSettings;
  compressionSettings?: CompressionSettings;
  deviceType?: 'smartphone' | 'feature-phone' | 'tablet' | 'desktop' | 'other';
  connectionType?: 'broadband' | '4G' | '3G' | '2G' | 'dialup' | 'unknown';
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Medical report types
 */
export type ReportType = 'CBC' | 'Lipid Panel' | 'Metabolic Panel' | 'Urinalysis' | 'ECG' | 'X-Ray' | 'MRI' | 'CT Scan' | 'Ultrasound' | 'Other';

/**
 * Report status
 */
export type ReportStatus = 'pending' | 'processing' | 'completed' | 'completed_with_errors' | 'error';

/**
 * Medical report information
 */
export interface MedicalReport extends MongoDocument {
  id: string;
  userId: string;
  type: ReportType;
  title: string;
  description?: string;
  status: ReportStatus;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadDate: Date | string;
  processedDate?: Date | string;
  provider?: string;
  patientName?: string;
  patientDOB?: Date | string;
  reportDate?: string;
  results?: TestResult[];
  analysis?: ReportAnalysis;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Test result information
 */
export interface TestResult {
  name: string;
  value: number | string;
  unit?: string;
  referenceRange?: {
    min?: number | string;
    max?: number | string;
    text?: string;
  };
  status?: 'normal' | 'low' | 'high' | 'critical-low' | 'critical-high' | 'abnormal';
  notes?: string;
}

/**
 * Report analysis information
 */
export interface ReportAnalysis {
  summary?: string;
  findings: string[];
  recommendations: string[];
  possibleConditions?: {
    name: string;
    probability: number; // 0-1
    description: string;
  }[];
  followUpRecommended?: boolean;
  followUpTimeframe?: string;
  aiConfidenceScore?: number; // 0-1
  reportType?: ReportType;
  testResults?: any[]; // Add testResults property to match implementation
  personalizedRecommendations?: {
    dietary: string[];
    exercise: string[];
    lifestyle: string[];
    medicationNotes?: string[];
  };
}

/**
 * Health alert information
 */
export interface HealthAlert {
  id: string;
  userId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  relatedReportId?: string;
  relatedTestResult?: string;
  isRead: boolean;
  createdAt: Date;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalReports: number;
  recentReports: number;
  abnormalResults: number;
  pendingReports: number;
  healthScore?: number; // 0-100
}

/**
 * Filter options for reports
 */
export interface ReportFilters {
  type?: ReportType[];
  status?: ReportStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

/**
 * API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Health Plan information
 */
export interface HealthPlan {
  summary: string;
  dietaryRecommendations: string[];
  exerciseRecommendations: string[];
  lifestyleChanges: string[];
  medicationNotes?: string[];
  followUpSchedule?: string;
  goals: Array<{description: string, timeframe: string}>;
}

/**
 * Voice interface options
 */
export interface VoiceOptions {
  gender?: 'male' | 'female' | 'neutral';
  accent?: string;
  speed?: number; // 0.5 to 2.0, 1.0 is normal speed
  pitch?: number; // 0.5 to 2.0, 1.0 is normal pitch
}

/**
 * AI Response format
 */
export interface AIResponse {
  answer: string;
  references?: Array<{text: string, location: string}>;
  suggestedFollowUps?: string[];
  confidence?: number;
}

/**
 * Supported languages for the application
 */
export type SupportedLanguage = 
  | 'en' // English
  | 'hi' // Hindi
  | 'bn' // Bengali
  | 'te' // Telugu
  | 'ta' // Tamil
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'pa' // Punjabi
  | 'ur' // Urdu
  | 'or' // Odia
  | 'as' // Assamese;

/**
 * Language preference settings
 */
export interface LanguagePreference {
  primary: SupportedLanguage;
  secondary?: SupportedLanguage;
  useTranslatedReports: boolean;
  useTranslatedRecommendations: boolean;
  smsNotifications: boolean;
  voiceLanguage: SupportedLanguage;
}

/**
 * Region-specific reference ranges for test results
 */
export interface RegionalReferenceRange {
  region: string; // e.g., 'North India', 'South India', 'East India', 'West India', 'Northeast India'
  gender?: 'male' | 'female' | 'all';
  ageRange?: {
    min?: number;
    max?: number;
  };
  testName: string;
  min?: number;
  max?: number;
  unit: string;
  description?: string;
}

/**
 * SMS notification settings
 */
export interface SmsNotificationSettings {
  enabled: boolean;
  phoneNumber: string;
  language: SupportedLanguage;
  notifyOnNewReport: boolean;
  notifyOnAbnormalResults: boolean;
  notifyOnRecommendations: boolean;
  includeReportSummary: boolean;
  maxMessageLength?: number; // For limiting SMS length
}

/**
 * Data compression settings for low-bandwidth environments
 */
export interface CompressionSettings {
  enabled: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  compressReports: boolean;
  offlineMode: boolean;
  syncFrequency: 'manual' | 'daily' | 'weekly' | 'when-connected';
}