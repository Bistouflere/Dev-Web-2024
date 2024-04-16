import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

const teamData = z.object({
  team_name: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  team_description: z
    .string()
    .min(4, {
      message: "Team description must be at least 4 characters.",
    })
    .optional(),
  team_image_url: z.string().optional(),
});

export const validateTeamData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { team_name, team_description, team_image_url } = req.body;

  try {
    teamData.parse({
      team_name,
      team_description,
      team_image_url,
    });
  } catch (error) {
    return res.status(400).json({ error: (error as ZodError).errors });
  }

  next();
};
