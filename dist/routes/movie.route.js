"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movieController_1 = require("../controllers/movieController");
const router = (0, express_1.Router)();
/**
 * GET /api/movie?id=tt0133093
 */
router.get("/", movieController_1.getMovieById);
exports.default = router;
