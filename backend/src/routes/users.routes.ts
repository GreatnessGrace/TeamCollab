import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getProfile } from "../controllers/users.controller";
const router = Router();

router.get('/me', authMiddleware, getProfile);

export default router;
