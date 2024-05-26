import {
  Group,
  Match,
  MatchGame,
  Participant,
  Round,
  Stage,
} from "brackets-model";

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

export type TournamentData = {
  group: Group[];
  match: Match[];
  round: Round[];
  stage: Stage[];
  match_game: MatchGame[];
  participant: Participant[];
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
  data: TournamentData;
  cash_prize: number | null;
  max_teams: number;
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
  team_id: string;
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

export type Invitation = {
  team_id: string;
  team_name: string;
  user_id: string;
  user_username: string;
};
