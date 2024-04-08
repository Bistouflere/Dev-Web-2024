export type TeamMember = {
  role: string;
  user_id: number;
  username: string;
  image_url: string | null;
  last_name: string;
  first_name: string;
  email_address: string;
};

export type Game = {
  game_id: number;
  game_name: string;
  game_image_url: string | null;
  game_description: string | null;
};

export type ParticipatingTournament = {
  game: Game;
  tournament_id: number;
  tournament_name: string;
  tournament_format: string;
  tournament_status: string;
  tournament_end_date: string;
  tournament_cash_prize: number;
  tournament_start_date: string;
  tournament_image_url: string | null;
  tournament_visibility: string;
  tournament_description: string | null;
};

export type TeamFollower = {
  follower_id: number;
  follower_email: string;
  follower_username: string;
  follower_image_url: string | null;
};

export type TeamDetails = {
  team_id: string;
  team_name: string;
  team_description: string | null;
  team_image_url: string | null;
  team_members: TeamMember[];
  participating_tournaments: ParticipatingTournament[];
  team_followers: TeamFollower[];
};
