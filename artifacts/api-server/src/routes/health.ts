import { Router, type Request, type Response } from "express";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "API is healthy 🚀",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
