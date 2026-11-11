import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/auth";
import {
  createProjectService,
  getProjectsService,
} from "../services/project.service";

export const createProject = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;

  const project = await createProjectService(req.body, authReq.user!.id);

  res.status(201).json({ success: true, project });
});

export const getProjects = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;

  const projects = await getProjectsService(
    authReq.user!.id,
    authReq.user!.role
  );

  res.json({ success: true, projects });
});