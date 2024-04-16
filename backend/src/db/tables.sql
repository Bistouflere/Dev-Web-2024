CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE team_role AS ENUM ('owner', 'manager', 'participant');
CREATE TYPE tournament_type AS ENUM ('single_elimination', 'double_elimination', 'round_robin');
-- single_elimination : each teams eliminated after losing a match; number of teams must be a power of 2
-- double_elimination : each team has to lose twice to be eliminated; requires a loser's bracket
-- round_robin : each team plays every other team; team with most wins is the winner
CREATE TYPE tournament_visibility AS ENUM ('public', 'private');
CREATE TYPE tournament_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
CREATE TYPE match_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');

CREATE TABLE users (
  id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email_address TEXT UNIQUE NOT NULL,
  image_url TEXT DEFAULT 'https://madbracket.xyz/images/default',
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE users_follows (
    follower_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    followed_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (follower_id, followed_id),
    CHECK (follower_id != followed_id)
);

CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT DEFAULT 'https://madbracket.xyz/images/default',
    open BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE teams_users (
    team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    role team_role NOT NULL DEFAULT 'participant',
    PRIMARY KEY (user_id, team_id)
);

CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT DEFAULT 'https://madbracket.xyz/images/default',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE tournaments (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT DEFAULT 'https://madbracket.xyz/images/default',
    game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    format tournament_type NOT NULL DEFAULT 'single_elimination',
    visibility tournament_visibility NOT NULL DEFAULT 'public',
    status tournament_status NOT NULL DEFAULT 'upcoming',
    tags TEXT[],
    cash_prize DECIMAL(16, 2),
    max_teams INT NOT NULL DEFAULT 16, -- 16 teams
    max_team_size INT NOT NULL DEFAULT 7, -- 5 players + 2 subs for a 5v5 game
    min_team_size INT NOT NULL DEFAULT 5, -- 5 players for a 5v5 game
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE tournaments_teams (
    tournament_id BIGINT REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
    PRIMARY KEY (tournament_id, team_id)
);

CREATE TABLE tournaments_users (
    tournament_id BIGINT REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
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

INSERT INTO users (id, username, image_url, email_address) VALUES 
('user_2ewoAgaj7Zk1uQhFtdO9r6Prv70', 'owhestia', 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZGlzY29yZC9pbWdfMmV3b0FqSlZtczBkbHJPU1Z4eFMyVXhpMFJnIn0', 'simon.fontaine@gmail.com'), 
('user_2f85ACEznYo6IoifDjSLRe9DQUO', 'eechho', 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZGlzY29yZC9pbWdfMmY4NUFCZ0lPSmhZc2VOYVlON1ZnOFpxNE9PIn0', 'bastien.patureau@gmail.com'),
('user_2f04zDgK6au6PrWu6K9Wo07LJa1', 'guignome54', 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZGlzY29yZC9pbWdfMmYwNHpHQ253NWxNWDZXZmdjT1NzdWgzb0lSIn0', 'guillaume.ladriere@gmail.com'),
('user_2f6fkmvmQOAV86nVDpB0v9TM2a4', 'quentiinlvq', 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZGlzY29yZC9pbWdfMmY2ZmtwTHg4dDJBaEVYeTZuUW02OU1INmt3In0', 'quentiinlvq@gmail.com'),
('user_2f7x7T88Sbm8DMKoR3aTHIIA4xB', 'bistouflere', 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZGlzY29yZC9pbWdfMmY3eDdab3lqUE1Vb042c2ljakNoUjdiZHZQIn0', 'bistouflere@gmail.com');

INSERT INTO games (name, description, image_url) VALUES
('League of Legends', 'League of Legends, commonly referred to as League, is a 2009 multiplayer online battle arena video game.', 'https://madbracket.xyz/images/lol'),
('Apex Legends', 'Apex Legends is a free-to-play battle royale-hero shooter game.', 'https://madbracket.xyz/images/apexlegends'),
('Counter-Strike: Global Offensive', 'Global Offensive is a 2012 multiplayer tactical first-person shooter.', 'https://madbracket.xyz/images/csgo'),
('Overwatch 2', 'Overwatch 2 is a 2022 first-person shooter game developed and published by Blizzard Entertainment.', 'https://madbracket.xyz/images/overwatch2'),
('Rocket League', 'Rocket League is a vehicular soccer video game.', 'https://madbracket.xyz/images/rocketleague');

INSERT INTO teams (name, description, image_url) VALUES
('4Esport Overwatch', 'Équipe e-sport sur Overwatch 2', 'https://madbracket.xyz/images/4esport'),
('Les Fennecs', 'C''est un petit renard des sables', 'https://madbracket.xyz/images/fennec');

INSERT INTO teams_users (team_id, user_id) VALUES
(1, 'user_2ewoAgaj7Zk1uQhFtdO9r6Prv70'),
(1, 'user_2f04zDgK6au6PrWu6K9Wo07LJa1'),
(2, 'user_2f85ACEznYo6IoifDjSLRe9DQUO');

INSERT INTO tournaments (name, description, image_url, game_id, cash_prize, max_team_size, min_team_size) VALUES
('League of Legends World Championship', 'The League of Legends World Championship is the annual professional League of Legends world championship tournament hosted by Riot Games.', 'https://madbracket.xyz/images/lolworlds', 1, 1000000.00, 5, 5),
('Apex Legends Global Series', 'The Apex Legends Global Series is the official tournament circuit by EA.', 'https://madbracket.xyz/images/globalseries', 2, 1000.00, 3, 3),
('ESL One', '', 'https://madbracket.xyz/images/eslone', 3, 30000.00, 7, 5),
('All For One Overwatch', 'The French Overwatch All For One Championship !', 'https://madbracket.xyz/images/allforone', 4, 500.00, 7, 5),
('Rocket League Championship Series', 'The Rocket League Championship Series is the official tournament circuit by Psyonix.', 'https://madbracket.xyz/images/rlcs', 5, 1000.00, 7, 5);

INSERT INTO tournaments_teams (tournament_id, team_id) VALUES
(4, 1),
(2, 2);

INSERT INTO tournaments_users (tournament_id, user_id) VALUES
(4, 'user_2ewoAgaj7Zk1uQhFtdO9r6Prv70'),
(4, 'user_2f04zDgK6au6PrWu6K9Wo07LJa1'),
(2, 'user_2f85ACEznYo6IoifDjSLRe9DQUO');
