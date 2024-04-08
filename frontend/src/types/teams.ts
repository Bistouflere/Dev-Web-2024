export type Game = {
  game_id: number;
  game_name: string;
  game_image_url: string | null;
  game_description: string | null;
};

export type TournamentInfo = {
  game: Game;
  tournament_id: number;
  tournament_name: string;
  tournament_end_date: string;
  tournament_cash_prize: number;
  tournament_start_date: string;
  tournament_image_url: string | null;
  tournament_description: string | null;
};

export type Team = {
  team_id: string;
  team_name: string;
  team_description: string | null;
  team_image_url: string | null;
  tournaments_info: TournamentInfo[];
};

export type APIResult = Team[];
