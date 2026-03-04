import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import movieRoutes from "./routes/movie.route";

const app = express();

// Helmet can sometimes block cross-origin requests, so we need to configure it
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
  })
);

// Allow all origins with proper CORS
app.use(
  cors({
    origin: "*", // Allow any origin
    methods: ["GET", "POST", "OPTIONS"], // Allow common methods
    allowedHeaders: ["Content-Type", "Authorization", "Accept"], // Allow common headers
    credentials: false, // Must be false when using origin: "*"
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

// Handle preflight requests for all routes
app.options("*", cors());

app.use(express.json());

app.use("/api/movie", movieRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS: All origins allowed`);
});