import { Router } from "express";
import { createTask, assignTask, updateTask, deleteTask, updateTaskStatus } from '../controllers/taskController'
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.post('/:taskId/assign', authMiddleware, assignTask)
router.put('/:taskId', authMiddleware, updateTask)
router.put('/:taskId/status', authMiddleware, updateTaskStatus)
router.delete('/:taskId', authMiddleware, deleteTask)

export default router;