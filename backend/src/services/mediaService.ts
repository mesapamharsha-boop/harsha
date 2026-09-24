import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env';

export interface UploadResult {
  url: string;
  secure_url: string;
  publicId: string;
  public_id: string;
  resourceType: 'image' | 'video' | 'raw' | 'auto';
  format?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
}

export class MediaService {
  private isConfigured: boolean = false;

  constructor() {
    this.initCloudinary();
  }

  private initCloudinary(): void {
    const rawCloudName = (ENV.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || '').trim();
    const cloudName = rawCloudName.replace(/^["']|["']$/g, '');
    const apiKey = (ENV.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY || '').trim().replace(/^["']|["']$/g, '');
    const apiSecret = (ENV.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET || '').trim().replace(/^["']|["']$/g, '');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.isConfigured = true;
    } else {
      this.isConfigured = false;
    }
  }

  /**
   * Upload an image or video file directly to Cloudinary.
   * File is received via multer temporary storage, uploaded to Cloudinary,
   * and the temporary local file is always removed immediately.
   */
  async uploadFile(
    file: Express.Multer.File,
    options?: { folder?: string; resourceType?: 'image' | 'video' | 'auto' }
  ): Promise<UploadResult> {
    const mime = (file.mimetype || '').toLowerCase();
    const ext = path.extname(file.originalname || '').toLowerCase().replace('.', '');
    const isVideo = mime.startsWith('video/') || ['mp4', 'mov', 'webm', 'mkv', 'avi'].includes(ext);
    const determinedResourceType: 'image' | 'video' | 'auto' =
      options?.resourceType || (isVideo ? 'video' : 'image');

    this.initCloudinary();

    if (!this.isConfigured) {
      if (file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch {}
      }
      throw new Error(
        'Cloudinary credentials are missing. Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are configured in backend/.env.'
      );
    }

    try {
      const uploadOptions: any = {
        folder: options?.folder || 'leox',
        resource_type: determinedResourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      };

      // For video reels, use upload_large or standard upload
      let uploadResponse: UploadApiResponse;
      if (determinedResourceType === 'video') {
        uploadResponse = (await cloudinary.uploader.upload_large(
          file.path,
          { ...uploadOptions, chunk_size: 6000000 }
        )) as any as UploadApiResponse;
      } else {
        uploadResponse = await cloudinary.uploader.upload(
          file.path,
          uploadOptions
        );
      }

      return {
        url: uploadResponse.secure_url,
        secure_url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        public_id: uploadResponse.public_id,
        resourceType: (uploadResponse.resource_type as any) || determinedResourceType,
        format: uploadResponse.format,
        size: uploadResponse.bytes,
        width: uploadResponse.width,
        height: uploadResponse.height,
        duration: uploadResponse.duration,
      };
    } catch (error: any) {
      console.error('[MediaService] Cloudinary upload error:', error?.message || error);
      const msg = error?.message || 'Check Cloudinary credentials, file size, and network.';
      throw new Error(`Cloudinary upload failed: ${msg}`);
    } finally {
      // Do not store uploaded media files permanently on application server
      if (file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (e) {
          console.warn('[MediaService] Could not remove temp file:', file.path);
        }
      }
    }
  }

  /**
   * Delete asset from Cloudinary by public ID
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'video' = 'video'): Promise<boolean> {
    try {
      this.initCloudinary();
      if (!this.isConfigured || !publicId) return false;
      const res = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      return res.result === 'ok' || res.result === 'not found';
    } catch (err: any) {
      console.error('[MediaService] Error destroying Cloudinary asset:', err?.message || err);
      return false;
    }
  }

  /**
   * Generate an optimized 9:16 thumbnail poster for a Cloudinary video
   */
  getVideoPosterUrl(videoUrl: string): string {
    if (!videoUrl) return '';
    if (videoUrl.includes('res.cloudinary.com') && videoUrl.includes('/video/upload/')) {
      return videoUrl
        .replace(/\/video\/upload\/(?:v\d+\/)?/, '/video/upload/so_0,c_fill,ar_9:16,w_440,q_auto,f_jpg/')
        .replace(/\.(mp4|mov|webm|mkv|avi)($|\?)/i, '.jpg$2');
    }
    return videoUrl;
  }
}

export const mediaService = new MediaService();
