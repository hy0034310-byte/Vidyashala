import { Router } from "express";

const router = Router();

const videos = [
  {
    id: "1",
    title: "Welcome Video",
    url: "https://example.com/video.mp4",
  },
];

router.get("/", (_req, res) => {
  res.status(200).json(videos);
});

router.get("/:id", (req, res) => {
  const video = videos.find((v) => v.id === req.params.id);

  if (!video) {
    res.status(404).json({ message: "Video not found" });
    return;
  }

  res.status(200).json(video);
});

router.post("/", (req, res) => {
  const newVideo = {
    id: Date.now().toString(),
    title: req.body.title || "Untitled",
    url: req.body.url || "",
  };

  videos.push(newVideo);
  res.status(201).json(newVideo);
});

export default router;
