import { pgTable, text, serial, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const quizzesTable = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  sector: text("sector").notNull(),
  difficulty: text("difficulty").notNull(),
  questionCount: integer("question_count").notNull().default(0),
  timeLimit: integer("time_limit").notNull().default(10),
  passingScore: integer("passing_score").notNull().default(60),
  questions: jsonb("questions").notNull().default([]),
  videoId: integer("video_id"),
  creatorId: integer("creator_id").notNull(),
  attempts: integer("attempts").notNull().default(0),
  averageScore: real("average_score").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQuizSchema = createInsertSchema(quizzesTable).omit({ id: true, createdAt: true });
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzesTable.$inferSelect;
