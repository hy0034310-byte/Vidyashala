import { Router, type IRouter } from "express";
import { db, sectorsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/sectors", async (req, res): Promise<void> => {
  const sectors = await db.select().from(sectorsTable);
  res.json(sectors);
});

router.get("/sectors/stats", async (req, res): Promise<void> => {
  const sectors = await db.select().from(sectorsTable);
  const stats = sectors.map((s) => ({
    sectorSlug: s.slug,
    sectorName: s.name,
    videoCount: s.videoCount,
    learnerCount: s.learnerCount,
    growthPercent: Math.round(Math.random() * 30 + 5),
  }));
  res.json(stats);
});

router.get("/sectors/:slug", async (req, res): Promise<void> => {
  const { slug } = req.params;
  const [sector] = await db.select().from(sectorsTable).where(eq(sectorsTable.slug, slug));
  if (!sector) {
    res.status(404).json({ error: "Sector not found" });
    return;
  }

  const { db: database, videosTable, shortsTable, creatorsTable, quizzesTable } = await import("@workspace/db");

  const { eq: eqOp, desc } = await import("drizzle-orm");

  const trendingVideos = await database
    .select()
    .from(videosTable)
    .where(eqOp(videosTable.sector, sector.name))
    .orderBy(desc(videosTable.views))
    .limit(6);

  const trendingShorts = await database
    .select()
    .from(shortsTable)
    .where(eqOp(shortsTable.sector, sector.name))
    .limit(4);

  const featuredCreators = await database
    .select()
    .from(creatorsTable)
    .where(eqOp(creatorsTable.sector, sector.name))
    .limit(4);

  const quizzes = await database
    .select()
    .from(quizzesTable)
    .where(eqOp(quizzesTable.sector, sector.name))
    .limit(4);

  const beginnerRoadmap = [
    { order: 1, title: `Introduction to ${sector.name}`, description: "Get started with the basics", duration: "2 hours", isCompleted: true },
    { order: 2, title: `Core Concepts of ${sector.name}`, description: "Understand fundamental principles", duration: "4 hours", isCompleted: true },
    { order: 3, title: `Practical ${sector.name} Skills`, description: "Hands-on practice sessions", duration: "6 hours", isCompleted: false },
    { order: 4, title: `${sector.name} Mini Projects`, description: "Apply what you've learned", duration: "3 hours", isCompleted: false },
  ];

  const advancedRoadmap = [
    { order: 1, title: `Advanced ${sector.name} Techniques`, description: "Deep dive into advanced topics", duration: "8 hours", isCompleted: false },
    { order: 2, title: `Industry Applications`, description: "Real-world case studies", duration: "6 hours", isCompleted: false },
    { order: 3, title: `Expert-level ${sector.name}`, description: "Master-level content", duration: "10 hours", isCompleted: false },
    { order: 4, title: `Certification Prep`, description: "Prepare for industry certifications", duration: "5 hours", isCompleted: false },
  ];

  res.json({
    sector,
    featuredCreators: featuredCreators.map((c) => ({
      ...c,
      languages: c.languages ?? [],
    })),
    trendingVideos: trendingVideos.map((v) => ({
      ...v,
      tags: v.tags ?? [],
    })),
    trendingShorts,
    beginnerRoadmap,
    advancedRoadmap,
    quizzes: quizzes.map((q) => ({
      ...q,
      questions: q.questions ?? [],
    })),
  });
});

export default router;
