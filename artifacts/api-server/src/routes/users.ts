import { Router, type IRouter } from "express";
import { db, usersTable, watchHistoryTable, savedVideosTable, videosTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";

const DEFAULT_USER_ID = 1;

const router: IRouter = Router();

router.get("/users/profile", async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, DEFAULT_USER_ID));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    ...user,
    sectors: user.sectors ?? [],
    badges: user.badges ?? [],
  });
});

router.patch("/users/profile", async (req, res): Promise<void> => {
  const body = req.body;
  const [user] = await db
    .update(usersTable)
    .set({
      name: body.name,
      preferredLanguage: body.preferredLanguage,
      sectors: body.sectors,
    })
    .where(eq(usersTable.id, DEFAULT_USER_ID))
    .returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ ...user, sectors: user.sectors ?? [], badges: user.badges ?? [] });
});

router.get("/users/dashboard", async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, DEFAULT_USER_ID));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const historyRows = await db
    .select()
    .from(watchHistoryTable)
    .where(eq(watchHistoryTable.userId, DEFAULT_USER_ID))
    .orderBy(desc(watchHistoryTable.watchedAt))
    .limit(3);

  const continueWatching = await Promise.all(
    historyRows.map(async (h) => {
      const [video] = await db.select().from(videosTable).where(eq(videosTable.id, h.videoId));
      if (!video) return null;
      return {
        video: { ...video, tags: video.tags ?? [] },
        progressPercent: h.progressPercent,
        lastWatchedAt: h.watchedAt.toISOString(),
      };
    })
  );

  res.json({
    user: { ...user, sectors: user.sectors ?? [], badges: user.badges ?? [] },
    continueWatching: continueWatching.filter(Boolean),
    weeklyStreak: [true, true, true, false, true, true, false],
    xpProgress: user.totalXP % 500,
    xpToNextLevel: 500,
    currentLevel: user.totalXP < 500 ? "Beginner" : user.totalXP < 1500 ? "Learner" : "Scholar",
    quizzesTaken: 12,
    videosWatched: historyRows.length + 18,
    minutesLearned: 340,
    recentBadges: user.badges?.slice(0, 3) ?? ["First Lesson", "Week Streak"],
  });
});

router.get("/users/history", async (req, res): Promise<void> => {
  const historyRows = await db
    .select()
    .from(watchHistoryTable)
    .where(eq(watchHistoryTable.userId, DEFAULT_USER_ID))
    .orderBy(desc(watchHistoryTable.watchedAt))
    .limit(20);

  const result = await Promise.all(
    historyRows.map(async (h) => {
      const [video] = await db.select().from(videosTable).where(eq(videosTable.id, h.videoId));
      if (!video) return null;
      return {
        video: { ...video, tags: video.tags ?? [] },
        watchedAt: h.watchedAt.toISOString(),
        progressPercent: h.progressPercent,
      };
    })
  );

  res.json(result.filter(Boolean));
});

router.get("/users/saved", async (req, res): Promise<void> => {
  const savedRows = await db
    .select()
    .from(savedVideosTable)
    .where(eq(savedVideosTable.userId, DEFAULT_USER_ID))
    .orderBy(desc(savedVideosTable.savedAt));

  const result = await Promise.all(
    savedRows.map(async (s) => {
      const [video] = await db.select().from(videosTable).where(eq(videosTable.id, s.videoId));
      return video ? { ...video, tags: video.tags ?? [] } : null;
    })
  );

  res.json(result.filter(Boolean));
});

router.post("/users/saved/:videoId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.videoId) ? req.params.videoId[0] : req.params.videoId;
  const videoId = parseInt(raw, 10);
  if (isNaN(videoId)) {
    res.status(400).json({ error: "Invalid video id" });
    return;
  }

  const [existing] = await db
    .select()
    .from(savedVideosTable)
    .where(and(eq(savedVideosTable.userId, DEFAULT_USER_ID), eq(savedVideosTable.videoId, videoId)));

  if (existing) {
    await db.delete(savedVideosTable).where(eq(savedVideosTable.id, existing.id));
    res.json({ saved: false });
  } else {
    await db.insert(savedVideosTable).values({ userId: DEFAULT_USER_ID, videoId });
    res.json({ saved: true });
  }
});

export default router;
