import axios from 'axios';
import { API_BASE_URL } from './api';

export interface UploadResult {
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}

/**
 * Upload a single image to Backblaze B2 via backend
 */
export const uploadImage = async (
  imageUri: string,
  token: string,
): Promise<UploadResult> => {
  try {
    // Create form data
    const formData = new FormData();
    
    // Get file info
    const filename = imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Append file
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    // Upload to backend
    const response = await axios.post(
      `${API_BASE_URL}/storage/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Backblaze B2 via backend
 */
export const uploadImages = async (
  imageUris: string[],
  token: string,
  onProgress?: (progress: number) => void,
): Promise<UploadResult[]> => {
  try {
    const results: UploadResult[] = [];
    const total = imageUris.length;

    for (let i = 0; i < imageUris.length; i++) {
      const result = await uploadImage(imageUris[i], token);
      results.push(result);

      // Report progress
      if (onProgress) {
        const progress = ((i + 1) / total) * 100;
        onProgress(progress);
      }
    }

    return results;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

/**
 * Get optimized image URL based on use case
 */
export const getImageUrl = (
  uploadResult: UploadResult,
  size: 'thumbnail' | 'medium' | 'large' | 'original' = 'medium',
): string => {
  return uploadResult[size];
};

