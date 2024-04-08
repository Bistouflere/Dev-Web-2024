export type User = {
  user_id: number;
  username: string;
  user_role: string;
};

export type Follower = {
  follower_id: number;
  follower_email: string;
  follower_username: string;
  follower_image_url: string | null;
};

export type Team = {
  team_id: number;
  team_name: string;
  team_members: User[];
  team_followers: Follower[];
  team_image_url: string | null;
  team_description: string | null;
};

export type Match = {
  status: string;
  pool_id: number;
  end_time: string | null;
  match_id: number;
  team1_id: number;
  team2_id: number;
  winner_id: number | null;
  start_time: string | null;
  actual_start_time: string | null;
};

export type Game = {
  game_id: string;
  game_name: string;
  game_description: string | null;
  game_image_url: string | null;
};

export type Tournament = {
  tournament_id: string;
  tournament_name: string;
  tournament_description: string | null;
  tournament_image_url: string | null;
  tournament_format: string;
  tournament_visibility: string;
  tournament_status: string;
  tournament_start_date: string;
  tournament_end_date: string;
  cash_prize: number | null;
  max_teams: number;
  max_team_size: number;
  min_team_size: number;
  game: Game;
  participating_teams: Team[];
  matches: Match[];
};
