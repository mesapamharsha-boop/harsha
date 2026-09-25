import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateAdmin, getAnalytics);

export default router;
