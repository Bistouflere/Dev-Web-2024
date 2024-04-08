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
  format: string;
  visibility: string;
  status: string;
  start_date: string;
  end_date: string;
  cash_prize: number | null;
  max_teams: number;
  max_team_size: number;
  min_team_size: number;
  game: Game;
  number_of_participating_teams: string;
};

export type APIResult = Tournament[];
