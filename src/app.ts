import express from "express";
import movieRoutes from "../src/routes/movie.route";

const app = express();

app.use(express.json());

// Base route
app.use("/api", movieRoutes);

export default app;