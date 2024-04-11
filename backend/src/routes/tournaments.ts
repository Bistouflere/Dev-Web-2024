import { query } from "../db/index";
import { validateTournamentId } from "../validator/tournamentIdValidator";
import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get(
  "/:tournamentId/teams",
  validateTournamentId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;

    try {
      const sql = `
        SELECT
          teams.*,
          COUNT(DISTINCT(teams_users.user_id)) AS users_count
        FROM tournaments_teams
        JOIN teams ON tournaments_teams.team_id = teams.id
        JOIN teams_users ON teams.id = teams_users.team_id
        WHERE tournaments_teams.tournament_id = $1
        GROUP BY teams.id;
      `;

      const result = await query(sql, [tournamentId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:tournamentId/teams/count",
  validateTournamentId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;

    try {
      const sql =
        "SELECT COUNT(*) FROM tournaments_teams WHERE tournament_id = $1;";
      const result = await query(sql, [tournamentId]);
      const count = parseInt(result.rows[0].count, 10);

      return res.status(200).json({
        count,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:tournamentId/users",
  validateTournamentId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;

    try {
      const sql = `
        SELECT
          users.*,
          tournaments_users.role AS tournament_role
        FROM tournaments_users
        JOIN users ON tournaments_users.user_id = users.id
        WHERE tournaments_users.tournament_id = $1;
      `;

      const result = await query(sql, [tournamentId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:tournamentId/users/count",
  validateTournamentId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;

    try {
      const sql =
        "SELECT COUNT(*) FROM tournaments_users WHERE tournament_id = $1;";
      const result = await query(sql, [tournamentId]);
      const count = parseInt(result.rows[0].count, 10);

      return res.status(200).json({ count });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:tournamentId/pools",
  validateTournamentId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;

    try {
      const sql = `SELECT * FROM pools WHERE pools.tournament_id = $1`;

      const result = await query(sql, [tournamentId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:tournamentId/pools/count",
  validateTournamentId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;

    try {
      const sql = "SELECT COUNT(*) FROM pools WHERE tournament_id = $1;";
      const result = await query(sql, [tournamentId]);
      const count = parseInt(result.rows[0].count, 10);

      return res.status(200).json({ count });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:tournamentId/matches",
  validateTournamentId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;

    try {
      const sql = `
        SELECT
          matches.*,
          pools.name AS pool_name,
          pools.created_at AS pool_created_at,
          pools.updated_at AS pool_updated_at
        FROM matches
        JOIN pools ON matches.pool_id = pools.id
        WHERE pools.tournament_id = $1;
      `;

      const result = await query(sql, [tournamentId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/popular",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sql = `
      SELECT 
        tournaments.*,
        COUNT(DISTINCT(tournaments_users.user_id)) AS users_count,
        COUNT(DISTINCT(tournaments_teams.team_id)) AS teams_count,
        games.name AS game_name,
        games.description AS game_description,
        games.image_url AS game_image_url,
        games.created_at AS game_created_at,
        games.updated_at AS game_updated_at
      FROM tournaments
      JOIN tournaments_users ON tournaments.id = tournaments_users.tournament_id
      JOIN tournaments_teams ON tournaments.id = tournaments_teams.tournament_id
      JOIN games ON tournaments.game_id = games.id
      GROUP BY tournaments.id, games.id
      ORDER BY users_count DESC
      LIMIT 10;
    `;

      const result = await query(sql);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/count",
  async (req: Request, res: Response, next: NextFunction) => {
    const searchQuery = req.query.query as string;

    try {
      const sql = searchQuery
        ? `SELECT COUNT(*) FROM tournaments WHERE name ILIKE $1;`
        : `SELECT COUNT(*) FROM tournaments;`;
      const params = searchQuery ? [`%${searchQuery}%`] : [];
      const result = await query(sql, params);
      const count = parseInt(result.rows[0].count, 10);

      return res.status(200).json({
        count,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:tournamentId",
  validateTournamentId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;

    try {
      const sql = `
        SELECT 
          tournaments.*,
          COUNT(DISTINCT(tournaments_users.user_id)) AS users_count,
          COUNT(DISTINCT(tournaments_teams.team_id)) AS teams_count,
          games.name AS game_name,
          games.description AS game_description,
          games.image_url AS game_image_url,
          games.created_at AS game_created_at,
          games.updated_at AS game_updated_at
        FROM tournaments
        JOIN tournaments_users ON tournaments.id = tournaments_users.tournament_id
        JOIN tournaments_teams ON tournaments.id = tournaments_teams.tournament_id
        JOIN games ON tournaments.game_id = games.id
        WHERE tournaments.id = $1
        GROUP BY tournaments.id, games.id;
      `;
      const result = await query(sql, [tournamentId]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: `Tournament with ID ${tournamentId} not found` });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const { query: searchQuery, page } = req.query as {
    query: string;
    page: string;
  };
  const perPage = 10;
  const offset = (parseInt(page, 10) - 1) * perPage || 0;

  try {
    const sql = searchQuery
      ? `
        SELECT 
          tournaments.*,
          COUNT(DISTINCT(tournaments_users.user_id)) AS users_count,
          COUNT(DISTINCT(tournaments_teams.team_id)) AS teams_count,
          games.name AS game_name,
          games.description AS game_description,
          games.image_url AS game_image_url,
          games.created_at AS game_created_at,
          games.updated_at AS game_updated_at
        FROM tournaments
        JOIN tournaments_users ON tournaments.id = tournaments_users.tournament_id
        JOIN tournaments_teams ON tournaments.id = tournaments_teams.tournament_id
        JOIN games ON tournaments.game_id = games.id
        WHERE tournaments.name ILIKE $1
        GROUP BY tournaments.id, games.id
        LIMIT $2
        OFFSET $3;
      `
      : `
        SELECT 
          tournaments.*,
          COUNT(DISTINCT(tournaments_users.user_id)) AS users_count,
          COUNT(DISTINCT(tournaments_teams.team_id)) AS teams_count,
          games.name AS game_name,
          games.description AS game_description,
          games.image_url AS game_image_url,
          games.created_at AS game_created_at,
          games.updated_at AS game_updated_at
        FROM tournaments
        JOIN tournaments_users ON tournaments.id = tournaments_users.tournament_id
        JOIN tournaments_teams ON tournaments.id = tournaments_teams.tournament_id
        JOIN games ON tournaments.game_id = games.id
        GROUP BY tournaments.id, games.id
        LIMIT $1
        OFFSET $2;
      `;
    const params = searchQuery
      ? [`%${searchQuery}%`, perPage, offset]
      : [perPage, offset];
    const result = await query(sql, params);

    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
