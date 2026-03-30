import { Router, type IRouter } from "express";
import { db, videosTable, shortsTable, sectorsTable, creatorsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/home/feed", async (req, res): Promise<void> => {
  const [trendingVideos, recommendedVideos, trendingShorts, sectors, spotlightCreators] = await Promise.all([
    db.select().from(videosTable).orderBy(desc(videosTable.views)).limit(8),
    db.select().from(videosTable).orderBy(desc(videosTable.likes)).limit(8),
    db.select().from(shortsTable).orderBy(desc(shortsTable.views)).limit(6),
    db.select().from(sectorsTable).limit(9),
    db.select().from(creatorsTable).where(eq(creatorsTable.isVerified, true)).orderBy(desc(creatorsTable.followers)).limit(6),
  ]);

  const careerVideos = (await db.select().from(videosTable).where(eq(videosTable.sector, "Careers")).orderBy(desc(videosTable.views)).limit(4)).map(v => ({ ...v, tags: v.tags ?? [] }));
  const techVideos = (await db.select().from(videosTable).where(eq(videosTable.sector, "Technology")).orderBy(desc(videosTable.views)).limit(4)).map(v => ({ ...v, tags: v.tags ?? [] }));
  const agriVideos = (await db.select().from(videosTable).where(eq(videosTable.sector, "Agriculture")).orderBy(desc(videosTable.views)).limit(4)).map(v => ({ ...v, tags: v.tags ?? [] }));
  const financeVideos = (await db.select().from(videosTable).where(eq(videosTable.sector, "Finance")).orderBy(desc(videosTable.views)).limit(4)).map(v => ({ ...v, tags: v.tags ?? [] }));

  res.json({
    trendingVideos: trendingVideos.map(v => ({ ...v, tags: v.tags ?? [] })),
    recommendedVideos: recommendedVideos.map(v => ({ ...v, tags: v.tags ?? [] })),
    trendingShorts,
    sectors,
    spotlightCreators: spotlightCreators.map(c => ({ ...c, languages: c.languages ?? [] })),
    careerUpdates: careerVideos,
    technologyVideos: techVideos,
    agricultureVideos: agriVideos,
    financeVideos,
  });
});

router.get("/platform/stats", async (req, res): Promise<void> => {
  const [videoCount, creatorCount, shortCount, sectorCount] = await Promise.all([
    db.select().from(videosTable),
    db.select().from(creatorsTable),
    db.select().from(shortsTable),
    db.select().from(sectorsTable),
  ]);

  res.json({
    totalVideos: videoCount.length,
    totalCreators: creatorCount.length,
    totalLearners: 1245678,
    totalShorts: shortCount.length,
    languagesSupported: 14,
    sectorsCount: sectorCount.length,
  });
});

export default router;
