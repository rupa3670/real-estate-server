import { Request, Response, NextFunction } from "express";
import { createEngineerService, deleteEngineerService, getEngineerByIdService, getEngineersService, updateEngineerService } from "../services/enginer.service";


export const createEngineer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const engineer = await createEngineerService(req.body);
    res.status(201).json({ success: true, data: engineer });
  } catch (error) {
    next(error);
  }
};

export const getEngineers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const engineers = await getEngineersService(search);
    res.json({ success: true, data: engineers });
  } catch (error) {
    next(error);
  }
};

export const getEngineerById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const engineer = await getEngineerByIdService(req.params.id);
    res.json({ success: true, data: engineer });
  } catch (error) {
    next(error);
  }
};

export const updateEngineer = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const engineer = await updateEngineerService(req.params.id, req.body);
    res.json({ success: true, data: engineer });
  } catch (error) {
    next(error);
  }
};

export const deleteEngineer = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteEngineerService(req.params.id);
    res.json({ success: true, message: "Engineer deleted" });
  } catch (error) {
    next(error);
  }
};