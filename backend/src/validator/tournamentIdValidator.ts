import { NextFunction, Request, Response } from "express";

export const validateTournamentId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { tournamentId } = req.params;

  const tournamentIdNumber = parseInt(tournamentId, 10);

  if (isNaN(tournamentIdNumber) || tournamentIdNumber < 1) {
    return res
      .status(400)
      .json({ error: "tournamentId must be a positive integer" });
  }

  next();
};
