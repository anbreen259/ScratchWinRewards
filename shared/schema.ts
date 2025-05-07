import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  lastLogin: timestamp("last_login"),
  gamesPlayed: integer("games_played").default(0),
  prizesWon: integer("prizes_won").default(0)
});

export const prizes = pgTable("prizes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // Physical, Digital, Discount
  value: text("value").notNull(),
  icon: text("icon").notNull(),
  stock: integer("stock"),
  isActive: boolean("is_active").default(true),
  probability: integer("probability").notNull().default(0), // 0-100
});

export const gameSettings = pgTable("game_settings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Scratch & Win"),
  instructionText: text("instruction_text").default("Scratch the card below to reveal your prize"),
  cardBackground: text("card_background").default("default.png"),
  primaryColor: text("primary_color").default("#1a365d"),
  secondaryColor: text("secondary_color").default("#ffc107"),
  enableGame: boolean("enable_game").default(true),
  showPrizeGallery: boolean("show_prize_gallery").default(true),
  enableWinAnimations: boolean("enable_win_animations").default(true),
  requireUserRegistration: boolean("require_user_registration").default(false),
  enableSocialSharing: boolean("enable_social_sharing").default(false),
  playsPerUser: text("plays_per_user").default("3 per day"),
  countdownTimer: integer("countdown_timer").default(24),
  timerType: text("timer_type").default("Until next play"),
  gameDuration: text("game_duration").default("1 month"),
  globalWinRate: integer("global_win_rate").default(25), // 0-100
  adminNotifications: json("admin_notifications").default({
    emailOnHighValuePrize: true,
    dailySummaryReport: true,
    lowStockAlerts: false,
  }),
  userNotifications: json("user_notifications").default({
    prizeWinConfirmation: true,
    reminderToPlay: true,
    marketingCommunications: false,
  }),
});

export const gameStats = pgTable("game_stats", {
  id: serial("id").primaryKey(),
  totalPlayers: integer("total_players").default(0),
  prizesWon: integer("prizes_won").default(0),
  gamesPlayed: integer("games_played").default(0),
  weeklyGrowth: integer("weekly_growth").default(0), // percentage
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertPrizeSchema = createInsertSchema(prizes).omit({
  id: true,
});

export const insertGameSettingsSchema = createInsertSchema(gameSettings).omit({
  id: true,
});

export const insertGameStatsSchema = createInsertSchema(gameStats).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPrize = z.infer<typeof insertPrizeSchema>;
export type Prize = typeof prizes.$inferSelect;

export type InsertGameSettings = z.infer<typeof insertGameSettingsSchema>;
export type GameSettings = typeof gameSettings.$inferSelect;

export type InsertGameStats = z.infer<typeof insertGameStatsSchema>;
export type GameStats = typeof gameStats.$inferSelect;
