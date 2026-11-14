import { Request, Response, NextFunction } from "express";
import { createMasonService, deleteMasonService, getMasonByIdService, getMasonsService, updateMasonService } from "../services/mason.service";


export const createMason = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mason = await createMasonService(req.body);
    res.status(201).json({ success: true, data: mason });
  } catch (error) {
    next(error);
  }
};

export const getMasons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const masons = await getMasonsService(search);
    res.json({ success: true, data: masons });
  } catch (error) {
    next(error);
  }
};

export const getMasonById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const mason = await getMasonByIdService(req.params.id);
    res.json({ success: true, data: mason });
  } catch (error) {
    next(error);
  }
};

export const updateMason = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const mason = await updateMasonService(req.params.id, req.body);
    res.json({ success: true, data: mason });
  } catch (error) {
    next(error);
  }
};

export const deleteMason = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteMasonService(req.params.id);
    res.json({ success: true, message: "Mason deleted" });
  } catch (error) {
    next(error);
  }
};