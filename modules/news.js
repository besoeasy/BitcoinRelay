import RSSParser from "rss-parser";
import { chromium } from "playwright";

const parser = new RSSParser();
const feedUrl = "https://news.google.com/rss/search?q=bitcoin";

/**
 * Uses Playwright to open the Google News article URL,
 * wait for client-side redirect, and returns the final URL.
 */
async function getFinalUrl(googleNewsUrl) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(googleNewsUrl, { waitUntil: 'load', timeout: 15000 });

    // Wait for JavaScript-based redirect (adjust timeout as necessary)
    await page.waitForTimeout(3000);

    const finalUrl = page.url();

    return finalUrl;
  } catch (error) {
    console.error("Error resolving final URL:", error.message);
    return googleNewsUrl; // fallback: return original link
  } finally {
    await browser.close();
  }
}

/**
 * Fetch the RSS feed and return the items.
 */
async function fetchFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
      source: feed.title,
    }));
  } catch (error) {
    console.error(`Error fetching feed from ${url}:`, error.message);
    return [];
  }
}

/**
 * Fetch all feeds, sort, clean titles, pick random item,
 * and resolve the actual URL using Playwright.
 */
async function fetchAllFeeds() {
  const posts = await fetchFeed(feedUrl);

  if (!posts.length) return null;

  // Sort by newest first
  posts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Clean titles: remove non-alphanumeric characters except spaces
  posts.forEach(post => {
    post.title = post.title.replace(/[^a-zA-Z0-9 ]/g, "");
  });

  // Pick one random article from first 15 (or fewer if less available)
  const post = posts[Math.floor(Math.random() * Math.min(15, posts.length))];

  // Resolve real article URL via browser automation
  post.actualLink = await getFinalUrl(post.link);

  return post;
}

/**
 * Main handler to get formatted news message.
 */
async function hndl_news() {
  const post = await fetchAllFeeds();

  if (!post) {
    return "No news found.";
  }

  const { title, contentSnippet, actualLink } = post;

  return `📰 ${title}\n\n${contentSnippet}\n\n#bitcoin #crypto #news\n${actualLink}`;
}

/* Export the handler */
export { hndl_news };

/* Example usage: 
(async () => {
  const newsMessage = await hndl_news();
  console.log(newsMessage);
})();
*/
