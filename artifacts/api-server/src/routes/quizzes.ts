import { Router, type IRouter } from "express";
import { db, quizzesTable, leaderboardTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/quizzes", async (req, res): Promise<void> => {
  const { sector, videoId } = req.query;
  let quizzes = await db.select().from(quizzesTable).orderBy(desc(quizzesTable.createdAt));

  if (sector && typeof sector === "string") {
    quizzes = quizzes.filter((q) => q.sector === sector);
  }
  if (videoId) {
    const vid = parseInt(videoId as string, 10);
    quizzes = quizzes.filter((q) => q.videoId === vid);
  }

  res.json(quizzes.map((q) => ({ ...q, questions: q.questions ?? [] })));
});

router.post("/quizzes", async (req, res): Promise<void> => {
  const body = req.body;
  const [quiz] = await db.insert(quizzesTable).values({
    title: body.title,
    description: body.description ?? "",
    sector: body.sector,
    difficulty: body.difficulty,
    questionCount: 0,
    timeLimit: body.timeLimit ?? 10,
    passingScore: body.passingScore ?? 60,
    questions: [],
    videoId: body.videoId ?? null,
    creatorId: body.creatorId,
    attempts: 0,
    averageScore: 0,
  }).returning();
  res.status(201).json({ ...quiz, questions: [] });
});

router.get("/quizzes/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid quiz id" });
    return;
  }
  const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.id, id));
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }
  res.json({ ...quiz, questions: quiz.questions ?? [] });
});

router.post("/quizzes/:id/submit", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid quiz id" });
    return;
  }
  const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.id, id));
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }

  const { answers, timeTaken } = req.body;
  const questions = (quiz.questions as any[]) ?? [];
  let correct = 0;
  const wrongTopics: string[] = [];

  questions.forEach((q: any, i: number) => {
    if (answers[i] === q.correctIndex) {
      correct++;
    } else {
      wrongTopics.push(q.topic ?? quiz.sector);
    }
  });

  const total = questions.length || 1;
  const score = Math.round((correct / total) * 100);
  const passed = score >= quiz.passingScore;

  let badge: string | null = null;
  if (score === 100) badge = "Perfect Score";
  else if (score >= 80) badge = "Knowledge Master";
  else if (passed) badge = "Quiz Champion";

  res.json({
    quizId: id,
    score,
    totalQuestions: total,
    correctAnswers: correct,
    passed,
    timeTaken: timeTaken ?? 0,
    badge,
    weakTopics: [...new Set(wrongTopics)].slice(0, 3),
    nextSuggestions: ["Practice more questions", "Watch related videos", "Try the advanced quiz"],
  });
});

router.get("/leaderboard", async (req, res): Promise<void> => {
  const entries = await db.select().from(leaderboardTable).orderBy(desc(leaderboardTable.score)).limit(20);
  res.json(entries.map((e, i) => ({ ...e, rank: i + 1 })));
});

export default router;
