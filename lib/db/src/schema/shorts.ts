import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const shortsTable = pgTable("shorts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  duration: text("duration").notNull().default("0:59"),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  sector: text("sector").notNull(),
  language: text("language").notNull(),
  creatorId: integer("creator_id").notNull(),
  creatorName: text("creator_name").notNull(),
  creatorAvatar: text("creator_avatar").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  hasQuickQuiz: boolean("has_quick_quiz").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertShortSchema = createInsertSchema(shortsTable).omit({ id: true, createdAt: true });
export type InsertShort = z.infer<typeof insertShortSchema>;
export type Short = typeof shortsTable.$inferSelect;
