import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} from '../controllers/inquiryController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.post('/', createInquiry);
router.get('/', authenticateAdmin, getInquiries);
router.get('/:id', authenticateAdmin, getInquiryById);
router.put('/:id', authenticateAdmin, updateInquiry);
router.delete('/:id', authenticateAdmin, deleteInquiry);

export default router;
