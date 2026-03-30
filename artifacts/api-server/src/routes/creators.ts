import { Router, type IRouter } from "express";
import { db, creatorsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/creators", async (req, res): Promise<void> => {
  const { sector, verified } = req.query;
  let creators = await db.select().from(creatorsTable).orderBy(desc(creatorsTable.followers));

  if (sector && typeof sector === "string") {
    creators = creators.filter((c) => c.sector === sector);
  }
  if (verified === "true") {
    creators = creators.filter((c) => c.isVerified);
  }

  res.json(creators.map((c) => ({ ...c, languages: c.languages ?? [] })));
});

router.get("/creators/spotlight", async (req, res): Promise<void> => {
  const creators = await db
    .select()
    .from(creatorsTable)
    .where(eq(creatorsTable.isVerified, true))
    .orderBy(desc(creatorsTable.followers))
    .limit(6);
  res.json(creators.map((c) => ({ ...c, languages: c.languages ?? [] })));
});

router.get("/creators/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid creator id" });
    return;
  }
  const [creator] = await db.select().from(creatorsTable).where(eq(creatorsTable.id, id));
  if (!creator) {
    res.status(404).json({ error: "Creator not found" });
    return;
  }
  res.json({ ...creator, languages: creator.languages ?? [] });
});

router.get("/creators/:id/analytics", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid creator id" });
    return;
  }
  const [creator] = await db.select().from(creatorsTable).where(eq(creatorsTable.id, id));
  if (!creator) {
    res.status(404).json({ error: "Creator not found" });
    return;
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const viewsByMonth = months.map((month) => ({
    month,
    value: Math.round(Math.random() * 50000 + 10000),
  }));
  const earningsByMonth = months.map((month) => ({
    month,
    value: Math.round(Math.random() * 20000 + 5000),
  }));

  const { db: database, videosTable } = await import("@workspace/db");
  const { eq: eqOp, desc: descOp } = await import("drizzle-orm");

  const topVideos = await database
    .select()
    .from(videosTable)
    .where(eqOp(videosTable.creatorId, id))
    .orderBy(descOp(videosTable.views))
    .limit(3);

  res.json({
    creatorId: id,
    totalViews: creator.totalViews,
    totalLikes: Math.round(creator.totalViews * 0.08),
    totalSubscribers: creator.followers,
    monthlyEarnings: creator.monthlyEarnings,
    viewsByMonth,
    earningsByMonth,
    topVideos: topVideos.map((v) => ({ ...v, tags: v.tags ?? [] })),
    engagementRate: parseFloat((Math.random() * 5 + 2).toFixed(1)),
  });
});

router.post("/creators", async (req, res): Promise<void> => {
  const body = req.body;
  const [creator] = await db.insert(creatorsTable).values({
    channelName: body.channelName,
    bio: body.bio ?? "",
    avatarUrl: body.avatarUrl ?? "",
    bannerUrl: body.bannerUrl ?? "",
    sector: body.sector,
    isVerified: false,
    followers: 0,
    totalViews: 0,
    videoCount: 0,
    shortCount: 0,
    languages: body.languages ?? ["Hindi"],
    monthlyEarnings: 0,
  }).returning();
  res.status(201).json({ ...creator, languages: creator.languages ?? [] });
});

export default router;
