import { Router } from 'express';
import { getPackages, createPackage, updatePackage, deletePackage } from '../controllers/packageController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getPackages);
router.post('/', authenticateAdmin, createPackage);
router.put('/:id', authenticateAdmin, updatePackage);
router.delete('/:id', authenticateAdmin, deletePackage);

export default router;
