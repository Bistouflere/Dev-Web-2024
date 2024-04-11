import { NextFunction, Request, Response } from "express";

export const validateTournamentId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { tournamentId } = req.params;

  if (isNaN(parseInt(tournamentId, 10))) {
    return res.status(400).json({ error: "tournamentId must be an integer" });
  }

  next();
};
