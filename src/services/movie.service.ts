import { getMovieById } from "../services/omdb.service";
import { getReviewsById } from "../services/review.service";
import { analyzeAudienceSentiment } from "../services/sentiment.service";

export async function getMovieInsight(imdbId: string) {
  console.log("🚀 Movie Insight Service Started");
  console.log("🎬 IMDb ID:", imdbId);

  if (!imdbId) {
    console.log("❌ Error: IMDb ID missing");
    throw new Error("IMDb ID is required");
  }

  /* ===============================
     1️⃣ Fetch OMDB Data
  =============================== */

  console.log("📡 Fetching OMDB data...");
  const omdbData = await getMovieById(imdbId);
  console.log("✅ OMDB data received:", omdbData?.Title);

  /* ===============================
     2️⃣ Fetch Reviews (ONLY for AI)
  =============================== */

  console.log("📝 Fetching reviews...");
  const reviewData = await getReviewsById(imdbId, 8);
  console.log(`✅ Reviews fetched: ${reviewData.reviews.length}`);

  /* ===============================
     3️⃣ AI Sentiment Analysis
  =============================== */

  console.log("🤖 Running AI sentiment analysis...");

  const aiAnalysis = await analyzeAudienceSentiment(
    reviewData.reviews.map(r => ({
      text: r.text,
      rating: r.rating
    }))
  );

  console.log("✅ AI analysis completed");

  /* ===============================
     FINAL CLEAN RESPONSE
  =============================== */

  const response = {
    imdbId,

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

    audienceInsight: aiAnalysis,

    generatedAt: new Date().toISOString()
  };

  console.log("📦 Final response ready for:", omdbData?.Title);

  return response;
}