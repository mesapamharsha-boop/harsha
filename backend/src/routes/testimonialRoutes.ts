import { Router } from 'express';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getTestimonials);
router.post('/', authenticateAdmin, createTestimonial);
router.put('/:id', authenticateAdmin, updateTestimonial);
router.delete('/:id', authenticateAdmin, deleteTestimonial);

export default router;
