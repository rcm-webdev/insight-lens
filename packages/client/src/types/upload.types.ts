// src/types/upload.types.ts

export interface UploadFile {
    id: string;
    file: File;
    preview: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress: number;
    error?: string;
    metadata: FileMetadata;
  }
  
  export interface FileMetadata {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    dimensions?: {
      width: number;
      height: number;
    };
  }
  
  export interface UploadConfig {
    maxFileSize: number; // in bytes
    maxFiles: number;
    acceptedTypes: string[];
    acceptedExtensions: string[];
  }
  
  export interface ValidationResult {
    isValid: boolean;
    errors: string[];
  }
  
  export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 20,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff'],
    acceptedExtensions: ['.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff']
  };