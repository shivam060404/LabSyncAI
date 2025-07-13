# Low Resource Mode in LabSyncAI

## Overview

LabSyncAI's Low Resource Mode is designed to make the application accessible and usable in environments with limited connectivity, older devices, or constrained data plans. This feature is particularly important for reaching users in rural and semi-urban areas of India where internet connectivity may be limited or expensive.

## Features

### Data Compression

- **Image Compression**: Reduces the size of images while maintaining readability
- **Text Compression**: Optimizes text content for SMS and low-bandwidth connections
- **Report Summarization**: Creates concise summaries of medical reports for SMS delivery

### UI Optimization

- **Simplified UI**: Reduces visual complexity and removes non-essential UI elements
- **Disabled Animations**: Turns off animations to improve performance on older devices
- **Reduced Image Quality**: Lowers image quality to decrease data usage
- **Text-First Approach**: Prioritizes text content over images when possible

### Connection Optimization

- **Offline Mode**: Allows access to previously loaded reports and recommendations without an internet connection
- **Data Usage Limits**: Sets maximum data usage for the application
- **Auto-Detection**: Automatically detects connection speed and adjusts settings accordingly

### SMS Integration

- **SMS Notifications**: Sends important health information via SMS for users without smartphones
- **SMS Report Summaries**: Delivers concise summaries of medical reports via SMS
- **SMS Recommendations**: Provides health recommendations via SMS

## Implementation

### CSS Optimizations

The `low-resource-mode.css` file contains CSS optimizations that are applied when Low Resource Mode is enabled:

- Image quality classes (`image-quality-low`, `image-quality-medium`, `image-quality-high`) for different levels of image optimization
- Simplified UI with reduced shadows and rounded corners (via `simplified-ui` class)
- Disabled animations and transitions (via `disable-animations` class)
- Optimized layouts for small screens
- Reduced color depth
- System font usage
- Print optimizations

### JavaScript Utilities

The `compressionUtils.ts` file provides utilities for data compression and optimization:

- `optimizeForLowResource`: Applies image quality optimizations based on the selected quality level (low, medium, high)
- `generateCompressedReport`: Creates compressed versions of medical reports when compressReports is enabled
- `generateSmsSummary`: Creates SMS-friendly summaries of medical reports
- `detectConnectionSpeed`: Automatically detects connection speed to adjust compression settings
- `cacheReportsForOfflineUse`: Stores reports locally for access in offline mode
- `syncDataBasedOnFrequency`: Synchronizes data based on the selected sync frequency

### Settings Component

The `LowResourceModeSettings.tsx` component allows users to configure Low Resource Mode settings:

- Enable/disable compression
- Select image quality (low, medium, high)
- Enable/disable report compression
- Enable offline mode
- Set sync frequency
- Auto-detect connection speed

## Usage

### Enabling Low Resource Mode

Low Resource Mode can be enabled in the Settings page under the "Low Resource Mode" tab.

### Programmatic Usage

```typescript
import { useCompressionSettings } from '@/contexts/CompressionContext';
import { optimizeForLowResource } from '@/lib/compressionUtils';

function MyComponent() {
  const { compressionSettings } = useCompressionSettings();
  
  // Example: Optimize an image for low resource mode
  const optimizedImageUrl = optimizeForLowResource(
    originalImageUrl,
    compressionSettings.enabled,
    compressionSettings.imageQuality
  );
  
  // Example: Handle report compression
  const handleReportDisplay = (report) => {
    if (compressionSettings.enabled && compressionSettings.compressReports) {
      return generateCompressedReport(report);
    }
    return report;
  };
  
  // Example: Handle offline mode
  useEffect(() => {
    if (compressionSettings.enabled && compressionSettings.offlineMode) {
      // Cache necessary data for offline use
      cacheReportsForOfflineUse();
    }
  }, [compressionSettings.offlineMode]);
  
  return (
    <div>
      <img src={optimizedImageUrl} alt="Optimized image" />
      <div>{handleReportDisplay(currentReport)}</div>
    </div>
  );
}
```

### Applying CSS Classes

To apply Low Resource Mode styles to a component:

```jsx
import { useCompressionSettings } from '@/contexts/CompressionContext';

function MyComponent() {
  const { compressionSettings } = useCompressionSettings();
  
  // Base class for low resource mode
  const className = `my-component ${compressionSettings.enabled ? 'low-resource-mode' : ''}`;
  
  // Add image quality class based on settings
  let imageQualityClass = '';
  if (compressionSettings.enabled) {
    // When low resource mode is enabled, simplified-ui and disable-animations are automatically applied
    // Add image quality class based on the selected quality
    switch (compressionSettings.imageQuality) {
      case 'low':
        imageQualityClass = ' image-quality-low';
        break;
      case 'medium':
        imageQualityClass = ' image-quality-medium';
        break;
      case 'high':
        imageQualityClass = ' image-quality-high';
        break;
      default:
        imageQualityClass = ' image-quality-medium';
    }
  }
  
  return (
    <div className={`${className}${imageQualityClass}`}>
      {/* Component content */}
    </div>
  );
}
```

## Best Practices

### Images

- Always provide `alt` text for images
- Use SVG for icons and simple graphics when possible
- Implement lazy loading for images
- Consider providing text alternatives for non-essential images
- Use the appropriate image quality setting based on the user's connection and device

### Network Requests

- Minimize the number of network requests
- Implement caching for frequently accessed data
- Use pagination for large datasets
- Implement retry mechanisms for failed requests
- Respect the user's sync frequency setting to control data usage

### Offline Support

- Prioritize essential data for offline caching
- Provide clear indicators when the app is in offline mode
- Implement data synchronization when connection is restored
- Use IndexedDB or localStorage for offline data storage
- Handle offline form submissions with a queue system

### UI Design

- Design with a mobile-first approach
- Use system fonts instead of custom fonts
- Minimize the use of heavy CSS properties (shadows, gradients, etc.)
- Avoid complex layouts that require significant reflow
- Ensure the app is usable with the simplified UI applied

## Testing

To test Low Resource Mode:

1. Enable Low Resource Mode in the Settings page
2. Test different image quality settings (low, medium, high) and verify visual differences
3. Enable report compression and verify that reports load faster
4. Test offline mode by enabling it and then disconnecting from the internet
5. Test different sync frequency settings and monitor network activity
6. Use browser developer tools to throttle network connection
7. Test on older devices or device emulators
8. Monitor data usage using browser developer tools
9. Test SMS functionality with the SmsTestComponent

## Future Enhancements

- Progressive Web App (PWA) support for improved offline functionality
- More granular control over image quality settings
- Advanced report compression algorithms
- Improved offline synchronization strategies
- Enhanced SMS integration with rich text formatting
- Support for proxy servers in low-connectivity areas
- Adaptive sync frequency based on connection quality
- Battery-saving optimizations for low-power devices