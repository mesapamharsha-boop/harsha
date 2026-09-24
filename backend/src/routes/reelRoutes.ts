import { Router } from 'express';
import { getReels, createReel, updateReel, deleteReel } from '../controllers/reelController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getReels);
router.post('/', authenticateAdmin, createReel);
router.put('/:id', authenticateAdmin, updateReel);
router.delete('/:id', authenticateAdmin, deleteReel);

export default router;
