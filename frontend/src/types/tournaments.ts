export type Member = {
  role: string;
  user_id: number;
  username: string;
};

export type ParticipatingTeam = {
  members: Member[];
  team_id: number;
  team_name: string;
  team_image_url: string | null;
  team_description: string | null;
};

export type Tournament = {
  tournament_id: string;
  tournament_name: string;
  cash_prize: number;
  tournament_description: string | null;
  tournament_image_url: string | null;
  start_date: string;
  end_date: string;
  game_id: string;
  game_name: string;
  game_description: string | null;
  game_image_url: string | null;
  participating_teams: ParticipatingTeam[];
};

export type APIResult = Tournament[];
