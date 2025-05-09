import { Router } from "express";
import { create, inviteUserToTeam, joinTeam, listTeamMembers } from '../controllers/team.controller'
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.post('/', authMiddleware, create)
router.post('/invite/:teamId', authMiddleware, inviteUserToTeam)
router.post('/join', authMiddleware, joinTeam)
router.get('/:teamId', authMiddleware, listTeamMembers)

export default router;