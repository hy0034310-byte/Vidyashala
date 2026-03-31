import express from "express";
import cors from "cors";
import videoRoutes from "./routes/videos";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/videos", videoRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Vidyashala API running 🚀",
  });
});

export default app;
