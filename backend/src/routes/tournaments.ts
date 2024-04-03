import { db } from "../db/index";
import {
  formats,
  games,
  teams,
  tournamentAdmins,
  tournaments,
} from "../db/schema";
import { and, asc, count, eq, ilike, or, sql, sum } from "drizzle-orm";
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

const NUMBER_OF_TOURNAMENTS_PER_PAGE = 9;

router.get("/popular", async (req: Request, res: Response) => {
  await new Promise((r) => setTimeout(r, 500));

  try {
    const result = await db
      .select()
      .from(tournaments)
      .leftJoin(teams, eq(tournaments.id, teams.tournament_id))
      .leftJoin(games, eq(tournaments.game_id, games.id))
      .leftJoin(formats, eq(tournaments.format_id, formats.id))
      .leftJoin(
        tournamentAdmins,
        eq(tournaments.id, tournamentAdmins.tournament_id),
      )
      .limit(10);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// http://localhost:3000/api/tournaments/count?query=SuperTournois
// or
// http://localhost:3000/api/tournaments/count

router.get("/count", async (req: Request, res: Response) => {
  const { query } = req.query;

  await new Promise((r) => setTimeout(r, 500));

  try {
    if (query) {
      const result = await db
        .select({ count: count() })
        .from(tournaments)
        .where(or(ilike(tournaments.name, `%${query}%`)));
      return res.status(200).json(result[0].count);
    } else {
      const result = await db.select({ count: count() }).from(tournaments);
      return res.status(200).json(result[0].count);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// http://localhost:3000/api/tournaments?query=SuperTournois&page=1
// or
// http://localhost:3000/api/tournaments?id=1

router.get("/", async (req: Request, res: Response) => {
  const { page, query, id } = req.query;

  await new Promise((r) => setTimeout(r, 500));

  if (id) {
    try {
      const result = await db
        .select()
        .from(tournaments)
        .leftJoin(teams, eq(tournaments.id, teams.tournament_id))
        .leftJoin(games, eq(tournaments.game_id, games.id))
        .leftJoin(formats, eq(tournaments.format_id, formats.id))
        .leftJoin(
          tournamentAdmins,
          eq(tournaments.id, tournamentAdmins.tournament_id),
        )
        .where(eq(tournaments.id, Number(id)));
      return res.status(200).json(result[0]);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  const offset = (Number(page) - 1) * NUMBER_OF_TOURNAMENTS_PER_PAGE;

  try {
    if (query) {
      const result = await db
        .select()
        .from(tournaments)
        .leftJoin(teams, eq(tournaments.id, teams.tournament_id))
        .leftJoin(games, eq(tournaments.game_id, games.id))
        .leftJoin(formats, eq(tournaments.format_id, formats.id))
        .leftJoin(
          tournamentAdmins,
          eq(tournaments.id, tournamentAdmins.tournament_id),
        )
        .orderBy(asc(tournaments.name))
        .where(or(ilike(tournaments.name, `%${query}%`)))
        .limit(NUMBER_OF_TOURNAMENTS_PER_PAGE)
        .offset(offset);
      return res.status(200).json(result);
    } else {
      const result = await db
        .select()
        .from(tournaments)
        .leftJoin(teams, eq(tournaments.id, teams.tournament_id))
        .leftJoin(games, eq(tournaments.game_id, games.id))
        .leftJoin(formats, eq(tournaments.format_id, formats.id))
        .leftJoin(
          tournamentAdmins,
          eq(tournaments.id, tournamentAdmins.tournament_id),
        )
        .orderBy(asc(tournaments.name))
        .limit(NUMBER_OF_TOURNAMENTS_PER_PAGE)
        .offset(offset);
      return res.status(200).json(result);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
