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
        u.clerk_user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.email_address,
        u.image_url,
        u.role AS user_role,
        u.created_at AS user_created_at,
        u.updated_at AS user_updated_at,
        json_agg(DISTINCT jsonb_build_object(
          'team_id', t.id,
          'team_name', t.name,
          'team_description', t.description,
          'team_image_url', t.image_url,
          'team_role', tu.role,
          'team_created_at', t.created_at,
          'team_updated_at', t.updated_at,
          'tournaments', (SELECT json_agg(DISTINCT jsonb_build_object(
            'tournament_id', tor.id,
            'tournament_name', tor.name,
            'tournament_description', tor.description,
            'tournament_image_url', tor.image_url,
            'tournament_format', tor.format,
            'tournament_visibility', tor.visibility,
            'tournament_status', tor.status,
            'tournament_tags', tor.tags,
            'tournament_cash_prize', tor.cash_prize,
            'tournament_max_teams', tor.max_teams,
            'tournament_max_team_size', tor.max_team_size,
            'tournament_min_team_size', tor.min_team_size,
            'tournament_start_date', tor.start_date,
            'tournament_end_date', tor.end_date,
            'game', jsonb_build_object(
              'game_id', g.id,
              'game_name', g.name,
              'game_description', g.description,
              'game_image_url', g.image_url,
              'game_created_at', g.created_at,
              'game_updated_at', g.updated_at
            )
          )) FROM tournament_teams tt JOIN tournaments tor ON tt.tournament_id = tor.id
             JOIN games g ON tor.game_id = g.id WHERE tt.team_id = t.id),
          'team_users', (SELECT json_agg(jsonb_build_object(
            'user_id', tu.user_id,
            'user_username', tu_user.username,
            'user_email', tu_user.email_address,
            'user_image_url', tu_user.image_url,
            'user_role', tu.role,
            'user_created_at', tu_user.created_at,
            'user_updated_at', tu_user.updated_at
          )) FROM team_users tu JOIN users tu_user ON tu.user_id = tu_user.id WHERE tu.team_id = t.id)
        )) FILTER (WHERE t.id IS NOT NULL) AS teams,
        json_agg(DISTINCT jsonb_build_object(
          'tournament_id', tor.id,
          'tournament_name', tor.name,
          'tournament_description', tor.description,
          'tournament_image_url', tor.image_url,
          'tournament_format', tor.format,
          'tournament_visibility', tor.visibility,
          'tournament_status', tor.status,
          'tournament_tags', tor.tags,
          'tournament_cash_prize', tor.cash_prize,
          'tournament_max_teams', tor.max_teams,
          'tournament_max_team_size', tor.max_team_size,
          'tournament_min_team_size', tor.min_team_size,
          'tournament_start_date', tor.start_date,
          'tournament_end_date', tor.end_date,
          'tournament_user_role', tt.role,
          'tournament_created_at', tor.created_at,
          'tournament_updated_at', tor.updated_at,
          'game', jsonb_build_object(
            'game_id', g.id,
            'game_name', g.name,
            'game_description', g.description,
            'game_image_url', g.image_url,
            'game_created_at', g.created_at,
            'game_updated_at', g.updated_at
          ),
          'tournament_teams', (SELECT json_agg(jsonb_build_object(
            'team_id', tt.team_id,
            'team_name', tt_team.name,
            'team_description', tt_team.description,
            'team_image_url', tt_team.image_url,
            'team_created_at', tt_team.created_at,
            'team_updated_at', tt_team.updated_at
          )) FROM tournament_teams tt JOIN teams tt_team ON tt.team_id = tt_team.id WHERE tt.tournament_id = tor.id),
          'tournament_users', (SELECT json_agg(jsonb_build_object(
            'user_id', tt_user.id,
            'user_username', tt_user.username,
            'user_email', tt_user.email_address,
            'user_image_url', tt_user.image_url,
            'user_role', tt.role,
            'user_created_at', tt_user.created_at,
            'user_updated_at', tt_user.updated_at
          )) FROM tournament_users tt JOIN users tt_user ON tt.user_id = tt_user.id WHERE tt.tournament_id = tor.id)
        )) FILTER (WHERE tor.id IS NOT NULL) AS tournaments,
        (SELECT json_agg(jsonb_build_object(
          'follower_id', uf.follower_id,
          'follower_username', uf_user.username,
          'follower_email', uf_user.email_address,
          'follower_image_url', uf_user.image_url,
          'follower_followed_at', uf.followed_at
        )) FROM user_follows uf JOIN users uf_user ON uf.follower_id = uf_user.id WHERE uf.followed_id = u.id) AS user_followers,
        (SELECT json_agg(jsonb_build_object(
          'following_id', uf.followed_id,
          'following_username', fu.username,
          'following_email', fu.email_address,
          'following_image_url', fu.image_url,
          'following_followed_at', uf.followed_at
        )) FROM user_follows uf JOIN users fu ON uf.followed_id = fu.id WHERE uf.follower_id = u.id) AS user_following,
        (SELECT json_agg(jsonb_build_object(
          'team_follower_id', tf.follower_id,
          'team_follower_username', tf_user.username,
          'team_follower_email', tf_user.email_address,
          'team_follower_image_url', tf_user.image_url,
          'team_follower_followed_at', tf.followed_at
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
        u.clerk_user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.email_address,
        u.image_url,
        u.role AS user_role,
        u.created_at AS user_created_at,
        u.updated_at AS user_updated_at,
        json_agg(DISTINCT jsonb_build_object(
            'team_id', t.id,
            'team_name', t.name,
            'team_description', t.description,
            'team_image_url', t.image_url,
            'team_role', tu.role,
            'team_created_at', t.created_at,
            'team_updated_at', t.updated_at,
            'tournaments', (SELECT json_agg(DISTINCT jsonb_build_object(
                'tournament_id', tor.id,
                'tournament_name', tor.name,
                'tournament_description', tor.description,
                'tournament_image_url', tor.image_url,
                'tournament_format', tor.format,
                'tournament_visibility', tor.visibility,
                'tournament_status', tor.status,
                'tournament_tags', tor.tags,
                'tournament_cash_prize', tor.cash_prize,
                'tournament_max_teams', tor.max_teams,
                'tournament_max_team_size', tor.max_team_size,
                'tournament_min_team_size', tor.min_team_size,
                'tournament_start_date', tor.start_date,
                'tournament_end_date', tor.end_date,
                'game', jsonb_build_object(
                    'game_id', g.id,
                    'game_name', g.name,
                    'game_description', g.description,
                    'game_image_url', g.image_url,
                    'game_created_at', g.created_at,
                    'game_updated_at', g.updated_at
                )
            )) FROM tournament_teams tt JOIN tournaments tor ON tt.tournament_id = tor.id
                JOIN games g ON tor.game_id = g.id WHERE tt.team_id = t.id),
            'team_users', (SELECT json_agg(jsonb_build_object(
                'user_id', tu.user_id,
                'user_username', tu_user.username,
                'user_email', tu_user.email_address,
                'user_image_url', tu_user.image_url,
                'user_role', tu.role,
                'user_created_at', tu_user.created_at,
                'user_updated_at', tu_user.updated_at
            )) FROM team_users tu JOIN users tu_user ON tu.user_id = tu_user.id WHERE tu.team_id = t.id)
        )) FILTER (WHERE t.id IS NOT NULL) AS teams,
        json_agg(DISTINCT jsonb_build_object(
            'tournament_id', tor.id,
            'tournament_name', tor.name,
            'tournament_description', tor.description,
            'tournament_image_url', tor.image_url,
            'tournament_format', tor.format,
            'tournament_visibility', tor.visibility,
            'tournament_status', tor.status,
            'tournament_tags', tor.tags,
            'tournament_cash_prize', tor.cash_prize,
            'tournament_max_teams', tor.max_teams,
            'tournament_max_team_size', tor.max_team_size,
            'tournament_min_team_size', tor.min_team_size,
            'tournament_start_date', tor.start_date,
            'tournament_end_date', tor.end_date,
            'tournament_user_role', tt.role,
            'tournament_created_at', tor.created_at,
            'tournament_updated_at', tor.updated_at,
            'game', jsonb_build_object(
                'game_id', g.id,
                'game_name', g.name,
                'game_description', g.description,
                'game_image_url', g.image_url,
                'game_created_at', g.created_at,
                'game_updated_at', g.updated_at
            ),
            'tournament_teams', (SELECT json_agg(jsonb_build_object(
                'team_id', tt.team_id,
                'team_name', tt_team.name,
                'team_description', tt_team.description,
                'team_image_url', tt_team.image_url,
                'team_created_at', tt_team.created_at,
                'team_updated_at', tt_team.updated_at
            )) FROM tournament_teams tt JOIN teams tt_team ON tt.team_id = tt_team.id WHERE tt.tournament_id = tor.id),
            'tournament_users', (SELECT json_agg(jsonb_build_object(
                'user_id', tt_user.id,
                'user_username', tt_user.username,
                'user_email', tt_user.email_address,
                'user_image_url', tt_user.image_url,
                'user_role', tt.role,
                'user_created_at', tt_user.created_at,
                'user_updated_at', tt_user.updated_at
            )) FROM tournament_users tt JOIN users tt_user ON tt.user_id = tt_user.id WHERE tt.tournament_id = tor.id)
        )) FILTER (WHERE tor.id IS NOT NULL) AS tournaments,
        (SELECT json_agg(jsonb_build_object(
            'follower_id', uf.follower_id,
            'follower_username', uf_user.username,
            'follower_email', uf_user.email_address,
            'follower_image_url', uf_user.image_url,
            'follower_followed_at', uf.followed_at
        )) FROM user_follows uf JOIN users uf_user ON uf.follower_id = uf_user.id WHERE uf.followed_id = u.id) AS user_followers,
        (SELECT json_agg(jsonb_build_object(
            'following_id', uf.followed_id,
            'following_username', fu.username,
            'following_email', fu.email_address,
            'following_image_url', fu.image_url,
            'following_followed_at', uf.followed_at
        )) FROM user_follows uf JOIN users fu ON uf.followed_id = fu.id WHERE uf.follower_id = u.id) AS user_following,
        (SELECT json_agg(jsonb_build_object(
            'team_follower_id', tf.follower_id,
            'team_follower_username', tf_user.username,
            'team_follower_email', tf_user.email_address,
            'team_follower_image_url', tf_user.image_url,
            'team_follower_followed_at', tf.followed_at
        )) FROM team_follows tf JOIN users tf_user ON tf.follower_id = tf_user.id INNER JOIN team_users tu ON tf.followed_id = tu.team_id WHERE tu.user_id = u.id) AS team_followers
      FROM users u
      LEFT JOIN team_users tu ON tu.user_id = u.id
      LEFT JOIN teams t ON t.id = tu.team_id
      LEFT JOIN tournament_users tt ON tt.user_id = u.id
      LEFT JOIN tournaments tor ON tor.id = tt.tournament_id
      LEFT JOIN games g ON tor.game_id = g.id
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
