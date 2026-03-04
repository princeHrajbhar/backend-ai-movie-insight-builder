"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieById = void 0;
const movie_service_1 = require("../services/movie.service");
const getMovieById = async (req, res, next) => {
    try {
        const imdbId = req.query.id;
        if (!imdbId) {
            return res.status(400).json({
                error: "IMDb ID is required",
            });
        }
        const result = await (0, movie_service_1.getMovieInsight)(imdbId);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Movie Insight API Error:", error);
        return res.status(500).json({
            error: error.message || "Internal Server Error",
        });
    }
};
exports.getMovieById = getMovieById;
