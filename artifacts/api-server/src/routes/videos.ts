import { Router, type IRouter } from "express";
import { db, videosTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/videos", async (req, res): Promise<void> => {
  const { sector, language, limit } = req.query;
  let query = db.select().from(videosTable).orderBy(desc(videosTable.createdAt));

  let videos = await db
    .select()
    .from(videosTable)
    .orderBy(desc(videosTable.createdAt));

  if (sector && typeof sector === "string") {
    videos = videos.filter((v) => v.sector === sector);
  }
  if (language && typeof language === "string") {
    videos = videos.filter((v) => v.language === language);
  }
  const limitNum = limit ? parseInt(limit as string, 10) : 20;
  videos = videos.slice(0, limitNum);

  res.json(videos.map((v) => ({ ...v, tags: v.tags ?? [] })));
});

router.post("/videos", async (req, res): Promise<void> => {
  const body = req.body;
  const [video] = await db.insert(videosTable).values({
    title: body.title,
    description: body.description ?? "",
    thumbnailUrl: body.thumbnailUrl ?? "",
    videoUrl: body.videoUrl ?? "",
    duration: body.duration ?? "0:00",
    sector: body.sector,
    language: body.language,
    tags: body.tags ?? [],
    creatorId: body.creatorId,
    creatorName: body.creatorName ?? "Creator",
    creatorAvatar: body.creatorAvatar ?? "",
    isVerified: body.isVerified ?? false,
    hasQuiz: body.hasQuiz ?? false,
    hasNotes: body.hasNotes ?? false,
    hasFlashcards: body.hasFlashcards ?? false,
    chapterCount: body.chapterCount ?? 1,
    difficulty: body.difficulty ?? "Beginner",
  }).returning();
  res.status(201).json({ ...video, tags: video.tags ?? [] });
});

router.get("/videos/trending", async (req, res): Promise<void> => {
  const videos = await db
    .select()
    .from(videosTable)
    .orderBy(desc(videosTable.views))
    .limit(12);
  res.json(videos.map((v) => ({ ...v, tags: v.tags ?? [] })));
});

router.get("/videos/recommended", async (req, res): Promise<void> => {
  const videos = await db
    .select()
    .from(videosTable)
    .orderBy(desc(videosTable.likes))
    .limit(12);
  res.json(videos.map((v) => ({ ...v, tags: v.tags ?? [] })));
});

router.get("/videos/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid video id" });
    return;
  }
  const [video] = await db.select().from(videosTable).where(eq(videosTable.id, id));
  if (!video) {
    res.status(404).json({ error: "Video not found" });
    return;
  }
  res.json({ ...video, tags: video.tags ?? [] });
});

router.post("/videos/:id/like", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid video id" });
    return;
  }
  const [video] = await db
    .update(videosTable)
    .set({ likes: sql`${videosTable.likes} + 1` })
    .where(eq(videosTable.id, id))
    .returning();
  if (!video) {
    res.status(404).json({ error: "Video not found" });
    return;
  }
  res.json({ likes: video.likes, liked: true });
});

export default router;
