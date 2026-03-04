import { Router } from "express";
import { getMovieById } from "../controllers/movieController";

const router = Router();

/**
 * GET /api/movie?id=tt0133093
 */
router.get("/", getMovieById);

export default router;