import { Router } from 'express';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware';
import { createAdmin } from '../controllers/admin.controller';

const router = Router();

router.post('/create', authMiddleware, checkRole('admin'), createAdmin);

export default router;
