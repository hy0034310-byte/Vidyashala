import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sectorsTable = pgTable("sectors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(),
  color: text("color").notNull(),
  videoCount: integer("video_count").notNull().default(0),
  creatorCount: integer("creator_count").notNull().default(0),
  learnerCount: integer("learner_count").notNull().default(0),
});

export const insertSectorSchema = createInsertSchema(sectorsTable).omit({ id: true });
export type InsertSector = z.infer<typeof insertSectorSchema>;
export type Sector = typeof sectorsTable.$inferSelect;
