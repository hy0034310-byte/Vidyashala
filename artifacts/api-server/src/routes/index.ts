import { Router, type IRouter } from "express";
import healthRouter from "./health";
import videosRouter from "./videos";
import shortsRouter from "./shorts";
import creatorsRouter from "./creators";
import sectorsRouter from "./sectors";
import quizzesRouter from "./quizzes";
import usersRouter from "./users";
import communityRouter from "./community";
import aiRouter from "./ai";
import homeRouter from "./home";

const router: IRouter = Router();

router.use(healthRouter);
router.use(videosRouter);
router.use(shortsRouter);
router.use(creatorsRouter);
router.use(sectorsRouter);
router.use(quizzesRouter);
router.use(usersRouter);
router.use(communityRouter);
router.use(aiRouter);
router.use(homeRouter);

export default router;
