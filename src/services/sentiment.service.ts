// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function analyzeAudienceSentiment(reviews: string[]) {
//   if (!reviews.length) {
//     return {
//       summary: "No reviews available",
//       overallSentiment: "neutral",
//       score: 0,
//     };
//   }

//   const combined = reviews.join("\n\n");

//   const model = genAI.getGenerativeModel({
//     model: "gemini-3-flash-preview",
//   });

//   const prompt = `
// Analyze the sentiment of the following movie reviews.

// Return JSON in this format:
// {
//   "summary": "short summary",
//   "overallSentiment": "positive | negative | neutral",
//   "score": number between -1 and 1
// }

// Reviews:
// ${combined}
// `;

//  try {
//   const result = await model.generateContent(prompt);
//   const text = result.response.text();

//   // 🔥 Remove markdown code blocks if present
//   const cleaned = text
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   // 🔥 Extract only JSON object using regex (extra safety)
//   const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

//   if (!jsonMatch) {
//     throw new Error("No valid JSON found in Gemini response");
//   }

//   return JSON.parse(jsonMatch[0]);
// } catch (error) {
//   console.error("Gemini error:", error);

//   return {
//     summary: "Sentiment analysis failed due to high demand of gen api please try again!! ",
//     overallSentiment: "neutral",
//     score: 0,
//   };
// }
// }

import { GoogleGenAI } from "@google/genai";

/**
 * Lazy initialization of Gemini client
 */
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY missing in environment variables");
    throw new Error("GEMINI_API_KEY is missing in environment variables");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Utility function to create a delay
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function analyzeAudienceSentiment(
  reviews: { text: string; rating?: number | null }[],
  maxRetries = 3
) {
  console.log("🧠 Sentiment analysis started");
  const ai = getAI();

  if (!reviews.length) {
    console.log("⚠️ No reviews provided, returning fallback");
    return fallback(0);
  }

  const averageUserRating =
    reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length;

  const reviewTexts = reviews.map((r) => r.text).join("\n\n");
  const prompt = `
Return STRICT JSON:
{
  "overallSentiment": "positive | neutral | negative",
  "score": number between 0 and 1,
  "positivePercentage": number,
  "neutralPercentage": number,
  "negativePercentage": number,
  "summary": "5-10 sentence summary",
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "emotionalTone": "tone"
}

Reviews:
${reviewTexts}
`;

  // --- RETRY LOGIC WRAPPER ---
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🚀 Sending request to Gemini (Attempt ${attempt}/${maxRetries})...`);
      const start = Date.now();

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        },
      });

      const end = Date.now();
      console.log(`⏱ Gemini response time: ${end - start} ms`);

      if (!response.text) {
        throw new Error("AI returned empty response");
      }

      // Clean and Parse JSON
      const cleaned = response.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid JSON response from AI");

      const parsed = JSON.parse(jsonMatch[0]);
      console.log("✅ Gemini analysis parsed successfully");

      return {
        overallSentiment: parsed.overallSentiment ?? "neutral",
        score: Number(parsed.score) || 0,
        positivePercentage: Number(parsed.positivePercentage) || 0,
        neutralPercentage: Number(parsed.neutralPercentage) || 0,
        negativePercentage: Number(parsed.negativePercentage) || 0,
        averageUserRating: Number(averageUserRating.toFixed(2)),
        summary: parsed.summary ?? "AI analysis completed",
        strengths: parsed.strengths ?? [],
        weaknesses: parsed.weaknesses ?? [],
        emotionalTone: parsed.emotionalTone ?? "neutral",
      };

    } catch (error: any) {
      const isRetryable = error.status === 503 || error.status === 429;
      
      if (isRetryable && attempt < maxRetries) {
        // Exponential Backoff: 2s, 4s, 8s...
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`⚠️ Gemini busy (Status ${error.status}). Retrying in ${delay}ms...`);
        await wait(delay);
      } else {
        console.error("🔥 Gemini final error:", error.message || error);
        break; // Exit loop and return fallback
      }
    }
  }

  console.log("⚠️ All retries failed. Returning fallback sentiment.");
  return fallback(averageUserRating);
}

function fallback(avg: number) {
  return {
    overallSentiment: "neutral",
    score: 0,
    positivePercentage: 0,
    neutralPercentage: 0,
    negativePercentage: 0,
    averageUserRating: Number(avg.toFixed(2)),
    summary: "Sentiment analysis is temporarily unavailable due to high API demand.",
    strengths: [],
    weaknesses: [],
    emotionalTone: "neutral",
  };
} 