import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

type Video = {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
};

let videos: Video[] = [];

const videoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url(),
  thumbnail: z.string().optional(),
});

// GET all videos
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: videos,
  });
});

// GET single video
router.get("/:id", (req: Request, res: Response) => {
  const video = videos.find((v) => v.id === req.params.id);

  if (!video) {
    return res.status(404).json({
      success: false,
      message: "Video not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: video,
  });
});

// CREATE video
router.post("/", (req: Request, res: Response) => {
  const parsed = videoSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten(),
    });
  }

  const newVideo: Video = {
    id: Date.now().toString(),
    ...parsed.data,
  };

  videos.push(newVideo);

  return res.status(201).json({
    success: true,
    data: newVideo,
  });
});

// DELETE video
router.delete("/:id", (req: Request, res: Response) => {
  const index = videos.findIndex((v) => v.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Video not found",
    });
  }

  const deleted = videos.splice(index, 1);

  return res.status(200).json({
    success: true,
    data: deleted[0],
  });
});

export default router;
