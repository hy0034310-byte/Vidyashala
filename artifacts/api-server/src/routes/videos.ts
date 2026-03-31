import { Router, Request, Response } from "express";

const router = Router();

// GET all videos
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    videos: [
      {
        id: 1,
        title: "Welcome Video",
        description: "First sample video",
      },
    ],
  });
});

// GET single video by id
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  res.status(200).json({
    success: true,
    video: {
      id,
      title: `Video ${id}`,
      description: "Sample single video",
    },
  });
});

// POST create video
router.post("/", (req: Request, res: Response) => {
  const { title, description } = req.body;

  res.status(201).json({
    success: true,
    message: "Video created successfully",
    data: {
      title,
      description,
    },
  });
});

export default router;
