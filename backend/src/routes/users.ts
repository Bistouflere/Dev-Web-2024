import { query } from "../db/index";
import express, { Request, Response } from "express";

// Make sure this path matches your actual db import

const router = express.Router();

// Fetch user profile by userId
router.get("/:userId/profile", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userProfileSql = "SELECT * FROM users WHERE id = $1";
    const userProfileResult = await query(userProfileSql, [userId]);

    if (userProfileResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(userProfileResult.rows[0]);
  } catch (error) {
    console.error("Error fetching user profile", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch all teams associated with a user
router.get("/:userId/teams", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const teamsSql = `
      SELECT t.*, utr.role
      FROM teams t
      JOIN user_team_roles utr ON t.id = utr.team_id
      WHERE utr.user_id = $1;
    `;
    const teamsResult = await query(teamsSql, [userId]);

    return res.status(200).json(teamsResult.rows);
  } catch (error) {
    console.error("Error fetching user teams", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch all tournaments a user is participating in
router.get("/:userId/tournaments", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const tournamentsSql = `
      SELECT t.*, utr.role
      FROM tournaments t
      JOIN user_tournament_roles utr ON t.id = utr.tournament_id
      WHERE utr.user_id = $1;
    `;
    const tournamentsResult = await query(tournamentsSql, [userId]);

    return res.status(200).json(tournamentsResult.rows);
  } catch (error) {
    console.error("Error fetching user tournaments", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch followers and following users
router.get("/:userId/social", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const followersSql =
      "SELECT u.* FROM users u JOIN user_follows uf ON u.id = uf.follower_id WHERE uf.followed_id = $1";
    const followingSql =
      "SELECT u.* FROM users u JOIN user_follows uf ON u.id = uf.followed_id WHERE uf.follower_id = $1";

    const followersResult = await query(followersSql, [userId]);
    const followingResult = await query(followingSql, [userId]);

    return res.status(200).json({
      followers: followersResult.rows,
      following: followingResult.rows,
    });
  } catch (error) {
    console.error("Error fetching social info", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch detailed roles of a user in teams
router.get("/:userId/teams/roles", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const sql = `
      SELECT t.name AS team_name, utr.role
      FROM user_team_roles utr
      JOIN teams t ON utr.team_id = t.id
      WHERE utr.user_id = $1;
    `;
    const result = await query(sql, [userId]);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user team roles", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch detailed roles of a user in tournaments
router.get(
  "/:userId/tournaments/roles",
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const sql = `
      SELECT tor.name AS tournament_name, utr.role
      FROM user_tournament_roles utr
      JOIN tournaments tor ON utr.tournament_id = tor.id
      WHERE utr.user_id = $1;
    `;
      const result = await query(sql, [userId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching user tournament roles", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Fetch upcoming tournaments for a user
router.get(
  "/:userId/tournaments/upcoming",
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const sql = `
      SELECT t.*
      FROM tournaments t
      JOIN user_tournament_roles utr ON t.id = utr.tournament_id
      WHERE utr.user_id = $1 AND t.start_date > CURRENT_DATE;
    `;
      const result = await query(sql, [userId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching upcoming tournaments", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Fetch past tournaments for a user
router.get("/:userId/tournaments/past", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const sql = `
      SELECT t.*
      FROM tournaments t
      JOIN user_tournament_roles utr ON t.id = utr.tournament_id
      WHERE utr.user_id = $1 AND t.end_date < CURRENT_DATE;
    `;
    const result = await query(sql, [userId]);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching past tournaments", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch match history for a user
router.get("/:userId/match-history", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const sql = `
      SELECT m.*, tr.round_type, t.name AS tournament_name, t1.name AS team1_name, t2.name AS team2_name, 
        CASE 
          WHEN m.winner_id = t1.id THEN 'Win'
          WHEN m.winner_id = t2.id THEN 'Loss'
          ELSE 'Draw'
        END as outcome
      FROM matches m
      INNER JOIN tournament_rounds tr ON m.round_id = tr.id
      INNER JOIN tournaments t ON tr.tournament_id = t.id
      INNER JOIN teams t1 ON m.team1_id = t1.id
      INNER JOIN teams t2 ON m.team2_id = t2.id
      WHERE m.team1_id IN (SELECT team_id FROM user_team_roles WHERE user_id = $1)
         OR m.team2_id IN (SELECT team_id FROM user_team_roles WHERE user_id = $1);
    `;
    const result = await query(sql, [userId]);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user match history", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch user's participation in teams
router.get(
  "/:userId/teams-participation",
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const sql = `
      SELECT t.name, t.bio, t.logo_url, utr.role
      FROM user_team_roles utr
      JOIN teams t ON utr.team_id = t.id
      WHERE utr.user_id = $1;
    `;
      const result = await query(sql, [userId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching user teams participation", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Fetch user's participation in tournaments
router.get(
  "/:userId/tournaments-participation",
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const sql = `
      SELECT tor.name, tor.format_type, tor.visibility, tor.status, tor.start_date, tor.end_date, utr.role
      FROM user_tournament_roles utr
      JOIN tournaments tor ON utr.tournament_id = tor.id
      WHERE utr.user_id = $1;
    `;
      const result = await query(sql, [userId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching user tournaments participation", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

export default router;
