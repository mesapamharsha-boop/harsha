import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

const REELS_FOLDER = 'assets/home/reels';

interface CloudinaryVideoResource {
  asset_id?: string;
  public_id: string;
  secure_url?: string;
  url?: string;
  resource_type?: string;
  type?: string;
  format?: string;
  created_at?: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes?: number;
  display_name?: string;
}

function buildReel(resource: CloudinaryVideoResource, index: number) {
  const videoUrl =
    resource.secure_url ||
    resource.url ||
    cloudinary.url(resource.public_id, {
      resource_type: 'video',
      type: 'upload',
      secure: true,
    });

  const thumbnail = cloudinary.url(resource.public_id, {
    resource_type: 'video',
    type: 'upload',
    secure: true,
    transformation: [
      {
        so: 0,
        width: 800,
        height: 1422,
        crop: 'fill',
        gravity: 'auto',
      },
    ],
  });

  return {
    id: resource.asset_id || resource.public_id,
    _id: resource.asset_id || resource.public_id,

    title:
      resource.display_name ||
      resource.public_id.split('/').pop() ||
      `LEOX Reel ${index + 1}`,

    description: '',
    eventName: '',
    city: '',
    venue: '',

    eventDate: resource.created_at
      ? resource.created_at.split('T')[0]
      : '',

    thumbnail,
    videoUrl,

    instagramUrl: 'https://www.instagram.com/leox_shoots/',

    views: '',
    featured: true,
    published: true,
    order: index + 1,

    publicId: resource.public_id,
    resourceType: resource.resource_type,
    format: resource.format,
    duration: resource.duration,
    width: resource.width,
    height: resource.height,
    bytes: resource.bytes,
    createdAt: resource.created_at,
  };
}

export const getCloudinaryReels = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(
      `[CloudinaryReels] Loading videos from: ${REELS_FOLDER}`
    );

    let resources: CloudinaryVideoResource[] = [];

    /*
     * FIRST:
     * Try Dynamic Folder Mode.
     */
    try {
      console.log(
        '[CloudinaryReels] Trying resources_by_asset_folder...'
      );

      const result =
        await cloudinary.api.resources_by_asset_folder(
          REELS_FOLDER,
          {
            resource_type: 'video',
            type: 'upload',
            max_results: 100,
            direction: 'desc',
          }
        );

      resources = (result.resources || []) as CloudinaryVideoResource[];

      console.log(
        `[CloudinaryReels] Dynamic folder returned ${resources.length} videos`
      );
    } catch (dynamicFolderError: any) {
      console.warn(
        '[CloudinaryReels] Dynamic folder lookup failed:',
        dynamicFolderError?.message || dynamicFolderError
      );

      /*
       * FALLBACK:
       * Legacy Fixed Folder Mode.
       *
       * In fixed-folder mode the folder path is part of
       * the public_id, so use prefix instead.
       */
      console.log(
        `[CloudinaryReels] Trying prefix lookup: ${REELS_FOLDER}/`
      );

      const result =
        await cloudinary.api.resources({
          resource_type: 'video',
          type: 'upload',
          prefix: `${REELS_FOLDER}/`,
          max_results: 100,
          direction: 'desc',
        });

      resources = (result.resources || []) as CloudinaryVideoResource[];

      console.log(
        `[CloudinaryReels] Prefix lookup returned ${resources.length} videos`
      );
    }

    /*
     * Make sure we only return video resources.
     */
    resources = resources.filter(
      (resource) => resource.resource_type === 'video'
    );

    /*
     * Convert Cloudinary resources into the Reel shape
     * expected by the frontend.
     */
    const reels = resources.map((resource, index) =>
      buildReel(resource, index)
    );

    console.log(
      `[CloudinaryReels] Returning ${reels.length} reels`
    );

    res.json({
      success: true,
      count: reels.length,
      reels,
    });
  } catch (error: any) {
    console.error(
      '[CloudinaryReels] Failed to retrieve reels from Cloudinary:'
    );

    console.error(
      error?.message || error
    );

    console.error(
      'Cloudinary error details:',
      {
        http_code: error?.http_code,
        name: error?.name,
        error: error?.error,
      }
    );

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reels from Cloudinary.',
      reels: [],
      count: 0,

      // Helpful during development.
      error:
        error?.message ||
        error?.error?.message ||
        'Unknown Cloudinary error',
    });
  }
};