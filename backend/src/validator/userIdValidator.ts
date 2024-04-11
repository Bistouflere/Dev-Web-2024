import { NextFunction, Request, Response } from "express";

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;

  if (isNaN(parseInt(userId, 10))) {
    return res.status(400).json({ error: "userId must be an integer" });
  }

  next();
};
