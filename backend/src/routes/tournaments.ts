import { query } from "../db/index";
import { validateTournamentId } from "../validator/tournamentIdValidator";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
} from "@clerk/clerk-sdk-node";
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
        LEFT JOIN teams_users ON teams.id = teams_users.team_id
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
      LEFT JOIN tournaments_users ON tournaments.id = tournaments_users.tournament_id
      LEFT JOIN tournaments_teams ON tournaments.id = tournaments_teams.tournament_id
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
        LEFT JOIN tournaments_users ON tournaments.id = tournaments_users.tournament_id
        LEFT JOIN tournaments_teams ON tournaments.id = tournaments_teams.tournament_id
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
router.post(
  "/:tournamentId/users",
  ClerkExpressRequireAuth({}),
  validateTournamentId,
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;
    const user_id = req.auth.userId;
    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [user_id]);

      if (authUserResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${user_id} not found` });
      }
      const tournamentSql = "SELECT * FROM tournaments WHERE id = $1;";
      const tournamentResult = await query(tournamentSql, [tournamentId]);

      if (tournamentResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `tournament with ID${tournamentId} is not found` });
      }
      if (tournamentResult.rows[0].open === false) {
        return res.status(403).json({
          message: `Tournament with ID ${tournamentId} is not joignable`,
        });
      }

      const existingTournamentUserSql =
        "SELECT * FROM tournaments_users WHERE tournament_id = $1 AND user_id = $2";
      const existingTournamentUserResult = await query(
        existingTournamentUserSql,
        [tournamentId, user_id],
      );

      if (
        existingTournamentUserResult.rowCount !== null &&
        existingTournamentUserResult.rowCount > 0
      ) {
        return res.status(409).json({
          message: `User with ID ${user_id} is already a participant of tournaments with ID ${tournamentId}`,
        });
      }

      const sql = `
        INSERT INTO tournaments_users (tournament_id, user_id, role)
        VALUES ($1, $2, 'participant')
        `;

      await query(sql, [tournamentId, user_id]);

      return res.status(201).json({ message: "User added to tournament" });
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
  },
);
router.delete(
  "/:tournamentId/users",
  ClerkExpressRequireAuth({}),
  validateTournamentId,
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;
    const authId = req.auth.userId;

    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [authId]);

      if (authUserResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${authId} not found` });
      }

      const existingTournamentUserSql =
        "SELECT * FROM tournaments_users WHERE tournament_id = $1 AND user_id = $2;";
      const existingTournamentUserResult = await query(
        existingTournamentUserSql,
        [tournamentId, authId],
      );

      if (
        existingTournamentUserResult.rowCount === null ||
        existingTournamentUserResult.rowCount === 0
      ) {
        return res.status(404).json({
          message: `User with ID ${authId} is not a member of tournament with ID ${tournamentId}`,
        });
      }

      const sql = `
        DELETE FROM tournaments_users
        WHERE tournament_id = $1 AND user_id = $2
      `;
      await query(sql, [tournamentId, authId]);

      return res.status(200).json({ message: "User removed from tournament" });
    } catch (error) {
      next(error);
    }
  },
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    description,
    imageUrl,
    format,
    visibility,
    status,
    startDate,
    endDate,
    cashPrize,
    maxTeams,
    maxTeamSize,
    minTeamSize,
    gameId,
  } = req.body;

  try {
    const sql = `
      INSERT INTO tournaments (name, description, image_url, format, visibility, status, start_date, end_date, cash_prize, max_teams, max_team_size, min_team_size, game_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    const params = [
      name,
      description,
      imageUrl,
      format,
      visibility,
      status,
      startDate,
      endDate,
      cashPrize,
      maxTeams,
      maxTeamSize,
      minTeamSize,
      gameId,
    ];

    const result = await query(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

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
        LEFT JOIN tournaments_users ON tournaments.id = tournaments_users.tournament_id
        LEFT JOIN tournaments_teams ON tournaments.id = tournaments_teams.tournament_id
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
        LEFT JOIN tournaments_users ON tournaments.id = tournaments_users.tournament_id
        LEFT JOIN tournaments_teams ON tournaments.id = tournaments_teams.tournament_id
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
