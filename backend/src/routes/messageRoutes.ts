import { Router } from 'express';
import { createMessage, getMessages, markMessageRead, deleteMessage } from '../controllers/messageController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.post('/', createMessage);
router.get('/', authenticateAdmin, getMessages);
router.put('/:id/read', authenticateAdmin, markMessageRead);
router.delete('/:id', authenticateAdmin, deleteMessage);

export default router;
