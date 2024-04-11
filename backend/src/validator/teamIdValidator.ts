import { NextFunction, Request, Response } from "express";

export const validateTeamId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { teamId } = req.params;

  if (isNaN(parseInt(teamId, 10))) {
    return res.status(400).json({ error: "teamId must be an integer" });
  }

  next();
};
