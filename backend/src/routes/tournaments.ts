import { query } from "../db/index";
import express, { Request, Response } from "express";

const router = express.Router();

const sendErrorResponse = (res: Response, error: any) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
};

router.get("/count", async (req: Request, res: Response) => {
  const searchQuery = req.query.query as string;

  try {
    const sql = searchQuery
      ? `SELECT COUNT(*) FROM tournaments WHERE name ILIKE $1;`
      : `SELECT COUNT(*) FROM tournaments;`;
    const params = searchQuery ? [`%${searchQuery}%`] : [];
    const result = await query(sql, params);

    const count = parseInt(result.rows[0].count, 10);
    res.status(200).json({ count });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get("/popular", async (req: Request, res: Response) => {
  const searchQuery = req.query.query as string;

  try {
    const sql = `
      SELECT
        tor.id AS tournament_id,
        tor.name AS tournament_name,
        tor.description AS tournament_description,
        tor.image_url AS tournament_image_url,
        tor.format,
        tor.visibility,
        tor.status,
        tor.start_date,
        tor.end_date,
        tor.cash_prize,
        tor.max_teams,
        tor.max_team_size,
        tor.min_team_size,
        g.id AS game_id,
        g.name AS game_name,
        g.description AS game_description,
        g.image_url AS game_image_url,
        COUNT(tt.team_id) AS number_of_participating_teams
      FROM tournaments tor
      JOIN games g ON tor.game_id = g.id
      LEFT JOIN tournament_teams tt ON tor.id = tt.tournament_id
      GROUP BY tor.id, g.id
      ORDER BY COUNT(tt.team_id) DESC, tor.start_date DESC
      LIMIT 10;
    `;

    const result = await query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get("/:tournamentId", async (req: Request, res: Response) => {
  const { tournamentId } = req.params;

  try {
    const sql = `
      SELECT
        tor.id AS tournament_id,
        tor.name AS tournament_name,
        tor.description AS tournament_description,
        tor.image_url AS tournament_image_url,
        tor.format AS tournament_format,
        tor.visibility AS tournament_visibility,
        tor.status AS tournament_status,
        tor.start_date AS tournament_start_date,
        tor.end_date AS tournament_end_date,
        tor.cash_prize,
        tor.max_teams,
        tor.max_team_size,
        tor.min_team_size,
        g.id AS game_id,
        g.name AS game_name,
        g.description AS game_description,
        g.image_url AS game_image_url,
        json_agg(DISTINCT jsonb_build_object(
          'team_id', t.id,
          'team_name', t.name,
          'team_description', t.description,
          'team_image_url', t.image_url,
          'team_followers', (SELECT json_agg(jsonb_build_object(
            'follower_id', tf.follower_id,
            'follower_username', fu.username,
            'follower_email', fu.email_address,
            'follower_image_url', fu.image_url
          )) FROM team_follows tf JOIN users fu ON tf.follower_id = fu.id WHERE tf.followed_id = t.id),
          'team_members', (SELECT json_agg(jsonb_build_object(
            'user_id', u.id,
            'username', u.username,
            'user_role', tu.role
          )) FROM team_users tu JOIN users u ON tu.user_id = u.id WHERE tu.team_id = t.id)
        )) FILTER (WHERE t.id IS NOT NULL) AS participating_teams,
        json_agg(DISTINCT jsonb_build_object(
          'match_id', m.id,
          'pool_id', m.pool_id,
          'team1_id', m.team1_id,
          'team2_id', m.team2_id,
          'start_time', m.start_time,
          'actual_start_time', m.actual_start_time,
          'end_time', m.end_time,
          'status', m.status,
          'winner_id', m.winner_id
        )) FILTER (WHERE m.id IS NOT NULL) AS matches
      FROM tournaments tor
      JOIN games g ON tor.game_id = g.id
      LEFT JOIN tournament_teams tt ON tor.id = tt.tournament_id
      LEFT JOIN teams t ON tt.team_id = t.id
      LEFT JOIN matches m ON tor.id = m.tournament_id
      WHERE tor.id = $1
      GROUP BY tor.id, g.id;
    `;

    const result = await query(sql, [tournamentId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Tournament with ID ${tournamentId} not found` });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  const { query: searchQuery, page } = req.query;
  const perPage = 10;
  const offset = (Math.abs(parseInt(page as string, 10) - 1) || 0) * perPage;

  try {
    const sqlBase = `
      SELECT
        tor.id AS tournament_id,
        tor.name AS tournament_name,
        tor.description AS tournament_description,
        tor.image_url AS tournament_image_url,
        tor.cash_prize,
        tor.start_date,
        tor.end_date,
        g.id AS game_id,
        g.name AS game_name,
        g.description AS game_description,
        g.image_url AS game_image_url,
        json_agg(DISTINCT jsonb_build_object(
          'team_id', t.id,
          'team_name', t.name,
          'team_description', t.description,
          'team_image_url', t.image_url,
          'members', (SELECT json_agg(jsonb_build_object(
            'user_id', u.id,
            'username', u.username,
            'role', tu.role
          )) FROM team_users tu JOIN users u ON tu.user_id = u.id WHERE tu.team_id = t.id)
        )) FILTER (WHERE t.id IS NOT NULL) AS participating_teams
      FROM tournaments tor
      JOIN games g ON tor.game_id = g.id
      LEFT JOIN tournament_teams tt ON tor.id = tt.tournament_id
      LEFT JOIN teams t ON tt.team_id = t.id
    `;

    const sql = searchQuery
      ? `${sqlBase} WHERE tor.name ILIKE $1 GROUP BY tor.id, g.id LIMIT $2 OFFSET $3;`
      : `${sqlBase} GROUP BY tor.id, g.id LIMIT $1 OFFSET $2;`;
    const params = searchQuery
      ? [`%${searchQuery}%`, perPage, offset]
      : [perPage, offset];

    const result = await query(sql, params);
    res.status(200).json(result.rows);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

export default router;
