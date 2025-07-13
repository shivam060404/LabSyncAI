/**
 * API client for making HTTP requests
 */

import { ApiResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Default request headers
 */
const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Generic fetch function with error handling
 */
async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Error: ${response.status} ${response.statusText}`,
        message: data.message || 'An error occurred while processing your request',
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to complete request. Please check your connection and try again.',
    };
  }
}

/**
 * GET request
 */
export async function get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  return fetchWithErrorHandling<T>(url.toString(), {
    method: 'GET',
    headers: defaultHeaders,
    credentials: 'include',
  });
}

/**
 * POST request
 */
export async function post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  return fetchWithErrorHandling<T>(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: defaultHeaders,
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request
 */
export async function put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  return fetchWithErrorHandling<T>(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: defaultHeaders,
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request
 */
export async function patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  return fetchWithErrorHandling<T>(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: defaultHeaders,
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return fetchWithErrorHandling<T>(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: defaultHeaders,
    credentials: 'include',
  });
}

/**
 * Upload file with form data
 */
export async function uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Error: ${response.status} ${response.statusText}`,
        message: data.message || 'An error occurred while uploading the file',
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error('File upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to upload file. Please check your connection and try again.',
    };
  }
}

/**
 * API client object
 */
const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  uploadFile,
};

export default api;