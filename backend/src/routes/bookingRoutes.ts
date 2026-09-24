import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Public creation route
router.post('/', createBooking);

// Protected admin routes
router.get('/', authenticateAdmin, getBookings);
router.get('/:id', authenticateAdmin, getBookingById);
router.put('/:id', authenticateAdmin, updateBooking);
router.delete('/:id', authenticateAdmin, deleteBooking);

export default router;
