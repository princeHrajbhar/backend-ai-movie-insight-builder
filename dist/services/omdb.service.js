"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieById = getMovieById;
async function getMovieById(imdbId) {
    if (!imdbId) {
        throw new Error("IMDb ID is required");
    }
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
        throw new Error("OMDB_API_KEY not configured");
    }
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`);
    if (!res.ok) {
        throw new Error("Failed to fetch movie");
    }
    const data = await res.json();
    if (data.Response === "False") {
        throw new Error(data.Error || "Movie not found");
    }
    return data;
}
