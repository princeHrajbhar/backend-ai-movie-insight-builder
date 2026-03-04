"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieInsight = getMovieInsight;
const omdb_service_1 = require("../services/omdb.service");
const review_service_1 = require("../services/review.service");
const sentiment_service_1 = require("../services/sentiment.service");
async function getMovieInsight(imdbId) {
    if (!imdbId) {
        throw new Error("IMDb ID is required");
    }
    /* ===============================
       1️⃣ Fetch OMDB Data
    =============================== */
    const omdbData = await (0, omdb_service_1.getMovieById)(imdbId);
    /* ===============================
       2️⃣ Fetch Reviews (ONLY for AI)
    =============================== */
    const reviewData = await (0, review_service_1.getReviewsById)(imdbId, 8);
    /* ===============================
       3️⃣ AI Sentiment Analysis
    =============================== */
    const aiAnalysis = await (0, sentiment_service_1.analyzeAudienceSentiment)(reviewData.reviews.map(r => ({
        text: r.text,
        rating: r.rating
    })));
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
