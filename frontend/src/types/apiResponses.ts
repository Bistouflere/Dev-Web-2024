export type Count = {
  count: number;
};

export type User = {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email_address: string;
  image_url: string | null;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
};

export type UserFollower = {
  followed_at: string;
} & User;

export type Game = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Tournament = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  game_id: string;
  format: "single_elimination" | "double_elimination" | "round_robin";
  visibility: "public" | "private";
  status: "upcoming" | "active" | "completed" | "cancelled";
  tags: string[];
  cash_prize: number | null;
  max_team: number;
  max_team_size: number;
  min_team_size: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  users_count: string;
  teams_count: string;
  game_name: string;
  game_description: string | null;
  game_image_url: string | null;
  game_created_at: string;
  game_updated_at: string;
};

export type UserTournament = {
  tournament_role: "participant" | "manager" | "owner";
} & Tournament;

export type TournamentUser = {
  tournament_role: "participant" | "manager" | "owner";
} & User;

export type Team = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  open: boolean;
  created_at: string;
  updated_at: string;
  users_count: string;
};

export type UserTeam = {
  team_role: "participant" | "manager" | "owner";
} & Team;

export type TeamUser = {
  team_role: "participant" | "manager" | "owner";
} & User;

export type Pool = {
  id: string;
  tournament_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Match = {
  id: string;
  tournament_id: string;
  pool_id: string;
  team1_id: string;
  team2_id: string;
  start_time: string | null;
  actual_start_time: string | null;
  end_time: string | null;
  status: "pending" | "active" | "completed" | "cancelled";
  winner_id: string | null;
  created_at: string;
  updated_at: string;
  pool_name: string;
  pool_created_at: string;
  pool_updated_at: string;
};

export type Invitation = {
  team_id: string;
  team_name: string;
  user_id: string;
  user_username: string;
};
