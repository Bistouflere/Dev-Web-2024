export type User = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email_address: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
  last_sign_in_at: Date;
};

export type Tournament = {
  id: string;
  game_id: number;
  name: string;
  cash_prize?: number;
  format_id: string;
  image_url?: string;
  description?: string;
  public?: boolean;
  slots?: number;
  team_size?: number;
  start_date?: Date;
  end_date?: Date;
  loser_bracket?: boolean;
  created_at?: Date;
  updated_at?: Date;
};
