'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CompressionSettings } from '@/types';

interface CompressionContextType {
  compressionSettings: CompressionSettings;
  updateCompressionSettings: (settings: Partial<CompressionSettings>) => void;
  enableLowResourceMode: () => void;
  disableLowResourceMode: () => void;
  detectConnectionSpeed: () => Promise<'slow' | 'medium' | 'fast'>;
  applyLowResourceClasses: () => void;
  removeLowResourceClasses: () => void;
}

const defaultCompressionSettings: CompressionSettings = {
  enabled: false,
  imageQuality: 'medium',
  compressReports: false,
  offlineMode: false,
  syncFrequency: 'when-connected',
};

const CompressionContext = createContext<CompressionContextType | undefined>(undefined);

export function CompressionProvider({ children }: { children: ReactNode }) {
  const [compressionSettings, setCompressionSettings] = useState<CompressionSettings>(defaultCompressionSettings);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('compressionSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setCompressionSettings(parsedSettings);
        
        // Apply classes if low resource mode is enabled
        if (parsedSettings.enabled) {
          applyLowResourceClasses(parsedSettings);
        }
      } catch (error) {
        console.error('Failed to parse compression settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('compressionSettings', JSON.stringify(compressionSettings));
  }, [compressionSettings]);

  // Auto-detect connection speed if enabled
  useEffect(() => {
    if (compressionSettings.enabled) {
      detectConnectionSpeed().then((speed) => {
        if (speed === 'slow') {
          updateCompressionSettings({
            imageQuality: 'low',
            compressReports: true,
          });
        } else if (speed === 'medium') {
          updateCompressionSettings({
            imageQuality: 'medium',
            compressReports: true,
          });
        }
      });
    }
  }, [compressionSettings.enabled]);

  const updateCompressionSettings = (settings: Partial<CompressionSettings>) => {
    setCompressionSettings(prev => {
      const newSettings = { ...prev, ...settings };
      
      // Apply or remove classes based on new settings
      if (newSettings.enabled) {
        applyLowResourceClasses(newSettings);
      } else {
        removeLowResourceClasses();
      }
      
      return newSettings;
    });
  };

  const enableLowResourceMode = () => {
    updateCompressionSettings({ enabled: true });
  };

  const disableLowResourceMode = () => {
    updateCompressionSettings({ enabled: false });
  };

  const detectConnectionSpeed = async (): Promise<'slow' | 'medium' | 'fast'> => {
    // Simple connection speed detection based on navigator.connection if available
    if ('connection' in navigator && navigator.connection) {
      const connection = navigator.connection as any;
      
      if (connection.effectiveType === '2g' || connection.downlink < 0.5) {
        return 'slow';
      } else if (connection.effectiveType === '3g' || connection.downlink < 2) {
        return 'medium';
      } else {
        return 'fast';
      }
    }
    
    // Fallback method: download a small test file and measure time
    try {
      const startTime = Date.now();
      const response = await fetch('/api/connection-test', { cache: 'no-store' });
      await response.text();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (duration > 1000) {
        return 'slow';
      } else if (duration > 300) {
        return 'medium';
      } else {
        return 'fast';
      }
    } catch (error) {
      console.error('Failed to detect connection speed:', error);
      return 'fast'; // Default to fast if detection fails
    }
  };

  const applyLowResourceClasses = (settings = compressionSettings) => {
    document.body.classList.add('low-resource-mode');
    
    // Apply image quality classes based on settings
    document.body.classList.remove('image-quality-low', 'image-quality-medium', 'image-quality-high');
    document.body.classList.add(`image-quality-${settings.imageQuality}`);
    
    // Apply simplified UI for all low resource mode
    document.body.classList.add('simplified-ui');
    
    // Apply disable animations for all low resource mode
    document.body.classList.add('disable-animations');
  };

  const removeLowResourceClasses = () => {
    document.body.classList.remove(
      'low-resource-mode', 
      'simplified-ui', 
      'disable-animations',
      'image-quality-low',
      'image-quality-medium',
      'image-quality-high'
    );
  };

  return (
    <CompressionContext.Provider
      value={{
        compressionSettings,
        updateCompressionSettings,
        enableLowResourceMode,
        disableLowResourceMode,
        detectConnectionSpeed,
        applyLowResourceClasses,
        removeLowResourceClasses,
      }}
    >
      {children}
    </CompressionContext.Provider>
  );
}

export function useCompressionSettings() {
  const context = useContext(CompressionContext);
  if (context === undefined) {
    throw new Error('useCompressionSettings must be used within a CompressionProvider');
  }
  return context;
}