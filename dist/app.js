"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movie_route_1 = __importDefault(require("../src/routes/movie.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Base route
app.use("/api", movie_route_1.default);
exports.default = app;
