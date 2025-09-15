import { cloudinary } from './cloudinary.js';

/**
 * Extract public_id from Cloudinary URL
 * @param {string} imageUrl - Cloudinary image URL
 * @param {string} folder - Folder name in Cloudinary (default: 'facilities')
 * @returns {string} - Public ID for Cloudinary
 */
export const extractPublicId = (imageUrl, folder = 'facilities') => {
  try {
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
    const urlParts = imageUrl.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicIdWithoutExtension = publicIdWithExtension.split('.')[0];
    
    // Handle versioned URLs (v1234567890/folder/public_id)
    const versionIndex = urlParts.findIndex(part => part.startsWith('v') && !isNaN(part.substring(1)));
    if (versionIndex !== -1 && versionIndex < urlParts.length - 2) {
      // Extract folder and public_id from versioned URL
      const folderFromUrl = urlParts[versionIndex + 1];
      return `${folderFromUrl}/${publicIdWithoutExtension}`;
    }
    
    // Fallback to provided folder
    return `${folder}/${publicIdWithoutExtension}`;
  } catch (error) {
    console.error('Error extracting public_id from URL:', imageUrl, error);
    throw error;
  }
};

/**
 * Delete a single image from Cloudinary
 * @param {string} imageUrl - Cloudinary image URL
 * @param {string} folder - Folder name in Cloudinary (default: 'facilities')
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
export const deleteImageFromCloudinary = async (imageUrl, folder = 'facilities') => {
  try {
    const publicId = extractPublicId(imageUrl, folder);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image from Cloudinary: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error(`Failed to delete image from Cloudinary: ${imageUrl}`, error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} imageUrls - Array of Cloudinary image URLs
 * @param {string} folder - Folder name in Cloudinary (default: 'facilities')
 * @returns {Promise<Array>} - Array of deletion results
 */
export const deleteImagesFromCloudinary = async (imageUrls, folder = 'facilities') => {
  if (!imageUrls || imageUrls.length === 0) {
    return [];
  }

  const deletePromises = imageUrls.map(async (imageUrl) => {
    try {
      return await deleteImageFromCloudinary(imageUrl, folder);
    } catch (error) {
      console.error(`Failed to delete image: ${imageUrl}`, error);
      // Return error info instead of throwing to continue with other deletions
      return { error: error.message, url: imageUrl };
    }
  });

  const results = await Promise.all(deletePromises);
  
  // Log summary
  const successful = results.filter(result => !result.error).length;
  const failed = results.filter(result => result.error).length;
  console.log(`Image deletion summary: ${successful} successful, ${failed} failed`);
  
  return results;
};