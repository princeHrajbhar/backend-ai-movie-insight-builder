import puppeteer from "puppeteer";

export interface Review {
  title: string | null;
  rating: number | null;
  maxRating: number;
  ratingAriaLabel: string | null;
  text: string;
  helpful: number;
  notHelpful: number;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  totalHelpful: number;
  totalNotHelpful: number;
}

export interface ReviewsResponse {
  summary: ReviewSummary;
  reviews: Review[];
}

export async function getReviewsById(
  imdbId: string,
  limit: number = 10
): Promise<ReviewsResponse> {

  if (!imdbId) {
    throw new Error("IMDb ID required");
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(
      `https://www.imdb.com/title/${imdbId}/reviews`,
      {
        waitUntil: "networkidle2",
        timeout: 30000
      }
    );

    await page.waitForSelector(
      '[data-testid="review-card-parent"]',
      { timeout: 10000 }
    );

    const reviews = await page.evaluate((limit: number) => {

      function convertCount(value: string | null): number {
        if (!value) return 0;

        if (value.includes("K")) {
          return Math.round(parseFloat(value) * 1000);
        }

        if (value.includes("M")) {
          return Math.round(parseFloat(value) * 1000000);
        }

        return parseInt(value, 10) || 0;
      }

      const cards = document.querySelectorAll(
        '[data-testid="review-card-parent"]'
      );

      const results = Array.from(cards)
        .slice(0, limit)
        .map((card: any) => {

          const title =
            card.querySelector('[data-testid="review-summary"] h3')
              ?.textContent || null;

          const ratingText =
            card.querySelector(".ipc-rating-star--rating")
              ?.textContent;

          const maxRatingText =
            card.querySelector(".ipc-rating-star--maxRating")
              ?.textContent;

          const helpfulText =
            card.querySelector(".ipc-voting__label__count--up")
              ?.textContent || null;

          const notHelpfulText =
            card.querySelector(".ipc-voting__label__count--down")
              ?.textContent || null;

          const ratingAriaLabel =
            card.querySelector('[class*="rating-star"]')
              ?.getAttribute("aria-label") || null;

          const text =
            card.querySelector(".ipc-html-content-inner-div")
              ?.textContent?.trim() || null;

          if (!text) return null;

          return {
            title,
            rating: ratingText ? parseInt(ratingText, 10) : null,
            maxRating: maxRatingText
              ? parseInt(maxRatingText.replace("/", "").trim(), 10)
              : 10,
            ratingAriaLabel,
            text,
            helpful: convertCount(helpfulText),
            notHelpful: convertCount(notHelpfulText)
          };
        })
        .filter((review): review is Review => review !== null);

      return results;

    }, limit);

    const summary: ReviewSummary = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
            reviews.length
          : 0,
      totalHelpful:
        reviews.reduce((acc, r) => acc + r.helpful, 0),
      totalNotHelpful:
        reviews.reduce((acc, r) => acc + r.notHelpful, 0)
    };

    return {
      summary,
      reviews
    };

  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error("Failed to scrape reviews");
  } finally {
    await browser.close();
  }
}