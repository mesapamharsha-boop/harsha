import { Router } from 'express';
import { login, logout, getMe, changePassword } from '../controllers/authController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateAdmin, getMe);
router.put('/change-password', authenticateAdmin, changePassword);

export default router;
