import { query } from "../db/index";
import { processImage, upload } from "../middleware/upload";
import { validateTeamId } from "../validator/teamIdValidator";
import { validateTournamentData } from "../validator/tournamentDataValidator";
import { validateTournamentId } from "../validator/tournamentIdValidator";
import { validateTournamentStatus } from "../validator/tournamentStatusValidator";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
} from "@clerk/clerk-sdk-node";
import { BracketsManager } from "brackets-manager";
import { InMemoryDatabase } from "brackets-memory-db";
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
          users.id, 
          users.username,  
          users.image_url, 
          users.role, 
          users.created_at, 
          users.updated_at,
          tournaments_users.team_id AS team_id,
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
  "/:tournamentId/teams/:teamId/users/:userId",
  ClerkExpressRequireAuth({}),
  validateTournamentId,
  validateTeamId,
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { tournamentId, userId, teamId } = req.params;
    const teamOwnerId = req.auth.userId;

    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [teamOwnerId]);

      if (authUserResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${teamOwnerId} not found` });
      }

      const tournamentSql = "SELECT * FROM tournaments WHERE id = $1;";
      const tournamentResult = await query(tournamentSql, [tournamentId]);

      if (tournamentResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Tournament with ID ${tournamentId} not found` });
      }

      const userSql = "SELECT * FROM users WHERE id = $1;";
      const userResult = await query(userSql, [userId]);

      if (userResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }

      const teamSql = "SELECT * FROM teams WHERE id = $1;";
      const teamResult = await query(teamSql, [teamId]);

      if (teamResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Team with ID ${teamId} not found` });
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

      const existingTournamentUserSql = `SELECT * FROM tournaments_users WHERE tournament_id = $1 AND user_id = $2;`;
      const existingTournamentUserResult = await query(
        existingTournamentUserSql,
        [tournamentId, userId],
      );

      if (
        existingTournamentUserResult.rowCount !== null &&
        existingTournamentUserResult.rowCount > 0
      ) {
        return res.status(409).json({
          message: `User with ID ${userId} is already a member of tournament with ID ${tournamentId}`,
        });
      }

      const sql = `
        INSERT INTO tournaments_users (tournament_id, user_id, team_id)
        VALUES ($1, $2, $3)
      `;
      await query(sql, [tournamentId, userId, teamId]);

      return res.status(201).json({ message: "User added to tournament" });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/:tournamentId/teams/:teamId",
  ClerkExpressRequireAuth({}),
  validateTournamentId,
  validateTeamId,
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { tournamentId, teamId } = req.params;
    const authId = req.auth.userId;

    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [authId]);

      if (authUserResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${authId} not found` });
      }

      const tournamentSql = "SELECT * FROM tournaments WHERE id = $1;";
      const tournamentResult = await query(tournamentSql, [tournamentId]);

      if (tournamentResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Tournament with ID ${tournamentId} not found` });
      }

      const teamSql = "SELECT * FROM teams WHERE id = $1;";
      const teamResult = await query(teamSql, [teamId]);

      if (teamResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Team with ID ${teamId} not found` });
      }

      const isTeamOwnerSql = `SELECT * FROM teams_users WHERE team_id = $1 AND user_id = $2 AND role = 'owner' OR role = 'manager';`;
      const isTeamOwnerResult = await query(isTeamOwnerSql, [teamId, authId]);

      if (isTeamOwnerResult.rowCount === 0) {
        return res.status(403).json({
          message: `User with ID ${authId} is not an owner or manager of team with ID ${teamId}`,
        });
      }

      const existingTournamentTeamSql = `SELECT * FROM tournaments_teams WHERE tournament_id = $1 AND team_id = $2;`;
      const existingTournamentTeamResult = await query(
        existingTournamentTeamSql,
        [tournamentId, teamId],
      );

      if (
        existingTournamentTeamResult.rowCount !== null &&
        existingTournamentTeamResult.rowCount > 0
      ) {
        return res.status(409).json({
          message: `Team with ID ${teamId} is already a participant of tournament with ID ${tournamentId}`,
        });
      }

      const sql = `
        INSERT INTO tournaments_teams (tournament_id, team_id)
        VALUES ($1, $2)
      `;
      await query(sql, [tournamentId, teamId]);

      return res.status(201).json({ message: "Team added to tournament" });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:tournamentId/teams/:teamId",
  ClerkExpressRequireAuth({}),
  validateTournamentId,
  validateTeamId,
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { tournamentId, teamId } = req.params;
    const teamOwnerId = req.auth.userId;

    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [teamOwnerId]);

      if (authUserResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${teamOwnerId} not found` });
      }

      const tournamentSql = "SELECT * FROM tournaments WHERE id = $1;";
      const tournamentResult = await query(tournamentSql, [tournamentId]);

      if (tournamentResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Tournament with ID ${tournamentId} not found` });
      }

      const teamSql = "SELECT * FROM teams WHERE id = $1;";
      const teamResult = await query(teamSql, [teamId]);

      if (teamResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Team with ID ${teamId} not found` });
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

      const existingTournamentTeamSql = `SELECT * FROM tournaments_teams WHERE tournament_id = $1 AND team_id = $2;`;
      const existingTournamentTeamResult = await query(
        existingTournamentTeamSql,
        [tournamentId, teamId],
      );

      if (
        existingTournamentTeamResult.rowCount === null ||
        existingTournamentTeamResult.rowCount === 0
      ) {
        return res.status(404).json({
          message: `Team with ID ${teamId} is not a participant of tournament with ID ${tournamentId}`,
        });
      }

      const sql = `
        DELETE FROM tournaments_teams
        WHERE tournament_id = $1 AND team_id = $2;
      `;

      await query(sql, [tournamentId, teamId]);

      const removeTournamentUsersSql = `
        DELETE FROM tournaments_users
        WHERE tournament_id = $1 AND team_id = $2;
      `;

      await query(removeTournamentUsersSql, [tournamentId, teamId]);

      return res.status(200).json({ message: "Team removed from tournament" });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:tournamentId/teams/:teamId/users/:userId",
  ClerkExpressRequireAuth({}),
  validateTournamentId,
  validateTeamId,
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { tournamentId, userId, teamId } = req.params;
    const teamOwnerId = req.auth.userId;

    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [teamOwnerId]);

      if (authUserResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${teamOwnerId} not found` });
      }

      const tournamentSql = "SELECT * FROM tournaments WHERE id = $1;";
      const tournamentResult = await query(tournamentSql, [tournamentId]);

      if (tournamentResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Tournament with ID ${tournamentId} not found` });
      }

      const userSql = "SELECT * FROM users WHERE id = $1;";
      const userResult = await query(userSql, [userId]);

      if (userResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }

      const teamSql = "SELECT * FROM teams WHERE id = $1;";
      const teamResult = await query(teamSql, [teamId]);

      if (teamResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Team with ID ${teamId} not found` });
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

      const existingTournamentUserSql = `SELECT * FROM tournaments_users WHERE tournament_id = $1 AND user_id = $2;`;
      const existingTournamentUserResult = await query(
        existingTournamentUserSql,
        [tournamentId, userId],
      );

      if (
        existingTournamentUserResult.rowCount === null ||
        existingTournamentUserResult.rowCount === 0
      ) {
        return res.status(404).json({
          message: `User with ID ${userId} is not a member of tournament with ID ${tournamentId}`,
        });
      }

      const sql = `
        DELETE FROM tournaments_users
        WHERE tournament_id = $1 AND user_id = $2;
      `;

      await query(sql, [tournamentId, userId]);

      return res.status(200).json({ message: "User removed from tournament" });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:tournamentId/status/:tournamentStatus",
  ClerkExpressRequireAuth({}),
  validateTournamentId,
  validateTournamentStatus,
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { tournamentId, tournamentStatus } = req.params;
    const ownerId = req.auth.userId;
    const status = tournamentStatus.toLowerCase();

    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [ownerId]);

      if (authUserResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${ownerId} not found` });
      }

      const tournamentSql = "SELECT * FROM tournaments WHERE id = $1;";
      const tournamentResult = await query(tournamentSql, [tournamentId]);

      if (tournamentResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Tournament with ID ${tournamentId} not found` });
      }

      const isOwnerSql = `SELECT * FROM tournaments_users WHERE tournament_id = $1 AND user_id = $2 AND role = 'owner' or role = 'manager';`;
      const isOwnerResult = await query(isOwnerSql, [tournamentId, ownerId]);

      if (isOwnerResult.rowCount === 0) {
        return res.status(403).json({
          message: `User with ID ${ownerId} is not an owner or manager of tournament with ID ${tournamentId}`,
        });
      }

      switch (status) {
        case "upcoming":
          break;
        case "active": {
          const tournamentTeamsSql = `
            SELECT 
              teams.id,
              teams.name
            FROM tournaments_teams
            JOIN teams ON tournaments_teams.team_id = teams.id
            WHERE tournaments_teams.tournament_id = $1;
          `;
          const tournamentTeamsResult = await query(tournamentTeamsSql, [
            tournamentId,
          ]);

          if (tournamentTeamsResult.rowCount === 0) {
            return res.status(400).json({
              message: `Tournament with ID ${tournamentId} has no teams`,
            });
          }

          const teams = tournamentTeamsResult.rows.map(
            (team: { id: string; tournament_id: string; name: string }) => {
              return {
                id: team.id,
                name: team.name,
                tournament_id: tournamentId,
              };
            },
          );

          const tournament = tournamentResult.rows[0];
          const storage = new InMemoryDatabase();
          const manager = new BracketsManager(storage);

          await manager.create.stage({
            tournamentId: tournamentId,
            name: tournament.name,
            type: tournament.format,
            seeding: teams,
            settings: {
              size: tournament.max_teams,
              grandFinal: "double",
            },
          });

          const data = await manager.get.tournamentData(tournamentId);

          const updateTournamentDataSql = `
              UPDATE tournaments
              SET data = $1, status = $2
              WHERE id = $3;
            `;
          await query(updateTournamentDataSql, [data, status, tournamentId]);

          return res.status(200).json({ message: "Tournament started" });
        }
        case "completed":
          break;
        case "cancelled":
          break;
        default:
          return res.status(400).json({
            message: `tournamentStatus must be one of 'upcoming', 'active', 'completed', or 'cancelled'`,
          });
      }
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/",
  ClerkExpressRequireAuth({}),
  upload.single("file"),
  validateTournamentData,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
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

      const existingTournamentSql =
        "SELECT * FROM tournaments WHERE name ILIKE $1;";
      const existingTournamentResult = await query(existingTournamentSql, [
        name,
      ]);
      if (existingTournamentResult.rowCount !== 0) {
        return res
          .status(409)
          .json({ message: `Tournament with name ${name} already exists` });
      }

      const tagsArray = (tags || "")
        .toLowerCase()
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean);

      const visibility_name = visibility === "true" ? "public" : "private";

      const insertTournamentSql = `
        INSERT INTO tournaments (
          name,
          description,
          image_url,
          game_id,
          format,
          visibility,
          tags,
          cash_prize,
          max_teams,
          max_team_size,
          min_team_size,
          start_date,
          end_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *;
      `;
      const result = await query(insertTournamentSql, [
        name,
        description,
        imageUrl,
        game,
        format,
        visibility_name,
        tagsArray,
        cash_prize,
        max_teams,
        max_team_size,
        min_team_size,
        start_date,
        end_date,
      ]);

      const insertTournamentUserSql = `
        INSERT INTO tournaments_users (tournament_id, user_id, role)
        VALUES ($1, $2, 'owner')
      `;
      await query(insertTournamentUserSql, [result.rows[0].id, authId]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:tournamentId",
  ClerkExpressRequireAuth({}),
  upload.single("file"),
  validateTournamentData,
  validateTournamentId,
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;

    try {
      const {
        name,
        description,
        game,
        format,
        tags,
        cash_prize,
        start_date,
        end_date,
        visibility,
      } = req.body;
      const authId = req.auth.userId;

      const tournamentUserRolesSql = `
        SELECT * FROM tournaments_users WHERE tournament_id = $1 AND user_id = $2;
      `;
      const tournamentUserRolesResult = await query(tournamentUserRolesSql, [
        tournamentId,
        authId,
      ]);

      if (tournamentUserRolesResult.rowCount === 0) {
        return res.status(403).json({
          message: `You are not authorized to update this tournament`,
        });
      }

      const userRole = tournamentUserRolesResult.rows[0].role;

      if (userRole !== "owner" && userRole !== "manager") {
        return res.status(403).json({
          message: `You are not authorized to update this tournament`,
        });
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

      const tournamentSql = "SELECT * FROM tournaments WHERE id = $1;";
      const tournamentResult = await query(tournamentSql, [tournamentId]);

      if (tournamentResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Tournament with ID ${tournamentId} not found` });
      }

      const existingTournamentSql =
        "SELECT * FROM tournaments WHERE name ILIKE $1 AND id != $2;";
      const existingTournamentResult = await query(existingTournamentSql, [
        name,
        tournamentId,
      ]);

      if (existingTournamentResult.rowCount !== 0) {
        return res
          .status(409)
          .json({ message: `Tournament with name ${name} already exists` });
      }

      let updateTournamentSql: string;
      let queryParams: any[];

      const tagsArray = (tags || "")
        .toLowerCase()
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean);

      const visibility_name = visibility === "true" ? "public" : "private";

      if (imageUrl) {
        updateTournamentSql = `
          UPDATE tournaments
          SET name = $1,
              description = $2,
              image_url = $3,
              game_id = $4,
              format = $5,
              visibility = $6,
              tags = $7,
              cash_prize = $8,
              start_date = $9,
              end_date = $10
          WHERE id = $11
          RETURNING *;
        `;

        queryParams = [
          name,
          description,
          imageUrl,
          game,
          format,
          visibility_name,
          tagsArray,
          cash_prize,
          start_date,
          end_date,
          tournamentId,
        ];
      } else {
        updateTournamentSql = `
          UPDATE tournaments
          SET name = $1,
              description = $2,
              game_id = $3,
              format = $4,
              visibility = $5,
              tags = $6,
              cash_prize = $7,
              start_date = $8,
              end_date = $9
          WHERE id = $10
          RETURNING *;
        `;

        queryParams = [
          name,
          description,
          game,
          format,
          visibility_name,
          tagsArray,
          cash_prize,
          start_date,
          end_date,
          tournamentId,
        ];
      }

      const result = await query(updateTournamentSql, queryParams);

      res.status(200).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:tournamentId",
  ClerkExpressRequireAuth({}),
  validateTournamentId,
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;
    const authId = req.auth.userId;

    try {
      const authUserSql = "SELECT * FROM users WHERE id = $1;";
      const authUserResult = await query(authUserSql, [authId]);

      if (authUserResult.rowCount === 0) {
        return res.status(404).json({ message: `User with your ID not found` });
      }

      const tournamentSql = "SELECT * FROM tournaments WHERE id = $1;";
      const tournamentResult = await query(tournamentSql, [tournamentId]);

      if (tournamentResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Tournament with ID ${tournamentId} not found` });
      }

      const isOwnerSql = `SELECT * FROM tournaments_users WHERE tournament_id = $1 AND user_id = $2 AND role = 'owner';`;
      const isOwnerResult = await query(isOwnerSql, [tournamentId, authId]);

      if (isOwnerResult.rowCount === 0) {
        return res.status(403).json({
          message: `You are not authorized to delete this tournament`,
        });
      }

      const sql = `
        DELETE FROM tournaments
        WHERE id = $1;
      `;
      await query(sql, [tournamentId]);

      return res
        .status(200)
        .json({ message: "Tournament deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
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
        GROUP BY tournaments.id, games.id;
      `;

    const result = await query(sql);

    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
