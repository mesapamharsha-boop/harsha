import { Router } from 'express';
import {
  getPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from '../controllers/portfolioController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getPortfolio);
router.get('/:id', getPortfolioById);
router.post('/', authenticateAdmin, createPortfolio);
router.put('/:id', authenticateAdmin, updatePortfolio);
router.delete('/:id', authenticateAdmin, deletePortfolio);

export default router;
