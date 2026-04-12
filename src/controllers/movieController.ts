import { Request, Response, NextFunction } from "express";
import { getMovieInsight } from "../services/movie.service";

export const getMovieById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("🎬 Controller: getMovieById triggered");

    const imdbId = req.query.id as string;

    console.log("📥 Incoming Query:", req.query);

    if (!imdbId) {
      console.log("❌ IMDb ID missing");

      return res.status(400).json({
        error: "IMDb ID is required",
      });
    }

    console.log("🔍 Fetching movie insight for:", imdbId);

    const result = await getMovieInsight(imdbId);

    console.log("✅ Movie insight fetched successfully");

    return res.status(200).json(result);

  } catch (error: any) {
    console.error("🔥 Movie Insight API Error:", error);

    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};