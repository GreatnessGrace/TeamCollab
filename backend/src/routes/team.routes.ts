import { Router } from "express";
import { create } from '../controllers/team.controller'
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.post('/', authMiddleware, create)

export default router;