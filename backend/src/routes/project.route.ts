import { Router } from "express";
import { createProject, listProjects, updateProject, deleteProject } from '../controllers/project.controller'
import { authMiddleware } from "../middlewares/auth.middleware";
import { createTask } from "../controllers/taskController";
const router = Router();

router.post('/:projectId/tasks', authMiddleware, createTask)
router.put('/:projectId', authMiddleware, updateProject)
router.delete('/:projectId', authMiddleware, deleteProject)

export default router;