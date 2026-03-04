import { getMovieById } from "../services/omdb.service";
import { getReviewsById } from "../services/review.service";
import { analyzeAudienceSentiment } from "../services/sentiment.service";

export async function getMovieInsight(imdbId: string) {
  if (!imdbId) {
    throw new Error("IMDb ID is required");
  }

  /* ===============================
     1️⃣ Fetch OMDB Data
  =============================== */
  const omdbData = await getMovieById(imdbId);

  /* ===============================
     2️⃣ Fetch Reviews (ONLY for AI)
  =============================== */
  const reviewData = await getReviewsById(imdbId, 8);

  /* ===============================
     3️⃣ AI Sentiment Analysis
  =============================== */
  const aiAnalysis = await analyzeAudienceSentiment(
    reviewData.reviews.map(r => ({
      text: r.text,
      rating: r.rating
    }))
  );

  /* ===============================
     FINAL CLEAN RESPONSE
     (No review data exposed)
  =============================== */

  return {
    imdbId,

    // 🎬 From OMDB API
    movie: {
      title: omdbData.Title,
      year: omdbData.Year,
      rated: omdbData.Rated,
      released: omdbData.Released,
      runtime: omdbData.Runtime,
      genre: omdbData.Genre,
      director: omdbData.Director,
      writer: omdbData.Writer,
      actors: omdbData.Actors,
      plot: omdbData.Plot,
      poster: omdbData.Poster,
      imdbRating: omdbData.imdbRating,
      imdbVotes: omdbData.imdbVotes
    },

    // 🤖 From Gemini AI
    audienceInsight: aiAnalysis,

    generatedAt: new Date().toISOString()
  };
}