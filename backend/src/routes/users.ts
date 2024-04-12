import { query } from "../db/index";
import { validateUserId } from "../validator/userIdValidator";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
} from "@clerk/clerk-sdk-node";
import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get(
  "/:userId/followers",
  validateUserId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = `
        SELECT
          users.*,
          users_follows.followed_at
        FROM users_follows
        JOIN users ON users_follows.follower_id = users.id
        WHERE users_follows.followed_id = $1;
      `;

      const result = await query(sql, [userId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/:userId/follow",
  validateUserId,
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const followerId = req.auth.userId;

    try {
      const followingSql = "SELECT * FROM users WHERE id = $1;";
      const followingResult = await query(followingSql, [userId]);

      if (followingResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: `User with ID ${userId} not found` });
      }

      const followerSql = "SELECT * FROM users WHERE clerk_user_id = $1;";
      const followerResult = await query(followerSql, [followerId]);

      if (followerResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: `User with ID ${followerId} not found` });
      }

      if (followingResult.rows[0].id === followerResult.rows[0].id) {
        return res.status(400).json({ error: "Cannot follow yourself" });
      }

      const existingFollowSql = `
        SELECT * FROM users_follows WHERE followed_id = $1 AND follower_id = $2;
      `;
      const existingFollowResult = await query(existingFollowSql, [
        followingResult.rows[0].id,
        followerResult.rows[0].id,
      ]);

      if (existingFollowResult.rows.length > 0) {
        return res.status(400).json({ error: "Already following this user" });
      }

      const insertSql = `
        INSERT INTO users_follows (followed_id, follower_id)
        VALUES ($1, $2);
      `;
      await query(insertSql, [
        followingResult.rows[0].id,
        followerResult.rows[0].id,
      ]);

      return res.status(201).json({ message: "User followed successfully" });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:userId/unfollow",
  validateUserId,
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const followerId = req.auth.userId;

    try {
      const followingSql = "SELECT * FROM users WHERE id = $1;";
      const followingResult = await query(followingSql, [userId]);

      if (followingResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: `User with ID ${userId} not found` });
      }

      const followerSql = "SELECT * FROM users WHERE clerk_user_id = $1;";
      const followerResult = await query(followerSql, [followerId]);

      if (followerResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: `User with ID ${followerId} not found` });
      }

      if (followingResult.rows[0].id === followerResult.rows[0].id) {
        return res.status(400).json({ error: "Cannot unfollow yourself" });
      }

      const followSql = `
        SELECT * FROM users_follows WHERE followed_id = $1 AND follower_id = $2;
      `;
      const followResult = await query(followSql, [
        followingResult.rows[0].id,
        followerResult.rows[0].id,
      ]);

      if (followResult.rows.length === 0) {
        return res.status(400).json({ error: "User is not being followed" });
      }

      const deleteSql = `
        DELETE FROM users_follows
        WHERE followed_id = $1 AND follower_id = $2;
      `;
      await query(deleteSql, [
        followingResult.rows[0].id,
        followerResult.rows[0].id,
      ]);

      return res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:userId/followers/count",
  validateUserId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = "SELECT COUNT(*) FROM users_follows WHERE followed_id = $1;";
      const result = await query(sql, [userId]);
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
  "/:userId/following",
  validateUserId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = `
        SELECT
          users.*,
          users_follows.followed_at
        FROM users_follows
        JOIN users ON users_follows.followed_id = users.id
        WHERE users_follows.follower_id = $1;
      `;

      const result = await query(sql, [userId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:userId/following/count",
  validateUserId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = "SELECT COUNT(*) FROM users_follows WHERE follower_id = $1;";
      const result = await query(sql, [userId]);
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
  "/:userId/teams",
  validateUserId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = `
        SELECT
          teams.*,
          teams_users.role AS team_role,
          COUNT(DISTINCT teams_users.user_id) AS users_count
        FROM teams_users
        JOIN teams ON teams_users.team_id = teams.id
        WHERE teams.id IN (
          SELECT team_id FROM teams_users WHERE user_id = $1
        )
        AND teams_users.user_id = $1
        GROUP BY teams.id, teams_users.role;
      `;

      const result = await query(sql, [userId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:userId/teams/count",
  validateUserId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = "SELECT COUNT(*) FROM teams_users WHERE user_id = $1;";
      const result = await query(sql, [userId]);
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
  "/:userId/tournaments",
  validateUserId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = `
        SELECT 
          tournaments.*, 
          COUNT(DISTINCT(tournaments_users.user_id)) AS users_count,
          COUNT(DISTINCT(tournaments_teams.team_id)) AS teams_count,
          tournaments_users.role as tournament_role,
          games.name AS game_name,
          games.description AS game_description,
          games.image_url AS game_image_url,
          games.created_at AS game_created_at,
          games.updated_at AS game_updated_at
        FROM tournaments
        LEFT JOIN tournaments_teams ON tournaments.id = tournaments_teams.tournament_id
        LEFT JOIN tournaments_users ON tournaments.id = tournaments_users.tournament_id
        JOIN games ON tournaments.game_id = games.id
        WHERE tournaments_users.user_id = $1
        GROUP BY tournaments.id, games.id, tournaments_users.role;
      `;

      const result = await query(sql, [userId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:userId/tournaments/count",
  validateUserId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = "SELECT COUNT(*) FROM tournaments_users WHERE user_id = $1;";
      const result = await query(sql, [userId]);
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
        ? `SELECT COUNT(*) FROM users WHERE username ILIKE $1;`
        : `SELECT COUNT(*) FROM users;`;
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
  "/:userId",
  validateUserId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = "SELECT * FROM users WHERE id = $1;";
      const result = await query(sql, [userId]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: `User with ID ${userId} not found` });
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
      ? "SELECT * FROM users WHERE username ILIKE $1 ORDER BY id LIMIT $2 OFFSET $3;"
      : "SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2;";
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
