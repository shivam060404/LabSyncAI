# Multi-Language Support in LabSyncAI

## Overview

LabSyncAI provides comprehensive multi-language support to make medical information accessible to users across India. The application supports multiple Indian languages and provides region-specific reference ranges for medical tests.

## Supported Languages

The following languages are supported:

- English (en)
- Hindi (hi) - हिन्दी
- Bengali (bn) - বাংলা
- Telugu (te) - తెలుగు
- Tamil (ta) - தமிழ்
- Marathi (mr) - मराठी
- Gujarati (gu) - ગુજરાતી
- Kannada (kn) - ಕನ್ನಡ
- Malayalam (ml) - മലയാളം
- Punjabi (pa) - ਪੰਜਾਬੀ
- Urdu (ur) - اردو
- Odia (or) - ଓଡ଼ିଆ
- Assamese (as) - অসমীয়া

## Supported Regions

The following regions are supported for region-specific reference ranges:

- All India (default)
- North India
- South India
- East India
- West India
- Northeast India

## Features

### Language Selection

Users can select their preferred language for the application interface. The language can be changed from:

- The language selector in the navigation bar
- The language settings page

### Translation

The following elements are translated:

- User interface elements
- Medical terms and descriptions
- Medical report summaries
- Health recommendations
- SMS notifications

### Region-Specific Reference Ranges

Medical test reference ranges can vary based on regional factors such as diet, genetics, and environment. LabSyncAI provides region-specific reference ranges for common medical tests, including:

- Hemoglobin
- Vitamin D
- Fasting Blood Sugar
- Total Cholesterol
- And more

### SMS Notifications

Users can receive SMS notifications in their preferred language. This is particularly useful for users without smartphones or with limited internet access. SMS notifications include:

- New report notifications
- Abnormal result alerts
- Health recommendation updates

### Low Resource Mode

For users with limited internet connectivity or older devices, LabSyncAI provides a Low Resource Mode that optimizes the application for performance and reduced data usage. Features include:

- Image compression
- Simplified UI
- Disabled animations
- Offline capabilities
- Data usage limits

## Implementation

### Language Context

The application uses a React Context (`LanguageContext`) to manage language preferences and provide translation functionality throughout the application.

### Localization Service

The `localizationService` provides translation dictionaries and methods for translating strings, retrieving region-specific reference ranges, and generating SMS-friendly content.

### Components

- `LanguageSelector`: A dropdown component for quick language switching
- `LanguageSettings`: A comprehensive settings page for language and region preferences
- `RegionalReferenceRanges`: A component to display region-specific reference ranges for medical tests
- `SmsNotificationSettings`: A component to configure SMS notification preferences
- `LowResourceModeSettings`: A component to configure low resource mode settings

## Usage

### Translating Text

To translate text in a component:

```jsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { translate } = useLanguage();
  
  return (
    <div>
      <h1>{translate('My Heading')}</h1>
      <p>{translate('My paragraph text.')}</p>
    </div>
  );
}
```

### Changing Language

```jsx
import { useLanguage } from '@/contexts/LanguageContext';

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="hi">हिन्दी (Hindi)</option>
      {/* Other languages */}
    </select>
  );
}
```

### Setting Region

```jsx
import { useLanguage } from '@/contexts/LanguageContext';

function RegionSelector() {
  const { region, setRegion } = useLanguage();
  
  return (
    <select value={region} onChange={(e) => setRegion(e.target.value)}>
      <option value="All India">All India</option>
      <option value="North India">North India</option>
      {/* Other regions */}
    </select>
  );
}
```

## Adding New Translations

To add new translations, update the translation dictionaries in `localizationService.ts`:

```typescript
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    'New Key': 'English translation',
    // ...
  },
  hi: {
    'New Key': 'Hindi translation',
    // ...
  },
  // Other languages
};
```

## Adding New Regions

To add new regions, update the `availableRegions` array in `LanguageContext.tsx` and add corresponding reference ranges in `regionalReferenceRanges.ts`.

## Low Resource Mode

Low Resource Mode can be enabled in the settings page. It applies CSS optimizations and behavior changes to reduce data usage and improve performance on slower connections and older devices.

## Future Enhancements

- Voice input and output in multiple languages
- OCR support for multiple languages
- Expanded regional reference ranges
- Support for additional Indian languages
- Improved offline functionality