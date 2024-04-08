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
      ? `SELECT COUNT(*) FROM users WHERE username ILIKE $1;`
      : `SELECT COUNT(*) FROM users;`;
    const params = searchQuery ? [`%${searchQuery}%`] : [];
    const result = await query(sql, params);

    const count = parseInt(result.rows[0].count, 10);
    res.status(200).json({ count });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const sql = `
      SELECT
        u.id AS user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.email_address,
        u.image_url,
        u.role AS user_role,
        json_agg(DISTINCT jsonb_build_object(
          'team_id', t.id,
          'team_name', t.name,
          'team_description', t.description,
          'team_image_url', t.image_url,
          'team_role', tu.role
        )) FILTER (WHERE t.id IS NOT NULL) AS teams,
        json_agg(DISTINCT jsonb_build_object(
          'tournament_id', tor.id,
          'tournament_name', tor.name,
          'tournament_description', tor.description,
          'tournament_image_url', tor.image_url,
          'tournament_format', tor.format,
          'tournament_visibility', tor.visibility,
          'tournament_status', tor.status,
          'tournament_cash_prize', tor.cash_prize,
          'tournament_start_date', tor.start_date,
          'tournament_end_date', tor.end_date,
          'tournament_user_role', tt.role,
          'game', jsonb_build_object(
            'game_id', g.id,
            'game_name', g.name,
            'game_description', g.description,
            'game_image_url', g.image_url
          )
        )) FILTER (WHERE tor.id IS NOT NULL) AS tournaments,
        (SELECT json_agg(jsonb_build_object(
          'follower_id', uf.follower_id,
          'follower_username', uf_user.username,
          'follower_email', uf_user.email_address,
          'follower_image_url', uf_user.image_url
        )) FROM user_follows uf JOIN users uf_user ON uf.follower_id = uf_user.id WHERE uf.followed_id = u.id) AS user_followers,
        (SELECT json_agg(jsonb_build_object(
          'following_id', uf.followed_id,
          'following_username', fu.username,
          'following_email', fu.email_address,
          'following_image_url', fu.image_url
        )) FROM user_follows uf JOIN users fu ON uf.followed_id = fu.id WHERE uf.follower_id = u.id) AS user_following,
        (SELECT json_agg(jsonb_build_object(
          'team_follower_id', tf.follower_id,
          'team_follower_username', tf_user.username,
          'team_follower_email', tf_user.email_address,
          'team_follower_image_url', tf_user.image_url
        )) FROM team_follows tf JOIN users tf_user ON tf.follower_id = tf_user.id INNER JOIN team_users tu ON tf.followed_id = tu.team_id WHERE tu.user_id = u.id) AS team_followers
      FROM users u
      LEFT JOIN team_users tu ON tu.user_id = u.id
      LEFT JOIN teams t ON t.id = tu.team_id
      LEFT JOIN tournament_users tt ON tt.user_id = u.id
      LEFT JOIN tournaments tor ON tor.id = tt.tournament_id
      LEFT JOIN games g ON tor.game_id = g.id
      WHERE u.id = $1
      GROUP BY u.id;
    `;

    const result = await query(sql, [userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  const searchQuery = req.query.query as string;
  const page = parseInt(req.query.page as string, 10) || 1;
  const perPage = 10;
  const offset = (page - 1) * perPage;

  try {
    const sqlBase = `
      SELECT
        u.id AS user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.email_address,
        u.image_url AS user_image_url,
        json_agg(DISTINCT jsonb_build_object(
          'team_id', t.id,
          'team_name', t.name,
          'team_description', t.description,
          'team_image_url', t.image_url,
          'tournaments', (SELECT json_agg(DISTINCT jsonb_build_object(
            'tournament_id', tor.id,
            'tournament_name', tor.name,
            'tournament_description', tor.description,
            'tournament_image_url', tor.image_url,
            'tournament_cash_prize', tor.cash_prize,
            'game', jsonb_build_object(
              'game_id', g.id,
              'game_name', g.name,
              'game_description', g.description,
              'game_image_url', g.image_url
            )
          )) FROM tournament_teams tt JOIN tournaments tor ON tt.tournament_id = tor.id
             JOIN games g ON tor.game_id = g.id WHERE tt.team_id = t.id)
        )) FILTER (WHERE t.id IS NOT NULL) AS teams_info
      FROM users u
      LEFT JOIN team_users tu ON u.id = tu.user_id
      LEFT JOIN teams t ON tu.team_id = t.id
    `;

    const sql = searchQuery
      ? `${sqlBase} WHERE u.username ILIKE $1 OR u.first_name ILIKE $1 OR u.last_name ILIKE $1 GROUP BY u.id LIMIT $2 OFFSET $3;`
      : `${sqlBase} GROUP BY u.id LIMIT $1 OFFSET $2;`;
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
