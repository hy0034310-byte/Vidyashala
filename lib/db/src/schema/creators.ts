import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const creatorsTable = pgTable("creators", {
  id: serial("id").primaryKey(),
  channelName: text("channel_name").notNull(),
  bio: text("bio").notNull().default(""),
  avatarUrl: text("avatar_url").notNull(),
  bannerUrl: text("banner_url").notNull().default(""),
  sector: text("sector").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  followers: integer("followers").notNull().default(0),
  totalViews: integer("total_views").notNull().default(0),
  videoCount: integer("video_count").notNull().default(0),
  shortCount: integer("short_count").notNull().default(0),
  languages: text("languages").array().notNull().default([]),
  monthlyEarnings: real("monthly_earnings").notNull().default(0),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCreatorSchema = createInsertSchema(creatorsTable).omit({ id: true, joinedAt: true });
export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type Creator = typeof creatorsTable.$inferSelect;
