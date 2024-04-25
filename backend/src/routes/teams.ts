import { query } from "../db/index";
import { processImage, upload } from "../middleware/upload";
import { validateTeamData } from "../validator/teamDataValidator";
import { validateTeamId } from "../validator/teamIdValidator";
import { validateTournamentId } from "../validator/tournamentIdValidator";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
} from "@clerk/clerk-sdk-node";
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
  ClerkExpressRequireAuth({}),
  upload.single("file"),
  validateTeamData,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, visibility } = req.body;
      const authId = req.auth.userId;

      let imageUrl = `https://madbracket.xyz/images/default`;
      if (req.file) {
        imageUrl = `https://madbracket.xyz/images/${await processImage(req.file)}`;
      }

      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [authId]);
      if (authUserResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${authId} not found` });
      }

      const existingTeamSql = "SELECT * FROM teams WHERE name ILIKE $1;";
      const existingTeamResult = await query(existingTeamSql, [name]);
      if (existingTeamResult.rowCount !== 0) {
        return res
          .status(409)
          .json({ message: `Team with name ${name} already exists` });
      }

      const insertTeamSql = `
        INSERT INTO teams (name, description, image_url, open)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const result = await query(insertTeamSql, [
        name,
        description,
        imageUrl,
        visibility,
      ]);
      const teamId = result.rows[0].id;

      const insertTeamUserSql = `
        INSERT INTO teams_users (team_id, user_id, role)
        VALUES ($1, $2, 'owner')
      `;
      await query(insertTeamUserSql, [teamId, authId]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/:teamId/users",
  ClerkExpressRequireAuth({}),
  validateTeamId,
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

router.put(
  "/:teamId",
  ClerkExpressRequireAuth({}),
  upload.single("file"),
  validateTeamData,
  validateTeamId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;

    try {
      const { name, description, visibility } = req.body;
      const authId = req.auth.userId;

      const teamUserRoleSql = `
        SELECT role FROM teams_users WHERE team_id = $1 AND user_id = $2;
      `;
      const teamUserRoleResult = await query(teamUserRoleSql, [teamId, authId]);

      if (teamUserRoleResult.rowCount === 0) {
        return res
          .status(403)
          .json({ message: `You are not authorized to update this team` });
      }

      const userRole = teamUserRoleResult.rows[0].role;

      if (userRole !== "owner" && userRole !== "manager") {
        return res
          .status(403)
          .json({ message: `You are not authorized to update this team` });
      }

      let imageUrl: string | null = null;

      if (req.file) {
        imageUrl = `https://madbracket.xyz/images/${await processImage(req.file)}`;
      }

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

      const existingTeamSql =
        "SELECT * FROM teams WHERE name ILIKE $1 AND id != $2;";
      const existingTeamResult = await query(existingTeamSql, [name, teamId]);
      if (existingTeamResult.rowCount !== 0) {
        return res
          .status(409)
          .json({ message: `Team with name ${name} already exists` });
      }

      let updateTeamSql: string;
      let queryParams: any[];

      if (imageUrl) {
        updateTeamSql = `
          UPDATE teams
          SET name = $1, description = $2, image_url = $3, open = $4
          WHERE id = $5
          RETURNING *;
        `;
        queryParams = [name, description, imageUrl, visibility, teamId];
      } else {
        updateTeamSql = `
          UPDATE teams
          SET name = $1, description = $2, open = $3
          WHERE id = $4
          RETURNING *;
        `;
        queryParams = [name, description, visibility, teamId];
      }

      const result = await query(updateTeamSql, queryParams);

      res.status(200).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:teamId",
  ClerkExpressRequireAuth({}),
  validateTeamId,
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    const authId = req.auth.userId;

    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [authId]);

      if (authUserResult.rowCount === 0) {
        return res.status(404).json({ message: `User with your ID not found` });
      }

      const teamSql = "SELECT * FROM teams WHERE id = $1;";
      const teamResult = await query(teamSql, [teamId]);

      if (teamResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `The team you're trying to delete does not exist` });
      }

      const teamOwnerSql =
        "SELECT * FROM teams_users WHERE team_id = $1 AND role = 'owner' AND user_id = $2;";
      const teamOwnerResult = await query(teamOwnerSql, [teamId, authId]);

      if (teamOwnerResult.rowCount === 0) {
        return res.status(403).json({
          message: `Only team owners have permission to delete the team`,
        });
      }

      const sql = `
        DELETE FROM teams
        WHERE id = $1
      `;
      await query(sql, [teamId]);

      return res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:teamId/users/:userId",
  ClerkExpressRequireAuth({}),
  validateTeamId,
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { teamId, userId } = req.params;
    const teamOwnerId = req.auth.userId;

    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [teamOwnerId]);

      if (authUserResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${teamOwnerId} not found` });
      }

      const teamSql = "SELECT * FROM teams WHERE id = $1;";
      const teamResult = await query(teamSql, [teamId]);

      if (teamResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Team with ID ${teamId} not found` });
      }

      const userSql = "SELECT * FROM users WHERE id = $1;";
      const userResult = await query(userSql, [userId]);

      if (userResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }

      const isTeamOwnerSql = `SELECT * FROM teams_users WHERE team_id = $1 AND user_id = $2 AND role = 'owner' OR role = 'manager';`;
      const isTeamOwnerResult = await query(isTeamOwnerSql, [
        teamId,
        teamOwnerId,
      ]);

      if (isTeamOwnerResult.rowCount === 0) {
        return res.status(403).json({
          message: `User with ID ${teamOwnerId} is not an owner or manager of team with ID ${teamId}`,
        });
      }

      const existingTeamUserSql = `SELECT * FROM teams_users WHERE team_id = $1 AND user_id = $2;`;
      const existingTeamUserResult = await query(existingTeamUserSql, [
        teamId,
        userId,
      ]);

      if (existingTeamUserResult.rowCount === 0) {
        return res.status(404).json({
          message: `User with ID ${userId} is not a member of team with ID ${teamId}`,
        });
      }

      if (existingTeamUserResult.rows[0].role === "owner") {
        return res.status(403).json({
          message: `Team owners cannot be removed from the team`,
        });
      }

      const sql = `DELETE FROM teams_users WHERE team_id = $1 AND user_id = $2;`;
      await query(sql, [teamId, userId]);

      return res.status(200).json({ message: "User removed from team" });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:teamId/users",
  ClerkExpressRequireAuth({}),
  validateTeamId,
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

      if (existingTeamUserResult.rows[0].role === "owner") {
        return res.status(403).json({
          message: `Team owners cannot be removed from the team`,
        });
      }

      const sql = `
        DELETE FROM teams_users
        WHERE team_id = $1 AND user_id = $2
      `;
      await query(sql, [teamId, authId]);

      const removeTournamentUser = `
        DELETE FROM tournaments_users
        WHERE team_id = $1 AND user_id = $2
      `;

      await query(removeTournamentUser, [teamId, authId]);

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
  "/:teamId/tournaments/:tournamentId/users",
  validateTeamId,
  validateTournamentId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId, tournamentId } = req.params;

    try {
      const sql = `
        SELECT
          users.*,
          tournaments_users.role AS tournament_role
        FROM users
        JOIN tournaments_users ON users.id = tournaments_users.user_id
        WHERE tournaments_users.tournament_id = $1
        AND tournaments_users.team_id = $2
        ORDER BY tournaments_users.role;
      `;

      const result = await query(sql, [tournamentId, teamId]);

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
  try {
    const sql = `
        SELECT
          teams.*,
          COUNT(DISTINCT(teams_users.user_id)) AS users_count
        FROM teams
        LEFT JOIN teams_users ON teams.id = teams_users.team_id
        GROUP BY teams.id
        ORDER BY teams.id;
      `;
    const result = await query(sql);

    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
