import { Router } from "express";
import { create, inviteUserToTeam, joinTeam, listTeamMembers } from '../controllers/team.controller'
import { authMiddleware } from "../middlewares/auth.middleware";
import { createProject, listProjects } from "../controllers/project.controller";
const router = Router();

router.post('/', authMiddleware, create)
router.post('/invite/:teamId', authMiddleware, inviteUserToTeam)
router.post('/join', authMiddleware, joinTeam)
router.get('/:teamId', authMiddleware, listTeamMembers)
router.post('/:teamId/projects', authMiddleware, createProject)
router.post('/:teamId/projects', authMiddleware, listProjects)

export default router;