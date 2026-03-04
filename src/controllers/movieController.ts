import { Request, Response, NextFunction } from "express";
import { getMovieInsight } from "../services/movie.service";

export const getMovieById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const imdbId = req.query.id as string;

    if (!imdbId) {
      return res.status(400).json({
        error: "IMDb ID is required",
      });
    }

    const result = await getMovieInsight(imdbId);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Movie Insight API Error:", error);

    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};