import { db } from "../db/index";
import { users } from "../db/schema";
import { and, asc, count, eq, ilike, or, sql, sum } from "drizzle-orm";
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.get("/users", async (req: Request, res: Response) => {
  const result = await db.query.users.findMany({
    with: {
      team: true,
    },
  });

  return res.status(200).json(result);
});

router.get("/teams", async (req: Request, res: Response) => {
  const result = await db.query.teams.findMany({
    with: {
      members: true,
      tournament: true,
      admins: true,
    },
  });

  return res.status(200).json(result);
});

router.get("/tournaments", async (req: Request, res: Response) => {
  const result = await db.query.tournaments.findMany({
    with: {
      teams: true,
      format: true,
      game: true,
      admins: true,
    },
  });

  return res.status(200).json(result);
});

router.get("/games", async (req: Request, res: Response) => {
  const result = await db.query.games.findMany({
    with: {
      tournaments: true,
    },
  });

  return res.status(200).json(result);
});

router.get("/formats", async (req: Request, res: Response) => {
  const result = await db.query.formats.findMany({
    with: {
      tournaments: true,
    },
  });

  return res.status(200).json(result);
});

export default router;
