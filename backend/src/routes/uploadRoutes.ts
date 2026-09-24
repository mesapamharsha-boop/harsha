import { Router } from 'express';
import { upload } from '../middleware/upload';
import { handleUpload, handleDeleteMedia } from '../controllers/uploadController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Middleware to accept any single file upload under common field names (media, file, image, video)
const flexibleUpload = (req: any, res: any, next: any) => {
  upload.any()(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Upload error' });
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

router.post('/', authenticateAdmin, flexibleUpload, handleUpload);
router.post('/image', authenticateAdmin, flexibleUpload, handleUpload);
router.post('/video', authenticateAdmin, flexibleUpload, handleUpload);
router.delete('/:filename', authenticateAdmin, handleDeleteMedia);

export default router;
