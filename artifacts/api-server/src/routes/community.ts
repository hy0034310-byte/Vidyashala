import { Router, type IRouter } from "express";
import { db, communityPostsTable, commentsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/community/posts", async (req, res): Promise<void> => {
  const { sector } = req.query;
  let posts = await db.select().from(communityPostsTable).orderBy(desc(communityPostsTable.createdAt));

  if (sector && typeof sector === "string") {
    posts = posts.filter((p) => p.sector === sector);
  }

  res.json(posts.map((p) => ({ ...p, tags: p.tags ?? [] })));
});

router.post("/community/posts", async (req, res): Promise<void> => {
  const body = req.body;
  const [post] = await db.insert(communityPostsTable).values({
    title: body.title,
    content: body.content,
    sector: body.sector,
    authorName: body.authorName ?? "Learner",
    authorAvatar: body.authorAvatar ?? "",
    likes: 0,
    commentCount: 0,
    tags: body.tags ?? [],
  }).returning();
  res.status(201).json({ ...post, tags: post.tags ?? [] });
});

router.get("/community/posts/:id/comments", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid post id" });
    return;
  }
  const comments = await db.select().from(commentsTable).where(eq(commentsTable.postId, id)).orderBy(desc(commentsTable.createdAt));
  res.json(comments);
});

router.post("/community/posts/:id/comments", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid post id" });
    return;
  }
  const body = req.body;
  const [comment] = await db.insert(commentsTable).values({
    postId: id,
    content: body.content,
    authorName: body.authorName ?? "Learner",
    authorAvatar: body.authorAvatar ?? "",
    likes: 0,
  }).returning();
  res.status(201).json(comment);
});

export default router;
