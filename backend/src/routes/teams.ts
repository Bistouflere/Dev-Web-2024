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
      ? `SELECT COUNT(*) FROM teams WHERE name ILIKE $1;`
      : `SELECT COUNT(*) FROM teams;`;
    const params = searchQuery ? [`%${searchQuery}%`] : [];
    const result = await query(sql, params);

    const count = parseInt(result.rows[0].count, 10);
    res.status(200).json({ count });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get("/:teamId", async (req: Request, res: Response) => {
  const { teamId } = req.params;

  try {
    const sql = `
      SELECT
        t.id AS team_id,
        t.name AS team_name,
        t.description AS team_description,
        t.image_url AS team_image_url,
        json_agg(DISTINCT jsonb_build_object(
          'user_id', u.id,
          'username', u.username,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'email_address', u.email_address,
          'image_url', u.image_url,
          'role', tu.role
        )) FILTER (WHERE u.id IS NOT NULL) AS team_members,
        json_agg(DISTINCT jsonb_build_object(
          'tournament_id', tor.id,
          'tournament_name', tor.name,
          'tournament_description', tor.description,
          'tournament_image_url', tor.image_url,
          'tournament_format', tor.format,
          'tournament_visibility', tor.visibility,
          'tournament_cash_prize', tor.cash_prize,
          'tournament_status', tor.status,
          'tournament_start_date', tor.start_date,
          'tournament_end_date', tor.end_date,
          'game', jsonb_build_object(
            'game_id', g.id,
            'game_name', g.name,
            'game_description', g.description,
            'game_image_url', g.image_url
          )
        )) FILTER (WHERE tor.id IS NOT NULL) AS participating_tournaments,
        json_agg(DISTINCT jsonb_build_object(
          'follower_id', uf.follower_id,
          'follower_username', fu.username,
          'follower_email', fu.email_address,
          'follower_image_url', fu.image_url
        )) FILTER (WHERE uf.follower_id IS NOT NULL) AS team_followers
      FROM teams t
      LEFT JOIN team_users tu ON t.id = tu.team_id
      LEFT JOIN users u ON tu.user_id = u.id
      LEFT JOIN tournament_teams tt ON t.id = tt.team_id
      LEFT JOIN tournaments tor ON tt.tournament_id = tor.id
      LEFT JOIN games g ON tor.game_id = g.id
      LEFT JOIN team_follows uf ON t.id = uf.followed_id
      LEFT JOIN users fu ON uf.follower_id = fu.id
      WHERE t.id = $1
      GROUP BY t.id;
    `;

    const result = await query(sql, [teamId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Team not found" });
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
        tm.id AS team_id,
        tm.name AS team_name,
        tm.description AS team_description,
        tm.image_url AS team_image_url,
        json_agg(DISTINCT jsonb_build_object(
          'tournament_id', tor.id,
          'tournament_name', tor.name,
          'tournament_description', tor.description,
          'tournament_image_url', tor.image_url,
          'tournament_cash_prize', tor.cash_prize,
          'tournament_start_date', tor.start_date,
          'tournament_end_date', tor.end_date,
          'game', jsonb_build_object(
            'game_id', g.id,
            'game_name', g.name,
            'game_description', g.description,
            'game_image_url', g.image_url
          )
        )) FILTER (WHERE tor.id IS NOT NULL) AS tournaments_info
      FROM teams tm
      LEFT JOIN tournament_teams tt ON tm.id = tt.team_id
      LEFT JOIN tournaments tor ON tt.tournament_id = tor.id
      LEFT JOIN games g ON tor.game_id = g.id
    `;

    const sql = searchQuery
      ? `
        ${sqlBase}
        WHERE tm.name ILIKE $1
        GROUP BY tm.id
        ORDER BY tm.id
        LIMIT $2 OFFSET $3;
      `
      : `
        ${sqlBase}
        GROUP BY tm.id
        ORDER BY tm.id
        LIMIT $1 OFFSET $2;
      `;

    const params = searchQuery
      ? [`%${searchQuery}%`, perPage, offset]
      : [perPage, offset];
    const result = await query(sql, params);

    return res.status(200).json(result.rows);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

export default router;
