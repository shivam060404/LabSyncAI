'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ReportsProvider } from './ReportsContext';
import { ToastProvider } from './ToastContext';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { CompressionProvider } from '@/contexts/CompressionContext';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Combines all context providers into a single component
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <LanguageProvider>
      <CompressionProvider>
        <AuthProvider>
          <ReportsProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ReportsProvider>
        </AuthProvider>
      </CompressionProvider>
    </LanguageProvider>
  );
}