import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url").notNull().default(""),
  preferredLanguage: text("preferred_language").notNull().default("Hindi"),
  sectors: text("sectors").array().notNull().default([]),
  streak: integer("streak").notNull().default(0),
  totalXP: integer("total_xp").notNull().default(0),
  badges: text("badges").array().notNull().default([]),
  isCreator: boolean("is_creator").notNull().default(false),
  creatorId: integer("creator_id"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const watchHistoryTable = pgTable("watch_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  videoId: integer("video_id").notNull(),
  progressPercent: integer("progress_percent").notNull().default(0),
  watchedAt: timestamp("watched_at", { withTimezone: true }).notNull().defaultNow(),
});

export const savedVideosTable = pgTable("saved_videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  videoId: integer("video_id").notNull(),
  savedAt: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leaderboardTable = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  userName: text("user_name").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  score: integer("score").notNull().default(0),
  quizzesTaken: integer("quizzes_taken").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  badge: text("badge").notNull().default("Learner"),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, joinedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
