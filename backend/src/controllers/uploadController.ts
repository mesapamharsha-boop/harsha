import { Request, Response } from 'express';
import { mediaService } from '../services/mediaService';

export const handleUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file || (req.files && Array.isArray(req.files) && req.files[0]);

    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No file received. Please select an image or video file.',
      });
      return;
    }

    const requestedType = (req.body.resourceType as 'image' | 'video' | 'auto') || undefined;
    const result = await mediaService.uploadFile(file as Express.Multer.File, {
      resourceType: requestedType,
    });

    res.json({
      success: true,
      message: 'Media uploaded successfully to Cloudinary.',
      url: result.secure_url,
      secure_url: result.secure_url,
      publicId: result.public_id,
      public_id: result.public_id,
      resourceType: result.resourceType,
      format: result.format,
      size: result.size,
      width: result.width,
      height: result.height,
      duration: result.duration,
    });
  } catch (error: any) {
    console.error('[UploadController] Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload media to Cloudinary.',
    });
  }
};

export const handleDeleteMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    const resourceType = (req.query.resourceType as 'image' | 'video') || 'image';
    const deleted = await mediaService.deleteFile(filename, resourceType);
    res.json({
      success: true,
      message: deleted ? 'Media removed from Cloudinary.' : 'Could not delete or asset not found.',
    });
  } catch (error: any) {
    console.error('[UploadController] Error deleting media:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete media from Cloudinary.',
    });
  }
};
