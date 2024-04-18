import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

const formats = [
  "single_elimination",
  "double_elimination",
  "round_robin",
] as const;

const tournamentData = z.object({
  name: z
    .string()
    .min(2, {
      message: "Tournament name must be at least 2 characters.",
    })
    .max(30, {
      message: "Tournament name must not be longer than 30 characters.",
    })
    .trim(),
  description: z
    .string()
    .max(160, {
      message: "Tournament description must not be longer than 160 characters.",
    })
    .trim()
    .optional(),
  file: typeof window === "undefined" ? z.any() : z.instanceof(File),
  game: z.string().refine((value) => {
    return value.length > 0;
  }, "Game must be selected."),
  format: z.string().refine((value) => {
    return formats.includes(value as any);
  }, "Format must be single_elimination, double_elimination, or round_robin."),
  tags: z.string().optional(),
  cash_prize: z.string().refine((value) => {
    return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
  }, "Cash prize must be a positive number."),
  max_teams: z.string().refine((value) => {
    return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
  }, "Max teams must be a positive number."),
  max_team_size: z.string().refine((value) => {
    return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
  }, "Max team size must be a positive number."),
  min_team_size: z.string().refine((value) => {
    return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
  }, "Min team size must be a positive number."),
  start_date: z
    .string()
    .refine((value) => {
      if (value.length === 0) return true;
      return new Date(value) > new Date();
    }, "Start date must be in the future.")
    .optional(),
  end_date: z
    .string()
    .refine((value) => {
      if (value.length === 0) return true;
      return new Date(value) > new Date();
    }, "Start date must be in the future.")
    .optional(),
  visibility: z.string().refine((value) => {
    if (value === "true" || value === "false") return true;
    return false;
  }, "Visibility must be a boolean value."),
});

export const validateTournamentData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    name,
    description,
    file,
    game,
    format,
    tags,
    cash_prize,
    max_teams,
    max_team_size,
    min_team_size,
    start_date,
    end_date,
    visibility,
  } = req.body;

  try {
    tournamentData.parse({
      name,
      description,
      file,
      game,
      format,
      tags,
      cash_prize,
      max_teams,
      max_team_size,
      min_team_size,
      start_date,
      end_date,
      visibility,
    });
  } catch (error) {
    return res.status(400).json({ error: (error as ZodError).errors });
  }

  next();
};
