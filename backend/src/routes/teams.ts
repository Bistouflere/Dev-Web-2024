import { query } from "../db/index";
import { validateTeamId } from "../validator/teamIdValidator";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
} from "@clerk/clerk-sdk-node";
import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get(
  "/:teamId/users",
  validateTeamId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;

    try {
      const sql = `
        SELECT
          users.*,
          teams_users.role AS team_role
        FROM users
        JOIN teams_users ON users.id = teams_users.user_id
        WHERE teams_users.team_id = $1
        ORDER BY teams_users.role;
      `;

      const result = await query(sql, [teamId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/",
  bodyParser.json(),
  // ClerkExpressRequireAuth({}),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { team_name, team_description, team_image_url } = req.body;

      const sql = `
      INSERT INTO teams (name, description, image_url)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
      const result = await query(sql, [
        team_name,
        team_description,
        team_image_url,
      ]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/:teamId/users",
  validateTeamId,
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    const authId = req.auth.userId;

    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [authId]);

      if (authUserResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${authId} not found` });
      }

      const teamSql = "SELECT * FROM teams WHERE id = $1;";
      const teamResult = await query(teamSql, [teamId]);

      if (teamResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Team with ID ${teamId} not found` });
      }

      if (teamResult.rows[0].open === false) {
        return res.status(403).json({
          message: `Team with ID ${teamId} is not open for new members`,
        });
      }

      const existingTeamUserSql =
        "SELECT * FROM teams_users WHERE team_id = $1 AND user_id = $2;";
      const existingTeamUserResult = await query(existingTeamUserSql, [
        teamId,
        authId,
      ]);

      if (
        existingTeamUserResult.rowCount !== null &&
        existingTeamUserResult.rowCount > 0
      ) {
        return res.status(409).json({
          message: `User with ID ${authId} is already a member of team with ID ${teamId}`,
        });
      }

      const sql = `
        INSERT INTO teams_users (team_id, user_id, role)
        VALUES ($1, $2, 'participant')
      `;

      await query(sql, [teamId, authId]);

      return res.status(201).json({ message: "User added to team" });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:teamId/users",
  validateTeamId,
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    const authId = req.auth.userId;

    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [authId]);

      if (authUserResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${authId} not found` });
      }

      const existingTeamUserSql =
        "SELECT * FROM teams_users WHERE team_id = $1 AND user_id = $2;";
      const existingTeamUserResult = await query(existingTeamUserSql, [
        teamId,
        authId,
      ]);

      if (
        existingTeamUserResult.rowCount === null ||
        existingTeamUserResult.rowCount === 0
      ) {
        return res.status(404).json({
          message: `User with ID ${authId} is not a member of team with ID ${teamId}`,
        });
      }

      const sql = `
        DELETE FROM teams_users
        WHERE team_id = $1 AND user_id = $2
      `;
      await query(sql, [teamId, authId]);

      return res.status(200).json({ message: "User removed from team" });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:teamId/users/count",
  validateTeamId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;

    try {
      const sql = "SELECT COUNT(*) FROM teams_users WHERE team_id = $1;";
      const result = await query(sql, [teamId]);
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
  "/:teamId/tournaments",
  validateTeamId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;

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
        WHERE tournaments_teams.team_id = $1
        GROUP BY tournaments.id, games.id;
      `;

      const result = await query(sql, [teamId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:teamId/tournaments/count",
  validateTeamId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;

    try {
      const sql =
        "SELECT COUNT(*) FROM tournaments_teams WHERE tournament_id = $1;";
      const result = await query(sql, [teamId]);
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
  "/count",
  async (req: Request, res: Response, next: NextFunction) => {
    const searchQuery = req.query.query as string;

    try {
      const sql = searchQuery
        ? `SELECT COUNT(*) FROM teams WHERE name ILIKE $1;`
        : `SELECT COUNT(*) FROM teams;`;
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
  "/:teamId",
  validateTeamId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;

    try {
      const sql = `
        SELECT
          teams.*,
          COUNT(DISTINCT(teams_users.user_id)) AS users_count
        FROM teams
        LEFT JOIN teams_users ON teams.id = teams_users.team_id
        WHERE teams.id = $1
        GROUP BY teams.id;
      `;

      const result = await query(sql, [teamId]);

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
          teams.*,
          COUNT(DISTINCT(teams_users.user_id)) AS users_count
        FROM teams
        LEFT JOIN teams_users ON teams.id = teams_users.team_id
        WHERE teams.name ILIKE $1
        GROUP BY teams.id
        ORDER BY teams.id
        LIMIT $2
        OFFSET $3;
      `
      : `
        SELECT
          teams.*,
          COUNT(DISTINCT(teams_users.user_id)) AS users_count
        FROM teams
        LEFT JOIN teams_users ON teams.id = teams_users.team_id
        GROUP BY teams.id
        ORDER BY teams.id
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
