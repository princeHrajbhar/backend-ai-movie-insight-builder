export interface Movie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
}

export async function getMovieById(imdbId: string): Promise<Movie> {
  console.log("🎬 OMDB Service Started");
  console.log("🔍 IMDb ID:", imdbId);

  if (!imdbId) {
    console.log("❌ Error: IMDb ID missing");
    throw new Error("IMDb ID is required");
  }

  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    console.log("❌ Error: OMDB_API_KEY missing in env");
    throw new Error("OMDB_API_KEY not configured");
  }

  const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`;

  console.log("📡 Calling OMDB API:", url);

  const start = Date.now();

  const res = await fetch(url);

  const end = Date.now();
  console.log(`⏱ OMDB response time: ${end - start} ms`);

  if (!res.ok) {
    console.log("❌ OMDB request failed with status:", res.status);
    throw new Error("Failed to fetch movie");
  }

  const data = await res.json();

  if (data.Response === "False") {
    console.log("❌ OMDB returned error:", data.Error);
    throw new Error(data.Error || "Movie not found");
  }

  console.log("✅ OMDB movie fetched:", data.Title);

  return data;
}