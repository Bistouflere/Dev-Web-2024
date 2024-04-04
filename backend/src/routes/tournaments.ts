import { query } from "../db/index";
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

// http://localhost:3000/api/tournaments/count
router.get("/count", async (req: Request, res: Response) => {
  const { query: searchQuery } = req.query;

  try {
    let sql = "SELECT COUNT(*) FROM tournaments";

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

// http://localhost:3000/api/tournaments/1/teams
router.get("/:tournamentId/teams", async (req: Request, res: Response) => {
  const tournamentId = req.params.tournamentId;

  try {
    const sql = `
      SELECT t.*
      FROM teams t
      INNER JOIN team_tournaments tt ON t.id = tt.team_id
      WHERE tt.tournament_id = $1;
    `;

    const result = await query(sql, [tournamentId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No teams found for the specified tournament" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/tournaments/1/matches
router.get("/:tournamentId/matches", async (req: Request, res: Response) => {
  const tournamentId = req.params.tournamentId;

  try {
    const sql = `
      SELECT *
      FROM matches
      WHERE tournament_id = $1;
    `;

    const result = await query(sql, [tournamentId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No matches found for the specified tournament" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/tournaments/1/admins
router.get("/:tournamentId/admins", async (req: Request, res: Response) => {
  const tournamentId = req.params.tournamentId;

  try {
    const sql = `
      SELECT u.*
      FROM users u
      INNER JOIN tournament_admins ta ON u.id = ta.user_id
      WHERE ta.tournament_id = $1;
    `;

    const result = await query(sql, [tournamentId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No admins found for the specified tournament" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/tournaments/most-teams
router.get("/popular", async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT t.*, COUNT(tt.team_id) AS team_count
      FROM tournaments t
      LEFT JOIN team_tournaments tt ON t.id = tt.tournament_id
      GROUP BY t.id
      ORDER BY team_count DESC
      LIMIT 10;
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No tournaments found" });
    }

    const tournaments = result.rows;
    return res.status(200).json(tournaments);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/tournaments/1
router.get("/:tournamentId", async (req: Request, res: Response) => {
  const tournamentId = req.params.tournamentId;

  try {
    const result = await query("SELECT * FROM tournaments WHERE id = $1", [
      tournamentId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/tournaments?query=mytournament&page=1
router.get("/", async (req: Request, res: Response) => {
  const { query: searchQuery, page } = req.query;
  const perPage = 10;
  const offset = (parseInt(page as string) - 1) * perPage || 0;

  try {
    let result;

    if (searchQuery) {
      const sql = `
        SELECT * FROM tournaments
        WHERE name ILIKE $1
        ORDER BY id
        LIMIT $2 OFFSET $3;
      `;

      result = await query(sql, [`%${searchQuery}%`, perPage, offset]);
    } else {
      const sql = `
        SELECT * FROM tournaments
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
