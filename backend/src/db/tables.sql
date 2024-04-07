CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE team_role AS ENUM ('owner', 'manager', 'participant');
CREATE TYPE tournament_type AS ENUM ('single_elimination', 'double_elimination', 'round_robin', 'swiss');
-- single_elimination : each teams eliminated after losing a match; number of teams must be a power of 2
-- double_elimination : each team has to lose twice to be eliminated; requires a loser's bracket
-- round_robin : each team plays every other team; team with most wins is the winner
-- swiss : each team plays a fixed number of matches; teams are paired based on their performance
CREATE TYPE tournament_visibility AS ENUM ('public', 'private');
CREATE TYPE tournament_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
CREATE TYPE match_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email_address TEXT UNIQUE NOT NULL,
  image_url TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE user_follows (
    follower_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    followed_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (follower_id, followed_id),
    CHECK (follower_id != followed_id)
);

CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE team_users (
    team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role team_role NOT NULL DEFAULT 'participant',
    PRIMARY KEY (user_id, team_id)
);

CREATE TABLE team_follows (
    follower_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    followed_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (follower_id, followed_id)
);

CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE tournaments (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
    format tournament_type NOT NULL DEFAULT 'single_elimination',
    visibility tournament_visibility NOT NULL DEFAULT 'public',
    status tournament_status NOT NULL DEFAULT 'upcoming',
    tags TEXT[],
    max_teams INT NOT NULL DEFAULT 16, -- 16 teams
    max_team_size INT NOT NULL DEFAULT 7, -- 5 players + 2 subs for a 5v5 game
    min_team_size INT NOT NULL DEFAULT 5, -- 5 players for a 5v5 game
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE tournament_teams (
    tournament_id BIGINT REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
    PRIMARY KEY (tournament_id, team_id)
);

CREATE TABLE tournament_users (
    tournament_id BIGINT REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role team_role NOT NULL DEFAULT 'participant',
    PRIMARY KEY (tournament_id, user_id)
);

CREATE TABLE pools (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT REFERENCES tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE matches (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT REFERENCES tournaments(id) ON DELETE CASCADE,
    pool_id BIGINT REFERENCES pools(id) ON DELETE CASCADE,
    team1_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
    team2_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
    start_time TIMESTAMP,
    actual_start_time TIMESTAMP,
    end_time TIMESTAMP,
    status match_status NOT NULL DEFAULT 'upcoming',
    winner_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE match_scores (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT REFERENCES matches(id) ON DELETE CASCADE,
    team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
    reporting_team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
    score_team1 INT NOT NULL DEFAULT 0,
    score_team2 INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER updated_at_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER updated_at_teams BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER updated_at_games BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER updated_at_tournaments BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER updated_at_pools BEFORE UPDATE ON pools FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER updated_at_matches BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER updated_at_match_scores BEFORE UPDATE ON match_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at();

INSERT INTO users (clerk_user_id, username, first_name, last_name, email_address) VALUES 
('1', 'owhestia', 'simon', 'fontaine', 'simon.fontaine@gmail.com'), 
('2', 'bistouflere', 'timothy', 'truong', 'timothy.truong@gmail.com'),
('3', 'echoo', 'bastien', 'patureau', 'bastien.patureau@gmail.com'),
('4', 'guignaume', 'guillaume', 'ladriere', 'guillaume.ladriere@gmail.com');

INSERT INTO games (name) VALUES
('League of Legends'),
('Valorant'),
('Counter-Strike: Global Offensive'),
('Overwatch'),
('Rainbow Six Siege'),
('Rocket League');

INSERT INTO teams (name) VALUES
('Team A'),
('Team B');

INSERT INTO team_users (team_id, user_id) VALUES
(1, 1),
(2, 2),
(1, 3),
(2, 4);

INSERT INTO tournaments (name, game_id, start_date, end_date) VALUES
('Tournament A', 1, '2024-12-01', '2024-12-31'),
('Tournament B', 2, '2024-12-01', '2024-12-31');

INSERT INTO tournament_teams (tournament_id, team_id) VALUES
(1, 1),
(2, 2);

INSERT INTO tournament_users (tournament_id, user_id) VALUES
(1, 1),
(2, 2);
