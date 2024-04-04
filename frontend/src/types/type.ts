export interface User {
  id: number;
  clerk_id: string;
  first_name: string | null;
  last_name: string | null;
  username: string;
  email_address: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
}

export interface FullUser {
  user: User;
  followers: User[];
  following: User[];
  ownedTeam: Team;
  teams: Team[];
  tournament: Tournament;
  past_tournaments: Tournament[];
}

export interface UserFollow {
  follower_id: number;
  followed_id: number;
}

export interface Game {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Format {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tournament {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  game_id: number;
  format_id: number;
  public: boolean;
  slots: number;
  cash_prize: number;
  team_size: number;
  looser_bracket: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TournamentAdmin {
  tournament_id: number;
  user_id: number;
  admin: boolean;
}

export interface Team {
  id: number;
  owner_id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  current_tournament_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface TeamTournament {
  team_id: number;
  tournament_id: number;
}

export interface TeamMember {
  team_id: number;
  user_id: number;
  admin: boolean;
}

export interface Match {
  id: number;
  tournament_id: number;
  team1_id: number;
  team2_id: number;
  match_date: string | null;
  match_location: string | null;
  winner_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface MatchScore {
  match_id: number;
  team_id: number;
  score: number;
}
