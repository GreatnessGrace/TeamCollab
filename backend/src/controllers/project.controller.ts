import { Request, Response } from "express";
import { Project } from "../models/project.model";
import { Team } from "../models/team.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;
    const { teamId } = req.params;
    const userId: any = req?.user?.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    if (!team.members.includes(userId)) {
      res.status(403).json({ message: "You are not a member of this team" });
      return;
    }

    const project = await Project.create({
      name,
      description,
      team: teamId,
      createdBy: userId,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

export const listProjects = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const projects = await Project.find({ team: teamId });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByIdAndUpdate(projectId, req.body, {
      new: true,
    });
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};
