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
  tournament_cash_prize: number;
  tournament_image_url: string | null;
  tournament_description: string | null;
};

export type TeamInfo = {
  team_id: number;
  team_name: string;
  tournaments: Tournament[];
  team_image_url: string | null;
  team_description: string | null;
};

export type User = {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  email_address: string;
  user_image_url: string | null;
  teams_info: TeamInfo[];
};

export type APIResult = User[];
