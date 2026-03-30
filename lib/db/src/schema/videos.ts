import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const videosTable = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url").notNull().default(""),
  duration: text("duration").notNull(),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  sector: text("sector").notNull(),
  language: text("language").notNull(),
  tags: text("tags").array().notNull().default([]),
  creatorId: integer("creator_id").notNull(),
  creatorName: text("creator_name").notNull(),
  creatorAvatar: text("creator_avatar").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  hasQuiz: boolean("has_quiz").notNull().default(false),
  hasNotes: boolean("has_notes").notNull().default(false),
  hasFlashcards: boolean("has_flashcards").notNull().default(false),
  chapterCount: integer("chapter_count").notNull().default(1),
  difficulty: text("difficulty").notNull().default("Beginner"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertVideoSchema = createInsertSchema(videosTable).omit({ id: true, createdAt: true });
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videosTable.$inferSelect;
