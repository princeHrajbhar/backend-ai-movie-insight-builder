import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import movieRoutes from "./routes/movie.route";
import reviewRoutes from "./routes/review.route";

const app = express();

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

app.use(express.json());

// Routes
app.use("/api/movie", movieRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Server running");
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS: All origins allowed`);
});