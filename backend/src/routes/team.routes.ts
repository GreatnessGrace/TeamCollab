import { Router } from "express";
import { create, inviteUserToTeam } from '../controllers/team.controller'
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.post('/', authMiddleware, create)
router.post('/invite/:teamId', authMiddleware, inviteUserToTeam)

export default router;