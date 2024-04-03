import { db } from "../db/index";
import { games, teams, tournaments, users } from "../db/schema";
import { and, asc, count, eq, ilike, or, sql, sum } from "drizzle-orm";
import { on } from "events";
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

const NUMBER_OF_USERS_PER_PAGE = 9;

// http://localhost:3000/api/users/count?query=John
// or
// http://localhost:3000/api/users/count

router.get("/count", async (req: Request, res: Response) => {
  const { query } = req.query;

  await new Promise((r) => setTimeout(r, 500));

  try {
    if (query) {
      const result = await db
        .select({ count: count() })
        .from(users)
        .where(
          or(
            ilike(users.username, `%${query}%`),
            ilike(users.first_name, `%${query}%`),
            ilike(users.last_name, `%${query}%`),
            ilike(users.email_address, `%${query}%`),
          ),
        );
      return res.status(200).json(result[0].count);
    } else {
      const result = await db.select({ count: count() }).from(users);
      return res.status(200).json(result[0].count);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// http://localhost:3000/api/users?query=John&page=1
// or
// http://localhost:3000/api/users?id=1

router.get("/", async (req: Request, res: Response) => {
  const { page, query, id } = req.query;

  await new Promise((r) => setTimeout(r, 500));

  if (id) {
    try {
      const result = await db
        .select()
        .from(users)
        .leftJoin(teams, eq(users.team_id, teams.id))
        .leftJoin(tournaments, eq(teams.tournament_id, tournaments.id))
        .leftJoin(games, eq(tournaments.game_id, games.id))
        .where(eq(users.id, Number(id)));
      return res.status(200).json(result[0]);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  const offset = (Number(page) - 1) * NUMBER_OF_USERS_PER_PAGE;

  try {
    if (query) {
      const result = await db
        .select()
        .from(users)
        .leftJoin(teams, eq(users.team_id, teams.id))
        .orderBy(asc(users.username))
        .where(
          or(
            ilike(users.username, `%${query}%`),
            ilike(users.first_name, `%${query}%`),
            ilike(users.last_name, `%${query}%`),
            ilike(users.email_address, `%${query}%`),
          ),
        )
        .limit(NUMBER_OF_USERS_PER_PAGE)
        .offset(offset);
      return res.status(200).json(result);
    } else {
      const result = await db
        .select()
        .from(users)
        .leftJoin(teams, eq(users.team_id, teams.id))
        .orderBy(asc(users.username))
        .limit(NUMBER_OF_USERS_PER_PAGE)
        .offset(offset);
      return res.status(200).json(result);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
