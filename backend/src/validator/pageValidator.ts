import { NextFunction, Request, Response } from "express";

export const validatePage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { page } = req.params;

  if (!page) {
    return next();
  }

  const pageNumber = parseInt(page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    return res.status(400).json({ error: "page must be a positive integer" });
  }

  next();
};
