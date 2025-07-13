/**
 * Utility functions for file handling and validation
 */

/**
 * Supported file types for medical reports
 */
export const SUPPORTED_FILE_TYPES = {
  PDF: 'application/pdf',
  CSV: 'text/csv',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  DICOM: 'application/dicom',
};

/**
 * Maximum file size in bytes (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Check if a file type is supported
 * @param fileType - MIME type of the file
 * @returns Boolean indicating if the file type is supported
 */
export function isFileTypeSupported(fileType: string): boolean {
  return Object.values(SUPPORTED_FILE_TYPES).includes(fileType);
}

/**
 * Check if a file size is within the allowed limit
 * @param fileSize - Size of the file in bytes
 * @returns Boolean indicating if the file size is within limits
 */
export function isFileSizeValid(fileSize: number): boolean {
  return fileSize <= MAX_FILE_SIZE;
}

/**
 * Format file size to human-readable string
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get file extension from file name
 * @param fileName - Name of the file
 * @returns File extension (without the dot)
 */
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

/**
 * Get file icon based on file type
 * @param fileType - MIME type of the file
 * @returns Icon name for the file type
 */
export function getFileIcon(fileType: string): string {
  switch (fileType) {
    case SUPPORTED_FILE_TYPES.PDF:
      return 'file-pdf';
    case SUPPORTED_FILE_TYPES.CSV:
      return 'file-csv';
    case SUPPORTED_FILE_TYPES.JPEG:
    case SUPPORTED_FILE_TYPES.PNG:
      return 'file-image';
    case SUPPORTED_FILE_TYPES.DICOM:
      return 'file-medical';
    default:
      return 'file';
  }
}

/**
 * Create a file preview URL
 * @param file - File object
 * @returns URL for file preview
 */
export function createFilePreview(file: File): string {
  // Check if we're in a browser environment
  if (typeof URL === 'undefined' || typeof URL.createObjectURL === 'undefined') {
    throw new Error('createFilePreview is only available in browser environments');
  }
  return URL.createObjectURL(file);
}

/**
 * Revoke a file preview URL to free up memory
 * @param previewUrl - URL created by createFilePreview
 */
export function revokeFilePreview(previewUrl: string): void {
  // Check if we're in a browser environment
  if (typeof URL === 'undefined' || typeof URL.revokeObjectURL === 'undefined') {
    console.warn('revokeFilePreview is only available in browser environments');
    return;
  }
  URL.revokeObjectURL(previewUrl);
}

/**
 * Convert a base64 string to a Blob
 * @param base64 - Base64 encoded string
 * @param contentType - MIME type of the file
 * @returns Blob object
 */
export function base64ToBlob(base64: string, contentType: string): Blob {
  // Check if we're in a browser environment
  if (typeof atob === 'undefined' || typeof Blob === 'undefined') {
    throw new Error('base64ToBlob is only available in browser environments');
  }
  
  try {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  } catch (error) {
    console.error('Error converting base64 to Blob:', error);
    // Handle the unknown error type
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error('Failed to convert base64 to Blob: ' + errorMessage);
  }
}