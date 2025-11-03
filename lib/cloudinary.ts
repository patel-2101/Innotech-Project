import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
})

export interface UploadResult {
  url: string
  publicId: string
  resourceType: string
}

// Upload image or video to Cloudinary
export async function uploadToCloudinary(
  file: string,
  folder: string = 'complaints'
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto', // Automatically detect image or video
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' }, // Limit max size
        { quality: 'auto' }, // Auto quality
        { fetch_format: 'auto' }, // Auto format
      ],
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload file')
  }
}

// Upload multiple files
export async function uploadMultipleToCloudinary(
  files: string[],
  folder: string = 'complaints'
): Promise<UploadResult[]> {
  try {
    const uploadPromises = files.map((file) => uploadToCloudinary(file, folder))
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Multiple upload error:', error)
    throw new Error('Failed to upload files')
  }
}

// Delete file from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return false
  }
}

// Delete multiple files
export async function deleteMultipleFromCloudinary(publicIds: string[]): Promise<boolean> {
  try {
    await cloudinary.api.delete_resources(publicIds)
    return true
  } catch (error) {
    console.error('Multiple delete error:', error)
    return false
  }
}

export default cloudinary
