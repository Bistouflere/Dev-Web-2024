import { NextFunction, Request, Response } from "express";

export const validateTournamentStatus = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { tournamentStatus } = req.params;

  const statuses = ["upcoming", "active", "completed", "cancelled"];

  if (!statuses.includes(tournamentStatus.toLowerCase())) {
    return res.status(400).json({
      error:
        "tournamentStatus must be one of 'upcoming', 'active', 'completed', or 'cancelled'",
    });
  }

  next();
};
