import { Router, Request, Response, NextFunction } from "express";
import { getMovieById } from "../controllers/movieController";

const router = Router();

/**
 * GET /api/movie?id=tt0133093
 */
router.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("🎬 Movie API hit");
    console.log("Query Params:", req.query);
    console.log("Time:", new Date().toISOString());
    next();
  },
  getMovieById
);

export default router;