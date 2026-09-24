import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Use a temporary folder for files being streamed to Cloudinary
export const uploadsDir = path.join(os.tmpdir(), 'leox_uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for high-res images and videos
  },
  fileFilter: (_req, file, cb) => {
    const allowedExts = /jpeg|jpg|png|webp|gif|svg|avif|mp4|mov|webm|mkv|avi/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = (file.mimetype || '').toLowerCase();

    if (
      allowedExts.test(ext) ||
      mime.startsWith('image/') ||
      mime.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Unsupported file format. Please upload an image (JPG, PNG, WEBP, GIF, SVG) or video (MP4, MOV, WEBM).'
        )
      );
    }
  },
});
