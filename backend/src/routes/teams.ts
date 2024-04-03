import { query } from "../db/index";
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

// http://localhost:3000/api/teams/count
router.get("/count", async (req: Request, res: Response) => {
  const { query: searchQuery } = req.query;

  try {
    let sql = "SELECT COUNT(*) FROM teams";

    const values = [];

    if (searchQuery) {
      sql += ` WHERE name ILIKE $1`;
      values.push(`%${searchQuery}%`);
    }

    const result = await query(sql, values);

    const count = parseInt(result.rows[0].count);

    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/teams/1/users
router.get("/:teamId/users", async (req: Request, res: Response) => {
  const teamId = req.params.teamId;

  try {
    const sql = `
      SELECT u.*
      FROM users u
      INNER JOIN team_members tm ON u.id = tm.user_id
      WHERE tm.team_id = $1;
    `;

    const result = await query(sql, [teamId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No users found for the specified team" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/teams/1/admins
router.get("/:teamId/admins", async (req: Request, res: Response) => {
  const teamId = req.params.teamId;

  try {
    const sql = `
      SELECT u.*
      FROM users u
      INNER JOIN team_members tm ON u.id = tm.user_id
      WHERE tm.team_id = $1 AND tm.admin = true;
    `;

    const result = await query(sql, [teamId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No admins found for the specified team" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/teams/:teamId/current-tournament
router.get(
  "/:teamId/current-tournament",
  async (req: Request, res: Response) => {
    const teamId = req.params.teamId;

    try {
      const currentTournamentResult = await query(
        `
      SELECT t.*
      FROM tournaments t
      WHERE t.id = (SELECT current_tournament_id FROM teams WHERE id = $1);
    `,
        [teamId],
      );

      if (currentTournamentResult.rows.length === 0) {
        return res.status(404).json({
          error: "No current tournament found for the specified team",
        });
      }

      const currentTournament = currentTournamentResult.rows[0];

      return res.status(200).json(currentTournament);
    } catch (error) {
      console.error("Error executing query", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// http://localhost:3000/api/teams/:teamId/old-tournaments
router.get("/:teamId/old-tournaments", async (req: Request, res: Response) => {
  const teamId = req.params.teamId;

  try {
    const oldTournamentsResult = await query(
      `
      SELECT t.*
      FROM tournaments t
      WHERE t.id IN (
        SELECT tournament_id
        FROM team_tournaments
        WHERE team_id = $1
      ) AND t.id != (
        SELECT current_tournament_id
        FROM teams
        WHERE id = $1
      );
    `,
      [teamId],
    );

    if (oldTournamentsResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No old tournaments found for the specified team" });
    }

    const oldTournaments = oldTournamentsResult.rows;

    return res.status(200).json(oldTournaments);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/teams/1
router.get("/:teamId", async (req: Request, res: Response) => {
  const teamId = req.params.teamId;

  try {
    const result = await query("SELECT * FROM teams WHERE id = $1", [teamId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/teams?query=myteam&page=1
router.get("/", async (req: Request, res: Response) => {
  const { query: searchQuery, page } = req.query;
  const perPage = 10;
  const offset = (parseInt(page as string) - 1) * perPage || 0;

  try {
    let result;

    if (searchQuery) {
      const sql = `
        SELECT * FROM teams
        WHERE name ILIKE $1
        ORDER BY id
        LIMIT $2 OFFSET $3;
      `;

      result = await query(sql, [`%${searchQuery}%`, perPage, offset]);
    } else {
      const sql = `
        SELECT * FROM teams
        ORDER BY id
        LIMIT $1 OFFSET $2;
      `;

      result = await query(sql, [perPage, offset]);
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
