import express from "express";
import movieRoutes from "../src/routes/movie.route";
import reviewRoutes  from "../src/routes/review.route";

const app = express();

app.use(express.json());

// Base route
app.use("/api", movieRoutes);
app.use("/api", reviewRoutes)

export default app;