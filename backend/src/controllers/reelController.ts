import { Request, Response } from 'express';
import { ReelModel } from '../models/index';
import { mediaService } from '../services/mediaService';

export const getReels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { featured, all } = req.query;
    let list = await ReelModel.find();

    if (all !== 'true') {
      list = list.filter((r) => r.published !== false);
    }

    if (featured === 'true') {
      list = list.filter((r) => r.featured === true);
    }

    list.sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({ success: true, count: list.length, reels: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reels.' });
  }
};

export const createReel = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      eventName,
      city,
      venue,
      eventDate,
      thumbnail,
      videoUrl,
      secure_url,
      public_id,
      publicId,
      mediaType,
      instagramUrl,
      views,
      featured,
      published,
      order,
    } = req.body;

    if (!title || (!thumbnail && !videoUrl && !secure_url)) {
      res.status(400).json({
        success: false,
        message: 'Reel title and either a video (Cloudinary upload/URL) or thumbnail are required.',
      });
      return;
    }

    const finalVideoUrl = (videoUrl || secure_url || '').trim();
    const finalSecureUrl = (secure_url || videoUrl || '').trim();
    const finalPublicId = (public_id || publicId || '').trim();

    // Auto-derive thumbnail from Cloudinary video if no dedicated thumbnail image was provided
    let finalThumbnail = (thumbnail || '').trim();
    if (!finalThumbnail && finalVideoUrl) {
      finalThumbnail = mediaService.getVideoPosterUrl(finalVideoUrl);
    }
    if (!finalThumbnail) {
      finalThumbnail = finalVideoUrl;
    }

    const finalCategory = category ? category.trim() : '';
    const finalEventName = eventName ? eventName.trim() : finalCategory || title.trim();
    const finalCity = city ? city.trim() : 'Vijayawada / Hyderabad';

    const reel = await ReelModel.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      category: finalCategory,
      eventName: finalEventName,
      city: finalCity,
      venue: venue ? venue.trim() : 'Studio / Location',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      thumbnail: finalThumbnail,
      videoUrl: finalVideoUrl,
      secure_url: finalSecureUrl,
      public_id: finalPublicId,
      publicId: finalPublicId,
      mediaType: mediaType || 'video',
      instagramUrl: instagramUrl ? instagramUrl.trim() : 'https://www.instagram.com/leox_shoots/',
      views: views ? views.trim() : undefined,
      featured: Boolean(featured),
      published: published !== undefined ? Boolean(published) : true,
      order: Number(order) || 0,
    });

    res.status(201).json({ success: true, message: 'Reel created successfully.', reel });
  } catch (error: any) {
    console.error('[ReelController] Error creating reel:', error);
    res.status(500).json({ success: false, message: error?.message || 'Failed to create reel.' });
  }
};

export const updateReel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    if (body.videoUrl && !body.secure_url) {
      body.secure_url = body.videoUrl;
    } else if (body.secure_url && !body.videoUrl) {
      body.videoUrl = body.secure_url;
    }

    if (body.public_id && !body.publicId) {
      body.publicId = body.public_id;
    } else if (body.publicId && !body.public_id) {
      body.public_id = body.publicId;
    }

    // Auto-generate poster thumbnail if missing and video exists
    if (!body.thumbnail && (body.videoUrl || body.secure_url)) {
      body.thumbnail = mediaService.getVideoPosterUrl(body.videoUrl || body.secure_url);
    }

    const updated = await ReelModel.findByIdAndUpdate(id, body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Reel not found.' });
      return;
    }
    res.json({ success: true, message: 'Reel updated successfully.', reel: updated });
  } catch (error: any) {
    console.error('[ReelController] Error updating reel:', error);
    res.status(500).json({ success: false, message: error?.message || 'Failed to update reel.' });
  }
};

export const deleteReel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await ReelModel.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Reel not found.' });
      return;
    }

    // Delete Cloudinary asset if public_id is present
    const publicId = existing.public_id || existing.publicId;
    if (publicId) {
      try {
        await mediaService.deleteFile(publicId, existing.mediaType === 'image' ? 'image' : 'video');
      } catch (cloudErr) {
        console.warn('[ReelController] Could not delete Cloudinary asset for reel:', publicId, cloudErr);
      }
    }

    await ReelModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Reel deleted successfully.' });
  } catch (error: any) {
    console.error('[ReelController] Error deleting reel:', error);
    res.status(500).json({ success: false, message: error?.message || 'Failed to delete reel.' });
  }
};

