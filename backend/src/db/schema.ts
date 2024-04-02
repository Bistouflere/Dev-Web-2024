import { relations } from "drizzle-orm";
import {
  bigint,
  bigserial,
  boolean,
  char,
  date,
  decimal,
  doublePrecision,
  integer,
  interval,
  json,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  smallint,
  text,
  time,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerk_id: varchar("clerk_id").unique().notNull(),
  first_name: varchar("first_name"),
  last_name: varchar("last_name"),
  username: varchar("username").unique().notNull(),
  email_address: varchar("email_address").unique().notNull(),
  image_url: text("image_url"),
  team_id: integer("team_id").references(() => teams.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  last_sign_in_at: timestamp("last_sign_in_at"),
});

// User Relations
export const userRelations = relations(users, ({ one, many }) => ({
  followers: many(followers, { relationName: "user_followers" }),
  following: many(followers, { relationName: "user_follows" }),
  team: one(teams, {
    fields: [users.team_id],
    references: [teams.id],
  }),
}));

// Followers Table
export const followers = pgTable(
  "followers",
  {
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id),
    follows_user_id: integer("follows_user_id")
      .notNull()
      .references(() => users.id),
  },
  (followers) => ({
    pk: primaryKey({ columns: [followers.user_id, followers.follows_user_id] }),
  }),
);

// Followers Relations
export const followersRelations = relations(followers, ({ one }) => ({
  user: one(users, {
    fields: [followers.user_id],
    references: [users.id],
    relationName: "user_followers",
  }),
  follows_user: one(users, {
    fields: [followers.follows_user_id],
    references: [users.id],
    relationName: "user_follows",
  }),
}));

// Teams Table
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique().notNull(),
  description: text("description"),
  image_url: text("image_url"),
  tournament_id: integer("tournament_id").references(() => tournaments.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Team Relations
export const teamRelations = relations(teams, ({ one, many }) => ({
  members: many(users),
  tournament: one(tournaments, {
    fields: [teams.tournament_id],
    references: [tournaments.id],
  }),
  admins: many(teamAdmins),
}));

// TeamAdmins Table
export const teamAdmins = pgTable(
  "team_admins",
  {
    team_id: integer("team_id")
      .notNull()
      .references(() => teams.id),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (teamAdmins) => ({
    pk: primaryKey({ columns: [teamAdmins.team_id, teamAdmins.user_id] }),
  }),
);

// TeamAdmins Relations
export const teamAdminsRelations = relations(teamAdmins, ({ one }) => ({
  team: one(teams, {
    fields: [teamAdmins.team_id],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamAdmins.user_id],
    references: [users.id],
  }),
}));

// Tournaments Table
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique().notNull(),
  description: text("description"),
  image_url: text("image_url"),
  game_id: integer("game_id")
    .references(() => games.id)
    .notNull(),
  format_id: integer("format_id")
    .references(() => formats.id)
    .notNull(),
  public: boolean("public").default(true),
  slots: integer("slots").default(16),
  cash_prize: decimal("cash_prize", { precision: 10, scale: 2 }),
  team_size: integer("team_size").default(1),
  loser_bracket: boolean("loser_bracket").default(false),
  start_date: timestamp("start_date"),
  end_date: timestamp("end_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Tournament Relations
export const tournamentRelations = relations(tournaments, ({ one, many }) => ({
  teams: many(teams),
  game: one(games, {
    fields: [tournaments.game_id],
    references: [games.id],
  }),
  format: one(formats, {
    fields: [tournaments.format_id],
    references: [formats.id],
  }),
  admins: many(tournamentAdmins),
}));

// TournamentAdmins Table
export const tournamentAdmins = pgTable(
  "tournament_admins",
  {
    tournament_id: integer("tournament_id")
      .notNull()
      .references(() => tournaments.id),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (tournamentAdmins) => ({
    pk: primaryKey({
      columns: [tournamentAdmins.tournament_id, tournamentAdmins.user_id],
    }),
  }),
);

// TournamentAdmins Relations
export const tournamentAdminsRelations = relations(
  tournamentAdmins,
  ({ one }) => ({
    tournament: one(tournaments, {
      fields: [tournamentAdmins.tournament_id],
      references: [tournaments.id],
    }),
    user: one(users, {
      fields: [tournamentAdmins.user_id],
      references: [users.id],
    }),
  }),
);

// Games Table
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique().notNull(),
  description: text("description"),
  image_url: text("image_url"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Game Relations
export const gameRelations = relations(games, ({ many }) => ({
  tournaments: many(tournaments),
}));

// Formats Table
export const formats = pgTable("formats", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique().notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Format Relations
export const formatRelations = relations(formats, ({ many }) => ({
  tournaments: many(tournaments),
}));
