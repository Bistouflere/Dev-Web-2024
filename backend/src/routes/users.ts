import { query } from "../db/index";
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

// http://localhost:3000/api/users/count
router.get("/count", async (req: Request, res: Response) => {
  const { query: searchQuery } = req.query;

  try {
    let sql = "SELECT COUNT(*) FROM users";

    const values = [];

    if (searchQuery) {
      sql += ` WHERE username ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1`;
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

// http://localhost:3000/api/users/1/followers
router.get("/:userId/followers", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const sql = `
      SELECT u.*
      FROM users u
      INNER JOIN user_follows uf ON u.id = uf.follower_id
      WHERE uf.followed_id = $1;
    `;

    const result = await query(sql, [userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No followers found for the specified user" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/users/1/following
router.get("/:userId/following", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const sql = `
      SELECT u.*
      FROM users u
      INNER JOIN user_follows uf ON u.id = uf.followed_id
      WHERE uf.follower_id = $1;
    `;

    const result = await query(sql, [userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No following found for the specified user" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/users/1/followers/count
router.get("/:userId/followers/count", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const sql = `
      SELECT COUNT(*)
      FROM user_follows
      WHERE followed_id = $1;
    `;

    const result = await query(sql, [userId]);

    const count = parseInt(result.rows[0].count);

    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/users/1/following/count
router.get("/:userId/following/count", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const sql = `
      SELECT COUNT(*)
      FROM user_follows
      WHERE follower_id = $1;
    `;

    const result = await query(sql, [userId]);

    const count = parseInt(result.rows[0].count);

    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/users/1/team
router.get("/:userId/team", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const sql = `
      SELECT t.*
      FROM teams t
      INNER JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = $1;
    `;

    const result = await query(sql, [userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "User is not a member of any team" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/users/1
router.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const result = await query("SELECT * FROM users WHERE id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/api/users?query=john&page=1
router.get("/", async (req: Request, res: Response) => {
  const { query: searchQuery, page } = req.query;
  const perPage = 10;
  const offset = (parseInt(page as string) - 1) * perPage || 0;

  try {
    let result;

    if (searchQuery) {
      const sql = `
        SELECT * FROM users
        WHERE username ILIKE $1
           OR first_name ILIKE $1
           OR last_name ILIKE $1
        ORDER BY id
        LIMIT $2 OFFSET $3;
      `;

      result = await query(sql, [`%${searchQuery}%`, perPage, offset]);
    } else {
      const sql = `
        SELECT * FROM users
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
