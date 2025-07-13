/**
 * Localization Service for LabSyncAI
 * Provides translation, regional reference ranges, and localization utilities
 */

import { SupportedLanguage, RegionalReferenceRange, TestResult } from '@/types';

// Translation dictionaries for different languages
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // English is the base language
  },
  hi: {
    // Hindi translations
    'Dashboard': 'डैशबोर्ड',
    'Reports': 'रिपोर्ट',
    'Health Plans': 'स्वास्थ्य योजनाएँ',
    'Recommendations': 'सिफारिशें',
    'Settings': 'सेटिंग्स',
    'Profile': 'प्रोफ़ाइल',
    'Logout': 'लॉग आउट',
    'Upload Report': 'रिपोर्ट अपलोड करें',
    'View Report': 'रिपोर्ट देखें',
    'Delete Report': 'रिपोर्ट हटाएं',
    'Normal': 'सामान्य',
    'Abnormal': 'असामान्य',
    'High': 'उच्च',
    'Low': 'निम्न',
    'Critical': 'गंभीर',
  },
  bn: {
    // Bengali translations
    'Dashboard': 'ড্যাশবোর্ড',
    'Reports': 'রিপোর্ট',
    'Health Plans': 'স্বাস্থ্য পরিকল্পনা',
    'Recommendations': 'সুপারিশ',
    'Settings': 'সেটিংস',
    'Profile': 'প্রোফাইল',
    'Logout': 'লগ আউট',
    'Upload Report': 'রিপোর্ট আপলোড করুন',
    'View Report': 'রিপোর্ট দেখুন',
    'Delete Report': 'রিপোর্ট মুছুন',
    'Normal': 'স্বাভাবিক',
    'Abnormal': 'অস্বাভাবিক',
    'High': 'উচ্চ',
    'Low': 'নিম্ন',
    'Critical': 'সংকটপূর্ণ',
  },
  te: {
    // Telugu translations
    'Dashboard': 'డాష్‌బోర్డ్',
    'Reports': 'నివేదికలు',
    'Health Plans': 'ఆరోగ్య ప్రణాళికలు',
    'Recommendations': 'సిఫార్సులు',
    'Settings': 'సెట్టింగ్‌లు',
    'Profile': 'ప్రొఫైల్',
    'Logout': 'లాగ్ అవుట్',
    'Upload Report': 'నివేదికను అప్‌లోడ్ చేయండి',
    'View Report': 'నివేదికను చూడండి',
    'Delete Report': 'నివేదికను తొలగించండి',
    'Normal': 'సాధారణ',
    'Abnormal': 'అసాధారణ',
    'High': 'అధిక',
    'Low': 'తక్కువ',
    'Critical': 'క్లిష్టమైన',
  },
  ta: {
    // Tamil translations
    'Dashboard': 'டாஷ்போர்டு',
    'Reports': 'அறிக்கைகள்',
    'Health Plans': 'சுகாதார திட்டங்கள்',
    'Recommendations': 'பரிந்துரைகள்',
    'Settings': 'அமைப்புகள்',
    'Profile': 'சுயவிவரம்',
    'Logout': 'வெளியேறு',
    'Upload Report': 'அறிக்கையை பதிவேற்றவும்',
    'View Report': 'அறிக்கையைக் காண்க',
    'Delete Report': 'அறிக்கையை நீக்கு',
    'Normal': 'இயல்பான',
    'Abnormal': 'அசாதாரண',
    'High': 'உயர்',
    'Low': 'குறைந்த',
    'Critical': 'நெருக்கடி',
  },
  mr: {
    // Marathi translations
    'Dashboard': 'डॅशबोर्ड',
    'Reports': 'अहवाल',
    'Health Plans': 'आरोग्य योजना',
    'Recommendations': 'शिफारसी',
    'Settings': 'सेटिंग्ज',
    'Profile': 'प्रोफाइल',
    'Logout': 'लॉग आउट',
    'Upload Report': 'अहवाल अपलोड करा',
    'View Report': 'अहवाल पहा',
    'Delete Report': 'अहवाल हटवा',
    'Normal': 'सामान्य',
    'Abnormal': 'असामान्य',
    'High': 'उच्च',
    'Low': 'कमी',
    'Critical': 'गंभीर',
  },
  gu: {
    // Gujarati translations
    'Dashboard': 'ડેશબોર્ડ',
    'Reports': 'અહેવાલો',
    'Health Plans': 'આરોગ્ય યોજનાઓ',
    'Recommendations': 'ભલામણો',
    'Settings': 'સેટિંગ્સ',
    'Profile': 'પ્રોફાઇલ',
    'Logout': 'લૉગ આઉટ',
    'Upload Report': 'અહેવાલ અપલોડ કરો',
    'View Report': 'અહેવાલ જુઓ',
    'Delete Report': 'અહેવાલ કાઢી નાખો',
    'Normal': 'સામાન્ય',
    'Abnormal': 'અસામાન્ય',
    'High': 'ઉચ્ચ',
    'Low': 'નીચું',
    'Critical': 'ગંભીર',
  },
  kn: {
    // Kannada translations
    'Dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'Reports': 'ವರದಿಗಳು',
    'Health Plans': 'ಆರೋಗ್ಯ ಯೋಜನೆಗಳು',
    'Recommendations': 'ಶಿಫಾರಸುಗಳು',
    'Settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'Profile': 'ಪ್ರೊಫೈಲ್',
    'Logout': 'ಲಾಗ್ ಔಟ್',
    'Upload Report': 'ವರದಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    'View Report': 'ವರದಿಯನ್ನು ವೀಕ್ಷಿಸಿ',
    'Delete Report': 'ವರದಿಯನ್ನು ಅಳಿಸಿ',
    'Normal': 'ಸಾಮಾನ್ಯ',
    'Abnormal': 'ಅಸಾಮಾನ್ಯ',
    'High': 'ಹೆಚ್ಚು',
    'Low': 'ಕಡಿಮೆ',
    'Critical': 'ಗಂಭೀರ',
  },
  ml: {
    // Malayalam translations
    'Dashboard': 'ഡാഷ്ബോർഡ്',
    'Reports': 'റിപ്പോർട്ടുകൾ',
    'Health Plans': 'ആരോഗ്യ പദ്ധതികൾ',
    'Recommendations': 'ശുപാർശകൾ',
    'Settings': 'ക്രമീകരണങ്ങൾ',
    'Profile': 'പ്രൊഫൈൽ',
    'Logout': 'ലോഗ്ഔട്ട്',
    'Upload Report': 'റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുക',
    'View Report': 'റിപ്പോർട്ട് കാണുക',
    'Delete Report': 'റിപ്പോർട്ട് ഇല്ലാതാക്കുക',
    'Normal': 'സാധാരണ',
    'Abnormal': 'അസാധാരണം',
    'High': 'ഉയർന്ന',
    'Low': 'കുറഞ്ഞ',
    'Critical': 'ഗുരുതരമായ',
  },
  pa: {
    // Punjabi translations
    'Dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'Reports': 'ਰਿਪੋਰਟਾਂ',
    'Health Plans': 'ਸਿਹਤ ਯੋਜਨਾਵਾਂ',
    'Recommendations': 'ਸਿਫਾਰਸ਼ਾਂ',
    'Settings': 'ਸੈਟਿੰਗਾਂ',
    'Profile': 'ਪ੍ਰੋਫਾਈਲ',
    'Logout': 'ਲੌਗ ਆਉਟ',
    'Upload Report': 'ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰੋ',
    'View Report': 'ਰਿਪੋਰਟ ਵੇਖੋ',
    'Delete Report': 'ਰਿਪੋਰਟ ਮਿਟਾਓ',
    'Normal': 'ਆਮ',
    'Abnormal': 'ਅਸਧਾਰਨ',
    'High': 'ਉੱਚ',
    'Low': 'ਘੱਟ',
    'Critical': 'ਨਾਜ਼ੁਕ',
  },
  ur: {
    // Urdu translations
    'Dashboard': 'ڈیش بورڈ',
    'Reports': 'رپورٹیں',
    'Health Plans': 'صحت کے منصوبے',
    'Recommendations': 'سفارشات',
    'Settings': 'ترتیبات',
    'Profile': 'پروفائل',
    'Logout': 'لاگ آؤٹ',
    'Upload Report': 'رپورٹ اپ لوڈ کریں',
    'View Report': 'رپورٹ دیکھیں',
    'Delete Report': 'رپورٹ حذف کریں',
    'Normal': 'عام',
    'Abnormal': 'غیر معمولی',
    'High': 'زیادہ',
    'Low': 'کم',
    'Critical': 'تنقیدی',
  },
  or: {
    // Odia translations
    'Dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'Reports': 'ରିପୋର୍ଟ',
    'Health Plans': 'ସ୍ୱାସ୍ଥ୍ୟ ଯୋଜନା',
    'Recommendations': 'ପରାମର୍ଶଗୁଡିକ',
    'Settings': 'ସେଟିଂସ',
    'Profile': 'ପ୍ରୋଫାଇଲ',
    'Logout': 'ଲଗଆଉଟ',
    'Upload Report': 'ରିପୋର୍ଟ ଅପଲୋଡ କରନ୍ତୁ',
    'View Report': 'ରିପୋର୍ଟ ଦେଖନ୍ତୁ',
    'Delete Report': 'ରିପୋର୍ଟ ଡିଲିଟ କରନ୍ତୁ',
    'Normal': 'ସାଧାରଣ',
    'Abnormal': 'ଅସାଧାରଣ',
    'High': 'ଉଚ୍ଚ',
    'Low': 'ନିମ୍ନ',
    'Critical': 'ଗୁରୁତର',
  },
  as: {
    // Assamese translations
    'Dashboard': 'ডেশ্বব\'ৰ্ড',
    'Reports': 'প্ৰতিবেদনসমূহ',
    'Health Plans': 'স্বাস্থ্য পৰিকল্পনাসমূহ',
    'Recommendations': 'পৰামৰ্শসমূহ',
    'Settings': 'ছেটিংছ',
    'Profile': 'প্ৰ\'ফাইল',
    'Logout': 'লগ আউট',
    'Upload Report': 'প্ৰতিবেদন আপল\'ড কৰক',
    'View Report': 'প্ৰতিবেদন চাওক',
    'Delete Report': 'প্ৰতিবেদন মচি পেলাওক',
    'Normal': 'স্বাভাৱিক',
    'Abnormal': 'অস্বাভাৱিক',
    'High': 'উচ্চ',
    'Low': 'নিম্ন',
    'Critical': 'সংকটপূৰ্ণ',
  },
};

