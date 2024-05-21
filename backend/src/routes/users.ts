import { query } from "../db/index";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
} from "@clerk/clerk-sdk-node";
import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post(
  "/:userId/follow",
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const followerId = req.auth.userId;

    try {
      const followingSql = `
        SELECT
          id, 
          username, 
          image_url, 
          role, 
          created_at, 
          updated_at 
        FROM users 
        WHERE id = $1;`;
      const followingResult = await query(followingSql, [userId]);

      if (followingResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }

      const followerSql = `
        SELECT
          id, 
          username, 
          image_url, 
          role, 
          created_at, 
          updated_at 
        FROM users 
        WHERE id = $1;`;
      const followerResult = await query(followerSql, [followerId]);

      if (followerResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${followerId} not found` });
      }

      if (followerId === userId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }

      const existingFollowSql = `
        SELECT * FROM users_follows WHERE followed_id = $1 AND follower_id = $2;
      `;
      const existingFollowResult = await query(existingFollowSql, [
        userId,
        followerId,
      ]);

      if (existingFollowResult.rows.length > 0) {
        return res.status(409).json({ message: "Already following this user" });
      }

      const insertSql = `
        INSERT INTO users_follows (followed_id, follower_id)
        VALUES ($1, $2);
      `;

      await query(insertSql, [userId, followerId]);

      return res.status(201).json({ message: "User followed successfully" });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:userId/follow",
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const followerId = req.auth.userId;

    try {
      const followingSql = `
        SELECT
          id, 
          username, 
          image_url, 
          role, 
          created_at, 
          updated_at 
        FROM users 
        WHERE id = $1;`;
      const followingResult = await query(followingSql, [userId]);

      if (followingResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }

      const followerSql = `
        SELECT
          id, 
          username, 
          image_url, 
          role, 
          created_at, 
          updated_at 
        FROM users 
        WHERE id = $1;`;
      const followerResult = await query(followerSql, [followerId]);

      if (followerResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${followerId} not found` });
      }

      if (followerId === userId) {
        return res.status(400).json({ message: "Cannot unfollow yourself" });
      }

      const followSql = `
        SELECT * FROM users_follows WHERE followed_id = $1 AND follower_id = $2;
      `;
      const followResult = await query(followSql, [userId, followerId]);

      if (followResult.rows.length === 0) {
        return res.status(400).json({ message: "User is not being followed" });
      }

      const deleteSql = `
        DELETE FROM users_follows
        WHERE followed_id = $1 AND follower_id = $2;
      `;
      await query(deleteSql, [userId, followerId]);

      return res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:userId/followers",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = `
          SELECT
            users.id, 
            users.username,  
            users.image_url, 
            users.role, 
            users.created_at, 
            users.updated_at
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

router.get(
  "/:userId/followers/count",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = `
          SELECT COUNT(*)
          FROM users_follows
          WHERE followed_id = $1;
        `;

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
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = `
          SELECT
            users.id, 
            users.username,  
            users.image_url, 
            users.role, 
            users.created_at, 
            users.updated_at
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = `
          SELECT COUNT(*)
          FROM users_follows
          WHERE follower_id = $1;
        `;

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
  "/:followerId/following/:followedId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { followerId, followedId } = req.params;

    try {
      const followerSql = "SELECT * FROM users WHERE id = $1;";
      const followerResult = await query(followerSql, [followerId]);

      if (followerResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${followerId} not found` });
      }

      const sql = `
        SELECT EXISTS (
          SELECT 1
          FROM users_follows
          WHERE follower_id = $1 AND followed_id = $2
        ) AS is_following;
      `;
      const params = [followerId, followedId];

      const result = await query(sql, params);
      const isFollowing = result.rows[0].is_following;

      return res.status(200).json({ isFollowing });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:userId/teams",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = `
        SELECT
          teams.*,
          (
            SELECT COUNT(DISTINCT user_id)
            FROM teams_users
            WHERE team_id = teams.id
          ) AS users_count,
          teams_users.role AS team_role
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = `
        SELECT 
          tournaments.*, 
          (
              SELECT COUNT(DISTINCT user_id)
              FROM tournaments_users
              WHERE tournament_id = tournaments.id
          ) AS users_count,
          (
              SELECT COUNT(DISTINCT team_id)
              FROM tournaments_teams
              WHERE tournament_id = tournaments.id
          ) AS teams_count,
          tournaments_users.team_id AS team_id,
          tournaments_users.role AS tournament_role,
          games.name AS game_name,
          games.description AS game_description,
          games.image_url AS game_image_url,
          games.created_at AS game_created_at,
          games.updated_at AS game_updated_at
        FROM tournaments
        LEFT JOIN tournaments_users ON tournaments.id = tournaments_users.tournament_id
        JOIN games ON tournaments.game_id = games.id
        WHERE tournaments_users.user_id = $1
        GROUP BY tournaments.id, games.id, tournaments_users.role, tournaments_users.team_id;
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const sql = `
        SELECT 
          id, 
          username, 
          image_url, 
          role, 
          created_at, 
          updated_at 
        FROM users 
        WHERE id = $1;`;
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
  try {
    const sql = `
      SELECT 
        id, 
        username, 
        first_name, 
        last_name, 
        image_url, 
        role, 
        created_at, 
        updated_at
      FROM users;`;
    const result = await query(sql);

    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
