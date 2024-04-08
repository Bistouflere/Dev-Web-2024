export type Game = {
  game_id: number;
  game_name: string;
  game_image_url: string | null;
  game_description: string | null;
};

export type Tournament = {
  game: Game;
  tournament_id: number;
  tournament_name: string;
  tournament_format: string;
  tournament_status: string;
  tournament_end_date: string;
  tournament_cash_prize: number;
  tournament_image_url: string | null;
  tournament_user_role: string;
  tournament_start_date: string;
  tournament_visibility: string;
  tournament_description: string | null;
};

export type Team = {
  team_id: number;
  team_name: string;
  team_role: string;
  team_image_url: string | null;
  team_description: string | null;
};

export type Follower = {
  follower_id: number;
  follower_email: string;
  follower_username: string;
  follower_image_url: string | null;
};

export type Following = {
  following_id: number;
  following_email: string;
  following_username: string;
  following_image_url: string | null;
};

export type TeamFollower = {
  team_follower_id: number;
  team_follower_email: string;
  team_follower_username: string;
  team_follower_image_url: string | null;
};

export type UserProfile = {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  email_address: string;
  image_url: string | null;
  user_role: string;
  teams: Team[];
  tournaments: Tournament[];
  user_followers: Follower[];
  user_following: Following[];
  team_followers: TeamFollower[];
};