// Region-specific reference ranges for common tests
const regionalReferenceRanges: RegionalReferenceRange[] = [
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
    description: 'Vitamin D levels for adults in South India',
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
];

/**
 * Localization Service class
 */
export class LocalizationService {
  private currentLanguage: SupportedLanguage = 'en';
  private currentRegion: string = 'All India';
  
  /**
   * Set the current language for the application
   */
  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
  }
  
  /**
   * Get the current language
   */
  getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }
  
  /**
   * Set the current region for reference ranges
   */
  setRegion(region: string): void {
    this.currentRegion = region;
  }
  
  /**
   * Get the current region
   */
  getRegion(): string {
    return this.currentRegion;
  }
  
  /**
   * Translate a string to the current language
   */
  translate(key: string): string {
    if (this.currentLanguage === 'en') {
      return key; // English is the base language
    }
    
    const translationDict = translations[this.currentLanguage];
    if (!translationDict) {
      return key; // Fallback to English if language not supported
    }
    
    return translationDict[key] || key; // Return translation or original key if not found
  }
  
  /**
   * Get region-specific reference range for a test
   */
  getReferenceRange(testName: string, gender: 'male' | 'female' | 'all' = 'all'): RegionalReferenceRange | null {
    // First try to find a region and gender specific match
    let range = regionalReferenceRanges.find(r => 
      r.region === this.currentRegion && 
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
   * Apply region-specific reference ranges to test results
   */
  applyRegionalReferenceRanges(results: TestResult[], gender: 'male' | 'female' = 'male'): TestResult[] {
    return results.map(result => {
      const regionalRange = this.getReferenceRange(result.name, gender);
      
      if (regionalRange && regionalRange.min !== undefined && regionalRange.max !== undefined) {
        // Create a new result object with updated reference range
        return {
          ...result,
          referenceRange: {
            min: regionalRange.min,
            max: regionalRange.max,
            text: `${regionalRange.min}-${regionalRange.max} ${regionalRange.unit}`
          },
          // Update status based on new reference range
          status: this.calculateStatus(result.value as number, regionalRange.min, regionalRange.max)
        };
      }
      
      return result; // Return original result if no regional range found
    });
  }
  
  /**
   * Calculate status based on value and reference range
   */
  private calculateStatus(value: number, min?: number, max?: number): 'normal' | 'low' | 'high' | 'critical-low' | 'critical-high' | 'abnormal' {
    if (min === undefined || max === undefined) {
      return 'normal';
    }
    
    if (value < min) {
      return value < min * 0.8 ? 'critical-low' : 'low';
    }
    
    if (value > max) {
      return value > max * 1.2 ? 'critical-high' : 'high';
    }
    
    return 'normal';
  }
  
  /**
   * Compress text for SMS notifications
   */
  compressForSMS(text: string, maxLength: number = 160): string {
    if (text.length <= maxLength) {
      return text;
    }
    
    // Simple compression by removing vowels from words longer than 3 characters
    // This is a basic approach - more sophisticated algorithms could be implemented
    const words = text.split(' ');
    const compressedWords = words.map(word => {
      if (word.length > 3) {
        return word.replace(/[aeiou]/gi, '');
      }
      return word;
    });
    
    let compressed = compressedWords.join(' ');
    
    // If still too long, truncate and add ellipsis
    if (compressed.length > maxLength) {
      compressed = compressed.substring(0, maxLength - 3) + '...';
    }
    
    return compressed;
  }
  
  /**
   * Generate SMS report summary
   */
  generateSMSReportSummary(report: any, language: SupportedLanguage = 'en'): string {
    // Save current language
    const prevLanguage = this.currentLanguage;
    // Set language for translation
    this.setLanguage(language);
    
    // Create a basic summary
    const reportDate = new Date(report.date).toLocaleDateString();
    const abnormalResults = report.results?.filter((r: TestResult) => r.status !== 'normal') || [];
    
    let summary = `${this.translate('Report')}: ${report.title} (${reportDate})\n`;
    
    if (abnormalResults.length > 0) {
      summary += `${this.translate('Abnormal Results')}:\n`;
      abnormalResults.forEach((result: TestResult) => {
        summary += `- ${result.name}: ${result.value} ${result.unit || ''} (${this.translate(result.status || 'Abnormal')})\n`;
      });
    } else {
      summary += `${this.translate('All results normal')}\n`;
    }
    
    if (report.analysis?.recommendations && report.analysis.recommendations.length > 0) {
      summary += `${this.translate('Key Recommendation')}: ${report.analysis.recommendations[0]}\n`;
    }
    
    // Restore previous language
    this.setLanguage(prevLanguage);
    
    // Compress if needed
    return this.compressForSMS(summary);
  }
}

// Export a singleton instance
export const localizationService = new LocalizationService();

/**
 * Get available languages for the application
 * @returns Array of supported languages
 */
export function getAvailableLanguages(): SupportedLanguage[] {
  return [
    'en', // English
    'hi', // Hindi
    'bn', // Bengali
    'te', // Telugu
    'ta', // Tamil
    'mr', // Marathi
    'gu', // Gujarati
    'kn', // Kannada
    'ml', // Malayalam
    'pa', // Punjabi
    'ur', // Urdu
    'or', // Odia
    'as', // Assamese
  ];
}

/**
 * Get available regions for the application
 * @returns Array of available regions
 */
export function getAvailableRegions(): string[] {
  return [
    'All India',
    'North India',
    'South India',
    'East India',
    'West India',
    'Northeast India',
  ];
}

/**
 * Get translation for a key in the specified language
 * @param key - The translation key
 * @param language - The language to translate to
 * @returns The translated string or the key itself if translation not found
 */
export function getTranslation(key: string, language: SupportedLanguage = 'en'): string {
  if (language === 'en') {
    return key; // English is the base language, return the key itself
  }
  
  const translationDict = translations[language];
  if (translationDict && translationDict[key]) {
    return translationDict[key];
  }
  
  return key; // Fallback to the key itself if translation not found
}