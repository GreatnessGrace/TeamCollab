import { Task } from "../models/task.model";
import { Project } from "../models/project.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Request, Response } from "express";

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void>  => {
  try {
    const { title, description } = req.body;
    const { projectId } = req.params;
    const userId = req.user?.userId;

    const project = await Project.findById(projectId);
    if (!project){  res.status(404).json({ message: "Project not found" });
  return}

    const task = await Task.create({
      title,
      description,
      project: projectId,
      createdBy: userId,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

export const assignTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: userId },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    if (!["pending", "in-progress", "done"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};
