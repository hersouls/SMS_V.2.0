import { supabase } from '../lib/supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface FileValidation {
  isValid: boolean;
  error?: string;
}

// File validation
export const validateFile = (file: File): FileValidation => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Please select an image file (JPEG, PNG, GIF, etc.)'
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 5MB'
    };
  }

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, WebP)'
    };
  }

  return { isValid: true };
};

// Upload image to Supabase Storage
export const uploadImage = async (file: File, folder: string = 'service-logos'): Promise<UploadResult> => {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;


    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(folder)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: uploadError.message || 'Failed to upload file'
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(folder)
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl
    };

  } catch (error) {
    console.error('Storage error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

// Delete image from Supabase Storage
export const deleteImage = async (url: string, folder: string = 'service-logos'): Promise<UploadResult> => {
  try {
    // Extract filename from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];

    // Delete file
    const { error: deleteError } = await supabase.storage
      .from(folder)
      .remove([fileName]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return {
        success: false,
        error: deleteError.message || 'Failed to delete file'
      };
    }

    return {
      success: true
    };

  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

// Get file size in human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Create image preview URL
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Optimize image before upload (basic implementation)
export const optimizeImage = async (file: File, maxWidth: number = 800): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      // Set canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw and compress image
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          } else {
            reject(new Error('Failed to optimize image'));
          }
        },
        file.type,
        0.8 // Quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};