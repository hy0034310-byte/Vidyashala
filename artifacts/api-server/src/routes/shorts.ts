import { Router, type IRouter } from "express";
import { db, shortsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/shorts", async (req, res): Promise<void> => {
  const { sector, language } = req.query;
  let shorts = await db.select().from(shortsTable).orderBy(desc(shortsTable.views));

  if (sector && typeof sector === "string") {
    shorts = shorts.filter((s) => s.sector === sector);
  }
  if (language && typeof language === "string") {
    shorts = shorts.filter((s) => s.language === language);
  }

  res.json(shorts);
});

router.post("/shorts", async (req, res): Promise<void> => {
  const body = req.body;
  const [short] = await db.insert(shortsTable).values({
    title: body.title,
    videoUrl: body.videoUrl ?? "",
    thumbnailUrl: body.thumbnailUrl ?? "",
    duration: body.duration ?? "0:59",
    sector: body.sector,
    language: body.language,
    creatorId: body.creatorId,
    creatorName: body.creatorName ?? "Creator",
    creatorAvatar: body.creatorAvatar ?? "",
    isVerified: body.isVerified ?? false,
    hasQuickQuiz: body.hasQuickQuiz ?? false,
  }).returning();
  res.status(201).json(short);
});

router.get("/shorts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid short id" });
    return;
  }
  const [short] = await db.select().from(shortsTable).where(eq(shortsTable.id, id));
  if (!short) {
    res.status(404).json({ error: "Short not found" });
    return;
  }
  res.json(short);
});

export default router;
