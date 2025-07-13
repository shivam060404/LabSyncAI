'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MedicalReport, ReportFilters, PaginationParams } from '../types';
import api from './api';
import { useAuth } from './AuthContext';
import { ReportType } from './aiService';

interface ReportsContextType {
  reports: MedicalReport[];
  isLoading: boolean;
  error: string | null;
  filters: ReportFilters;
  pagination: PaginationParams;
  fetchReports: (newFilters?: Partial<ReportFilters>) => Promise<void>;
  getReportById: (id: string) => Promise<MedicalReport | null>;
  uploadReport: (file: File, metadata: Partial<MedicalReport>) => Promise<{ success: boolean; report?: MedicalReport; message?: string }>;
  deleteReport: (id: string) => Promise<boolean>;
  setFilters: (newFilters: Partial<ReportFilters>) => void;
  setPagination: (newPagination: Partial<PaginationParams>) => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ReportFilters>({});
  const [pagination, setPaginationState] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Fetch reports when authenticated or filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated]);

  // Fetch reports with optional new filters
  const fetchReports = async (newFilters?: Partial<ReportFilters>) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Apply new filters if provided
      const currentFilters = newFilters ? { ...filters, ...newFilters } : filters;
      setFiltersState(currentFilters);
      
      // Prepare query parameters
      const params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };
      
      // Add filter parameters if they exist
      if (currentFilters.type?.length) {
        params.types = currentFilters.type.join(',');
      }
      
      if (currentFilters.status?.length) {
        params.statuses = currentFilters.status.join(',');
      }
      
      if (currentFilters.dateRange) {
        params.startDate = currentFilters.dateRange.start.toISOString();
        params.endDate = currentFilters.dateRange.end.toISOString();
      }
      
      if (currentFilters.searchTerm) {
        params.search = currentFilters.searchTerm;
      }
      
      const response = await api.get<{ reports: MedicalReport[]; total: number }>('/reports', params);
      
      if (response.success && response.data) {
        setReports(response.data.reports);
        setPaginationState(prev => ({
          ...prev,
          total: response.data?.total || 0,
        }));
      } else {
        setError(response.error || 'Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('An unexpected error occurred while fetching reports');
    } finally {
      setIsLoading(false);
    }
  };

  // Get a single report by ID
  const getReportById = async (id: string): Promise<MedicalReport | null> => {
    setIsLoading(true);
    try {
      const response = await api.get<MedicalReport>(`/reports/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      setError(response.error || `Failed to fetch report with ID: ${id}`);
      return null;
    } catch (error) {
      console.error(`Error fetching report ${id}:`, error);
      setError('An unexpected error occurred while fetching the report');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload a new report
  const uploadReport = async (file: File, metadata: Partial<MedicalReport>) => {
    setIsLoading(true);
    try {
      const response = await api.uploadFile<MedicalReport>('/reports/upload', file, metadata);
      
      if (response.success && response.data) {
        // Add the new report to the list
        setReports(prev => [response.data!, ...prev]);
        
        return { 
          success: true, 
          report: response.data,
        };
      }
      
      return { 
        success: false, 
        message: response.error || 'Failed to upload report'
      };
    } catch (error) {
      console.error('Error uploading report:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred while uploading the report'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a report
  const deleteReport = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.delete<{ success: boolean }>(`/reports/${id}`);
      
      if (response.success) {
        // Remove the deleted report from the list
        setReports(prev => prev.filter(report => report.id !== id));
        return true;
      }
      
      setError(response.error || `Failed to delete report with ID: ${id}`);
      return false;
    } catch (error) {
      console.error(`Error deleting report ${id}:`, error);
      setError('An unexpected error occurred while deleting the report');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update filters
  const setFilters = (newFilters: Partial<ReportFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFiltersState(updatedFilters);
    // Reset to first page when filters change
    setPaginationState(prev => ({ ...prev, page: 1 }));
    fetchReports(updatedFilters);
  };

  // Update pagination
  const setPagination = (newPagination: Partial<PaginationParams>) => {
    const updatedPagination = { ...pagination, ...newPagination };
    setPaginationState(updatedPagination);
    fetchReports();
  };

  const value = {
    reports,
    isLoading,
    error,
    filters,
    pagination,
    fetchReports,
    getReportById,
    uploadReport,
    deleteReport,
    setFilters,
    setPagination,
  };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}