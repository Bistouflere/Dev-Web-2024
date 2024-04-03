export type User = {
  id: number;
  clerk_id: string;
  first_name: string;
  last_name: string;
  username: string;
  email_address: string;
  image_url?: string;
  team_id?: number;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string;
};

// export type Follower = {
//   user_id: number;
//   follows_user_id: number;
// };

export type Team = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  tournament_id?: number;
  created_at: string;
  updated_at: string;
};

export type TeamAdmin = {
  team_id: number;
  user_id: number;
};

export type Tournament = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  game_id: number;
  format_id: number;
  public?: boolean;
  slots?: number;
  cash_prize?: number;
  team_size?: number;
  looser_bracket?: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
};

export type TournamentAdmin = {
  tournament_id: number;
  user_id: number;
};

export type Game = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
};

export type Format = {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
};

export type UsersAPIResponse = {
  users: User;
  // followers?: Follower;
  teams?: Team;
  tournaments?: Tournament;
  games?: Game;
};

export type TeamsAPIResponse = {
  teams: Team;
  members?: User;
  tournament?: Tournament;
  admins?: TeamAdmin;
};

export type TournamentsAPIResponse = {
  tournaments: Tournament;
  teams?: Team;
  games?: Game;
  format?: Format;
  admins?: TournamentAdmin;
};
