import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

const teamData = z.object({
  name: z
    .string()
    .min(2, {
      message: "Team name must be at least 2 characters.",
    })
    .max(30, {
      message: "Team name must not be longer than 30 characters.",
    })
    .trim(),
  description: z
    .string()
    .max(160, {
      message: "Team description must not be longer than 160 characters.",
    })
    .trim()
    .optional(),
  file: typeof window === "undefined" ? z.any() : z.instanceof(File),
  visibility: z.string().refine((value) => {
    if (value === "true" || value === "false") return true;
    return false;
  }, "Visibility must be a boolean value."),
});

export const validateTeamData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, description, file, visibility } = req.body;

  try {
    teamData.parse({
      name,
      description,
      file,
      visibility,
    });
  } catch (error) {
    return res.status(400).json({ error: (error as ZodError).errors });
  }

  next();
};
