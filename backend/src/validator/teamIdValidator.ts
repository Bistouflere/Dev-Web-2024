import { NextFunction, Request, Response } from "express";

export const validateTeamId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { teamId } = req.params;

  const teamIdNumber = parseInt(teamId, 10);

  if (isNaN(teamIdNumber) || teamIdNumber < 1) {
    return res.status(400).json({ error: "teamId must be a positive integer" });
  }

  next();
};
