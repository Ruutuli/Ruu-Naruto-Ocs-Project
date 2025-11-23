// Image URL utilities - Convert Google Drive links and other image URLs to direct image format

/**
 * Converts Google Drive sharing links to direct image URLs that can be embedded in img tags
 * @param {string} url - The image URL (can be Google Drive link or regular image URL)
 * @returns {string} - The converted direct image URL
 */
export function convertImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return url;
  }
  
  // Handle Google Drive sharing links
  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // Or: https://drive.google.com/file/d/FILE_ID/view
  const googleDriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (googleDriveMatch) {
    const fileId = googleDriveMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  // Handle Google Drive short links (format: https://drive.google.com/open?id=FILE_ID)
  const googleDriveShortMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (googleDriveShortMatch) {
    const fileId = googleDriveShortMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  // Return original URL if it's not a Google Drive link
  return url;
}

